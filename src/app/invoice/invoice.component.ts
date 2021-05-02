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

  listArticlesLoads = [];

  dsbSave: boolean;
  hiddenProgBar: boolean;
  codeAction: string;
  showDepositInput: boolean;

  constructor(
    private router: Router,
    public invoiceService: InvoiceService,
    public customerService: CustomerService,
    private _snackBar: MatSnackBar,
    public route: ActivatedRoute) {
    this.deposit = new FormControl();
    this.invoiceNumber = new FormControl();
    this.dateInvoice = new FormControl();
    this.employeeName = new FormControl();
    this.clientName = new FormControl();
    this.clientDocument = new FormControl();
    this.clientAddress = new FormControl();
    this.clientEmail = new FormControl();

    this.clearData();
    this.hiddenProgBar = true;
    this.dsbSave = false;
    this.codeAction = this.route.snapshot.paramMap.get('id');
    if (this.codeAction === '0') {
      this.showDepositInput = true;
      this.isCreated = true;
      this.loadDataLocalstorage();
    } else {
      this.showDepositInput = false;
      this.isCreated = false;
      this.loadDataInvoiceById(this.codeAction);
    }
  }

  ngOnInit() { }

  loadDataInvoiceById(id){
    this.invoiceService.loadInvoice(id).subscribe((response: any) => {
      if (response.resp) {
        console.log(response);
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


  loadDataLocalstorage(){
    let valLocalstorage = JSON.parse(localStorage.getItem('reserve'));
    valLocalstorage.articlesLocalStorage.forEach(element => {
      let msg = " - articulo: "+element.reference+", Descuento: "+element.discount+", Precio: "+element.price;
      this.descriptionArticles.push(msg);
    });
    this.dateInvoice.setValue(this.dateNow());
    this.employeeName.setValue(valLocalstorage.employeeName)
    this.customer = Number(valLocalstorage.customerID);
    this.employee = Number(valLocalstorage.employeeID);
    this.reserve = Number(valLocalstorage.reserveID);
    this.customerService.loadCustomer(valLocalstorage.customerID).subscribe((response: any) => {
      if (response.resp) {
        console.log(response);
        this.clientName.setValue(response.msg.name === '' || null ? 'Sin Nombre': response.msg.name)
        this.clientDocument.setValue(response.msg.identification === '' || null ? 'Sin Numero de documento': response.msg.identification)
        this.clientAddress.setValue(response.msg.direction === '' || null ? 'Sin Dirección': response.msg.direction)
        this.clientEmail.setValue(response.msg.email === '' || null ? 'Sin email': response.msg.email)
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
    this.invoice.description = this.descriptionArticles.toString();


    this.invoiceService.createInvoice(this.invoice)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          this.alert('Exito', 'Factura creada.', 'success');
          this.invoiceNumber.setValue(response.msg.reserveNumber);
          this.clearData();
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
    
    if (this.deposit.value > totalInvoice) {
      this.openSnackBar('Debe ingresar un deposito menor al total de la factura.', 'OK');
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

  addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
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

}
