import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
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
  loadUsers(): Observable<User[]> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    return this.http.get<User[]>(this.urlApi + '/user/getUsers', { headers: header }).pipe(catchError(this.handleError));
  }

  /*Servicio que consulta un usuario en el sistema*/
  loadUser(id): Observable<User> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
    return this.http.get<User>(this.urlApi + '/user/getUser', { headers: header }).pipe(catchError(this.handleError));
  }

  // Servicio que crea un usuario en el sistema
  createUser(user: User): Observable<User> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    return this.http.post<User>(this.urlApi + '/user/create', user, { headers: header }).pipe(catchError(this.handleError));
  }

  // Servicio que actualiza un usuario en el sistema
  updateUser(id: string, user: User): Observable<User> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
    return this.http.put<User>(this.urlApi + '/user/updateUser', user, { headers: header }).pipe(catchError(this.handleError));
  }

  // Servicio que modifica el estado de un usuario en el sistema
  changeState(id: string, state: boolean, companyData: string): Observable<any> {
    const data = {
      active: state
    };
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
    return this.http.put<any>(this.urlApi + '/user/updateActive', data, { headers: header }).pipe(catchError(this.handleError));
  }

  // Servicio que eliminar un usuario en el sistema
  deleteUser(id): Observable<any> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
    return this.http.delete<any>(this.urlApi + '/user/deleteUser', { headers: header }).pipe(catchError(this.handleError));
  }
}
