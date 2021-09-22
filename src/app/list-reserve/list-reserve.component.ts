import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

// Modelo
import { ReserveCancel } from '../models/reserve.model';
// Servicio
import { ReserveService } from '../service/reserve.service';

@Component({
  selector: 'app-list-reserve',
  templateUrl: './list-reserve.component.html',
  styleUrls: ['./list-reserve.component.css'],
  providers: [ReserveService]
})
export class ListReserveComponent implements OnInit {

  cancel_reserve: ReserveCancel;

  public hiddenProgBar: boolean;
  public dsbBtn: boolean;

  public listReserves: any[];
  public listReservesAllInfo: any[];
  public cols: any;

  constructor(
    private router: Router,
    public reserveService: ReserveService,
    private _snackBar: MatSnackBar) {
    this.listReserves = [];
    this.listReservesAllInfo = [];
    this.hiddenProgBar = true;
    this.dsbBtn = false;
  }


  ngOnInit() {
    this.getList();
  }

  goToDetails(data) {
    console.info(data);
    this.router.navigate(['/details-reserve', data.id]);
  }

  goToEdit(data) {
    this.router.navigate(['/edit-reserve', data.id]);
  }

  // Servicios
  getList(): any {
    this.reserveService.loadReserves()
      .subscribe((response: any) => {
        if (response.resp) {
          response.msg.forEach(element => {
            let boolActive = element.active ? 'ACTIVA' : 'CERRADA';
            const dataQuotation = {
              id: element.id,
              customerName: element.customerName,
              reserveDay: this.convertDates(element.reserveDay),
              endDate: this.convertDates(element.endDate),
              articles: element.articles.length,
              isActive: boolActive,
              reserveNumber: element.reserveNumber
            }
            this.listReserves.push(dataQuotation);
            this.listReservesAllInfo.push(dataQuotation);
          });
        } else {
          this.openSnackBar('Sin registros de reservas.', 'OK');
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

  private changeShow() {
    this.dsbBtn = !this.dsbBtn;
    this.hiddenProgBar = !this.hiddenProgBar;
  }

  alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
  }

  // Función general para snackbar
  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 5000, panelClass: ['mycsssnackbartest'] });
  }

  public createInvoice(data) {
    this.reserveService.loadReserve(data.id)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          let array_list = response.msg.articles;
          let articleListLocalstorage = [];
          let valTotal = 0;
          for (let obj in array_list) {
            const element = array_list[obj];
            valTotal = valTotal + element.price;
            articleListLocalstorage.push({ reference: element.reference, price: element.price, discount: element.discount });
          }
          let dataLocalstorage = {
            status: response.msg.active,
            articlesIDS: response.msg.articles,
            invoiceNumber: response.msg.invoiceNumber,
            articlesLocalStorage: articleListLocalstorage,
            customerID: response.msg.customer.id,
            employeeName: response.msg.employeeName,
            reserveNumber: response.msg.reserveNumber,
            reserveID: data.id,
            total: valTotal,
            subtotal: response.msg.subTotal,
            depositInvoice: 0,
            type: '1'
          }
          let status = {
            created: false
          }
          localStorage.setItem('reserve', JSON.stringify(dataLocalstorage));
          localStorage.setItem('isCreatedInvoice', JSON.stringify(status));
          this.router.navigate(['/invoice/', 0]);
        }
      },
        (err) => {
          this.changeShow();
          this.alert('Atención Usuario', `${err.error.msg}`, 'warning');
        }
      );
  }

  public cancelReserve(data) {
    Swal.fire({
      title: '¡Atención!',
      icon: 'info',
      text: `¿Seguro desea cancelar la reserva #$${data.reserveNumber}?`,
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.cancel_reserve = new ReserveCancel();
        this.cancel_reserve.reserveNumber = Number(data.reserveNumber);
        this.srvCancelReserve(this.cancel_reserve);
      }
    })
  }

  private srvCancelReserve(dataReserve: ReserveCancel): any {
    this.reserveService.cancelReserve(dataReserve)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          Swal.fire({
            title: 'Exito',
            html: `Reserva registrada.`,
            icon: 'success',
            confirmButtonText: 'OK',
            showConfirmButton: true,
            showCancelButton: false,
            timer: 3000
          }).then((resultModal: any) => {
            this.getList();
          })
        } else {
          this.alert('Error', response.msg, 'error');
        }
      },
        (err) => {
          this.changeShow();
          this.alert('Atención Usuario', `${err.error.msg}`, 'warning');
        }
      );

  }

}
