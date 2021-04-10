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
    this.router.navigate(['/details-reserve', data.id]);
  }

  // Servicios
  getList(): any {
    this.reserveService.loadReserves()
      .subscribe((response: any) => {
        if (response.resp) {
          debugger;
          response.msg.forEach(element => {
            let isActive = element.active ? 'ACTIVA' : 'CERRADA';
            const dataQuotation = {
              id: element.id,
              customerName: element.id,
              reserveDay: element.reserveDay,
              endDate: element.endDate,
              articles: element.items.length,
              isActive
            }
            /*const date = new Date(element.createdOn);
            const createdOn =
              `${date.getDate()}/${date.getMonth() + 1}/${date.getUTCFullYear()} |
               ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
            dataQuotation.createdOn = createdOn;*/
            this.listReserves.push(dataQuotation);
            this.listReservesAllInfo.push(dataQuotation);
          });
        } else {
          this.openSnackBar('Sin registros de reservas.', 'HECHO');
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
