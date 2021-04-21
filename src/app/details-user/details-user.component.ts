import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

// Modelo
import { User } from '../models/user.model';
// Servicio
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-details-user',
  templateUrl: './details-user.component.html',
  styleUrls: ['./details-user.component.css'],
  providers: [UserService]
})
export class DetailsUserComponent implements OnInit {

  public form: FormGroup;
  public cols: any;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    public userService: UserService) {
    this.createForm();
  }


  ngOnInit() {
    this.getData(this.route.snapshot.paramMap.get('id'));
  }

  back() {
    this.router.navigate(['/list-user']);
  }


  setData(data) {
    this.form.controls.name.setValue(data.name);
    this.form.controls.email.setValue(data.email);
    this.form.controls.role.setValue(data.role.role);
    this.form.controls.description.setValue(data.description);
    const active = data.active ? 'SI' : 'NO';
    this.form.controls.active.setValue(active);
  }

  getData(idUser: string): any {
    this.userService.loadUser(idUser)
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
      name: new FormControl(''),
      email: new FormControl(''),
      role: new FormControl(''),
      description: new FormControl(''),
      active: new FormControl('')
    });
  }

}
