import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Item } from '../models/item.model';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ItemService {
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

    loadItems(): Observable<Item[]> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        return this.http.get<Item[]>(this.urlApi + '/item/getItems', { headers: header })
            .pipe(catchError(this.handleError));
    }

    loadItemsCO(): Observable<Item[]> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        return this.http.get<Item[]>(this.urlApi + '/item/findItemsCO', { headers: header })
            .pipe(catchError(this.handleError));
    }

    loadItem(id): Observable<Item> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
        return this.http.get<Item>(this.urlApi + '/item/findItemsWithFilter', { headers: header })
            .pipe(catchError(this.handleError));
    }

    loadItemsWithFilter(filter): Observable<any[]> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        return this.http.post<any[]>(this.urlApi + '/item/findItemsWithFilter', filter, {
            headers: header
        }).pipe(catchError(this.handleError));
    }

    createItem(item: Item): Observable<Item> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        return this.http.post<Item>(this.urlApi + '/item/createItem', item, { headers: header })
            .pipe(catchError(this.handleError));
    }

    updateItem(id: string, newData: any): Observable<Item> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
        return this.http.put<Item>(this.urlApi + '/item/updateItem', newData, { headers: header })
            .pipe(catchError(this.handleError));
    }

    deleteItem(id): Observable<any> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
        return this.http.delete<any>(this.urlApi + '/item/deleteItem', { headers: header })
            .pipe(catchError(this.handleError));
    }

    public handleError(error: HttpErrorResponse) {
        return throwError(error);
    }


}
