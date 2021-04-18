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
  public referenceProduct: any;
  public imageProduct: any;
  public quantityProduct: any;
  public dateNowValid: any;

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
    this.changeShow();
    // Validar todos los datos basicos
    if (!this.validateForm()) {
      this.changeShow();
      return;
    }
    // Validar todos los datos de productos
    if (!this.validateRows()) {
      this.changeShow();
      return;
    }
    const shipping = this.shipping.value === null ? 0 : this.shipping.value;
    const vendor = JSON.parse(localStorage.getItem('user'));

    const control = this.listArticles.get('rows') as FormArray;
    const rows = control.value;
    let articleList = [];

    for (let index = 0; index < rows.length; index++) {
      const element = rows[index];
      // Conservar article en lista para almacenar
      articleList.push(element.garmentReference);
    }

    this.rowsArticlesValues = articleList;


    this.reserve = new Reserve;
    this.reserve.customerID = this.customerId.value;
    let dataClientSelected = this.listCustomers.filter((e) => e.id === this.customerId.value);
    this.reserve.customerName = dataClientSelected[0].name;
    this.reserve.employeeName = vendor.name;
    this.reserve.reserveDate = this.dateNow();
    this.reserve.startDate = this.dateNow();
    this.reserve.endDate = this.dateNow();
    this.reserve.tax = this.tax.value;
    this.reserve.comments = this.comments.value;
    this.reserve.articles = this.rowsArticlesValues;
    this.reserve.vendor = vendor.id;
    this.reserve.shipping = shipping;
    this.reserve.total = this.totalReserve.value;
    this.reserve.subtotal = this.subtotal.value;
    this.reserve.totalTax = this.totalTax.value;
    this.reserve.totalDiscount = this.totalDiscount.value;

    this.createReserve(this.reserve);
  }

  private validateForm() {
    // Validar si selecciono un cliente
    if (this.customerId.value === null || this.customerId.value === '') {
      this.openSnackBar('Debe seleccionar un cliente', 'HECHO');
      return false;
    }
    return true;
  }

  private validateRows() {
    // Validar campos de articles
    const control = this.listArticles.get('rows') as FormArray;
    const rowsArticles = control.value;
    let validRowsIndex = [];
    let sw = false;
    for (let index = 0; index < rowsArticles.length; index++) {
      const element = rowsArticles[index];
      if (element.reference === '' || element.description === '' || element.discount < 0 || element.price < 0 || element.quantity < 0) {
        validRowsIndex.push(index);
      } else {
        sw = true
      }
    }
    if (!sw) {
      this.openSnackBarLarge(`En la siguientes filas ID # `+validRowsIndex.toString()+` \n debe verificarse que todos los campos de producto esten diligenciados.`, 'HECHO');
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

    for (let index = 0; index < rowsArticles.length; index++) {
      const element = rowsArticles[index];

      // Calcular precio y total
      const discount = element.price * (element.discount / 100);
      element.price = element.price - discount;

      // Calcular y asignar totales
      subtotal = subtotal + element.price;
      totalReserve = totalReserve + element.price;
      totalDiscount = totalDiscount + (discount * element.quantity);
    }

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

  setGarmentPrice(garment, index) {
    var dataArticle = this.listGarment.filter((e) => e.reference === garment.value);
    ((this.listArticles.get('rows') as FormArray).at(index) as FormGroup).get('price').setValue(dataArticle[0].price);
    this.calculateTotals();
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


  //modal Methods

  public openModal(input) {
    this.referenceProduct = input.value;
    var article = this.listGarment.filter((e) => e.reference === input.value);
    this.imageProduct = 'https://storage.googleapis.com/bellarose-qa.appspot.com/'+article[0].imageURL;
    this.quantityProduct = article[0].quantity;
    const modal = document.getElementById('myModalPreview');
    modal.style.display = 'block';
  }

  public close() {
    const modal = document.getElementById('myModalPreview');
    modal.style.display = 'none';
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

  // Función general para snackbar de texto largo
  private openSnackBarLarge(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 6000, panelClass: ['mycsssnackbartest'] });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  dateNow() {
    const now = new Date(Date.now());
    const dd = this.addZero(now.getDate());
    const mm = this.addZero(now.getMonth() + 1);
    const yyyy = now.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  }

  addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }


}
