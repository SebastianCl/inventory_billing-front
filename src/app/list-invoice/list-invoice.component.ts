import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { InvoiceService } from 'app/service/invoice.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-invoice',
  templateUrl: './list-invoice.component.html',
  styleUrls: ['./list-invoice.component.css'],
  providers: [InvoiceService]
})
export class ListInvoiceComponent implements OnInit {

  public listInvoices: any[] = [];
  public numberInvoiceTittle: number;
  public restante: number;
  public totalInvoice: number;
  public depositInvoice: number;
  public payment: number;
  public idInvoice: number
  public cols: any;
  public showUpdate: boolean;
  public abono: FormControl;
  public classMove: string;

  constructor(
    private router: Router,
    public invoiceService: InvoiceService,
    private _snackBar: MatSnackBar) {
    this.abono = new FormControl();
  }


  ngOnInit() {
    this.getList();
  }

  openModalInvoice(data) {
    debugger;
    this.classMove = '';
    this.showUpdate = true;
    this.numberInvoiceTittle = data.numberInvoice;
    this.restante = data.totalInvoice - data.payment;
    this.idInvoice = data.id;
    this.totalInvoice = data.totalInvoice;
    this.depositInvoice = data.depositInvoice
    this.payment = data.payment
    const modalNewInvoice = document.getElementById('myModalNewInvoice');
    modalNewInvoice.style.display = 'block';
  }

  close() {
    const closeModalNewInvoice = document.getElementById('myModalNewInvoice');
    closeModalNewInvoice.style.display = 'none';
  }

  goToDetails(data) {
    this.router.navigate(['/view-invoice/', data]);
  }

  // Servicios
  getList(): any {
    this.invoiceService.loadInvoices()
      .subscribe((response: any) => {
        if (response.resp) {
          response.msg.forEach(element => {
            const dataInvoice = {
              id: element.id,
              nameCustomer: element.customerName,
              identificationCustomer: element.customerIdentification,
              numberInvoice: element.invoiceNumber,
              numberReserve: element.reserveNumber,
              stateInvoice: element.active,
              description: element.description,
              totalInvoice: element.cost,
              depositInvoice: element.deposit,
              payment: element.payment,
              nameEmployee: element.employeeName,
              type: element.type
            }
            this.listInvoices = [... this.listInvoices, dataInvoice];
          });
        } else {
          this.alert('Warning', 'No records.', 'warning');
        }
      },
        (err) => {
          if (err.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('customer');
            Swal.fire({
              title: 'Sesión expirada', text: 'Debes iniciar sesión.', icon: 'warning',
              onClose: () => { this.router.navigate(['/login']); }
            });
          } else {
            console.log(err.message);
            this.alert('Error', 'Un error ha ocurrido.', 'error');
          }
        }
      );
  }



  createAbono() {
    if (!this.validateData(this.totalInvoice)) {
      return;
    }
    this.showUpdate = false;
    this.classMove = 'moveButtonCancel';
    this.saveAbono(this.idInvoice, this.numberInvoiceTittle);
  }

  private saveAbono(idInvoice, numberInvoice) {
    let invoiceAbono = {
      payment: this.abono.value,
      invoiceNumber: numberInvoice
    }

    this.invoiceService.payInvoice(idInvoice, invoiceAbono)
      .subscribe((response: any) => {
        if (response.resp) {
          this.close();
          this.alert('Exito', 'El abono a la factura fue realizado.', 'success');
          this.clearData();
          this.listInvoices = [];
          this.getList()
        } else {
          this.alert('Atención', 'Error en proceso de abono a factura.', 'warning');
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

  alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  private validateData(totalInvoice) {
    if (this.abono.value === null || this.abono.value === 0) {
      this.openSnackBar('Debe ingresar un abono.', 'OK');
      return false;
    }

    let sumDeposit = this.payment + this.abono.value;

    if (sumDeposit > totalInvoice) {
      this.openSnackBar('Debe ingresar un abono menor al total restante de factura.', 'OK');
      return false;
    }
    return true;
  }

  // Función general para snackbar
  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 4000, panelClass: ['mycsssnackbartest'] });
  }

  private clearData() {
    this.abono.setValue(null);
    this.numberInvoiceTittle = null;
    this.idInvoice = null;
    this.totalInvoice = null;
  }

}
