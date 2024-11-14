import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductList } from "../../models/product";
import { UserProductListComponent } from "../user-product-list/user-product-list.component";
import { ProductService } from "../../services/product.service";
import { ProductsComponent } from "../products/products.component";
import { Subscription, of, switchMap } from "rxjs";


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
        </div>
        `,
    styles: [`
        .main { height: 100vh }
        .products { 
            height: 48px;
            resize: both;
            position: -webkit-sticky;
            position: sticky;
            top: 0;
            background-color: white;
            font-size: 25px;
        }
    `]
})
export class ViewListComponent {


    list: ProductList = {} as ProductList;
    selectedId: string = '0';
    updateSubscription: Subscription = new Subscription();

    constructor(private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService) { }

    ngOnInit() {
        const selectedId = this.route.snapshot.paramMap.get('id');
        this.selectedId = selectedId !== null ? selectedId : '';
        this.getList();

        this.updateSubscription = this.productService.currentProduct.pipe(
            switchMap(product => {
                const ids = this.list.products.map( p => p.id )
                if (product && !ids.includes(product.id)) {
                    return this.productService.updateNewProducts(this.selectedId, [product.id])  
                }
                return of(null)
            })
        ).subscribe({
            next: (data) => {
                console.log('updated', data);
            },
            error: () => console.log('nie ma')
        })
        
    }

    getList() {
        return this.productService.getList(parseInt(this.selectedId))
            .subscribe({
                next: (data) => { 
                    this.list = data;
                },
                error: (error) => console.log(error)
            })
    }

    updateNewProducts(productId: number) {
        let listId = this.route.snapshot.paramMap.get('id');
        if (listId && productId) {
            this.productService.updateNewProducts(
                listId,
                [productId]
            ).subscribe({
                next: (data) => { this.getList() },
                error: () => console.log('error updating')
            })
        }
    }

    ngOnDestroy() {
        this.updateSubscription.unsubscribe();
    }
}