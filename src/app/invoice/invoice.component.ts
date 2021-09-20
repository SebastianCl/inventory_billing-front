import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'app/service/customer.service';

import Swal from 'sweetalert2';
import { Invoice } from '../models/invoice.model';

import { InvoiceService } from '../service/invoice.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  providers: [InvoiceService, CustomerService]
})
export class InvoiceComponent implements OnInit {

  hide = true; // hide password
  invoice: Invoice;

  deposit: FormControl;
  payment: FormControl;
  invoiceNumber: FormControl;
  dateInvoice: FormControl;
  employeeName: FormControl;
  clientName: FormControl;
  clientDocument: FormControl;
  clientAddress: FormControl;
  clientEmail: FormControl;
  subTotal: number;
  total: number;
  employee: number;
  customer: number;
  reserve: number;
  isCreated: boolean;
  descriptionArticles = [];
  tittle: string;
  subtittle: string;
  numberInvoice: string;
  depositInvoice: string;
  paymentInvoice: string;
  listArticlesLoads = [];
  dsbSave: boolean;
  hiddenProgBar: boolean;
  codeAction: string;
  showDepositInput: boolean;
  showPrintButton: boolean;
  typeFact: string;
  pagoDeposito: string;
  checkDeposito: boolean;

  constructor(
    private router: Router,
    public invoiceService: InvoiceService,
    public customerService: CustomerService,
    private _snackBar: MatSnackBar,
    public route: ActivatedRoute) {
    this.deposit = new FormControl();
    this.payment = new FormControl();
    this.invoiceNumber = new FormControl();
    this.dateInvoice = new FormControl();
    this.employeeName = new FormControl();
    this.clientName = new FormControl();
    this.clientDocument = new FormControl();
    this.clientAddress = new FormControl();
    this.clientEmail = new FormControl();
    this.typeFact = '';
    this.pagoDeposito = '';
    this.checkDeposito = false;
    this.clearData();
    this.hiddenProgBar = true;
    this.dsbSave = false;
    this.codeAction = this.route.snapshot.paramMap.get('id');
    if (this.codeAction === '0') {
      this.tittle = 'Agregar factura';
      this.subtittle = 'Complete toda la información';
      this.showPrintButton = false;
      this.loadDataLocalstorage();
    } else {
      this.tittle = 'Detalle de Factura';
      this.subtittle = '';
      this.showDepositInput = false;
      this.isCreated = false;
      this.showPrintButton = true;
      this.loadDataInvoiceById(this.codeAction);
    }
  }

  ngOnInit() { }

  loadDataInvoiceById(id) {
    this.invoiceService.loadInvoice(id).subscribe((response: any) => {
      if (response.resp) {
        this.numberInvoice = response.msg.invoiceNumber;
        this.dateInvoice.setValue(this.convertDates(response.msg.date));
        this.employeeName.setValue(response.msg.employeeName);
        this.getCustomerData(response.msg.reserve.customer.id);

        this.listArticlesLoads = response.msg.articles
        this.subTotal = response.msg.subTotal;
        this.total = response.msg.cost;
        this.deposit.setValue(response.msg.deposit);
        this.payment.setValue(response.msg.payment);
      } else {
        this.alert('Atención', 'No se encontro ninguna factura por este id.', 'warning');
      }
    }, (err) => {
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
    });

  }


  loadDataLocalstorage() {
    if (localStorage.getItem('isCreatedInvoice') !== null) {
      const valStateLocalStorage = JSON.parse(localStorage.getItem('isCreatedInvoice'));
      if (valStateLocalStorage.created === false) {
        this.showDepositInput = true;
        this.isCreated = true;
      } else {
        this.showPrintButton = true;
        this.showDepositInput = false;
        this.isCreated = false;
      }
    } else {
      this.showPrintButton = true;
      this.showDepositInput = false;
      this.isCreated = false;
    }
    let valLocalstorage = JSON.parse(localStorage.getItem('reserve'));
    this.numberInvoice = valLocalstorage.invoiceNumber;
    this.deposit.setValue(valLocalstorage.depositInvoice);
    this.payment.setValue(valLocalstorage.paymentInvoice);
    this.typeFact = valLocalstorage.type;
    valLocalstorage.articlesLocalStorage.forEach(element => {
      let msg = " - articulo: " + element.reference + ", Descuento: " + element.discount + ", Precio: " + element.price;
      this.descriptionArticles.push(msg);
    });
    this.dateInvoice.setValue(this.dateNow());
    this.employeeName.setValue(valLocalstorage.employeeName);
    this.customer = Number(valLocalstorage.customerID);
    this.reserve = Number(valLocalstorage.reserveID);
    this.customerService.loadCustomer(valLocalstorage.customerID.toString()).subscribe((response: any) => {
      if (response.resp) {
        this.clientName.setValue(response.msg.name === '' || null ? 'Sin Nombre' : response.msg.name)
        this.clientDocument.setValue(response.msg.identification === '' || null ? 'Sin Numero de documento' : response.msg.identification)
        this.clientAddress.setValue(response.msg.direction === '' || null ? 'Sin Dirección' : response.msg.direction)
        this.clientEmail.setValue(response.msg.email === '' || null ? 'Sin email' : response.msg.email)
      } else {
        this.alert('Atención', 'El cliente ligado en esta factura no fue encontrado', 'warning');
      }
    }, (err) => {
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
    });
    this.listArticlesLoads = valLocalstorage.articlesLocalStorage
    this.subTotal = valLocalstorage.subtotal
    this.total = valLocalstorage.total
  }

