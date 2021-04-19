import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import Swal from 'sweetalert2';
import { User } from '../models/user.model';

import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [UserService]
})
export class UserProfileComponent implements OnInit {

  hide = true; // hide password
  user: User;

  name: FormControl;
  identification: FormControl;
  email: FormControl;
  password: FormControl;
  direction: FormControl;
  telephone: FormControl;
  isAdmin: FormControl;
  active: FormControl;

  dsbSave: boolean;
  hiddenProgBar: boolean;

  constructor(public userService: UserService, private _snackBar: MatSnackBar) {

    this.name = new FormControl();
    this.identification = new FormControl();
    this.direction = new FormControl();
    this.telephone = new FormControl();
    this.email = new FormControl('', [Validators.email,]);
    this.password = new FormControl();
    this.isAdmin = new FormControl();
    this.active = new FormControl();

    this.clearData();
    this.hiddenProgBar = true;
    this.dsbSave = false;
  }

  ngOnInit() { }

  create() {
    this.changeShow();
    if (!this.validateData()) {
      this.changeShow();
      return;
    }
    this.save();
  }

  private save() {
    this.user = new User;
    this.user.name = this.name.value;
    this.user.identification = this.identification.value;
    this.user.direction = this.direction.value;
    this.user.telephone = this.telephone.value;
    this.user.email = this.email.value;
    this.user.password = this.password.value;
    this.user.active = true;
    this.user.isAdmin = this.isAdmin.value;;

    this.userService.createUser(this.user)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          this.alert('Exito', 'Usuario creado.', 'success');
          this.clearData();
        } else {
          this.alert('Atención', 'Usario no creado.', 'warning');
        }
      },
        (err) => {
          this.changeShow();
          this.alert('Error', 'Usario no creado.', 'error');
        }
      );
  }

  private validateData() {
    if (this.name.value === null || this.name.value === '') {
      this.openSnackBar('Debe indicar el nombre.', 'OK');
      return false;
    }
    if (this.identification.value === null || this.identification.value === '') {
      this.openSnackBar('Debe indicar la identificación.', 'OK');
      return false;
    }
    if (this.email.value === null || this.email.value === '') {
      this.openSnackBar('Debe indicar el email.', 'OK');
      return false;
    }
    if (this.password.value === null || this.password.value === '') {
      this.openSnackBar('Debe indicar la clave.', 'OK');
      return false;
    }
    if (!this.formatEmail(this.email.value)) {
      this.openSnackBar('Debe ingresar un email con formato correcto.', 'OK');
      return false;
    }
    return true;
  }


  // FUNCIONES DE AYUDA

  // Reiniciar valores de los campos
  private clearData() {
    this.name.setValue('');
    this.identification.setValue('');
    this.direction.setValue('');
    this.telephone.setValue('');
    this.email.setValue('');
    this.password.setValue('');
    this.isAdmin.setValue(false);
    this.hide = true;
  }

  // Función general para alertas
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
