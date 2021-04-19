import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Employe } from 'app/models/employe.model';

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

    loadEmployes(): Observable<Employe[]> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        return this.http.get<Employe[]>(this.urlApi + '/employee/getEmployees', { headers: header })
            .pipe(catchError(this.handleError));
    }

    public handleError(error: HttpErrorResponse) {
        return throwError(error);
    }


}
