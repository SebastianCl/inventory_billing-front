import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

// Servicio
import { CustomerService } from '../service/customer.service';
import { ReserveService } from '../service/reserve.service';
import { ArticleService } from '../service/article.service';

// Modelo
import { Reserve } from '../models/reserve.model';
import { EmployeeService } from 'app/service/employee.service';

@Component({
  selector: 'app-quotation',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css'],
  providers: [CustomerService, ReserveService, ArticleService, EmployeeService]
})
export class ReserveComponent implements OnInit {

  reserve: Reserve;
  public hiddenProgBar: boolean;
  public dsbSave: boolean;
  public listCustomers: any[];
  public listEmployees: any[];
  public listArticles: FormGroup;
  public listGarment: any[];

  public customerId: FormControl;
  public customerIdentification: FormControl;
  public employeIdentification: FormControl;
  public employeId: FormControl;
  public startDate: FormControl;
  public endDate: FormControl;
  public tax: FormControl;
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
  private localstorageArticlesValues: any[];

  constructor
    (
      private router: Router,
      private _snackBar: MatSnackBar,
      private customerService: CustomerService,
      private articleService: ArticleService,
      private employeService: EmployeeService,
      private reserveService: ReserveService,
      public fb: FormBuilder
    ) {
    this.customerId = new FormControl();
    this.customerIdentification = new FormControl();
    this.employeIdentification = new FormControl();
    this.employeId = new FormControl();
    this.startDate = new FormControl();
    this.endDate = new FormControl();
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
    this.getListEmployes();
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

    const control = this.listArticles.get('rows') as FormArray;
    const rows = control.value;
    let articleList = [];

    let articleListLocalstorage = [];

    for (let index = 0; index < rows.length; index++) {
      const element = rows[index];
      // Conservar artículo en lista para almacenar
      articleList.push({ ref: element.garmentReference, price: element.price, discount: element.discount });
      articleListLocalstorage.push({ reference: element.garmentReference, price: element.price, discount: element.discount });
    }
    this.localstorageArticlesValues = articleListLocalstorage;
    this.rowsArticlesValues = articleList;


    this.reserve = new Reserve;
    this.reserve.customerID = Number(this.customerId.value);
    this.reserve.employeeID = Number(this.employeId.value);
    this.reserve.startDate = this.convertDates(this.startDate.value);
    this.reserve.endDate = this.convertDates(this.endDate.value);
    this.reserve.description = this.comments.value;
    this.reserve.articles = this.rowsArticlesValues;

    this.createReserve(this.reserve);
  }

  private validateForm() {
    // Validar si selecciono un cliente
    if (this.customerId.value === null || this.customerId.value === '') {
      this.openSnackBar('Debe seleccionar un cliente', 'OK');
      return false;
    }
    if (this.employeId.value === null || this.employeId.value === '') {
      this.openSnackBar('Debe seleccionar un empleado', 'OK');
      return false;
    }
    if (this.startDate.value === null || this.startDate.value === '') {
      this.openSnackBar('Debe seleccionar una fecha inicial para la reserva', 'OK');
      return false;
    }
    if (this.endDate.value === null || this.endDate.value === '') {
      this.openSnackBar('Debe seleccionar una fecha final para la reserva', 'OK');
      return false;
    }
    return true;
  }

  private validateRows() {
    // Validar campos de artículos
    const control = this.listArticles.get('rows') as FormArray;
    const rowsArticles = control.value;
    let validRowsIndex = [];
    let sw = false;
    for (let index = 0; index < rowsArticles.length; index++) {
      const element = rowsArticles[index];
      if (element.reference === '' || element.discount > 100 || element.price < 0 || element.quantity < 0) {
        validRowsIndex.push(index + 1);
      } else {
        sw = true
      }
    }
    if (!sw) {
      this.openSnackBarLarge(`En las filas # ` + validRowsIndex.toString() + ` debe verificarse que todos los campos de producto esten diligenciados.`, 'OK');
      return false;
    }
    return true;
  }

  calculateTotals() {

    // Validar campos de artículos
    const control = this.listArticles.get('rows') as FormArray;
    const rowsArticles = control.value;

    // Variables para calcular resumen del detalle
    let valSubTotal = 0;
    let valDescuento = 0;

    debugger;
    for (let index = 0; index < rowsArticles.length; index++) {

      const element = rowsArticles[index];
      let valCantidad = element.quantity;
      let valUnitario = element.price;
      let valNeto = (valCantidad * valUnitario);
      let pDescuento = element.discount;

      valSubTotal = valSubTotal + valNeto;
      valDescuento = valDescuento + (valNeto * (pDescuento / 100));
    }

    let valTotal = (valSubTotal - valDescuento);

    this.subtotal.setValue(valSubTotal); // SUBTOTAL
    this.totalDiscount.setValue(valDescuento); // TOTAL DE DESCUENTOS
    this.totalReserve.setValue(valTotal); // TOTAL DE RESERVA

  }

