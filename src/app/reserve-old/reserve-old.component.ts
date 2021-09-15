import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';

//Service
import { CustomerService } from '../service/customer.service';
import { ArticleService } from '../service/article.service';
import { EmployeeService } from 'app/service/employee.service';
import { ReserveService } from '../service/reserve.service';

import { ValidateArticle } from '../models/article.model'
import { Reserve } from '../models/reserve.model';
import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-reserve-old',
  templateUrl: './reserve-old.component.html',  
  styleUrls: ['./reserve-old.component.css'],
  providers: [CustomerService, ArticleService, EmployeeService, ReserveService]
})
export class ReserveOldComponent implements OnInit {

  article: ValidateArticle;
  reserve: Reserve;
  customer: Customer;
  name: FormControl;
  identification: FormControl;
  email: FormControl;
  telephone1: FormControl;
  telephone2: FormControl;
  telephone3: FormControl;
  direction: FormControl;
  public showProgBar: boolean;
  public dsbSave: boolean;
  public showRef: boolean;
  public dsbSaveCliente: boolean;
  public showForm: boolean;
  public anyCabecera: any[];
  public anyCabeceraRef: any[];
  public anyDetalleRef: any[];
  public anyDetalleArticle: FormGroup;
  public comments: FormControl;
  public subtotal: FormControl;
  public totalDiscount: FormControl;
  public totalReserve: FormControl;
  public customerId: FormControl;
  public customerIdentification: FormControl;
  public employeIdentification: FormControl;
  public employeId: FormControl;
  public listGarment: any[];
  public referenceProduct: any;
  public imageProduct: any;
  public quantityProduct: any;
  private arrayValidateArticles:any[];
  private rowsArticlesValues: any[];

  public listCustomers: any[];
  public listEmployees: any[];
  private localstorageArticlesValues: any[];

  //Form
  public startDate: FormControl;
  public endDate: FormControl;

  constructor(
    private router: Router,
    public fb: FormBuilder,
    private articleService: ArticleService,
    private customerService: CustomerService,
    private employeService: EmployeeService,
    private _snackBar: MatSnackBar,
    private reserveService: ReserveService,
  ) {
    this.name = new FormControl();
    this.identification = new FormControl();
    this.email = new FormControl('', [Validators.email,]);
    this.telephone1 = new FormControl();
    this.telephone2 = new FormControl();
    this.telephone3 = new FormControl();
    this.direction = new FormControl();
    this.showProgBar = true;
    this.showRef = true;
    this.showForm = true;
    this.anyCabecera = ['','','% DESCUENTO','REFERENCIA','PRECIO','DESCUENTO','NETO','VISUALIZAR'];
    this.anyDetalleArticle = this.fb.group({ rows: this.fb.array([]) });
    this.listGarment = [];
    this.listCustomers = [];
    this.listEmployees = [];
    this.subtotal = new FormControl();
    this.totalDiscount = new FormControl();
    this.totalReserve = new FormControl();
    this.customerId = new FormControl();
    this.customerIdentification = new FormControl();
    this.employeIdentification = new FormControl();
    this.employeId = new FormControl();
    this.comments = new FormControl();

    //Form
    this.startDate = new FormControl();
    this.endDate = new FormControl(); 

    this.clearData();
    this.getListGarments();
    this.getListCustomers();
    this.getListEmployes();
   }

  ngOnInit() {
  }

  private clearData() {
    this.listCustomers = [];
    this.listEmployees = [];
    this.rowsArticlesValues = [];
    this.showProgBar = true;
    this.dsbSave = false;
    this.customerId.setValue('');
    this.customerIdentification.setValue('');
    this.employeIdentification.setValue('');
    this.employeId.setValue('');
    this.startDate.setValue('');
    this.endDate.setValue('');
    this.comments.setValue('');
    this.totalDiscount.setValue(0);
    this.subtotal.setValue(0);
    this.totalReserve.setValue(0);
    const control = this.anyDetalleArticle.get('rows') as FormArray;
    control.clear();
    this.addArticle();
  }

