import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Credentials } from '../../models/user';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  credentials = new Credentials('', '');
  button = 'Log In';

  onSubmit() {
    this.handleSubmit();
  }

  redirectToHome() {
    this.router.navigate(['/']); 
  }

  handleSubmit() {
    this.loginService.login(this.credentials as Credentials)
    .subscribe({
      next: (data) => {
        this.redirectToHome();
      },
      error: (error) => console.log(error)
    });
  }

  testSecured() {
    this.loginService.secured()
      .subscribe({
        next: (data) => console.log(data),
        error: (error) => console.log(error)
      })
  }

  logout() {
    this.loginService.logout()
      .subscribe({
        next: (data) => console.log('logged out', data),
        error: (error) => console.log(error)
      })
  }
}
