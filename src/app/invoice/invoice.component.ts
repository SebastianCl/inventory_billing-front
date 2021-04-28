import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';
import { Invoice } from '../models/invoice.model';

import { InvoiceService } from '../service/invoice.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  providers: [InvoiceService]
})
export class InvoiceComponent implements OnInit {

  hide = true; // hide password
  invoice: Invoice;

  deposit: FormControl;
  invoiceNumber: FormControl;
  active: FormControl;

  dsbSave: boolean;
  hiddenProgBar: boolean;
  codeAction: string;
  showDepositInput: boolean;

  constructor(
    public invoiceService: InvoiceService,
    private _snackBar: MatSnackBar,
    public route: ActivatedRoute) {
    this.deposit = new FormControl();
    this.invoiceNumber = new FormControl();
    this.active = new FormControl();

    this.clearData();
    this.hiddenProgBar = true;
    this.dsbSave = false;
    this.codeAction = this.route.snapshot.paramMap.get('id');
    if (this.codeAction === '0') {
      this.showDepositInput = true;
      this.loadDataLocalstorage();
    } else {
      this.showDepositInput = false;
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
      this.alert('Error', 'Ha ocurrido un error en la consulta', 'warning');
    });
    
  }


  loadDataLocalstorage(){

  }

  create() {
    this.changeShow();
    if (!this.validateData()) {
      this.changeShow();
      return;
    }
    this.save();
  }

  private save() {
    this.invoice = new Invoice;
    this.invoice.invoiceNumber = this.invoiceNumber.value;
    this.invoice.active = this.active.value;;

    this.invoiceService.createInvoice(this.invoice)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          this.alert('Exito', 'Usuario creado.', 'success');
          this.clearData();
        } else {
          this.alert('Atención', 'Usario no creado.', 'warning');
        }
      },
        (err) => {
          this.changeShow();
          this.alert('Error', 'Usario no creado.', 'error');
        }
      );
  }

  private validateData() {
    if (this.invoiceNumber.value === null || this.invoiceNumber.value === '') {
      this.openSnackBar('Debe indicar el nombre.', 'OK');
      return false;
    }
    return true;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  // FUNCIONES DE AYUDA

  // Reiniciar valores de los campos
  private clearData() {
    this.invoiceNumber.setValue('');
    this.active.setValue(false);
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