  private getListEmployes(): any {
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
            this.alert('Error', 'Ocurrió un error.', 'error');
          }
        }
      )
  }

  public setEmployeData() {
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

  public setCustomerData() {
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

  private getListCustomers(): any {
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
            this.alert('Error', 'Ocurrió un error.', 'error');
          }
        }
      )
  }

  private getListGarments(): any {
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
            this.alert('Error', 'Ocurrió un error.', 'error');
          }
        }
      )
  }

  public addArticle() {
    const anyControl = this.anyDetalleArticle.get('rows') as FormArray;
    anyControl.push(this.createArticle());
  }

  private createArticle(): FormGroup {
    return this.fb.group({
      discount: 0,
      garmentReference: '',
      price: 0,
      quantity: 1,
      total: 0
    });
  }

  public removeArticle(index: number) {
    const control = this.anyDetalleArticle.get('rows') as FormArray;
    control.removeAt(index);
    this.calculateTotals();
    this.valDisponibilidad();
  }

  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  public calculateTotals() {

    // Validar campos de artículos
    const control = this.anyDetalleArticle.get('rows') as FormArray;
    const rowsArticles = control.value;

    // Variables para calcular resumen del detalle
    let valSubTotal = 0;
    let valDescuento = 0;

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

  public setGarmentPrice(garment, index) {
    var dataArticle = this.listGarment.filter((e) => e.reference === garment.value);
    ((this.anyDetalleArticle.get('rows') as FormArray).at(index) as FormGroup).get('price').setValue(dataArticle[0].price);
    this.calculateTotals();
    this.valDisponibilidad();
  }

  private alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
  }

  public openModal(input) {
    this.referenceProduct = input.value;
    var article = this.listGarment.filter((e) => e.reference === input.value);
    this.imageProduct = `${environment.urlImage}/${article[0].imageURL}`;
    this.quantityProduct = article[0].quantity;
    const modal = document.getElementById('myModalPreview');
    modal.style.display = 'block';
  }

  public close() {
    const modal = document.getElementById('myModalPreview');
    modal.style.display = 'none';
  }

  public openModalCliente() {
    const modal = document.getElementById('modalCreateClient');
    modal.style.display = 'block';
  }

  public closeModalCliente() {
    const modal = document.getElementById('modalCreateClient');
    modal.style.display = 'none';
  }

  private changeShowCliente() {
    this.dsbSaveCliente = !this.dsbSaveCliente;
  }

  private valDisponibilidad(){
    const control = this.anyDetalleArticle.get('rows') as FormArray;
    const rows = control.value;
    let arrayValidate = [];

    for (let indx in rows){
      const element = rows[indx];
      const objeto = {
        ref: element.garmentReference, 
        price: element.price, 
        discount: element.discount
      }
      arrayValidate.push(objeto.ref);
    }

    this.arrayValidateArticles = arrayValidate;
    this.article = new ValidateArticle;
    this.article.articles = this.arrayValidateArticles;
    this.srvValDisponibilidad(this.article);
  }

  private srvValDisponibilidad(article: ValidateArticle): any {
    this.articleService.validateAvailability(article)
    .subscribe((response: any) => {
      if(response.resp){
        this.showRef = true;
        this.showForm = false;
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
        } else if (err.error.type === 2) {
          this.showRef = false;
          this.showForm = true;
          this.anyCabeceraRef = ['REFERENCE','FECHA DISPONIBILIDAD'];
          let anyResponse = err.error.msg;
          let anyResult = [];
          for (let obj in anyResponse){
            const element = anyResponse[obj];
            const objeto = {
              reference: element.reference,
              earlyDate: this.convertDates(element.earlyDate)
            }
            anyResult.push(objeto);
          }
          this.anyDetalleRef = anyResult;
        } else {
          this.alert('Error', 'Ocurrió un error.', 'error');
        }
      }
    );
  }

  private convertDates(value) {
    const now = new Date(value);
    const dd = this.addZero(now.getDate());
    const mm = this.addZero(now.getMonth() + 1);
    const yyyy = now.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  }

  private addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }

  private valRows(){
    const control = this.anyDetalleArticle.get('rows') as FormArray;
    const rowsArticles = control.value;
    let validRowsIndex = [];
    let sw = false;
    for (let obj in rowsArticles){
      const element = rowsArticles[obj];
      if (element.reference === '' || element.discount > 100 || element.price < 0 || element.quantity < 0) {
        validRowsIndex.push(obj + 1);
      } else {
        sw = true
      }
    }
    if (!sw) {
      this.openSnackBarLarge(`En las filas # ` + validRowsIndex.toString() + ` debe verificarse que todos los campos de producto esten diligenciados.`, 'OK');
      return false;
    }
    return sw;
  }

  public dateLessThan(event) {
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

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000, panelClass: ['mycsssnackbartest'] });
  }

  private openSnackBarLarge(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 6000, panelClass: ['mycsssnackbartest'] });
  }

  private changeShow() {
    this.dsbSave = !this.dsbSave;
    this.showProgBar = !this.showProgBar;
  }

  public saveReserve() {
    this.changeShow();
    // Validar todos los datos basicos
    if (!this.validateForm()) {
      this.changeShow();
      return;
    }
    // Validar todos los datos de productos
    if (!this.valRows()) {
      this.changeShow();
      return;
    }
    
    const control = this.anyDetalleArticle.get('rows') as FormArray;
    const rowsArticles = control.value;
    let articleList = [],
        articleListLocalstorage;
    for (let obj in rowsArticles){
      const element = rowsArticles[obj];
      const objeto = {
        ref: element.garmentReference,
        price: element.price,
        discount: element.discount
      }
      articleList.push(objeto);
      articleListLocalstorage.push({ reference: element.garmentReference, price: element.price, discount: element.discount });
    }
    this.rowsArticlesValues = articleList;
    this.localstorageArticlesValues = articleListLocalstorage;

    this.reserve = new Reserve;
    this.reserve.customerID = Number(this.customerId.value);
    this.reserve.employeeID = Number(this.employeId.value);
    this.reserve.startDate = this.convertDates(this.startDate.value);
    this.reserve.endDate = this.convertDates(this.endDate.value);
    this.reserve.description = this.comments.value;
    this.reserve.articles = this.rowsArticlesValues;

    this.createReserve(this.reserve);

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

  createCliente(){
    this.changeShowCliente();
    if (!this.validateData()) {
      this.changeShowCliente();
      return;
    }
    this.saveCliente();
  }

  private validateData() {
    if (this.name.value === null || this.name.value === '') {
      this.openSnackBar('Debes indicar el nombre.', 'OK');
      return false;
    }
    if (this.identification.value === null || this.identification.value === '') {
      this.openSnackBar('Debes indicar la identificación.', 'OK');
      return false;
    }
    if (this.email.value !== '') {
      if (!this.formatEmail(this.email.value)) {
        this.openSnackBar('Debe ingresar un email con formato correcto.', 'OK');
        return false;
      }
    }
    if (this.direction.value === null || this.direction.value === '') {
      this.openSnackBar('Debes indicar la dirección.', 'OK');
      return false;
    }
    if (this.telephone1.value === null || this.telephone1.value === '') {
      this.openSnackBar('Debes indicar el telefono 1.', 'OK');
      return false;
    }
    if (this.telephone2.value === null || this.telephone2.value === '') {
      this.openSnackBar('Debes indicar el telefono 2.', 'OK');
      return false;
    }
    if (this.telephone3.value === null || this.telephone3.value === '') {
      this.openSnackBar('Debes indicar el telefono 3.', 'OK');
      return false;
    }
    return true;
  }

  private formatEmail(email) {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  private saveCliente() {
    this.dsbSaveCliente = true;
    this.customer = new Customer;
    this.customer.name = this.name.value;
    this.customer.identification = this.identification.value;
    this.customer.email = this.email.value;
    this.customer.telephone1 = this.telephone1.value;
    this.customer.direction = this.direction.value;
    this.customer.telephone2 = this.telephone2.value;
    this.customer.telephone3 = this.telephone3.value;

    this.customerService.createCustomer(this.customer)
      .subscribe((response: any) => {
        this.changeShowCliente();
        if (response.resp) {
          this.alert('HECHO', 'Cliente creado.', 'success');
          this.clearDataCliente();
          this.getListCustomers();
        } else {
          this.alert('Atención', 'Cliente no creado', 'warning');
        }
        this.closeModalCliente();
      },
        (err) => {
          this.changeShowCliente();
          this.alert('Error', 'Cliente no creado', 'error');
          this.closeModalCliente();
        }
      );
    
  }

  private clearDataCliente() {
    this.name.setValue('');
    this.identification.setValue('');
    this.email.setValue('');
    this.telephone1.setValue('');
    this.telephone2.setValue('');
    this.telephone3.setValue('');
    this.direction.setValue('');
  }

}
