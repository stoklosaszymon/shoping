import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NewProductListComponent } from './components/new-product-list/new-product-list.component';
import { ProductsComponent } from './components/products/products.component';
import { UserListsComponent } from './components/user-lists/user-lists.component';
import { ViewListComponent } from './components/view-list/view-list.component';
import { AuthGuard } from './shared/auth.guard';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: '', component: UserListsComponent},
    {path: 'new-list', component: NewProductListComponent},
    {path: 'products', component: ProductsComponent},
    {path: 'view-list/:id', component: ViewListComponent},
];
