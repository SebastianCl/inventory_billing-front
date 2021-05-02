import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Employee } from '../models/employee.model';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    urlApi: string;
    token: string;

    constructor(private http: HttpClient) {
        this.urlApi = environment.apiUrl;
        if (localStorage.getItem('token') !== null) {
            this.token = localStorage.getItem('token');
        } else {
            this.token = '';
        }
    }

    public handleError(error: HttpErrorResponse) {
        return throwError(error);
    }

    /*Servicio que consulta todos los usuarios registrados en el sistema*/
    loadEmployees(): Observable<Employee[]> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        return this.http.get<Employee[]>(this.urlApi + '/employee/getEmployees', { headers: header })
            .pipe(catchError(this.handleError));
    }

    /*Servicio que consulta un usuario en el sistema*/
    loadEmployee(id): Observable<Employee> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
        return this.http.get<Employee>(this.urlApi + '/employee/getEmployee', { headers: header })
            .pipe(catchError(this.handleError));
    }

    // Servicio que crea un usuario en el sistema
    createEmployee(employee: Employee): Observable<Employee> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        return this.http.post<Employee>(this.urlApi + '/employee/createEmployee', employee, { headers: header })
            .pipe(catchError(this.handleError));
    }

    // Servicio que actualiza un usuario en el sistema
    updateEmployee(id: string, employee: Employee): Observable<Employee> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
        return this.http.put<Employee>(this.urlApi + '/employee/updateEmployee', employee, { headers: header })
            .pipe(catchError(this.handleError));
    }

    // Servicio que eliminar un usuario en el sistema
    deleteEmployee(id): Observable<any> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
        return this.http.delete<any>(this.urlApi + '/employee/deleteEmployee', { headers: header })
            .pipe(catchError(this.handleError));
    }
}
