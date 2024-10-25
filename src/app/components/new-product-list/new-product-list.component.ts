import { Component } from '@angular/core';
import { ProductsComponent } from '../products/products.component';
import { UserProductListComponent } from '../user-product-list/user-product-list.component';
import { ProductService } from '../../services/product.service';
import { INewListRequest } from '../../models/product';

@Component({
    selector: 'app-new-product-list',
    standalone: true,
    imports: [ProductsComponent, UserProductListComponent],
    template: `
        <div class="main">
            <div class="block">
                <app-products></app-products>
            </div>
            <div class="block">
                <app-user-product-list></app-user-product-list>
            </div>
        </div>
        <div class="corner">
            <button (click)="addList()" class="btn btn-primary">Create</button>
        </div>
  `,
    styles: [
    `.main { display: flex; margin-top: 10px; flex-wrap: wrap }
     .corner { position: relative; left: 93vw; bottom: 45px;width: fit-content; }
     .block { width: 50% }
     @media only screen and (max-width: 600px) {
       .block {
	  width: 100%;
       }
       .corner {
	  left: 85vw;
	  bottom: 45px;
       }
     }
  `]
})
export class NewProductListComponent {

    selectedIds: number[] = [];

    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.productService.currentProduct.subscribe(product => {
            this.selectedIds.push(product.id)            
        })
    }

    addList() {
        const newList = {list: { name: '', product_ids: []}} as INewListRequest;
        newList.list.name = `Lista zakupów ${new Date().toLocaleDateString()}`;
        newList.list.product_ids = this.selectedIds;

        this.productService.addNewList(newList)
        .subscribe({
            next: (data) => console.log(data),
            error: (error) => console.log(error)
        })
    }
}
