import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import Swal from 'sweetalert2';
import { QuoteService } from '../service/quote.service';


@Component({
  selector: 'app-list-customer-order',
  templateUrl: './list-customer-order.component.html',
  styleUrls: ['./list-customer-order.component.css'],
  providers: [QuoteService]
})
export class ListCustomerOrderComponent implements OnInit {
  public listQuoatations: any[] = [];
  public cols: any;

  constructor(
    private router: Router,
    public quoteService: QuoteService,
    private _snackBar: MatSnackBar) { }


  ngOnInit() {
    this.getList();
  }

  goToDetails(data): any {
    this.router.navigate(['/details-customerOrder', data.id]);
  }

  // Servicios
  getList(): any {
    const filter = { isCO: true };
    this.quoteService.loadQuotesWithFilter(filter)
      .subscribe((response: any) => {
        if (response.resp) {
          response.msg.forEach(element => {
            const dataQuotation = {
              id: element.id,
              numCO: element.numCO,
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
          });
        } else {
          this.openSnackBar('No registered customer orders.', 'DONE');
        }
      },
        (err) => {
          if (err.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            Swal.fire({
              title: 'Session expired', text: 'You must log.', icon: 'warning',
              onClose: () => { this.router.navigate(['/login']); }
            });
          } else {
            console.log(err.message);
            this.alert('Error', 'An error happened.', 'error');
          }
        }
      );
  }

  alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
  }

  // Función general para snackbar
  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 5000, panelClass: ['mycsssnackbartest'] });
  }

}
