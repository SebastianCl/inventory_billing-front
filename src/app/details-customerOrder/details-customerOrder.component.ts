import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

// Modelo
import { Quote } from '../models/quote.model';
// Servicio
import { QuoteService } from '../service/quote.service';

@Component({
  selector: 'app-details-customerOrder',
  templateUrl: './details-customerOrder.component.html',
  styleUrls: ['./details-customerOrder.component.css'],
  providers: [QuoteService]
})
export class DetailsCustomerOrderComponent implements OnInit {

  public form: FormGroup;
  public listItems: any[];
  public cols: any;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    public quoteService: QuoteService) {
    this.createForm();
    this.listItems = [];
  }


  ngOnInit() {
    this.getData(this.route.snapshot.paramMap.get('id'));
  }

  back() {
    this.router.navigate(['/list-customerOrder']);
  }


  setData(data) {
    this.form.controls.numCO.setValue(data.numCO);
    this.form.controls.customer.setValue(`${data.vendor.firstname} ${data.vendor.lastname}`);
    this.form.controls.comments.setValue(data.comments);
    this.form.controls.shipping.setValue(data.shipping);
    this.form.controls.tax.setValue(data.tax);
    this.form.controls.totalTax.setValue(data.totalTax);
    this.form.controls.totalDiscount.setValue(data.totalDiscount);
    this.form.controls.totalQuote.setValue(data.total);
    this.form.controls.subtotal.setValue(data.subtotal);

    data.items.forEach(element => {
      const item = {
        discount: element.discount,
        ref: element.ref,
        description: element.description,
        retail: element.retail,
        price: element.price,
        quantity: element.quantity,
        total: element.total
      };
      this.listItems.push(item);

    });
  }

  getData(idQuote: string): any {
    this.quoteService.loadQuote(idQuote)
      .subscribe((response: any) => {
        this.setData(response.msg.entityData);
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

  public createForm() {

    this.form = new FormGroup({
      numCO: new FormControl(''),
      customer: new FormControl(''),
      shipping: new FormControl(''),
      tax: new FormControl(''),
      comments: new FormControl(''),
      totalTax: new FormControl(''),
      totalDiscount: new FormControl(''),
      totalQuote: new FormControl(''),
      subtotal: new FormControl('')
    });
  }

}
