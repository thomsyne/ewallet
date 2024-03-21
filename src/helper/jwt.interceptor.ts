import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available

        let userstring = (localStorage.getItem('user')) || ''
        let currentUser;

        if (userstring){
            currentUser = JSON.parse(userstring)
        }

        if (currentUser && currentUser.accessToken) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${currentUser.accessToken}`
                }
            });
        }

        return next.handle(request);
    }
}