import { Component } from '@angular/core';
import { ProductsComponent } from '../products/products.component';
import { UserProductListComponent } from '../user-product-list/user-product-list.component';
import { ProductService } from '../../services/product.service';
import { INewListRequest } from '../../models/product';
import { Router } from '@angular/router';

@Component({
    selector: 'app-new-product-list',
    standalone: true,
    imports: [ProductsComponent, UserProductListComponent],
    template: `
        <div class="main">
            <div class="products">
                <app-products></app-products>
            </div>
            <div class="list">
                <app-user-product-list></app-user-product-list>
            </div>
        </div>
        <div class="corner">
            <button (click)="addList()" [disabled]="empty()" class="btn btn-primary">Create</button>
        </div>
  `,
    styles: [
        `
     .main { display: flex; flex-direction: column; height: 100% }
     .corner {     
        position: STICKY;
        bottom: 20px;
        display: flex;
        justify-content: center;
     }
     .corner button {
        width: 80px;
        height: 35px;
        font-size: 15px;
        font-weight: bold;
     }
     .list { height: 100%; width: 100%; overflow-y: scroll}
     .products { max-height: 48px; width: 100%; text-align: center; overflow-y: scroll }
     @media only screen and (max-width: 600px) {

     }
   `]
})
export class NewProductListComponent {

    selectedIds: number[] = [];

    constructor(private productService: ProductService,
                private router: Router) { }

    ngOnInit() {
        this.productService.currentProduct.subscribe(product => {
            if (!this.selectedIds.includes(product.id)) {
                this.selectedIds.push(product.id)
            }
        })
    }

    addList() {
        const newList = { list: { name: '', product_ids: [] } } as INewListRequest;
        newList.list.name = `Lista zakupów ${new Date().toLocaleDateString()}`;
        newList.list.product_ids = this.selectedIds;

        this.productService.addNewList(newList)
            .subscribe({
                next: (data) => {
                    console.log(data)
                    this.router.navigate(['/']);
                },
                error: (error) => console.log(error)
            })
    }

    empty() {
        return this.selectedIds.length == 0;
    }
}
