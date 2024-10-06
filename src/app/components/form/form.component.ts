import { Component } from '@angular/core';
import { User } from '../../models/user';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {

  constructor(private loginService: LoginService) {

  }

  model: User = new User('Jacek', 'Placek', '+32414412442', 'jacek@placek.com');

  onSubmit() {
    this.loginService.secured()
      .subscribe({
        next: (data) => console.log(data),
        error: (error) => console.log(error)
      })
  }
}
