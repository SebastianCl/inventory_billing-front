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

  firstname: FormControl;
  lastname: FormControl;
  email: FormControl;
  password: FormControl;

  dsbSave: boolean;
  hiddenProgBar: boolean;

  constructor(
    public userService: UserService,
    private _snackBar: MatSnackBar) {
    this.firstname = new FormControl();
    this.lastname = new FormControl();
    this.email = new FormControl('', [
      Validators.email,
    ]);
    this.password = new FormControl();

    this.clearData();
    this.hiddenProgBar = true;
    this.dsbSave = false;
  }

  ngOnInit() {
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
    this.user = new User;
    this.user.firstname = this.firstname.value;
    this.user.lastname = this.lastname.value;
    this.user.email = this.email.value;
    this.user.password = this.password.value;
    this.user.active = true;

    this.userService.createUser(this.user)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          this.alert('Done', 'User created.', 'success');
          this.clearData();
        } else {
          this.alert('Atention', 'User not created.', 'warning');
        }
      },
        (err) => {
          this.changeShow();
          this.alert('Error', 'User not created.', 'error');
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
    if (this.email.value === null || this.email.value === '') {
      this.openSnackBar('You must indicate the email.', 'DONE');
      return false;
    }
    if (this.password.value === null || this.password.value === '') {
      this.openSnackBar('You must indicate the password.', 'DONE');
      return false;
    }
    if (!this.formatEmail(this.email.value)) {
      this.openSnackBar('You must enter an email with correct format.', 'DONE');
      return false;
    }
    return true;
  }


  // FUNCIONES DE AYUDA

  // Reiniciar valores de los campos
  private clearData() {
    this.firstname.setValue('');
    this.lastname.setValue('');
    this.email.setValue('');
    this.password.setValue('');
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
