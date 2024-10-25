import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { SelectCategoriesComponent } from '../select-categories/select-categories.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ SelectCategoriesComponent ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  products: Product[] = []
  category = ''
  constructor(private productService: ProductService) {

  }

  ngOnInit() {
    this.productService.currentCategory.subscribe( category => {
        this.category = category;
        this.getProduct(this.category);
    })
    this.getProduct();
  }

  handleClick(product: Product) {
    this.productService.selectProduct(product)
  }

  getProduct(category = '') {
    this.productService.getProducts(category)
      .subscribe({
        next: (data: Product[]) => { this.products = data },
        error: (error) => console.log(error)
      })
  }
}
