import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

// Modelo
import { Reserve } from '../models/reserve.model';
// Servicio
import { ReserveService } from '../service/reserve.service';

@Component({
  selector: 'app-details-reserve',
  templateUrl: './details-reserve.component.html',
  styleUrls: ['./details-reserve.component.css'],
  providers: [ReserveService]
})
export class DetailsReserveComponent implements OnInit {

  public form: FormGroup;

  public listItems: any[];

  public cols: any;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    public quoteService: ReserveService) {
    this.createForm();
    this.listItems = [];
  }


  ngOnInit() {
    this.getData(this.route.snapshot.paramMap.get('id'));
  }

  back() {
    this.router.navigate(['/list-reserve']);
  }


  setData(data) {
    this.form.controls.customer.setValue(`${data.vendor.firstname} ${data.vendor.lastname}`);
    this.form.controls.comments.setValue(data.comments);
    this.form.controls.shipping.setValue(data.shipping);
    this.form.controls.tax.setValue(data.tax);
    this.form.controls.totalTax.setValue(data.totalTax);
    this.form.controls.totalDiscount.setValue(data.totalDiscount);
    this.form.controls.totalReserve.setValue(data.total);
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

  getData(idReserve: string): any {
    this.quoteService.loadReserve(idReserve)
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
      customer: new FormControl(''),
      shipping: new FormControl(''),
      tax: new FormControl(''),
      comments: new FormControl(''),
      totalTax: new FormControl(''),
      totalDiscount: new FormControl(''),
      totalReserve: new FormControl(''),
      subtotal: new FormControl('')
    });
  }

}
