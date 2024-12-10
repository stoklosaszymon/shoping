import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product, ProductList } from '../../models/product';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-product-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  template: `
      <div class="notebook" id="typedtext">

        @for (product of products; track product.id) {
          <div class="row-item" >
            
            <span (click)="onClickProduct($event)" [ngClass]="{'strike': product.status != 'to_buy'}">
                    {{$index + 1}}.
              <span id="product-{{product.id}}">
                {{product.name}}
              </span>
              <span>
                {{getProductUnitAndQuantity(product)}}
              </span>
            </span>

            <div class="menu">
              <mat-icon (click)="incQuantity(product.id, product.quantity, product.unit)">add</mat-icon>
              <mat-icon (click)="decQuantity(product.id, product.quantity, product.unit)">remove</mat-icon>
              @if ( isEditMode ) {
                <mat-icon (click)="crossoutProduct(product.id)" style="color: green">check</mat-icon>
              }
              <mat-icon (click)="removeProductFromList(product.id)" style="color: red">delete_forever</mat-icon>
            </div>

          </div>
        }
        @if ( isMobile ) {
          <input id="userInput" class="userInput" [value]="userInput" (input)="updateUserInput($event)" placeholder="Type here..."/>
        }
        
      </div>`,
  styleUrl: './user-product-list.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UserProductListComponent implements OnChanges {
  @Input() list: ProductList = {} as ProductList;
  @Input() id: string = '0';
  @Input() userInput: string = '';
  @Output() userInputChange = new EventEmitter<string>();
  @Output() listChange = new EventEmitter<Product[]>();
  @Input() isEditMode = false;

  isMobile = false;
  products: Product[] = [];
  myDiv = {} as HTMLElement;

  constructor(private productService: ProductService,
    private elementRef: ElementRef,
    private deviceService: DeviceDetectorService) {
    this.isMobile = deviceService.isMobile()
  }

  updateUserInput(event: Event): void {
    let input = event.target as HTMLInputElement;
    this.userInput = input.value;
    this.userInputChange.emit(this.userInput);
  }

  ngOnInit() {
    this.productService.currentProduct.subscribe((product) => {
      if (this.products.map(p => p.id).includes(product.id)) {
        this.shakeItem(product.id);
      } else {
        product.status = 'to_buy';
        product.quantity = 1;
        this.products.push(product);
        this.userInput = '';
      }
    });
  }

  ngAfterViewInit() {
    this.changeHeightOnKeyboardMobile();
  }

  changeHeightOnKeyboardMobile() {
    document.querySelectorAll('input').forEach((input) => {
      input.addEventListener('focus', () => {

      });
      input.addEventListener('blur', () => {

      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['list']) {
      this.products = changes['list'].currentValue.products;
    }
  }

  shakeItem(id: number) {
    let product = document.getElementById(`product-${id}`)
    product?.classList.add('shake-text');
    setTimeout(() => {
      product?.classList.remove('shake-text');
    }, 500)
  }

  onClickProduct(event: Event) {
    document.querySelectorAll(".menu").forEach((e) => e.classList.remove('show'));
    let element = event.target as HTMLElement;
    element.parentElement?.parentElement?.querySelector(".menu")?.classList.toggle('show');
  }

  removeProductFromList(id: number) {
    this.products = this.products.filter(product => product.id != id);
    if (this.id !== '0') {
      this.removeAssociation(id);
    }
  }

  removeAssociation(id: number) {
    this.productService.removeProductFromList(this.id, id.toString())
      .subscribe({
        next: (data) => {
          console.log(data)
          this.listChange.emit(this.products);
        },
        error: (error) => console.log(error)
      })
  }

  crossoutProduct(id: number) {
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

  getProductUnitAndQuantity(product: Product) {
    if (product.unit == 'piece') {
      return product.quantity + 'x';
    }
    return product.quantity + product.unit;
  }

  getValueByUnit(unit: string) {
    switch (unit) {
      case 'piece':
        return 1;
      case 'kg':
        return 0.25;
      case 'g':
        return 100;
    }
    return 1;
  }

  incQuantity(productId: number, quantity: number, unit: string) {
    if (quantity > 0) {
      let value = this.getValueByUnit(unit);
      this.isEditMode ? this.updateQuantityCall(productId, value) : this.updateQuantityValue(productId, value);
    }
  }

  decQuantity(productId: number, quantity: number, unit: string) {
    if (quantity > 1) {
      let value = this.getValueByUnit(unit);
      this.isEditMode ? this.updateQuantityCall(productId, -value) : this.updateQuantityValue(productId, -value);
    }
  }

  updateQuantityCall(productId: number, value: number) {
    this.productService.updateQuantity(this.id, productId, value)
      .subscribe({
        next: (data) => {
          this.updateQuantityValue(productId, value);
        },
        error: () => console.log('error inc')
      })
  }

  updateQuantityValue(productId: number, value: number) {
    let product = this.products.find(p => p.id == productId);
    if (product) {
      product.quantity += value
    }
  }
}
