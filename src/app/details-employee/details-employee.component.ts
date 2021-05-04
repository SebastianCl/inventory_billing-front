import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

// Servicio
import { EmployeeService } from '../service/employee.service';

@Component({
  selector: 'app-details-employee',
  templateUrl: './details-employee.component.html',
  styleUrls: ['./details-employee.component.css'],
  providers: [EmployeeService]
})
export class DetailsEmployeeComponent implements OnInit {

  public form: FormGroup;
  public cols: any;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    public employeeService: EmployeeService) {
    this.createForm();
  }


  ngOnInit() {
    this.getData(this.route.snapshot.paramMap.get('id'));
  }

  back() {
    this.router.navigate(['/list-employee']);
  }


  setData(data) {
    this.form.controls.name.setValue(data.name);
    this.form.controls.identification.setValue(data.identification);
    this.form.controls.email.setValue(data.email);
    this.form.controls.direction.setValue(data.direction);
    this.form.controls.telephone.setValue(data.telephone);
  }

  getData(idEmployee: string): any {
    this.employeeService.loadEmployee(idEmployee)
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
      identification: new FormControl(''),
      email: new FormControl(''),
      direction: new FormControl(''),
      telephone: new FormControl('')
    });
  }

}
