import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { UserProductListComponent } from './components/user-product-list/user-product-list.component';
import { LoginService } from './services/login.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { logOut } from './store/login.actions';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet,
		ProductsComponent,
		UserProductListComponent,
		RouterLink,
		RouterLinkActive,
		AsyncPipe
	],
	providers: [],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent {
	title = 'angular-project';

	signedIn$: Observable<boolean>;

	constructor(
		private router: Router,
		private loginService: LoginService,
    	private store: Store<{ login: boolean }>
	) {
		this.signedIn$ = store.select('login')
	}

	logout() {
	   this.loginService.logout().subscribe({
	        next: () => { 
				this.store.dispatch(logOut())
				this.router.navigate(['/']);
			}
	   });
	}

}
