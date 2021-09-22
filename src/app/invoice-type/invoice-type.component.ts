import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

//Services
import { CustomerService } from '../service/customer.service';
import { EmployeeService } from 'app/service/employee.service';
import { ArticleService } from '../service/article.service';
import { InvoiceService } from '../service/invoice.service';

//Models
import { Customer } from '../models/customer.model';
import { InvoiceDano, InvoiceVenta } from '../models/invoice.model';
import { ValidateArticle } from '../models/article.model';

@Component({
  selector: 'app-invoice-type',
  templateUrl: './invoice-type.component.html',
  styleUrls: ['./invoice-type.component.css'],
  providers: [CustomerService, EmployeeService, ArticleService, InvoiceService]
})
export class InvoiceTypeComponent implements OnInit {
  //Models
  article: ValidateArticle;
  customer: Customer;
  invoice_dano: InvoiceDano;
  invoice_venta: InvoiceVenta;
  public typeInvoice: string;
  //Info imagen reference
  public referenceProduct: any;
  public imageProduct: any;
  public quantityProduct: any;
  //Array select
  public anyListCustomers: any[];
  public anyListEmployees: any[];
  public anyListGarment: any[];
  private rowsArticlesValues: any[];
  //Arrays
  public anyCabecera: any[];
  private arrayValidateArticles: any[];
  public anyCabeceraRef: any[];
  public anyDetalleRef: any[];
  //Form bool
  public btnSaveCliente: boolean;
  public btnSaveInvoice: boolean;
  public showFormRef: boolean;
  public showProgBar: boolean;
  public showFormVal: boolean;
  public showForm: boolean;
  public showValRef: boolean;
  //Form invoice
  public customerId: FormControl;
  public customerIdentification: FormControl;
  public employeIdentification: FormControl;
  public cost: FormControl;
  public description: FormControl;
  public employeeName: FormControl;
  public customerName: FormControl;
  public employeId: FormControl;
  public anyDetalleArticle: FormGroup;
  public strTitle: string;
  //Form cliente
  public name: FormControl;
  public identification: FormControl;
  public email: FormControl;
  public direction: FormControl;
  public telephone1: FormControl;
  public telephone2: FormControl;
  public telephone3: FormControl;
  constructor(
    //Services
    private customerService: CustomerService,
    private employeService: EmployeeService,
    private articleService: ArticleService,
    private invoiceService: InvoiceService,
    //Other
    public route: ActivatedRoute,
    private router: Router,
    public fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    //Models
    this.typeInvoice = '';
    //Array select
    this.anyListCustomers = [];
    this.anyListEmployees = [];
    this.anyListGarment = [];
    //Arrays
    this.anyCabecera = ['', '', '%DESCUENTO', 'REFERENCIA', 'PRECIO', 'DESCUENTO', 'NETO', 'VISUALIZAR'];
    this.anyDetalleArticle = this.fb.group({ rows: this.fb.array([]) });
    //Form bool
    this.btnSaveCliente = false;
    this.btnSaveInvoice = false;
    this.showFormRef = false;
    this.showProgBar = true;
    this.showFormVal = false;
    this.showValRef = false;
    //Form invoice
    this.customerId = new FormControl();
    this.customerIdentification = new FormControl();
    this.employeIdentification = new FormControl;
    this.cost = new FormControl();
    this.description = new FormControl();
    this.employeeName = new FormControl();
    this.customerName = new FormControl();
    this.employeId = new FormControl();
    //Form cliente
    this.name = new FormControl();
    this.identification = new FormControl();
    this.email = new FormControl();
    this.direction = new FormControl();
    this.telephone1 = new FormControl();
    this.telephone2 = new FormControl();
    this.telephone3 = new FormControl();
    //Functions init
    this.getListCustomers();
    this.getListEmployes();
    this.getListGarments();
  }

