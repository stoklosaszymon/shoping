import { Component } from "@angular/core";
import { ProductService } from "../../services/product.service";
import { IList } from "../../models/product";
import { Router } from "@angular/router";

@Component({
    selector: 'app-user-lists',
    standalone: true,
    template: `
        <div class="main fs-4">
            @for (list of userLists; track list.id) {
                <div class="item" (click)="redirectTo(list.id)">
                    <p> {{list.name}} </p>
                </div>
            }
            <div class="item new fs-4">
                <span (click)="newListRedirect()">Add</span>
            <div>
        </div>
    `,
    styles: [`
    .main {
        display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;
        margin: 20px 5px 20px 5px; width: 100%
    }
    .item { 
        width: 240px; height: 120px; border-radius: 15px;
        border: 1px solid black; display: flex; cursor: pointer;
        align-items:center; justify-content:center
    }
    .item:hover {
        background-color: #cccccc
    }
    `],
})
export class UserListsComponent {
    userLists: IList[] = [];

    constructor(private productService: ProductService,
                private router: Router) {}

    ngOnInit() {
        this.getLists();
    }

    getLists() {
        this.productService.getLists()
        .subscribe({
            next: (data) => { this.userLists = data; console.log(data)},
            error: (error) => console.log(error)
        })
    }

    redirectTo(id: number | string) {
        this.router.navigate([`view-list/${id}`]);
    }

    newListRedirect() {
        this.router.navigate([`new-list`]);
    }
}
