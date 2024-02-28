import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { JwtHelperService } from "@auth0/angular-jwt";
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private readonly toastr: ToastrService,
        private router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const helper = new JwtHelperService();
        
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const isExpired = helper.isTokenExpired(currentUser.accessToken);
        
        if (currentUser && !isExpired) {
            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.toastr.error('Please login to access this page');
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}