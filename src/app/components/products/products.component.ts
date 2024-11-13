import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { SelectCategoriesComponent } from '../select-categories/select-categories.component';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SelectCategoriesComponent,
            MatMenuModule,
            MatIconModule,
            FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  keyword: string = '';
  products: Product[] = []
  category = ''
  selected: number = 0;
  loaded = false;
  private keyHoldTimeout: any;
  private holdTime = 1000;
  @ViewChild('keywordRef') keywordRef: any;

  constructor(private productService: ProductService) { }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.keywordRef.nativeElement.classList.add("show");
    setTimeout(() => {
      this.keywordRef.nativeElement.classList.remove("show");
    }, 1000);
    if (event.code == `Key${event.key.toUpperCase()}` || event.code == 'Space') {
      this.keyword += event.key;
      this.products = this.products.filter(product => product.name.toLowerCase().startsWith(this.keyword.toLowerCase()));
    }
  }

  @HostListener('window:keydown.backspace', ['$event'])
  handleBackspace() {
    if (!this.keyHoldTimeout) {
      this.keyword = this.keyword.slice(0, -1);
      if (this.keyword.length == 0) {
        this.getProduct();
      }

      this.keyHoldTimeout = setTimeout(() => {
        this.clearKeyword();
      }, this.holdTime);
    }
  }

  @HostListener('window:keyup.enter', ['$event'])
  handleEnter() {
    if (this.products.length === 1) {
      this.productService.selectProduct(this.products[0]);
      this.clearKeyword();
    }

    if (this.products.length === 0) {
      this.addProduct();
    }
  }

  @HostListener('window:keyup.backspace', ['$event'])
  handleBackspaceUp() {
    if (this.keyHoldTimeout) {
      clearTimeout(this.keyHoldTimeout);
      this.keyHoldTimeout = null;
    }
  }

  ngOnInit() {
    this.productService.currentCategory.subscribe(category => {
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
        error: (error) => console.log(error),
        complete: () => this.loaded = true
      })
  }

  clearKeyword() {
    this.keyword = '';
    this.getProduct();
  }

  addProduct() {
    this.productService.addProduct(this.keyword).subscribe({
      next: (data) => {
        this.clearKeyword();
        this.productService.selectProduct(data);
      },
      error: (e) => console.log(e)
    })
  }

  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: any;

  menuTopLeftPosition = { x: '0', y: '0' }

  onRightClick(event: any) {
    event.preventDefault();
    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';
    this.matMenuTrigger.openMenu();
  }

  setId(id: number) {
    this.selected = id;
  }

  handleDelete() {
    this.productService.deleteProduct(this.selected).subscribe({
      next: (resp) => {
        this.clearKeyword();
      },
      error: (error) => console.log(error)
    })
  }

  showSearch() {
    let input = document.getElementById('searchInput') as HTMLElement;
    input.classList.toggle('show');
    input.focus();
  }

  clearSearch() {
    this.clearKeyword();
  }

}
