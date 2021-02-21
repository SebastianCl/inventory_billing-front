import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
// Servicio
import { LoginService } from '../service/login.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  email: FormControl;
  password: FormControl;

  constructor(
    private router: Router,
    private loginService: LoginService) {
    this.email = new FormControl();
    this.password = new FormControl();
  }

  ngOnInit() {
  }

  login2() {
    this.router.navigate(['/dashboard']);
  }
  login() {
    const session = { user: this.email.value, password: this.password.value }
    this.loginService.login(session).subscribe(
      response => {
        if (response.resp) {
          const token = response.msg.token;
          const user = response.msg.user;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          this.router.navigate(['/dashboard']);
        } else {
          this.alert('Bad', 'User o password incorrect', 'warning');
        }
      }, (err) => {
        if (err.status === 400) {
          this.alert('Bad credentials', err.error.msg, 'warning');
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

}
