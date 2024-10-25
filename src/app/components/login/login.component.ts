import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Credentials } from '../../models/user';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Store } from '@ngrx/store'
import { logIn } from '../../store/login.actions'
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
    private store: Store<{ login: boolean}>
  ) {
  }

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
	      this.store.dispatch(logIn())
      },
      error: (error) => console.log(error)
    });
  }
}
