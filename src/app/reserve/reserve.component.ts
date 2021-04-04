import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

// Servicio
import { CustomerService } from '../service/customer.service';
import { ReserveService } from '../service/reserve.service';
import { ItemService } from '../service/item.service';

// Modelo
import { Reserve } from '../models/reserve.model';

@Component({
  selector: 'app-quotation',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css'],
  providers: [CustomerService, ReserveService, ItemService]
})
export class ReserveComponent implements OnInit {

  reserve: Reserve;
  public hiddenProgBar: boolean;
  public dsbSave: boolean;
  public listCustomers: any[];
  public listItems: FormGroup;
  public listGarment: any[];

  public customerId: FormControl;
  public customerIdentificacion: FormControl;
  public tax: FormControl;
  public shipping: FormControl;
  public comments: FormControl;
  public totalTax: FormControl;
  public totalDiscount: FormControl;
  public subtotal: FormControl;
  public totalReserve: FormControl;

  private rowsItemsValues: any[];

  constructor
    (
      private router: Router,
      private _snackBar: MatSnackBar,
      private customerService: CustomerService,
      private itemService: ItemService,
      private reserveService: ReserveService,
      public fb: FormBuilder
    ) {
    this.customerId = new FormControl();
    this.customerIdentificacion = new FormControl();
    this.shipping = new FormControl();
    this.tax = new FormControl();
    this.comments = new FormControl();
    this.totalTax = new FormControl();
    this.totalDiscount = new FormControl();
    this.totalReserve = new FormControl();
    this.subtotal = new FormControl();
    this.listItems = this.fb.group({ rows: this.fb.array([]) });
    this.listGarment = [];
    this.clearData();
    this.getListCustomers();
    this.getListGarments();
  }

  ngOnInit() { }

  addItem() {
    const control = this.listItems.get('rows') as FormArray;
    control.push(this.createItem());
  }

  createItem(): FormGroup {
    return this.fb.group({
      discount: 0,
      garmentReference: '',
      description: '',
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

  saveReserve() {
    this.changeShow();
    // Validar todos los datos
    if (!this.validateData()) {
      this.changeShow();
      return;
    }
    const shipping = this.shipping.value === null ? 0 : this.shipping.value;
    const vendor = JSON.parse(localStorage.getItem('user'));

    this.reserve = new Reserve;
    this.reserve.customer = this.customerId.value;
    this.reserve.tax = this.tax.value;
    this.reserve.comments = this.comments.value;
    this.reserve.items = this.rowsItemsValues;
    this.reserve.vendor = vendor.id;
    this.reserve.shipping = shipping;
    this.reserve.isCO = false;
    this.reserve.total = this.totalReserve.value;
    this.reserve.subtotal = this.subtotal.value;
    this.reserve.totalTax = this.totalTax.value;
    this.reserve.totalDiscount = this.totalDiscount.value;

    this.createReserve(this.reserve);
  }

  private validateData() {

    // Validar si selecciono un cliente
    if (this.customerId.value === null || this.customerId.value === '') {
      this.openSnackBar('Debe seleccionar un cliente', 'HECHO');
      return false;
    }
    // Validar campos de items
    const control = this.listItems.get('rows') as FormArray;
    const rowsItems = control.value;

    let sw = false;

    for (let index = 0; index < rowsItems.length; index++) {
      const element = rowsItems[index];

      let item = {
        reference: element.reference,
        description: element.description,
        discount: element.discount === null ? 0 : element.discount,
        price: element.price,
        quantity: element.quantity
      }

      // Calcular precio y total
      // item.price = item.retail - ((item.retail * item.discount) / 100);
      // item.total = item.price * item.quantity;
      if (
        item.reference === '' ||
        item.description === '' ||
        item.discount < 0 ||
        item.price <= 0 ||
        item.quantity <= 0
      ) {
        break;
      }
      sw = true
    }

    if (!sw) {
      this.openSnackBar('Debe indicar la toda la infomración de los productos.', 'HECHO');
      return false;
    }
    return true;
  }

  calculateTotals() {

    // Validar campos de items
    const control = this.listItems.get('rows') as FormArray;
    const rowsItems = control.value;
    let totalDiscount = 0;
    let subtotal = 0;
    let totalReserve = 0;
    let rowsItemsValues = [];

    for (let index = 0; index < rowsItems.length; index++) {
      const element = rowsItems[index];

      let item = {
        ref: element.ref,
        description: element.description,
        discount: element.discount,
        price: element.price,
        quantity: element.quantity
      }

      // Calcular precio y total
      const discount = item.price * (item.discount / 100);
      item.price = item.price - discount;

      // Conservar item en lista global para almacenar
      rowsItemsValues.push(item);

      // Calcular y asignar totales
      subtotal = subtotal + item.price;
      totalReserve = totalReserve + item.price;
      totalDiscount = totalDiscount + (discount * item.quantity);
    }

    this.rowsItemsValues = rowsItemsValues;

    this.subtotal.setValue(subtotal); // SUBTOTAL
    this.totalDiscount.setValue(totalDiscount); // TOTAL DE DESCUENTOS
    this.totalReserve.setValue(totalReserve); // TOTAL DE RESERVA

  }

  setCustomerData() {
    let customerIdentificacion = '';
    for (let index = 0; index < this.listCustomers.length; index++) {
      const element = this.listCustomers[index];
      if (element.id === this.customerId.value) {
        customerIdentificacion = element.identification;
        break;
      }
    }
    this.customerIdentificacion.setValue(customerIdentificacion);
  }

  setGarmentPrice(garment) {
    debugger;
    console.log(garment);

  }

  // Servicios
  getListCustomers(): any {
    this.customerService.loadCustomers()
      .subscribe((response: any) => {
        if (response.resp && response.msg.length > 0) {
          response.msg.sort((a, b) => a.name.localeCompare(b.name)).forEach(element => {
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
              title: 'Sesión expirada', text: 'Debes iniciar sesión.', icon: 'warning',
              onClose: () => { this.router.navigate(['/login']); }
            });
          } else {
            console.log(err.message);
            this.alert('Error', 'Ocurrió un error.', 'error');
          }
        }
      )
  }

  getListGarments(): any {
    this.itemService.loadItems()
      .subscribe((response: any) => {
        if (response.resp && response.msg.length > 0) {
          response.msg.sort((a, b) => a.reference.localeCompare(b.reference)).forEach(element => {
            this.listGarment.push(element);
          });
        } else {
          this.listGarment = [];
        }
      },
        (err) => {
          if (err.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            Swal.fire({
              title: 'Sesión expirada', text: 'Debes iniciar sesión.', icon: 'warning',
              onClose: () => { this.router.navigate(['/login']); }
            });
          } else {
            console.log(err.message);
            this.alert('Error', 'Ocurrió un error.', 'error');
          }
        }
      )
  }

  createReserve(dataReserve: Reserve): any {
    this.reserveService.createReserve(dataReserve)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          this.alert('Done', 'Registered reserve.', 'success');
          this.clearData();
          this.getListCustomers();
        } else {
          this.alert('Fail', response.msg, 'error');
        }
      },
        (err) => {
          this.changeShow();
          this.alert('Error', 'Ocurrió un error.', 'error');
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
    this.customerIdentificacion.setValue('');
    this.comments.setValue('');
    this.tax.setValue(7);
    this.shipping.setValue(0);
    this.totalTax.setValue(0);
    this.totalDiscount.setValue(0);
    this.subtotal.setValue(0);
    this.totalReserve.setValue(0);
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
