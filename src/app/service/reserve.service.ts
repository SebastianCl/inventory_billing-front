import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Reserve, EditReserve, ReserveCancel } from '../models/reserve.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReserveService {
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

  loadReserves(): Observable<Reserve[]> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    return this.http.get<Reserve[]>(this.urlApi + '/reserve/getReserves', { headers: header })
      .pipe(catchError(this.handleError));
  }

  loadReserve(id: string): Observable<Reserve> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
    return this.http.get<Reserve>(this.urlApi + '/reserve/getReserve', { headers: header })
      .pipe(catchError(this.handleError));
  }

  loadReservesWithFilter(filter: any): Observable<any[]> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    return this.http.post<any[]>(this.urlApi + '/reserve/findReserveWithFilter', filter, {
      headers: header
    }).pipe(catchError(this.handleError));
  }

  createReserve(reserve: Reserve): Observable<ReserveCancel> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    return this.http.post<ReserveCancel>(this.urlApi + '/reserve/createReserve', reserve, { headers: header })
      .pipe(catchError(this.handleError));
  }

  getDataArticles(reserve: ReserveCancel): Observable<any[]> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    return this.http.post<any[]>(this.urlApi + '/reserve/getDataArticlesReserved', reserve, {
      headers: header
    }).pipe(catchError(this.handleError));
  }

  cancelReserve(reserve: ReserveCancel): Observable<ReserveCancel> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    return this.http.post<ReserveCancel>(this.urlApi + '/reserve/cancelReserve', reserve, { headers: header })
      .pipe(catchError(this.handleError));
  }

  editReserve(reserve: EditReserve, idReserve: string): Observable<EditReserve> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, 'id': idReserve});
    return this.http.put<EditReserve>(this.urlApi + '/reserve/editReserve', reserve, { headers: header })
      .pipe(catchError(this.handleError));
  }

  payReserve(id: string, newData: any): Observable<Reserve> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
    return this.http.put<Reserve>(this.urlApi + '/reserve/payReserve', newData, { headers: header })
      .pipe(catchError(this.handleError));
  }

  reserveToCO(id: string): Observable<Reserve> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
    return this.http.post<Reserve>(this.urlApi + '/reserve/reserveToCO', { nombre: 'nada' }, { headers: header })
      .pipe(catchError(this.handleError));
  }

  deleteReserve(id: string): Observable<any> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
    return this.http.delete<any>(this.urlApi + '/reserve/deleteReserve', { headers: header })
      .pipe(catchError(this.handleError));
  }

  public handleError(error: HttpErrorResponse) {
    return throwError(error);
  }


}
