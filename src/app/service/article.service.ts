import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Article, EditArticle, ValidateArticle } from '../models/article.model';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {
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

    loadArticles(): Observable<Article[]> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        return this.http.get<Article[]>(this.urlApi + '/article/getArticles', { headers: header })
            .pipe(catchError(this.handleError));
    }

    loadArticle(id): Observable<Article> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
        return this.http.get<Article>(this.urlApi + '/article/getArticle', { headers: header })
            .pipe(catchError(this.handleError));
    }

    loadArticlesWithFilter(filter): Observable<any[]> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        return this.http.post<any[]>(this.urlApi + '/article/findArticlesWithFilter', filter, {
            headers: header
        }).pipe(catchError(this.handleError));
    }

    createArticle(article: Article): Observable<Article> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        return this.http.post<Article>(this.urlApi + '/article/createArticle', article, { headers: header })
            .pipe(catchError(this.handleError));
    }

    editArticle(article: EditArticle, idArticle: string): Observable<EditArticle> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, 'id': idArticle});
        return this.http.put<EditArticle>(this.urlApi + '/article/updateArticle', article, { headers: header })
            .pipe(catchError(this.handleError));
    }

    async uploadImage(image) {
        let header = new HttpHeaders({ 'Content-Type': 'application/json', 'cache-control': 'no-cache', 'x-access-token': this.token });
        return await this.http.post<any>(
            this.urlApi + '/article/createArticle',
            image,
            { headers: header })
            .pipe(catchError(this.handleError)).toPromise();
    }

    updateArticle(id: string, newData: any): Observable<Article> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
        return this.http.put<Article>(this.urlApi + '/article/updateArticle', newData, { headers: header })
            .pipe(catchError(this.handleError));
    }

    deleteArticle(id): Observable<any> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token, id });
        return this.http.delete<any>(this.urlApi + '/article/deleteArticle', { headers: header })
            .pipe(catchError(this.handleError));
    }

    validateAvailability(articles: any): Observable<ValidateArticle> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        return this.http.post<ValidateArticle>(this.urlApi + '/article/validateAvailability', articles, { headers: header })
            .pipe(catchError(this.handleError));
    }

    public handleError(error: HttpErrorResponse) {
        return throwError(error);
    }


}
