import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product, ProductList } from '../../models/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
      <div class="notebook" id="typedtext">

        @for (product of products; track product.id) {
          <div class="row-item" >
            
            <span (click)="handleClick($event)" [ngClass]="{'strike': product.status != 'to_buy'}">{{$index + 1}}. <span id="product-{{product.id}}">{{product.name}}</span></span>

            <div class="menu">
              <svg (click)="removeFromList(product.id)" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 456 511.82">
                <path fill="#FD3B3B" d="M48.42 140.13h361.99c17.36 0 29.82 9.78 28.08 28.17l-30.73 317.1c-1.23 13.36-8.99 26.42-25.3 26.42H76.34c-13.63-.73-23.74-9.75-25.09-24.14L20.79 168.99c-1.74-18.38 9.75-28.86 27.63-28.86zM24.49 38.15h136.47V28.1c0-15.94 10.2-28.1 27.02-28.1h81.28c17.3 0 27.65 11.77 27.65 28.01v10.14h138.66c.57 0 1.11.07 1.68.13 10.23.93 18.15 9.02 18.69 19.22.03.79.06 1.39.06 2.17v42.76c0 5.99-4.73 10.89-10.62 11.19-.54 0-1.09.03-1.63.03H11.22c-5.92 0-10.77-4.6-11.19-10.38 0-.72-.03-1.47-.03-2.23v-39.5c0-10.93 4.21-20.71 16.82-23.02 2.53-.45 5.09-.37 7.67-.37zm83.78 208.38c-.51-10.17 8.21-18.83 19.53-19.31 11.31-.49 20.94 7.4 21.45 17.57l8.7 160.62c.51 10.18-8.22 18.84-19.53 19.32-11.32.48-20.94-7.4-21.46-17.57l-8.69-160.63zm201.7-1.74c.51-10.17 10.14-18.06 21.45-17.57 11.32.48 20.04 9.14 19.53 19.31l-8.66 160.63c-.52 10.17-10.14 18.05-21.46 17.57-11.31-.48-20.04-9.14-19.53-19.32l8.67-160.62zm-102.94.87c0-10.23 9.23-18.53 20.58-18.53 11.34 0 20.58 8.3 20.58 18.53v160.63c0 10.23-9.24 18.53-20.58 18.53-11.35 0-20.58-8.3-20.58-18.53V245.66z"/>
              </svg>
              <svg (click)="checkElement(product.id)" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 109.76" style="enable-background:new 0 0 122.88 109.76" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;fill:#01A601;}</style><g>
                <path class="st0" d="M0,52.88l22.68-0.3c8.76,5.05,16.6,11.59,23.35,19.86C63.49,43.49,83.55,19.77,105.6,0h17.28 C92.05,34.25,66.89,70.92,46.77,109.76C36.01,86.69,20.96,67.27,0,52.88L0,52.88z"/></g>
              </svg>
            </div>

          </div>
        }

        <p>{{userInput}}</p>
        
      </div>`,
  styleUrl: './user-product-list.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UserProductListComponent implements OnChanges {
  myDiv = {} as HTMLElement;
  @Input() list: ProductList = {} as ProductList;
  @Input() id: string = '0';
  products: Product[] = [];
  userInput = '';

  constructor(private productService: ProductService,
    private elementRef: ElementRef) { }

  ngOnInit() {
    this.productService.currentProduct.subscribe((product) => {
      if (this.products.map( p => p.id ).includes(product.id)) {
        this.notifyFoundItem(product.id);
      } else {
        product.status = 'to_buy';
        this.products.push(product);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.products = changes['list'].currentValue.products;
  }

  notifyFoundItem(id: number) {
    let product = document.getElementById(`product-${id}`)
    product?.classList.add('shake-text');
    setTimeout( () => {
      product?.classList.remove('shake-text');
    }, 500)
  }

  handleClick(event: Event) {
    document.querySelectorAll(".menu").forEach( (e) => e.classList.remove('show'));
    let element = event.target as HTMLElement;
    element.parentElement?.parentElement?.querySelector(".menu")?.classList.toggle('show');
  }

  removeFromList(id: number) {
    this.products = this.products.filter(product => product.id != id);
    if (this.id !== '0') {
      this.removeAssociation(id);
    }
  }

  removeAssociation(id: number) {
    this.productService.removeProductFromList(this.id, id.toString())
      .subscribe({
        next: (data) => console.log(data),
        error: (error) => console.log(error)
      })
  }

  checkElement(id: number) {
    let product = this.products.find((p) => p.id == id);
    if (product && this.id !== '0') {
      product.status = product?.status == 'to_buy' ? 'bought' : 'to_buy';
      this.productService.updateStatus(this.id, id.toString())
      .subscribe({
        next: (data) => console.log('upated', data),
        error: () => console.log('error')
      })
    }
  }

}
