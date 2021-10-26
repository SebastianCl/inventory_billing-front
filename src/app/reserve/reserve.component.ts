import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';

//Services
import { ArticleService } from '../service/article.service';
import { CustomerService } from '../service/customer.service';
import { EmployeeService } from 'app/service/employee.service';
import { ReserveService } from '../service/reserve.service';

//Models
import { ValidateArticle } from '../models/article.model';
import { Reserve } from '../models/reserve.model';
import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css'],
  providers: [ArticleService, CustomerService, EmployeeService, ReserveService]
})
export class ReserveComponent implements OnInit {
  //Models
  article: ValidateArticle;
  reserve: Reserve;
  customer: Customer;
  //Info imagen code
  public codeProduct: any;
  public imageProduct: any;
  public quantityProduct: any;
  //Arrays select
  public anyListGarment: any[];
  public anyListCustomers: any[];
  public anyListEmployees: any[];
  //Arrays
  public anyCabecera: any[];
  public anyDetalleArticle: FormGroup;
  private arrayValidateArticles: any[];
  public anyCabeceraRef: any[];
  public anyDetalleRef: any[];
  private rowsArticlesValues: any[];
  private localstorageArticlesValues: any[];
  //Form bool
  public showFormRef: boolean;
  public showValRef: boolean;
  public showForm: boolean;
  public btnSaveRes: boolean;
  public showProgBar: boolean;
  public btnSaveCliente: boolean;
  //Form reserva
  public startDate: FormControl;
  public endDate: FormControl;
  public customerId: FormControl;
  public customerIdentification: FormControl;
  public employeId: FormControl;
  public employeIdentification: FormControl;
  public comments: FormControl;
  //Form cliente
  public name: FormControl;
  public identification: FormControl;
  public email: FormControl;
  public direction: FormControl;
  public telephone1: FormControl;
  public telephone2: FormControl;
  public telephone3: FormControl;
  //Form formulas
  public subtotal: FormControl;
  public totalDiscount: FormControl;
  public totalReserve: FormControl;
  constructor(
    //Services
    private articleService: ArticleService,
    private customerService: CustomerService,
    private employeService: EmployeeService,
    private reserveService: ReserveService,
    private router: Router,
    public fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    //Arrays select
    this.anyListGarment = [];
    this.anyListCustomers = [];
    this.anyListEmployees = []
    //Arrays
    this.anyCabecera = ['', '', '% DESCUENTO', 'REFERENCIA', 'PRECIO', 'DESCUENTO', 'NETO', 'VISUALIZAR'];
    this.anyDetalleArticle = this.fb.group({ rows: this.fb.array([]) });
    //Form bool
    this.showFormRef = true;
    this.showValRef = true;
    this.showForm = true;
    this.btnSaveRes = false;
    this.showProgBar = true;
    //Form reserva
    this.startDate = new FormControl();
    this.endDate = new FormControl();
    this.customerId = new FormControl();
    this.customerIdentification = new FormControl();
    this.employeId = new FormControl();
    this.employeIdentification = new FormControl();
    this.comments = new FormControl();
    //Form cliente
    this.name = new FormControl();
    this.identification = new FormControl();
    this.email = new FormControl();
    this.direction = new FormControl();
    this.telephone1 = new FormControl();
    this.telephone2 = new FormControl();
    this.telephone3 = new FormControl();
    //Form formulas
    this.subtotal = new FormControl();
    this.totalDiscount = new FormControl();
    this.totalReserve = new FormControl();
    //Functions init
    this.getListArticles();
    this.getListCustomers();
    this.getListEmployes();
    this.clearData();
  }

  ngOnInit() {
  }

