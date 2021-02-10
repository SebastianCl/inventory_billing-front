import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Customer } from '../models/customer.model';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
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
    loadCustomers(): Observable<Customer[]> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        return this.http.get<Customer[]>(this.urlApi + '/customer/getCustomers', { headers: header })
            .pipe(catchError(this.handleError));
    }

    /*Servicio que consulta un usuario en el sistema*/
    loadCustomer(id): Observable<Customer> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
        return this.http.get<Customer>(this.urlApi + '/customer/getCustomer', { headers: header })
            .pipe(catchError(this.handleError));
    }

    // Servicio que crea un usuario en el sistema
    createCustomer(customer: Customer): Observable<Customer> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        return this.http.post<Customer>(this.urlApi + '/customer/createCustomer', customer, { headers: header })
            .pipe(catchError(this.handleError));
    }

    // Servicio que actualiza un usuario en el sistema
    updateCustomer(id: string, customer: Customer): Observable<Customer> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
        return this.http.put<Customer>(this.urlApi + '/customer/updateCustomer', customer, { headers: header })
            .pipe(catchError(this.handleError));
    }

    // Servicio que eliminar un usuario en el sistema
    deleteCustomer(id): Observable<any> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
        return this.http.delete<any>(this.urlApi + '/customer/deleteCustomer', { headers: header })
            .pipe(catchError(this.handleError));
    }
}
