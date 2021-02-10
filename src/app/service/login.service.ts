import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Session } from '../models/session.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  urlApi: string;

  constructor(private http: HttpClient) {
    this.urlApi = environment.apiUrl;
  }

  login(session: any): Observable<any> {
    const sessionJson = JSON.stringify(session);
    return this.http.post(this.urlApi + '/user/login', sessionJson, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).pipe(map(dat => {
      return dat;
    }),
      catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
