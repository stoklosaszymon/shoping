import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Credentials } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private apiService: ApiService) { }

    register(credentials: Credentials) {
        this.apiService.post<any[]>('users', credentials)
            .subscribe(
                (data) => {
                    console.log(data);
                },
                (error) => {
                    console.error('Error registering user:', error);
                }
            );
    }

    login(credentials: Credentials) {
        return this.apiService.post<any[]>('login', credentials);
    }

    logout() {
        return this.apiService.delete<any[]>('logout');
    }

    secured() {
        return this.apiService.get<any[]>('users');
    }

    auth() {
        return this.apiService.get<any[]>('auth')
    }
}