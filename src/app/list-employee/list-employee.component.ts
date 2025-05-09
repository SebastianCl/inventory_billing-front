import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { Employee } from '../models/employee.model';
import { EmployeeService } from '../service/employee.service';


@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css'],
  providers: [EmployeeService]
})
export class ListEmployeeComponent implements OnInit {

  public listEmployee: any[] = [];
  public cols: any;

  constructor(
    private router: Router,
    public employeeService: EmployeeService) { }


  ngOnInit() {
    this.getList();
  }

  goToDetails(data) {
    this.router.navigate(['/details-employee', data.id]);
  }

  goToEdit(data) {
    let infoEmployee = {
      employeeId: data.id,
      employeeName: data.name,
      employeeIdentificacion: data.identification,
      employeeTelephone: data.telephone,
      employeeEmail: data.email,
      employeeDirection: data.direction,
      employeeActive: data.state
    }
    localStorage.setItem('info-edit-employee', JSON.stringify(infoEmployee));
    this.router.navigate(['/edit-employee']);
  }

  // Servicios
  getList(): any {
    this.employeeService.loadEmployees()
      .subscribe((response: any) => {
        if (response.resp) {
          response.msg.forEach(element => {
            const dataEmployee = {
              id: element.id,
              name: element.name,
              identification: element.identification,
              telephone: element.telephone,
              email: element.email,
              direction: element.direction,
              state: element.active,
              srtstate: (element.active == true) ? 'ACTIVO' : 'INACTIVO'
            }
            this.listEmployee.push(dataEmployee);
          });
        } else {
          this.alert('Warning', 'No records.', 'warning');
        }
      },
        (err) => {
          if (err.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('employee');
            Swal.fire({
              title: 'Sesión expirada', text: 'Debes iniciar sesión.', icon: 'warning',
              onClose: () => { this.router.navigate(['/login']); }
            });
          } else {
            console.log(err.message);
            this.alert('Error', 'Un error ha ocurrido.', 'error');
          }
        }
      );
  }

  alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
  }

}
