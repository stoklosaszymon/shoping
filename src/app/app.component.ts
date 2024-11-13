import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { UserProductListComponent } from './components/user-product-list/user-product-list.component';
import { LoginService } from './services/login.service';
import { Store } from '@ngrx/store';
import { logIn, logOut } from './store/login.actions';
import { Location } from '@angular/common';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet,
		ProductsComponent,
		UserProductListComponent,
		RouterLink,
		RouterLinkActive,
	],
	providers: [],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent {
	title = 'angular-project';

	signedIn: boolean = false;

	constructor(
		private router: Router,
		private loginService: LoginService,
		private store: Store<{ login: boolean }>,
		private location: Location
	) {
		if (!this.location.path().includes('register')) {
			this.loginService.auth().subscribe({
				next: (data) => {
					this.signedIn = true;
					this.store.dispatch(logIn())
				},
				error: (err) => {
					this.store.dispatch(logOut());
					this.router.navigate(['/login']);
					this.signedIn = false;
				}
			})
		}
	}

	logout() {
		this.loginService.logout().subscribe({
			next: () => {
				this.signedIn = false;
				this.store.dispatch(logOut())
				this.router.navigate(['/login']);
			}
		});
	}

}
