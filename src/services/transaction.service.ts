import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment, HttpOptions } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

constructor(private readonly http: HttpClient) { }

fetchTransactions(params: any): Observable<any> {
  return this.http.get<any>(
    `${environment.apiUrl}getTransactions`,
    {
      headers: HttpOptions.headers,
      params
    }
  );
}

}
