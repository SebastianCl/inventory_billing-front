import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

// Servicio
import { CustomerService } from '../service/customer.service';
import { ReserveService } from '../service/reserve.service';
import { ArticleService } from '../service/article.service';

// Modelo
import { Reserve } from '../models/reserve.model';

@Component({
  selector: 'app-quotation',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css'],
  providers: [CustomerService, ReserveService, ArticleService]
})
export class ReserveComponent implements OnInit {

  reserve: Reserve;
  public hiddenProgBar: boolean;
  public dsbSave: boolean;
  public listCustomers: any[];
  public listArticles: FormGroup;
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

  private rowsArticlesValues: any[];

  constructor
    (
      private router: Router,
      private _snackBar: MatSnackBar,
      private customerService: CustomerService,
      private articleService: ArticleService,
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
    this.listArticles = this.fb.group({ rows: this.fb.array([]) });
    this.listGarment = [];
    this.clearData();
    this.getListCustomers();
    this.getListGarments();
  }

  ngOnInit() { }

  addArticle() {
    const control = this.listArticles.get('rows') as FormArray;
    control.push(this.createArticle());
  }

  createArticle(): FormGroup {
    return this.fb.group({
      discount: 0,
      garmentReference: '',
      description: '',
      price: 0,
      quantity: 1,
      total: 0
    });
  }

  removeArticle(index: number) {
    const control = this.listArticles.get('rows') as FormArray;
    control.removeAt(index);
    this.calculateTotals();
  }

  private changeShow() {
    this.dsbSave = !this.dsbSave;
    this.hiddenProgBar = !this.hiddenProgBar;
  }

  saveReserve() {
    this.router.navigate(['/invoice']);
    /*
    this.changeShow();
    // Validar todos los datos
    if (!this.validateData()) {
      this.changeShow();
      return;
    }
    const shipping = this.shipping.value === null ? 0 : this.shipping.value;
    const vendor = JSON.parse(localStorage.getArticle('user'));

    this.reserve = new Reserve;
    this.reserve.customer = this.customerId.value;
    this.reserve.tax = this.tax.value;
    this.reserve.comments = this.comments.value;
    this.reserve.items = this.rowsArticlesValues;
    this.reserve.vendor = vendor.id;
    this.reserve.shipping = shipping;
    this.reserve.total = this.totalReserve.value;
    this.reserve.subtotal = this.subtotal.value;
    this.reserve.totalTax = this.totalTax.value;
    this.reserve.totalDiscount = this.totalDiscount.value;

    this.createReserve(this.reserve);*/
  }

  private validateData() {

    // Validar si selecciono un cliente
    if (this.customerId.value === null || this.customerId.value === '') {
      this.openSnackBar('Debe seleccionar un cliente', 'HECHO');
      return false;
    }
    // Validar campos de articles
    const control = this.listArticles.get('rows') as FormArray;
    const rowsArticles = control.value;

    let sw = false;

    for (let index = 0; index < rowsArticles.length; index++) {
      const element = rowsArticles[index];

      let article = {
        reference: element.reference,
        description: element.description,
        discount: element.discount === null ? 0 : element.discount,
        price: element.price,
        quantity: element.quantity
      }

      // Calcular precio y total
      // article.price = article.retail - ((article.retail * article.discount) / 100);
      // article.total = article.price * article.quantity;
      if (
        article.reference === '' ||
        article.description === '' ||
        article.discount < 0 ||
        article.price <= 0 ||
        article.quantity <= 0
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

    // Validar campos de articles
    const control = this.listArticles.get('rows') as FormArray;
    const rowsArticles = control.value;
    let totalDiscount = 0;
    let subtotal = 0;
    let totalReserve = 0;
    let rowsArticlesValues = [];

    for (let index = 0; index < rowsArticles.length; index++) {
      const element = rowsArticles[index];

      let article = {
        ref: element.ref,
        description: element.description,
        discount: element.discount,
        price: element.price,
        quantity: element.quantity
      }

      // Calcular precio y total
      const discount = article.price * (article.discount / 100);
      article.price = article.price - discount;

      // Conservar article en lista global para almacenar
      rowsArticlesValues.push(article);

      // Calcular y asignar totales
      subtotal = subtotal + article.price;
      totalReserve = totalReserve + article.price;
      totalDiscount = totalDiscount + (discount * article.quantity);
    }

    this.rowsArticlesValues = rowsArticlesValues;

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
            localStorage.removeArticle('token');
            localStorage.removeArticle('user');
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
    this.articleService.loadArticles()
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
            localStorage.removeArticle('token');
            localStorage.removeArticle('user');
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
    this.rowsArticlesValues = [];
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
    const control = this.listArticles.get('rows') as FormArray;
    control.clear();
    this.addArticle();
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
