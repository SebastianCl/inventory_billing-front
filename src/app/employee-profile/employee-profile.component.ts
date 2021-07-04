import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Employee } from '../models/employee.model';
import { EmployeeService } from '../service/employee.service';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/profiles', title: 'Perfiles', icon: 'face', class: '' }
];

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css'],
  providers: [EmployeeService]
})
export class EmployeeProfileComponent implements OnInit {

  [x: string]: any;

  employee: Employee;

  name: FormControl;
  identification: FormControl;
  email: FormControl;
  telephone: FormControl;
  direction: FormControl;

  dsbSave: boolean;
  hiddenProgBar: boolean;

  constructor(
    private router: Router,
    public employeeService: EmployeeService,
    private _snackBar: MatSnackBar) {
    this.name = new FormControl();
    this.identification = new FormControl();
    this.email = new FormControl('', [Validators.email,]);
    this.telephone = new FormControl();
    this.direction = new FormControl();
    this.clearData();
    this.hiddenProgBar = true;
    this.dsbSave = false;
  }

  ngOnInit() {

    let jsonData = JSON.parse(localStorage.getItem('user'));
    let descRole = jsonData.role.role.toUpperCase();

    if (descRole != "ADMINISTRADOR") {
      this.router.navigate(['/profiles']);
    }

  }

  private clearData() {
    this.name.setValue('');
    this.identification.setValue('');
    this.email.setValue('');
    this.telephone.setValue('');
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
    this.employee = new Employee;
    this.employee.name = this.name.value;
    this.employee.identification = this.identification.value;
    this.employee.email = this.email.value;
    this.employee.telephone = this.telephone.value;
    this.employee.direction = this.direction.value;

    this.employeeService.createEmployee(this.employee)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          this.alert('HECHO', 'Empleado creado.', 'success');
          this.clearData();
        } else {
          this.alert('Atención', 'Empleado no creado.', 'warning');
        }
      },
        (err) => {
          this.changeShow();
          this.alert('Error', 'Empleado no creado.', 'error');
        }
      );
  }

  private validateData() {
    if (this.name.value === null || this.name.value === '') {
      this.openSnackBar('Debes indicar el nombre.', 'OK');
      return false;
    }
    if (this.identification.value === null || this.identification.value === '') {
      this.openSnackBar('Debes indicar la identificación.', 'OK');
      return false;
    }
    if (this.telephone.value === null || this.telephone.value === '') {
      this.openSnackBar('Debes indicar el teléfono.', 'OK');
      return false;
    }
    if (this.email.value !== '') {
      if (!this.formatEmail(this.email.value)) {
        this.openSnackBar('Debe ingresar un email con formato correcto.', 'OK');
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

