import { Component, Inject } from "@angular/core";
import { MatBottomSheetModule, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatFormField } from "@angular/material/form-field"
import { MatSelectModule } from "@angular/material/select"
import { MatInputModule } from '@angular/material/input';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { IProduct } from "../../models/product";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ProductService } from "../../services/product.service";

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [
        MatBottomSheetModule,
        MatFormField,
        MatSelectModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    template: `
      <div class="container">
      <form class="container" [formGroup]="productForm" (ngSubmit)="onSubmit()">
        <mat-form-field>
          <mat-label>Product name</mat-label>
          <input matInput formControlName="name"/>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Unit</mat-label>
          <mat-select formControlName="unit">
            @for (unit of units; track $index) {
                <mat-option value={{unit}}>{{unit}}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <button class="btn" matButton type="submit" [disabled]="!productForm.valid">Edit</button>
        </form>
      </div>
    `,
    styles: [`
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .container > mat-form-field {
            width: 100%
        }
        .btn {
            height: 40px;
            width: 70px;
            border-radius: 15px;
            background-color: paleturquoise;
            font-weight: bold;
        }
    `]
})
export class ProductFormComponent {
    constructor(
        private bottomSheetRef: MatBottomSheetRef<ProductFormComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: { id: string },
        private productService: ProductService) {
        this.productId = data.id;
    }

    ngOnInit() {
        this.productService.getProduct(this.productId)
        .subscribe({
            next: (data: any) => {
                this.productForm.controls['name'].setValue(data.name);
                this.productForm.controls['unit'].setValue(data.unit);
            },
            error: () => console.log('error')
        })
    }

    productId: string = '';
    product: IProduct | null = null;
    units: string[] = ["piece", "kg", "g", "l", "ml"];
    selectedUnit = "piece";

    productForm = new FormGroup({
        name: new FormControl<string>('', [
            Validators.required,
        ]),
        unit: new FormControl<string>('', [
            Validators.required,
        ]),
    });

    close(): void {
        this.bottomSheetRef.dismiss();
    }

    onSubmit() {
        let form = { id: this.productId, ...this.productForm.value } as IProduct;
        this.productService.updateProduct(form)
            .subscribe({
                next: (data) => {
                    console.log('saving changes', data)
                },
                error: () => console.log('error'),
                complete: () => this.close()
            })
    }
}