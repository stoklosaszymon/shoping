import { Component } from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Credentials } from '../../models/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  credentials = new FormGroup({
    username: new FormControl<string>('', [
      Validators.required,
    ]),
    password: new FormControl<string>('', [
      Validators.required
    ]),
    email: new FormControl<string>('', [
      Validators.required
    ]),
  });

  constructor(private loginService: LoginService) {

  }

  onSubmit() {
    this.loginService.register(this.credentials.value as Credentials);
  }
}
