import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import Swal from 'sweetalert2';

import { Customer } from '../models/customer.model';
import { CustomerService } from '../service/customer.service';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css'],
  providers: [CustomerService]
})
export class CustomerProfileComponent implements OnInit {

  customer: Customer;

  name: FormControl;
  identification: FormControl;
  email: FormControl;
  telephone1: FormControl;
  telephone2: FormControl;
  telephone3: FormControl;
  direction: FormControl;

  dsbSave: boolean;
  hiddenProgBar: boolean;

  constructor(
    public customerService: CustomerService,
    private _snackBar: MatSnackBar) {
    this.name = new FormControl();
    this.identification = new FormControl();
    this.email = new FormControl('', [Validators.email,]);
    this.telephone1 = new FormControl();
    this.telephone2 = new FormControl();
    this.telephone3 = new FormControl();
    this.direction = new FormControl();
    this.clearData();
    this.hiddenProgBar = true;
    this.dsbSave = false;
  }

  ngOnInit() { }

  private clearData() {
    this.name.setValue('');
    this.identification.setValue('');
    this.email.setValue('');
    this.telephone1.setValue('');
    this.telephone2.setValue('');
    this.telephone3.setValue('');
    this.direction.setValue('');
  }

  create() {
    this.changeShow();
    if (!this.validateData()) {
      this.changeShow();
      return;
    }
    this.save();
  }

  private save() {
    this.dsbSave = true;
    this.customer = new Customer;
    this.customer.name = this.name.value;
    this.customer.identification = this.identification.value;
    this.customer.email = this.email.value;
    this.customer.telephone1 = this.telephone1.value;
    this.customer.direction = this.direction.value;
    this.customer.telephone2 = this.telephone2.value;
    this.customer.telephone3 = this.telephone3.value;

    this.customerService.createCustomer(this.customer)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          this.alert('HECHO', 'Customer created.', 'success');
          this.clearData();
        } else {
          this.alert('Atención', 'Customer not created.', 'warning');
        }
      },
        (err) => {
          this.changeShow();
          this.alert('Error', 'Customer not created.', 'error');
        }
      );
  }

  private validateData() {
    if (this.name.value === null || this.name.value === '') {
      this.openSnackBar('Debes indicar el nombre.', 'OK');
      return false;
    }
    if (this.identification.value === null || this.identification.value === '') {
      this.openSnackBar('Debes indicar the identification.', 'OK');
      return false;
    }
    if (this.telephone2.value === null || this.telephone2.value === '') {
      this.openSnackBar('Debes indicar if tax free.', 'OK');
      return false;
    }
    if (this.telephone2.value) {
      if (this.telephone3.value === null || this.telephone3.value === '') {
        this.openSnackBar('Debes indicar the tax exempt number.', 'OK');
        return false;
      }
    }
    if (this.email.value !== '') {
      if (!this.formatEmail(this.email.value)) {
        this.openSnackBar('You must enter an email with correct format.', 'OK');
        return false;
      }
    }
    return true;
  }

  private alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
  }
  // Función general para snackbar
  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000, panelClass: ['mycsssnackbartest'] });
  }

  // Valida si el email tiene un formato correcto
  private formatEmail(email) {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  private changeShow() {
    this.dsbSave = !this.dsbSave;
    this.hiddenProgBar = !this.hiddenProgBar;
  }


}

