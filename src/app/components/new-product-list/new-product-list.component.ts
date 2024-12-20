import { Component, ElementRef, OnChanges, SimpleChanges, ViewChild, viewChild } from '@angular/core';
import { ProductsComponent } from '../products/products.component';
import { UserProductListComponent } from '../user-product-list/user-product-list.component';
import { ProductService } from '../../services/product.service';
import { INewListRequest, IProductRequest, Product } from '../../models/product';
import { Router } from '@angular/router';

@Component({
    selector: 'app-new-product-list',
    standalone: true,
    imports: [ProductsComponent, UserProductListComponent],
    template: `
        <div class="main">
            <div class="products">
                <app-products [keyword]="keyword"></app-products>
            </div>
            <div class="list">
                <app-user-product-list #list [(userInput)]="keyword"></app-user-product-list>
            </div>
        </div>
        <div class="button-container">
            <button (click)="createNewList()" [disabled]="anySelected()" class="btn btn-primary">Create</button>
        </div>
  `,
    styles: [
        `
     .main { display: flex; flex-direction: column; height: 100% }
     .button-container {     
        position: STICKY;
        bottom: 20px;
        display: flex;
        justify-content: center;
     }
     .button-container button {
        width: 80px;
        height: 35px;
        font-size: 15px;
        font-weight: bold;
     }
     .list { height: 100%; width: 100%; overflow-y: scroll}
     .products { 
            height: 48px;
            resize: both;
            position: -webkit-sticky;
            position: sticky;
            top: 0;
            background-color: white;
            font-size: 25px;
            z-index: 1;
     }
   `]
})
export class NewProductListComponent {

    selectedIds: number[] = [];
    keyword: string = '';
    listComponent = viewChild<UserProductListComponent>("list");

    constructor(private productService: ProductService,
                private router: Router) { }

    ngOnInit() {
        this.productService.currentProduct.subscribe(product => {
            if (!this.selectedIds.includes(product.id)) {
                this.selectedIds.push(product.id)
            }
        })
    }

    createNewList() {
        const newList = { list: { name: '', products: [] } } as INewListRequest;
        newList.list.name = `Lista zakupów ${new Date().toLocaleDateString()}`;
        const products = this.listComponent()?.products.map( p => ({
            id: p.id,
            quantity: p.quantity,
            status: p.status
        }))
        newList.list.products = products as IProductRequest[];

        this.productService.addNewList(newList)
            .subscribe({
                next: (data) => {
                    console.log(data)
                    this.router.navigate(['/']);
                },
                error: (error) => console.log(error)
            })
    }

    anySelected() {
        return this.selectedIds.length == 0;
    }
}
