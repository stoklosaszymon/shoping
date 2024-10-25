import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { ProductList } from "../../models/product";
import { UserProductListComponent } from "../user-product-list/user-product-list.component";
import { ProductService } from "../../services/product.service";


@Component({
    selector: 'app-view-list',
    standalone: true,
    imports: [
        UserProductListComponent
    ],
    template: '<app-user-product-list [list]="list"></app-user-product-list>',
    styles: ['']
})
export class ViewListComponent {


    list: ProductList = {} as ProductList;
    selectedId: string = '0';

    constructor(private route: ActivatedRoute,
                private router: Router,
                private productService: ProductService) {}

    ngOnInit() {
        const selectedId = this.route.snapshot.paramMap.get('id');
        this.selectedId = selectedId !== null ? selectedId : '';
        this.getList();
    }

    getList() {
        this.productService.getList(parseInt(this.selectedId))
        .subscribe({
            next: (data) => { this.list = data; console.log(' lisr', this.list.products)},
            error: (error) => console.log(error)
        })
    }
}