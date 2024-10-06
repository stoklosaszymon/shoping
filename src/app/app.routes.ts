import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FormComponent } from './components/form/form.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', component: FormComponent},
    {path: 'register', component: RegisterComponent}
];
