import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Invoice } from '../models/invoice.model';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {
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

    loadInvoices(): Observable<Invoice[]> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        return this.http.get<Invoice[]>(this.urlApi + '/invoice/getInvoices', { headers: header })
            .pipe(catchError(this.handleError));
    }

    loadInvoice(id: string): Observable<Invoice> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
        return this.http.get<Invoice>(this.urlApi + '/invoice/getInvoice', { headers: header })
            .pipe(catchError(this.handleError));
    }

    loadInvoicesWithFilter(filter: any): Observable<any[]> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        return this.http.post<any[]>(this.urlApi + '/invoice/findInvoiceWithFilter', filter, {
            headers: header
        }).pipe(catchError(this.handleError));
    }

    createInvoice(invoice: Invoice, type: string): Observable<Invoice> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, 'type': type });
        return this.http.post<Invoice>(this.urlApi + '/invoice/createInvoice', invoice, { headers: header })
            .pipe(catchError(this.handleError));
    }

    payInvoice(id: string, newData: any): Observable<Invoice> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
        return this.http.put<Invoice>(this.urlApi + '/invoice/payInvoice', newData, { headers: header })
            .pipe(catchError(this.handleError));
    }

    invoiceToCO(id: string): Observable<Invoice> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
        return this.http.post<Invoice>(this.urlApi + '/invoice/invoiceToCO', { nombre: 'nada' }, { headers: header })
            .pipe(catchError(this.handleError));
    }

    deleteInvoice(id: string): Observable<any> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
        return this.http.delete<any>(this.urlApi + '/invoice/deleteInvoice', { headers: header })
            .pipe(catchError(this.handleError));
    }

    public handleError(error: HttpErrorResponse) {
        return throwError(error);
    }


}
