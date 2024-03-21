import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment, HttpOptions } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

constructor(private readonly http: HttpClient) { }

filterTransactions(): Observable<any> {
  return this.http.get<any>(
    `${environment.apiUrl}filterTransactions`,
    {
      headers: HttpOptions.headers
    }
  );
}

}