  setCustomerData() {
    let customerIdentification = '';
    for (let index = 0; index < this.listCustomers.length; index++) {
      const element = this.listCustomers[index];
      if (element.id === this.customerId.value) {
        customerIdentification = element.identification;
        break;
      }
    }
    this.customerIdentification.setValue(customerIdentification);
  }

  setEmployeData() {
    let employeIdentification = '';
    for (let index = 0; index < this.listEmployees.length; index++) {
      const element = this.listEmployees[index];
      if (element.id === this.employeId.value) {
        employeIdentification = element.identification;
        break;
      }
    }
    this.employeIdentification.setValue(employeIdentification);
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

  getListEmployes(): any {
    this.employeService.loadEmployees()
      .subscribe((response: any) => {
        if (response.resp && response.msg.length > 0) {
          response.msg.sort((a, b) => a.name.localeCompare(b.name)).forEach(employe => {
            this.listEmployees.push(employe);
          });
        } else {
          this.listEmployees = [];
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
    let arrayArticleValids = [];
    this.reserveService.createReserve(dataReserve)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          let dataLocalstorage = {
            status: response.msg.active,
            articlesIDS: response.msg.articles,
            invoiceNumber: '',
            articlesLocalStorage: this.localstorageArticlesValues,
            customerID: this.customerId.value,
            employeeName: response.msg.employeeName,
            reserveNumber: response.msg.reserveNumber,
            reserveID: response.msg.id,
            total: this.totalReserve.value,
            subtotal: this.subtotal.value,
            depositInvoice: 0
          }
          let status = {
            created: false
          }
          Swal.fire({
            title: 'Exito',
            html: `Reserva registrada.`,
            icon: 'success',
            confirmButtonText: 'OK',
            showConfirmButton: true,
            showCancelButton: false,
            timer: 3000
          }).then((resultModal: any) => {
            localStorage.setItem('reserve', JSON.stringify(dataLocalstorage));
            localStorage.setItem('isCreatedInvoice', JSON.stringify(status));
            this.clearData();
            this.getListCustomers();
            this.getListEmployes();
            this.router.navigate(['/invoice/', 0]);
          })
        } else {
          this.alert('Error', response.msg, 'error');
        }
      },
        (err) => {
          this.changeShow();
          if (err.error.type === 2) {
            err.error.msg.forEach(element => {
              let msg = "- articulo " + element.reference + ": no existe stock actualmente, estara disponible: " + this.convertDates(element.earlyDate);
              arrayArticleValids.push(msg);
            });
            this.alert('Atención Usuario', 'Se informa lo siguiente: \n' + arrayArticleValids.toString(), 'warning');
          } else {
            this.alert('Error', 'Ocurrió un error.', 'error');
          }
        }
      );
  }

  private clearData() {
    this.listCustomers = [];
    this.listEmployees = [];
    this.rowsArticlesValues = [];
    this.hiddenProgBar = true;
    this.dsbSave = false;
    this.customerId.setValue('');
    this.customerIdentification.setValue('');
    this.employeIdentification.setValue('');
    this.employeId.setValue('');
    this.startDate.setValue('');
    this.endDate.setValue('');
    this.comments.setValue('');
    this.tax.setValue(7);
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
    this.imageProduct = 'https://storage.googleapis.com/bellarose-qa.appspot.com/' + article[0].imageURL;
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

  convertDates(value) {
    const now = new Date(value);
    const dd = this.addZero(now.getDate());
    const mm = this.addZero(now.getMonth() + 1);
    const yyyy = now.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  }

  dateLessThan(event) {
    const now = new Date(event);
    const dd = this.addZero(now.getDate());
    const mm = this.addZero(now.getMonth() + 1);
    const yyyy = now.getFullYear();

    if (dd != '0' && mm != '0' && yyyy > 2000) {
      if (new Date(this.startDate.value) >= new Date(this.endDate.value)) {
        this.openSnackBar('La fecha final de reserva debe ser mayor a la fecha inicial de reserva', 'OK');
        this.endDate.reset();
      }
    }
  }

  addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }


}
