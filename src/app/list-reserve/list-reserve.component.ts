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

  public listQuoatations: any[];
  public listQuoatationsAllInfo: any[];
  public cols: any;

  constructor(
    private router: Router,
    public quoteService: ReserveService,
    private _snackBar: MatSnackBar) {
    this.listQuoatations = [];
    this.listQuoatationsAllInfo = [];
    this.hiddenProgBar = true;
    this.dsbBtn = false;
  }


  ngOnInit() {
    //this.getList();
  }

  goToDetails(data) {
    this.router.navigate(['/details-reserve', data.id]);
  }

  // Servicios
  getList(): any {
    const filter = { isCO: false };
    this.quoteService.loadReservesWithFilter(filter)
      .subscribe((response: any) => {
        if (response.resp) {
          response.msg.forEach(element => {
            const dataQuotation = {
              id: element.id,
              customer: `${element.customer.firstname} ${element.customer.lastname}`,
              createdOn: '',
              totalItem: element.items.length,
              total: element.total
            }
            const date = new Date(element.createdOn);
            const createdOn =
              `${date.getDate()}/${date.getMonth() + 1}/${date.getUTCFullYear()} |
               ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
            dataQuotation.createdOn = createdOn;
            this.listQuoatations.push(dataQuotation);
            this.listQuoatationsAllInfo.push(dataQuotation);
          });
        } else {
          this.openSnackBar('No registered quotes.', 'DONE');
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
