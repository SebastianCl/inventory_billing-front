import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

// Modelo
import { Customer } from '../models/customer.model';
// Servicio
import { CustomerService } from '../service/customer.service';

@Component({
  selector: 'app-details-customer',
  templateUrl: './details-customer.component.html',
  styleUrls: ['./details-customer.component.css'],
  providers: [CustomerService]
})
export class DetailsCustomerComponent implements OnInit {

  public form: FormGroup;
  public cols: any;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    public customerService: CustomerService) {
    this.createForm();
  }


  ngOnInit() {
    this.getData(this.route.snapshot.paramMap.get('id'));
  }

  back() {
    this.router.navigate(['/list-customer']);
  }


  setData(data) {
    this.form.controls.name.setValue(`${data.firstname} ${data.lastname}`);
    this.form.controls.email.setValue(data.email);
    this.form.controls.telephone.setValue(data.telephone);
    this.form.controls.taxExempt.setValue(data.taxExempt);
  }

  getData(idCustomer: string): any {
    this.customerService.loadCustomer(idCustomer)
      .subscribe((response: any) => {
        this.setData(response.msg.entityData);
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

  public createForm() {

    this.form = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      telephone: new FormControl(''),
      taxExempt: new FormControl('')
    });
  }

}
