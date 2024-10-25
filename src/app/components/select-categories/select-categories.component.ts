import { Component } from "@angular/core";
import { ProductService } from "../../services/product.service";
import { FormsModule } from "@angular/forms";
import { ICategory } from "../../models/product";

@Component({
    selector: 'app-select-categories',
    standalone: true,
    imports: [
        FormsModule
    ],
    providers: [],
    template: `
            <select class="form-select" [(ngModel)]="selectedCategoryId" (change)="onChange()">
                @for (category of categories; track category.id) {
                    <option [value]="category.id">
                        {{ category.name }}
                    </option>
                }
            </select>
        `,
    styles: []
})

export class SelectCategoriesComponent {

    categories: ICategory[] = []
    selectedCategoryId: string = '';
    constructor(private productService: ProductService) { }

    ngOnInit() {
        this.getCategories();
    }

    onChange() {
        this.productService.selectCategory(this.selectedCategoryId);
    }

    getCategories() {
        this.productService.getCategories()
            .subscribe({
                next: (data) => { this.categories = data },
                error: (error) => { console.log(error) }
            })
    }
}