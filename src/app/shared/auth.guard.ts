import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  isAuthenticated: boolean = false;

  constructor(private router: Router,
    private store: Store<{ login: boolean }>) {
      store.select('login').subscribe({
        next: (isLoggedin: boolean) => {
          this.isAuthenticated = isLoggedin
        }
      });
      console.log('guard')
  }

  canActivate(): boolean {
    if (this.isAuthenticated) {
      return true;
    } 

    this.router.navigate(['/login']);
    return false;
  }
}
