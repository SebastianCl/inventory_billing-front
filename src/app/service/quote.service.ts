import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Quote } from '../models/quote.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
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

  loadQuotes(): Observable<Quote[]> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    return this.http.get<Quote[]>(this.urlApi + '/quote/getQuotes', { headers: header })
      .pipe(catchError(this.handleError));
  }

  loadQuote(id: string): Observable<Quote> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
    return this.http.get<Quote>(this.urlApi + '/quote/getQuote', { headers: header })
      .pipe(catchError(this.handleError));
  }

  loadQuotesWithFilter(filter: any): Observable<any[]> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    return this.http.post<any[]>(this.urlApi + '/quote/findQuoteWithFilter', filter, {
      headers: header
    }).pipe(catchError(this.handleError));
  }

  createQuote(quote: Quote): Observable<Quote> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    return this.http.post<Quote>(this.urlApi + '/quote/createQuote', quote, { headers: header })
      .pipe(catchError(this.handleError));
  }

  updateQuote(id: string, newData: any): Observable<Quote> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
    return this.http.put<Quote>(this.urlApi + '/quote/updateQuote', newData, { headers: header })
      .pipe(catchError(this.handleError));
  }

  quoteToCO(id: string): Observable<Quote> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
    return this.http.post<Quote>(this.urlApi + '/quote/quoteToCO', { nombre: 'nada' }, { headers: header })
      .pipe(catchError(this.handleError));
  }

  deleteQuote(id: string): Observable<any> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
    return this.http.delete<any>(this.urlApi + '/quote/deleteQuote', { headers: header })
      .pipe(catchError(this.handleError));
  }

  public handleError(error: HttpErrorResponse) {
    return throwError(error);
  }


}
