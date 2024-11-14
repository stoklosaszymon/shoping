import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Credentials } from '../../models/user';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, AsyncPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(
    private router: Router,
    private loginService: LoginService,
  ) {
  }

  credentials = new Credentials('', '');
  button = 'Log In';

  onSubmit() {
    this.loginService.login(this.credentials as Credentials)
      .subscribe({
        next: (data) => {
          this.redirectToHome();
        },
        error: (error) => console.log(error)
      });
  }

  redirectToHome() {
    this.router.navigate(['/'])
      .then(() => {
        window.location.reload();
      });
  }
}
