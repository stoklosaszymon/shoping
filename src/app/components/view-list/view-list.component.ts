import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductList } from "../../models/product";
import { UserProductListComponent } from "../user-product-list/user-product-list.component";
import { ProductService } from "../../services/product.service";
import { ProductsComponent } from "../products/products.component";


@Component({
    selector: 'app-view-list',
    standalone: true,
    imports: [
        UserProductListComponent,
        ProductsComponent
    ],
    template: `
        <div class="main">
            <div class="products">
                <app-products></app-products>
            </div>
            <app-user-product-list [list]="list" [id]="selectedId"></app-user-product-list>

            @if (newProducts.length > 0) {
                 <div class="corner">
                     <button (click)="updateNewProducts()" class="btn btn-primary">Update</button>
                 </div>
            }
        </div>
        `,
    styles: [`
        .main { height: 100vh }
        .products { height: 48px }
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
    `]
})
export class ViewListComponent {


    list: ProductList = {} as ProductList;
    selectedId: string = '0';
    newProducts: number[] = [];

    constructor(private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService) { }

    ngOnInit() {
        const selectedId = this.route.snapshot.paramMap.get('id');
        this.selectedId = selectedId !== null ? selectedId : '';
        this.getList();

        this.productService.currentProduct.subscribe((product) => {
            if (!this.list.products.map(p => p.id).includes(product.id)) {
                this.newProducts.push(product.id);
            }
        });
    }

    getList() {
        this.productService.getList(parseInt(this.selectedId))
            .subscribe({
                next: (data) => { this.list = data },
                error: (error) => console.log(error)
            })
    }

    updateNewProducts() {
        let selectedId = this.route.snapshot.paramMap.get('id');
        selectedId = selectedId !== null ? selectedId : '';
        this.productService.updateNewProducts(
            selectedId,
            this.newProducts
        ).subscribe({
            next: (data) => console.log('updated', data),
            error: () => console.log('error updating')
        })
    }
}