  ngOnInit() {
    let type = Number(this.route.snapshot.paramMap.get('id'));
    this.typeInvoice = String(type);
    switch (type) {
      case 3:
        this.strTitle = 'Factura por daño';
        this.showFormRef = false;
        this.showForm = true;
        break;
      case 2:
        this.strTitle = 'Factura por venta';
        this.showFormRef = true;
        this.showForm = false;
        this.addArticle();
        break;
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }
  private getListGarments(): any {
    this.articleService.loadArticles()
      .subscribe((response: any) => {
        if (response.resp && response.msg.length > 0) {
          response.msg.sort((a, b) => a.reference.localeCompare(b.reference)).forEach(element => {
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

  private alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
  }

  public setCustomerData() {
    let customerIdentification = '',
      customerName = '';
    for (let index = 0; index < this.anyListCustomers.length; index++) {
      const element = this.anyListCustomers[index];
      if (element.id === this.customerId.value) {
        customerIdentification = element.identification;
        customerName = element.name
        break;
      }
    }
    this.customerIdentification.setValue(customerIdentification);
    this.customerName.setValue(customerName);
  }

  public setEmployeData() {
    let employeName = '',
      employeIdentification;
    for (let index = 0; index < this.anyListEmployees.length; index++) {
      const element = this.anyListEmployees[index];
      if (element.id === this.employeId.value) {
        employeName = element.name;
        employeIdentification = element.identification;
        break;
      }
    }
    this.employeeName.setValue(employeName);
    this.employeIdentification.setValue(employeIdentification);
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

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000, panelClass: ['mycsssnackbartest'] });
  }

  private openSnackBarLarge(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 6000, panelClass: ['mycsssnackbartest'] });
  }

  private formatEmail(email) {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  public saveReserve() {

    this.changeShow();
    // Validar todos los datos basicos
    if (!this.validateForm()) {
      this.changeShow();
      return;
    }

    let type = this.showFormRef;

    if (type) {

      // Validar todos los datos de productos
      if (!this.valRows()) {
        this.changeShow();
        return;
      }

      const control = this.anyDetalleArticle.get('rows') as FormArray;
      const rowsArticles = control.value;
      let articleList = [];

      for (let obj in rowsArticles) {
        const element = rowsArticles[obj];
        const objeto = {
          ref: element.garmentReference,
          price: element.price,
          discount: (element.discount === '') ? 0 : element.discount
        }
        articleList.push(objeto);
      }

      this.rowsArticlesValues = articleList;

      this.invoice_venta = new InvoiceVenta;
      this.invoice_venta.cost = Number(this.cost.value);
      this.invoice_venta.customerIdentification = this.customerIdentification.value;
      this.invoice_venta.description = this.description.value;
      this.invoice_venta.customerName = this.customerName.value;
      this.invoice_venta.employeeName = this.employeeName.value;
      this.invoice_venta.articles = this.rowsArticlesValues;

      console.info(this.invoice_venta);

      this.createInvoiceVenta(this.invoice_venta);

    }
    else {

      this.invoice_dano = new InvoiceDano;
      this.invoice_dano.cost = Number(this.cost.value);
      this.invoice_dano.customerIdentification = this.customerIdentification.value;
      this.invoice_dano.description = this.description.value;
      this.invoice_dano.customerName = this.customerName.value;
      this.invoice_dano.employeeName = this.employeeName.value;

      console.info(this.invoice_dano);

      this.createInvoiceDano(this.invoice_dano);

    }

  }

  private createInvoiceDano(dataInvoice: InvoiceDano): any {
    let arrayArticleValids = [];
    this.invoiceService.createInvoiceDano(dataInvoice, this.typeInvoice)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          Swal.fire({
            title: 'Exito',
            html: `Factura de daño registrada.`,
            icon: 'success',
            confirmButtonText: 'OK',
            showConfirmButton: true,
            showCancelButton: false,
            timer: 3000
          }).then((resultModal: any) => {
            this.clearData();
            this.getListCustomers();
            this.getListEmployes();
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

  private createInvoiceVenta(dataInvoice: InvoiceVenta): any {
    let arrayArticleValids = [];
    this.invoiceService.createInvoiceVenta(dataInvoice, this.typeInvoice)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          Swal.fire({
            title: 'Exito',
            html: `Factura de venta registrada.`,
            icon: 'success',
            confirmButtonText: 'OK',
            showConfirmButton: true,
            showCancelButton: false,
            timer: 3000
          }).then((resultModal: any) => {
            this.clearData();
            this.getListCustomers();
            this.getListEmployes();
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

  private clearData() {
    this.anyListCustomers = [];
    this.anyListEmployees = [];
    this.rowsArticlesValues = [];
    this.showProgBar = true;
    this.btnSaveInvoice = false;
    this.customerId.setValue('');
    this.customerIdentification.setValue('');
    this.employeIdentification.setValue('');
    this.employeId.setValue('');
    this.cost.setValue('');
    this.description.setValue('');
    const control = this.anyDetalleArticle.get('rows') as FormArray;
    control.clear();
    this.addArticle();
  }

  private valRows() {
    const control = this.anyDetalleArticle.get('rows') as FormArray;
    const rowsArticles = control.value;
    let validRowsIndex = [];
    let sw = false;
    for (let obj in rowsArticles) {
      const element = rowsArticles[obj];
      if (element.garmentReference === '' || element.discount > 100 || element.price < 0) {
        validRowsIndex.push(obj + 1);
      } else {
        sw = true
      }
    }
    if (!sw) {
      this.openSnackBarLarge(`En las filas # ` + Number(validRowsIndex.toString()) + ` debe verificarse que todos los campos de producto esten diligenciados.`, 'OK');
      return false;
    }
    return sw;
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
    if (this.cost.value === null || this.cost.value === '') {
      this.openSnackBar('Debe ingresar un precio', 'OK');
      return false;
    }
    if (this.description.value === null || this.description.value === '') {
      this.openSnackBar('Debe ingresar una descripción', 'OK');
      return false;
    }
    return true;
  }

  private changeShow() {
    this.btnSaveInvoice = !this.btnSaveInvoice;
    this.showProgBar = !this.showProgBar;
  }

  public addArticle() {
    const anyControl = this.anyDetalleArticle.get('rows') as FormArray;
    anyControl.push(this.createArticle());
  }

  private createArticle(): FormGroup {
    return this.fb.group({
      discount: '',
      garmentReference: '',
      price: 0,
      quantity: 1,
      total: 0
    });
  }

  public removeArticle(index: number) {
    const control = this.anyDetalleArticle.get('rows') as FormArray;
    control.removeAt(index);
    // this.calculateTotals();
    if (control.length == 0) {
      this.showFormVal = false;
      this.showForm = false;
    }
    else {
      this.valDisponibilidad();
    }
  }

  public setGarmentPrice(garment, index) {
    var dataArticle = this.anyListGarment.filter((e) => e.reference === garment.value);
    ((this.anyDetalleArticle.get('rows') as FormArray).at(index) as FormGroup).get('price').setValue(dataArticle[0].price);
    // this.calculateTotals();
    this.valDisponibilidad();
  }

  public openModalImg(input) {
    this.referenceProduct = input.value;
    var article = this.anyListGarment.filter((e) => e.reference === input.value);
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
      arrayValidate.push(element.garmentReference);
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
          this.showFormVal = false;
          this.showForm = true;
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
              this.showFormVal = true;
              this.showForm = false;
              this.anyCabeceraRef = ['REFERENCE', 'FECHA DISPONIBILIDAD'];
              let anyResponse = err.error.msg;
              let anyResult = [];
              for (let obj in anyResponse) {
                const element = anyResponse[obj];
                const objeto = {
                  reference: element.reference,
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

}
