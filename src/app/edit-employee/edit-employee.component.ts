import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

//Models
import { Employee } from '../models/employee.model';

//Service
import { EmployeeService } from '../service/employee.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css'],
  providers: [EmployeeService]
})
export class EditEmployeeComponent implements OnInit {
  //Models
  employee: Employee;
  //Form update employee
  public hiddenProgBar: boolean;
  public dsbSave: boolean;
  public employeeId: FormControl;
  public employeeName: FormControl;
  public employeeIdentificacion: FormControl;
  public employeeTelephone: FormControl;
  public employeeEmail: FormControl;
  public employeeDirection: FormControl;
  public employeeActive: boolean;

  constructor(
    //Services
    public employeeService: EmployeeService,
    public route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    //Form update employee
    this.hiddenProgBar = true;
    this.dsbSave       = false;
    this.employeeId    = new FormControl();
    this.employeeName  = new FormControl();
    this.employeeIdentificacion = new FormControl();
    this.employeeTelephone = new FormControl();
    this.employeeEmail = new FormControl('', [Validators.email,]);
    this.employeeDirection = new FormControl();
    this.employeeActive = false;
  }

  ngOnInit() {
    const infoEmployee = JSON.parse(localStorage.getItem('info-edit-employee'));
    this.setEmployee(infoEmployee);
  }

  private setEmployee(infoEmployee){
    this.employeeId.setValue(infoEmployee.employeeId);
    this.employeeName.setValue(infoEmployee.employeeName);
    this.employeeIdentificacion.setValue(infoEmployee.employeeIdentificacion);
    this.employeeTelephone.setValue(infoEmployee.employeeTelephone);
    this.employeeEmail.setValue(infoEmployee.employeeEmail);
    this.employeeDirection.setValue(infoEmployee.employeeDirection);
    this.employeeActive = infoEmployee.employeeActive;
  }

  public edit(){

    if (!this.validateData()) {
      this.changeShow();
      return;
    }

    Swal.fire({
      title: '¡Atención!',
      icon: 'info',
      text: `¿Seguro desea editar el empleado?`,
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {

        this.changeShow();
        this.employee = new Employee;
        this.employee.id = this.employeeId.value;
        this.employee.name = this.employeeName.value;
        this.employee.identification = this.employeeIdentificacion.value;
        this.employee.direction = this.employeeDirection.value;
        this.employee.email = this.employeeEmail.value;
        this.employee.telephone = this.employeeTelephone.value;
        this.employee.active = this.employeeActive;

        this.saveEdit(this.employee);

      }
    })

  }

  private saveEdit(dataEmployee: Employee): any {

    this.employeeService.updateEmployee(dataEmployee.id, dataEmployee)
      .subscribe((response: any) => {
        this.changeShow();
        if (response.resp) {
          this.alert('HECHO', 'Empleado editado.', 'success');
        } else {
          this.alert('Atención', 'Empleado no editado.', 'warning');
        }
        this.clearData();
      },
        (err) => {
          this.alert('Error', 'Empleado no editado.', 'error');
          this.changeShow();
          this.clearData();
        }
      );
    
  }

  private alert(title: any, text: any, icon: any) {
    Swal.fire({ title, text, icon });
  }

  private clearData(){
    this.employeeId.setValue('');
    this.employeeName.setValue('');
    this.employeeIdentificacion.setValue('');
    this.employeeDirection.setValue('');
    this.employeeEmail.setValue('');
    this.employeeTelephone.setValue('');
    this.employeeActive = false;
    localStorage.removeItem('info-edit-employee');
    this.back();
  }

  private changeShow() {
    this.dsbSave = !this.dsbSave;
    this.hiddenProgBar = !this.hiddenProgBar;
  }

  private validateData() {
    if (this.employeeName.value === null || this.employeeName.value === '') {
      this.openSnackBar('Debes indicar el nombre.', 'OK');
      return false;
    }
    if (this.employeeIdentificacion.value === null || this.employeeIdentificacion.value === '') {
      this.openSnackBar('Debes indicar la identificación.', 'OK');
      return false;
    }
    if (this.employeeTelephone.value === null || this.employeeTelephone.value === '') {
      this.openSnackBar('Debes indicar el teléfono.', 'OK');
      return false;
    }
    if (this.employeeEmail.value !== '') {
      if (!this.formatEmail(this.employeeEmail.value)) {
        this.openSnackBar('Debe ingresar un email con formato correcto.', 'OK');
        return false;
      }
    }
    if (this.employeeDirection.value === null || this.employeeDirection.value === '') {
      this.openSnackBar('Debes indicar una dirección.', 'OK');
      return false;
    }
    return true;
  }

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000, panelClass: ['mycsssnackbartest'] });
  }

  private formatEmail(email) {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  public back() {
    this.router.navigate(['/list-employee']);
  }

  public setActive(state) {
    this.employeeActive = state;
  }

}
