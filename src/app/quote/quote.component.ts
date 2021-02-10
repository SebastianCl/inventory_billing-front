import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

// Servicio
import { CustomerService } from '../service/customer.service';
import { QuoteService } from '../service/quote.service';

// Modelo
import { Quote } from '../models/quote.model';

@Component({
  selector: 'app-quotation',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css'],
  providers: [CustomerService, QuoteService]
})
export class QuoteComponent implements OnInit {

  quote: Quote;
  public hiddenProgBar: boolean;
  public dsbSave: boolean;
  public listCustomers: any[];
  public listItems: FormGroup;

  public customerId: FormControl;
  public tax: FormControl;
  public shipping: FormControl;
  public comments: FormControl;
  public totalTax: FormControl;
  public totalDiscount: FormControl;
  public subtotal: FormControl;
  public totalQuote: FormControl;

  private rowsItemsValues: any[];

  constructor
    (
      private router: Router,
      private _snackBar: MatSnackBar,
      private customerService: CustomerService,
      private quoteService: QuoteService,
      public fb: FormBuilder
    ) {
    this.customerId = new FormControl();
    this.shipping = new FormControl();
    this.tax = new FormControl();
    this.comments = new FormControl();
    this.totalTax = new FormControl();
    this.totalDiscount = new FormControl();
    this.totalQuote = new FormControl();
    this.subtotal = new FormControl();
    this.listItems = this.fb.group({ rows: this.fb.array([]) });
    this.clearData();
    //this.getListCustomers();
  }

  ngOnInit() { }

  addItem() {
    const control = this.listItems.get('rows') as FormArray;
    control.push(this.createItem());
  }

  createItem(): FormGroup {
    return this.fb.group({
      discount: 0,
      ref: '',
      description: '',
      retail: 0,
      price: 0,
      quantity: 1,
      total: 0
    });
  }

  removeItem(index: number) {
    const control = this.listItems.get('rows') as FormArray;
    control.removeAt(index);
    this.calculateTotals();
  }

  private changeShow() {
    this.dsbSave = !this.dsbSave;
    this.hiddenProgBar = !this.hiddenProgBar;
  }

  saveQuote() {
    this.changeShow();
    // Validar todos los datos
    if (!this.validateData()) {
      this.changeShow();
      return;
    }
    const shipping = this.shipping.value === null ? 0 : this.shipping.value;
    const vendor = JSON.parse(localStorage.getItem('user'));

    this.quote = new Quote;
    this.quote.customer = this.customerId.value;
    this.quote.tax = this.tax.value;
    this.quote.comments = this.comments.value;
    this.quote.items = this.rowsItemsValues;
    this.quote.vendor = vendor.id;
    this.quote.shipping = shipping;
    this.quote.isCO = false;
    this.quote.total = this.totalQuote.value;
    this.quote.subtotal = this.subtotal.value;
    this.quote.totalTax = this.totalTax.value;
    this.quote.totalDiscount = this.totalDiscount.value;

    this.createQuote(this.quote);
  };

  private validateData() {

    // Validar si selecciono un cliente
    if (this.customerId.value === null || this.customerId.value === '') {
      this.openSnackBar('You must select a customer', 'DONE');
      return false;
    }
    // Validar si indico tax
    if (this.tax.value === null || this.tax.value === '') {
      this.openSnackBar('You must indicate the tax percentage', 'DONE');
      return false;
    }

    // Validar campos de items
    const control = this.listItems.get('rows') as FormArray;
    const rowsItems = control.value;

    let sw = false;

    for (let index = 0; index < rowsItems.length; index++) {
      const element = rowsItems[index];

      let item = {
        ref: element.ref,
        description: element.description,
        retail: element.retail,
        discount: element.discount === null ? 0 : element.discount,
        price: 0,
        quantity: element.quantity,
        total: 0
      }

      // Calcular precio y total
      item.price = item.retail - ((item.retail * item.discount) / 100);
      item.total = item.price * item.quantity;
      if (
        item.ref === '' ||
        item.description === '' ||
        item.retail <= 0 ||
        item.discount < 0 ||
        item.price <= 0 ||
        item.quantity <= 0 ||
        item.total < 0
      ) {
        break;
      }
      sw = true
    }

    if (!sw) {
      this.openSnackBar('You must indicate all the information of the items.', 'DONE');
      return false;
    }
    return true;
  }

