import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

// Modelo
import { Reserve } from '../models/reserve.model';
// Servicio
import { ReserveService } from '../service/reserve.service';

@Component({
  selector: 'app-list-reserve',
  templateUrl: './list-reserve.component.html',
  styleUrls: ['./list-reserve.component.css'],
  providers: [ReserveService]
})
export class ListReserveComponent implements OnInit {


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
              isActive: boolActive
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

}
