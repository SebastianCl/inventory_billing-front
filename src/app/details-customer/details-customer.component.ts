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
    this.form.controls.name.setValue(data.name);
    this.form.controls.identification.setValue(data.identification);
    this.form.controls.email.setValue(data.email);
    this.form.controls.direction.setValue(data.direction);
    this.form.controls.telephone1.setValue(data.telephone1);
    this.form.controls.telephone2.setValue(data.telephone2);
    this.form.controls.telephone3.setValue(data.telephone3);
  }

  getData(idCustomer: string): any {
    this.customerService.loadCustomer(idCustomer)
      .subscribe((response: any) => {
        this.setData(response.msg);
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
      name: new FormControl(''),
      identification: new FormControl(''),
      email: new FormControl(''),
      direction: new FormControl(''),
      telephone1: new FormControl(''),
      telephone2: new FormControl(''),
      telephone3: new FormControl('')
    });
  }

}
