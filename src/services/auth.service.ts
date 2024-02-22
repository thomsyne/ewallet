import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment, HttpOptions } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

constructor(private readonly http: HttpClient) { }


authSignup(model: any): Observable<any> {
  return this.http.post<any>(
    `${environment.apiUrl}users`, model, HttpOptions
  )
}
}