  private getListEmployes(): any {
    this.employeService.loadEmployees()
      .subscribe((response: any) => {
        if (response.resp && response.msg.length > 0) {
          response.msg.sort((a, b) => a.name.localeCompare(b.name)).forEach(employe => {
            this.anyListEmployees.push(employe);
          });
        } else {
          this.anyListEmployees = [];
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

  private getListCustomers(): any {
    this.customerService.loadCustomers()
      .subscribe((response: any) => {
        if (response.resp && response.msg.length > 0) {
          response.msg.sort((a, b) => a.name.localeCompare(b.name)).forEach(element => {
            this.anyListCustomers.push(element);
          });
        } else {
          this.anyListCustomers = [];
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

  private getListArticles(): any {
    this.articleService.loadArticles()
      .subscribe((response: any) => {
        if (response.resp && response.msg.length > 0) {
          response.msg.sort((a, b) => a.code.localeCompare(b.code)).forEach(element => {
            this.anyListGarment.push(element);
          });
        } else {
          this.anyListGarment = [];
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

  private alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
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
        this.showFormRef = true;
      }
      else {
        this.showFormRef = false;
      }
    }
  }

  public addArticle() {
    const anyControl = this.anyDetalleArticle.get('rows') as FormArray;
    anyControl.push(this.createArticle());
  }

  private createArticle(): FormGroup {
    return this.fb.group({
      discount: '',
      garmentCode: '',
      price: 0,
      quantity: 1,
      total: 0
    });
  }

  private addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000, panelClass: ['mycsssnackbartest'] });
  }

  private openSnackBarLarge(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 6000, panelClass: ['mycsssnackbartest'] });
  }

  public removeArticle(index: number) {
    const control = this.anyDetalleArticle.get('rows') as FormArray;
    control.removeAt(index);
    this.calculateTotals();
    if (control.length == 0) {
      this.showValRef = true;
      this.showForm = true;
    }
    else {
      this.valDisponibilidad();
    }
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
    var dataArticle = this.anyListGarment.filter((e) => e.code === garment.value);
    ((this.anyDetalleArticle.get('rows') as FormArray).at(index) as FormGroup).get('price').setValue(dataArticle[0].price);
    this.calculateTotals();
    this.valDisponibilidad();
  }

  public openModalImg(input) {
    this.codeProduct = input.value;
    var article = this.anyListGarment.filter((e) => e.code === input.value);
    this.imageProduct = `${environment.urlImage}/${article[0].imageURL}`;
    this.quantityProduct = article[0].quantity;
    const modal = document.getElementById('myModalImg');
    modal.style.display = 'block';
  }

  public closeModalImg() {
    const modal = document.getElementById('myModalImg');
    modal.style.display = 'none';
  }

  private valDisponibilidad() {
    const control = this.anyDetalleArticle.get('rows') as FormArray;
    const rows = control.value;
    let arrayValidate = [];

    for (let indx in rows) {
      const element = rows[indx];
      arrayValidate.push(element.garmentCode);
    }

    this.arrayValidateArticles = arrayValidate;
    this.article = new ValidateArticle;
    this.article.articles = this.arrayValidateArticles;
    this.srvValDisponibilidad(this.article);
  }

  private srvValDisponibilidad(article: ValidateArticle): any {
    this.articleService.validateAvailability(article)
      .subscribe((response: any) => {
        if (response.resp) {
          this.showValRef = true;
          this.showForm = false;
        }
      },
        (err) => {
          console.info(err);
          if (err.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            Swal.fire({
              title: 'Sesión expirada', text: 'Debes iniciar sesión.', icon: 'warning',
              onClose: () => { this.router.navigate(['/login']); }
            });
          } else if (err.status === 400) {
            if (err.error.type === 2) {
              this.showValRef = false;
              this.showForm = true;
              this.anyCabeceraRef = ['REFERENCIA', 'ARTÍCULO RESERVADO EN'];
              let anyResponse = err.error.msg;
              let anyResult = [];
              for (let obj in anyResponse) {
                const element = anyResponse[obj];
                const objeto = {
                  code: element.code,
                  earlyDate: this.convertDates(element.earlyDate)
                }
                anyResult.push(objeto);
              }
              this.anyDetalleRef = anyResult;
            }
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

  public setCustomerData() {
    let customerIdentification = '';
    for (let index = 0; index < this.anyListCustomers.length; index++) {
      const element = this.anyListCustomers[index];
      if (element.id === this.customerId.value) {
        customerIdentification = element.identification;
        break;
      }
    }
    this.customerIdentification.setValue(customerIdentification);
  }

  public setEmployeData() {
    let employeIdentification = '';
    for (let index = 0; index < this.anyListEmployees.length; index++) {
      const element = this.anyListEmployees[index];
      if (element.id === this.employeId.value) {
        employeIdentification = element.identification;
        break;
      }
    }
    this.employeIdentification.setValue(employeIdentification);
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
      articleListLocalstorage = [];

    for (let obj in rowsArticles) {
      const element = rowsArticles[obj];
      let discount = (element.discount === '') ? 0 : element.discount;
      const objeto = {
        code: element.garmentCode,
        price: element.price,
        discount
      }
      articleList.push(objeto);
      articleListLocalstorage.push({ code: element.garmentCode, price: element.price, discount });
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

  private createReserve(dataReserve: Reserve): any {
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
            depositInvoice: 0,
            type: '1',
            startDate: response.msg.startDate
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
              let msg = "- articulo " + element.code + ": no existe stock actualmente, estara disponible: " + this.convertDates(element.earlyDate);
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
    this.anyListCustomers = [];
    this.anyListEmployees = [];
    this.rowsArticlesValues = [];
    this.showProgBar = true;
    this.btnSaveRes = false;
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

  private changeShow() {
    this.btnSaveRes = !this.btnSaveRes;
    this.showProgBar = !this.showProgBar;
  }

  private validateForm() {
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

  private valRows() {
    const control = this.anyDetalleArticle.get('rows') as FormArray;
    const rowsArticles = control.value;
    let validRowsIndex = [];
    let sw = false;
    for (let obj in rowsArticles) {
      const element = rowsArticles[obj];
      if (element.code === '' || element.discount > 100 || element.price < 0 || element.quantity < 0) {
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

  public openModalCliente() {
    const modal = document.getElementById('modalCreateClient');
    modal.style.display = 'block';
  }

  public closeModalCliente() {
    const modal = document.getElementById('modalCreateClient');
    modal.style.display = 'none';
  }

  public createCliente() {
    this.changeShowCliente();
    if (!this.validateData()) {
      this.changeShowCliente();
      return;
    }

    this.customer = new Customer;
    this.customer.name = this.name.value;
    this.customer.identification = this.identification.value;
    this.customer.email = this.email.value;
    this.customer.direction = this.direction.value;
    this.customer.telephone1 = String(this.telephone1.value);
    this.customer.telephone2 = (this.telephone2.value == null) ? '0' : String(this.telephone2.value);
    this.customer.telephone3 = (this.telephone3.value == null) ? '0' : String(this.telephone3.value);

    this.saveCliente(this.customer);

  }

  private saveCliente(dataCliente: Customer): any {

    this.customerService.createCustomer(dataCliente)
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
          this.alert('Error', 'Cliente no creado', 'error');
          this.changeShowCliente();
          this.closeModalCliente();
          this.clearDataCliente();
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

  private changeShowCliente() {
    this.btnSaveCliente = !this.btnSaveCliente;
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
    return true;
  }

  private formatEmail(email) {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

}