  getCustomerData(customerID) {
    this.customerService.loadCustomer(customerID).subscribe((response: any) => {
      if (response.resp) {
        this.clientName.setValue(response.msg.name === '' || null ? 'Sin Nombre' : response.msg.name)
        this.clientDocument.setValue(response.msg.identification === '' || null ? 'Sin Numero de documento' : response.msg.identification)
        this.clientAddress.setValue(response.msg.direction === '' || null ? 'Sin Dirección' : response.msg.direction)
        this.clientEmail.setValue(response.msg.email === '' || null ? 'Sin email' : response.msg.email)
      } else {
        this.alert('Atención', 'El cliente ligado en esta factura no fue encontrado', 'warning');
      }
    }, (err) => {
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
    });
  }

  create() {
    this.changeShow();
    if (!this.validateData(this.total)) {
      this.changeShow();
      return;
    }
    this.save();
  }

  private save() {
    this.invoice = new Invoice;
    this.invoice.reserve = this.reserve;
    this.invoice.subTotal = this.subTotal;
    this.invoice.cost = this.total;
    this.invoice.deposit = Number(this.deposit.value);
    this.invoice.depositState = this.checkDeposito;
    this.invoice.payment = Number(this.payment.value);
    this.invoice.description = this.descriptionArticles.toString();
    
    this.invoiceService.createInvoice(this.invoice, this.typeFact)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          this.alert('Exito', 'Factura creada.', 'success');
          this.numberInvoice = response.msg.invoiceNumber;
          let resetDataLocalstorage = {
            status: response.msg.active,
            articlesIDS: [],
            invoiceNumber: response.msg.invoiceNumber,
            articlesLocalStorage: this.listArticlesLoads,
            customerID: this.customer,
            employeeName: response.msg.employeeName,
            reserveNumber: response.msg.reserveNumber,
            reserveID: response.msg.id,
            total: response.msg.cost,
            subtotal: response.msg.subTotal,
            depositInvoice: this.deposit.value,
            paymentInvoice: this.payment.value
          }
          localStorage.setItem('reserve', JSON.stringify(resetDataLocalstorage));
          this.showPrintButton = true;
          localStorage.removeItem('isCreatedInvoice');
          this.clearData();
          this.router.navigate(['/list-invoice']);
        } else {
          this.alert('Atención', 'Factura no creada.', 'warning');
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
      );
  }

  private validateData(totalInvoice) {
    if (this.deposit.value === null || this.deposit.value === 0) {
      this.openSnackBar('Debe ingresar un deposito.', 'OK');
      return false;
    }

    if (this.payment.value > totalInvoice) {
      this.openSnackBar('Debe ingresar un abono menor al total de la factura.', 'OK');
      return false;
    }
    return true;
  }

  // FUNCIONES DE AYUDA

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

  addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }


  printPage() {
    const printContents = document.getElementById('row-invoice-print').innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    window.location.reload();
  }




  // Reiniciar valores de los campos
  private clearData() {
    this.isCreated = false;
    this.showDepositInput = false;
    this.hide = true;
  }

  // Función general para alertas
  private alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
  }

  // Función general para snackbar
  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000, panelClass: ['mycsssnackbartest'] });
  }

  // Valida si el email tiene un formato correcto
  private formatEmail(email) {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  private changeShow() {
    this.dsbSave = !this.dsbSave;
    this.hiddenProgBar = !this.hiddenProgBar;
  }

  public setAll(bool){
    this.pagoDeposito = (bool) ? 'SI' : 'NO';
    this.checkDeposito = bool;
    const valDeposito = Number(this.deposit.value);
    const valAbono = Number(this.payment.value);
    const total = Number(this.subTotal);
    if (bool) {
      this.total = total - valAbono;
    }
    else {
      this.total = total + valDeposito;
    }
  }

}
