import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

//Models
import { Customer } from '../models/customer.model';
//Service
import { CustomerService } from '../service/customer.service';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css'],
  providers: [CustomerService]
})
export class EditCustomerComponent implements OnInit {
  //Models
  customer: Customer;
  //Form update customer
  public hiddenProgBar: boolean;
  public dsbSave: boolean;
  public customerId: FormControl;
  public customerName: FormControl;
  public customeIdentification: FormControl;
  public customerEmail: FormControl;
  public customerDirection: FormControl;
  public customerTelephone1: FormControl;
  public customerTelephone2: FormControl;
  public customerTelephone3: FormControl;

  constructor(
    //Services
    public customerService: CustomerService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {
  //Form update customer
  this.hiddenProgBar = true;
  this.dsbSave       = false;
  this.customerId    = new FormControl();
  this.customerName  = new FormControl();
  this.customeIdentification = new FormControl();
  this.customerEmail = new FormControl('', [Validators.email,]);
  this.customerDirection = new FormControl();
  this.customerTelephone1 = new FormControl();
  this.customerTelephone2 = new FormControl();
  this.customerTelephone3 = new FormControl();
  }

  ngOnInit() {
    const infoCustomer = JSON.parse(localStorage.getItem('info-edit-customer'));
    this.setCustomer(infoCustomer);
  }

  private setCustomer(infoCustomer){
    this.customerId.setValue(infoCustomer.customerId);
    this.customerName.setValue(infoCustomer.customerName);
    this.customeIdentification.setValue(infoCustomer.customerIdentificacion);
    this.customerEmail.setValue(infoCustomer.customerEmail);
    this.customerDirection.setValue(infoCustomer.customerDirection);
    this.customerTelephone1.setValue(infoCustomer.customerTelephone1);
    this.customerTelephone2.setValue(infoCustomer.customerTelephone2);
    this.customerTelephone3.setValue(infoCustomer.customerTelephone3);
  }

  public edit() {

    if (!this.validateData()) {
      this.changeShow();
      return;
    }

    Swal.fire({
      title: '¡Atención!',
      icon: 'info',
      text: `¿Seguro desea editar el cliente?`,
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {

        this.changeShow();
        this.customer = new Customer;
        this.customer.id = this.customerId.value;
        this.customer.name = this.customerName.value;
        this.customer.identification = this.customeIdentification.value;
        this.customer.email = this.customerEmail.value;
        this.customer.direction = this.customerDirection.value;
        this.customer.telephone1 = this.customerTelephone1.value;
        this.customer.telephone2 = this.customerTelephone2.value;
        this.customer.telephone3 = this.customerTelephone3.value;

        this.saveEdit(this.customer);

      }
    })

  }

  private saveEdit(dataCustomer: Customer): any {

    this.customerService.updateCustomer(dataCustomer.id, dataCustomer)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          this.alert('HECHO', 'Cliente editado.', 'success');
        } else {
          this.alert('Atención', 'Cliente no editado.', 'warning');
        }
        this.clearData();
      },
        (err) => {
          this.alert('Error', 'Cliente no editado.', 'error');
          this.changeShow();
          this.clearData();
        }
      );

  }

  private clearData(){
    this.customerId.setValue('');
    this.customerName.setValue('');
    this.customeIdentification.setValue('');
    this.customerEmail.setValue('');
    this.customerDirection.setValue('');
    this.customerTelephone1.setValue('');
    this.customerTelephone2.setValue('');
    this.customerTelephone3.setValue('');
    localStorage.removeItem('info-edit-customer');
    this.back();
  }

  private validateData() {
    if (this.customerName.value === null || this.customerName.value === '') {
      this.openSnackBar('Debes indicar el nombre.', 'OK');
      return false;
    }
    if (this.customeIdentification.value === null || this.customeIdentification.value === '') {
      this.openSnackBar('Debes indicar la identificación.', 'OK');
      return false;
    }
    if (this.customerEmail.value !== '') {
      if (!this.formatEmail(this.customerEmail.value)) {
        this.openSnackBar('Debe ingresar un email con formato correcto.', 'OK');
        return false;
      }
    }
    if (this.customerTelephone1.value === null || this.customerTelephone1.value === '') {
      this.openSnackBar('Debes indicar el telefono 1.', 'OK');
      return false;
    }
    if (this.customerTelephone2.value === null || this.customerTelephone2.value === '') {
      this.openSnackBar('Debes indicar el telefono 2.', 'OK');
      return false;
    }
    if (this.customerTelephone3.value === null || this.customerTelephone3.value === '') {
      this.openSnackBar('Debes indicar el telefono 3.', 'OK');
      return false;
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

  public back() {
    this.router.navigate(['/list-customer']);
  }

}
