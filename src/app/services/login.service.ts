import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Credentials } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private apiService: ApiService,
                private router: Router) { }

    register(credentials: Credentials) {
        this.apiService.post<any[]>('users', credentials)
            .subscribe({
                next: (data) => this.router.navigate(['/login']),
                error: (error) => console.log(error)
            });
    }

    login(credentials: Credentials) {
        return this.apiService.post<any[]>('login', credentials);
    }

    logout() {
        return this.apiService.delete<any[]>('logout');
    }

    auth() {
        return this.apiService.get<any[]>('auth')
    }
}