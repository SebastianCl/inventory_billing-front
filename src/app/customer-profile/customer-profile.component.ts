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

  firstname: FormControl;
  lastname: FormControl;
  email: FormControl;
  telephone: FormControl;
  taxFree: FormControl;
  taxExempt: FormControl;
  company: FormControl;

  dsbSave: boolean;
  hiddenProgBar: boolean;

  constructor(
    public customerService: CustomerService,
    private _snackBar: MatSnackBar) {
    this.firstname = new FormControl();
    this.lastname = new FormControl();
    this.email = new FormControl('', [
      Validators.email,
    ]);
    this.telephone = new FormControl();
    this.company = new FormControl();
    this.taxFree = new FormControl();
    this.taxExempt = new FormControl();
    this.clearData();
    this.hiddenProgBar = true;
    this.dsbSave = false;
  }

  ngOnInit() { }

  private clearData() {
    this.firstname.setValue('');
    this.lastname.setValue('');
    this.email.setValue('');
    this.telephone.setValue('');
    this.company.setValue('');
    this.taxFree.setValue(false);
    this.taxExempt.setValue('');
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
    this.customer.firstname = this.firstname.value;
    this.customer.lastname = this.lastname.value;
    this.customer.email = this.email.value;
    this.customer.telephone = this.telephone.value;
    this.customer.company = this.company.value;
    this.customer.taxFree = this.taxFree.value;
    this.customer.taxExempt = this.taxExempt.value;

    this.customerService.createCustomer(this.customer)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          this.alert('Done', 'Customer created.', 'success');
          this.clearData();
        } else {
          this.alert('Atention', 'Customer not created.', 'warning');
        }
      },
        (err) => {
          this.changeShow();
          this.alert('Error', 'Customer not created.', 'error');
        }
      );
  }

  private validateData() {
    if (this.firstname.value === null || this.firstname.value === '') {
      this.openSnackBar('You must indicate the firstname.', 'DONE');
      return false;
    }
    if (this.lastname.value === null || this.lastname.value === '') {
      this.openSnackBar('You must indicate the lastname.', 'DONE');
      return false;
    }
    if (this.taxFree.value === null || this.taxFree.value === '') {
      this.openSnackBar('You must indicate if tax free.', 'DONE');
      return false;
    }
    if (this.taxFree.value) {
      if (this.taxExempt.value === null || this.taxExempt.value === '') {
        this.openSnackBar('You must indicate the tax exempt number.', 'DONE');
        return false;
      }
    }
    if (this.email.value !== '') {
      if (!this.formatEmail(this.email.value)) {
        this.openSnackBar('You must enter an email with correct format.', 'DONE');
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

