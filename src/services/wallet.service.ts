import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment, HttpOptions } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(private readonly http: HttpClient) {}

  getDetails(model: any): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}getUserInfo`,
      model,
      HttpOptions
    );
  }

  transferFunds(model: any): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}transferFunds`,
      model,
      HttpOptions
    );
  }

  fundWallet(model: any): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}fundAccount`,
      model,
      HttpOptions
    );
  }

}
