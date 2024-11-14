import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { UserProductListComponent } from './components/user-product-list/user-product-list.component';
import { LoginService } from './services/login.service';
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
		private location: Location
	) {
		if (!this.location.path().includes('register')) {
			this.loginService.auth().subscribe({
				next: (data) => {
					this.signedIn = true;
				},
				error: (err) => {
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
				this.router.navigate(['/login']);
			}
		});
	}

}
