import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';



@Injectable({
    providedIn: 'root'
})
export class AuthGard implements CanActivate {


    constructor(private as: AuthService, private router: Router) { }

    canActivate() {
        if (!this.as.isAuthenticated()) {
            this.router.navigate([''])
        }
        return true;
    }
}