  calculateTotals() {

    // Validar campos de items
    const control = this.listItems.get('rows') as FormArray;
    const rowsItems = control.value;
    let totalDiscount = 0;
    let totalTax = 0;
    let subtotal = 0;
    let totalQuote = 0;
    let rowsItemsValues = [];

    for (let index = 0; index < rowsItems.length; index++) {
      const element = rowsItems[index];

      let item = {
        ref: element.ref,
        description: element.description,
        retail: element.retail,
        discount: element.discount,
        price: 0,
        quantity: element.quantity,
        total: 0
      }

      // Calcular precio y total
      const discount = item.retail * (item.discount / 100);
      item.price = item.retail - discount;
      item.total = item.price * item.quantity;

      // Conservar item en lista global para almacenar
      rowsItemsValues.push(item);

      // Calcular y asignar totales
      subtotal = subtotal + item.retail;
      totalQuote = totalQuote + item.total;
      totalDiscount = totalDiscount + (discount * item.quantity);
    }

    this.rowsItemsValues = rowsItemsValues;
    totalTax = totalQuote * (this.tax.value / 100);

    // Sumar tax y precio al total
    totalQuote = totalQuote + totalTax + this.shipping.value;

    this.subtotal.setValue(subtotal); // SUBTOTAL
    this.totalDiscount.setValue(totalDiscount); // TOTAL DE DESCUENTOS
    this.totalTax.setValue(totalTax); // TOTAL DE TAX
    this.totalQuote.setValue(totalQuote); // TOTAL DE COTIZACION

  }

  setTax() {
    let taxFree = false;
    for (let index = 0; index < this.listCustomers.length; index++) {
      const element = this.listCustomers[index];
      if (element.id === this.customerId.value) {
        taxFree = element.taxFree;
        break;
      }
    }
    if (taxFree) {
      this.tax.setValue(0);
    } else {
      this.tax.setValue(7);
    }
    this.calculateTotals();
  }

  // Servicios
  getListCustomers(): any {
    this.customerService.loadCustomers()
      .subscribe((response: any) => {
        if (response.resp && response.msg.length > 0) {
          response.msg.sort((a, b) => a.firstname.localeCompare(b.firstname)).forEach(element => {
            this.listCustomers.push(element);
          });
        } else {
          this.listCustomers = [];
        }
      },
        (err) => {
          if (err.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            Swal.fire({
              title: 'Session expired', text: 'You must log.', icon: 'warning',
              onClose: () => { this.router.navigate(['/login']); }
            });
          } else {
            console.log(err.message);
            this.alert('Error', 'An error happened.', 'error');
          }
        }
      )
  }

  createQuote(dataQuote: Quote): any {
    this.quoteService.createQuote(dataQuote)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          this.alert('Done', 'Registered quote.', 'success');
          this.clearData();
          this.getListCustomers();
        } else {
          this.alert('Fail', response.msg, 'error');
        }
      },
        (err) => {
          this.changeShow();
          this.alert('Error', 'An error happened.', 'error');
          console.log(err.message);
        }
      );
  }

  private clearData() {
    this.listCustomers = [];
    this.rowsItemsValues = [];
    this.hiddenProgBar = true;
    this.dsbSave = false;
    this.customerId.setValue('');
    this.comments.setValue('');
    this.tax.setValue(7);
    this.shipping.setValue(0);
    this.totalTax.setValue(0);
    this.totalDiscount.setValue(0);
    this.subtotal.setValue(0);
    this.totalQuote.setValue(0);
    const control = this.listItems.get('rows') as FormArray;
    control.clear();
    this.addItem();
  }


  // FUNCIONES DE AYUDA

  // Función general para alertas
  private alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
  }

  // Función general para snackbar
  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000, panelClass: ['mycsssnackbartest'] });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


}
