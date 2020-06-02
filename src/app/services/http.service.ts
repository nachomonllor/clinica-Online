import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import urljoin from 'url-join';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { Observable, throwError as observableThrowError,  Subject } from 'rxjs';
import * as _ from 'lodash';
import { Cacheable } from 'ngx-cacheable';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const cacheBuster$ = new Subject<void>();
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private _url: string;
  constructor(
    public httpClient: HttpClient
  ) {}
  public get url(): string {
    return this._url;
  }
  public set url(value: string) {
    this._url = value;
  }
  getAll<T>(
    filter = '',
    sortField = 'id',
    sortDirection = 'asc',
    pageNumber = 0,
    pageSize = 0,
  ): Observable<T> {
    // const mergedUrl =
    //   `${this.url}` +
    //   `?page=${this.paginationService.page}&pageCount=${
    //     this.paginationService.pageCount
    //   }`;
    const options: { params } = {
      params: new HttpParams()
        .set('filter', filter)
        .set('sortField', sortField)
        .set('sortDirection', sortDirection)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    };
    return this.httpClient
      .get<T>(this.url, options)
      .pipe(
        map((res: any) => res),
        catchError(this.handleError),
      );
  }
  getSingle<T>(id: number): Observable<T> {
    return this.httpClient.get<T>(`${this.url}/${id}`);
  }
  add<T>(toAdd: T): Observable<T> {
    const url = this.url;
    return this.httpClient.post<T>(url, toAdd, httpOptions).pipe(
      map((response: any) => {
        // this.dataChange.next(response.business);
        return response;
      }),
      catchError(this.handleError)
    );
  }
  @Cacheable({
    cacheBusterObserver: cacheBuster$
  })
  update<T>(toUpdate: T): Observable<T> {
    const id = typeof toUpdate === 'number' ? toUpdate : toUpdate['id'];
    const url = `${this.url}/${id}`;
    // _.omit(toUpdate, ['id']);
    return this.httpClient
      .put<T>(url, toUpdate, httpOptions)
      .pipe(catchError(this.handleError));
  }
  delete<T>(toDelete: T | number): Observable<T> {
    // return this.httpClient.delete(url);
    const id = typeof toDelete === 'number' ? toDelete : toDelete['id'];
    const url = `${this.url}/${id}`;
    return this.httpClient
      .delete<T>(url, httpOptions)
      .pipe(catchError(this.handleError));
  }
  public handleError(error: HttpErrorResponse) {
    let message = '';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      // console.error('An error occurred:', error.error.message);
      message = error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      // console.error(
      //   `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      // );
      if (error.error.message instanceof Array) {
        error.error.message.map(el => {
          message += `${el.message}\n`;
        });
      } else {
        message = error.error.message;
      }
    }
    // return an observable with a user-facing error message
    return observableThrowError(message);
  }
}
