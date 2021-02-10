import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import Swal from 'sweetalert2';

// Modelo
import { Quote } from '../models/quote.model';
// Servicio
import { QuoteService } from '../service/quote.service';

@Component({
  selector: 'app-list-quote',
  templateUrl: './list-quote.component.html',
  styleUrls: ['./list-quote.component.css'],
  providers: [QuoteService]
})
export class ListQuoteComponent implements OnInit {


  public hiddenProgBar: boolean;
  public dsbBtn: boolean;

  public listQuoatations: any[];
  public listQuoatationsAllInfo: any[];
  public cols: any;

  constructor(
    private router: Router,
    public quoteService: QuoteService,
    private _snackBar: MatSnackBar) {
    this.listQuoatations = [];
    this.listQuoatationsAllInfo = [];
    this.hiddenProgBar = true;
    this.dsbBtn = false;
  }


  ngOnInit() {
    //this.getList();
  }

  changeCO(data: any) {
    const id = data;
    Swal.fire({
      title: '¿Are you sure?',
      icon: 'info',
      text: 'The quote will become a customer order.',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, convert.'
    }).then((result) => {
      if (result.value) {
        this.updateQuote(id);
      }
    })
  }

  goToDetails(data) {
    this.router.navigate(['/details-quote', data.id]);
  }

  // Servicios
  getList(): any {
    const filter = { isCO: false };
    this.quoteService.loadQuotesWithFilter(filter)
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

  updateQuote(data: any) {
    this.changeShow();
    const id = data.id;
    this.quoteService.quoteToCO(id)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          this.alert('Done!', 'The quote was passed at the customer order.', 'success');
          this.listQuoatations = [];
          this.getList();
          return;
        }
        this.alert('Something went wrong', 'The quote was not passed at the customer order', 'warning');
      },
        (err) => {
          this.changeShow();
          if (err.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            Swal.fire({
              title: 'Session expired', text: 'You must log.', icon: 'warning',
              onClose: () => { this.router.navigate(['/login']); }
            });
          } else {
            this.alert('Error', 'An error happened.', 'error');
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
