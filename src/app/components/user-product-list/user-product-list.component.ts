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
            
            <span (click)="onClickProduct($event)" [ngClass]="{'strike': product.status != 'to_buy'}">{{$index + 1}}.<span id="product-{{product.id}}">{{product.name}}</span></span>

            <div class="menu">
              <mat-icon (click)="removeProductFromList(product.id)" style="color: red">delete_forever</mat-icon>
              <mat-icon (click)="crossoutProduct(product.id)" style="color: green">check</mat-icon>
            </div>

          </div>
        }
        @if ( isMobile ) {
          <input class="userInput" [value]="userInput" (input)="updateUserInput($event)" placeholder="Type here..."/>
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
      if (this.products.map( p => p.id ).includes(product.id)) {
        this.shakeItem(product.id);
      } else {
        product.status = 'to_buy';
        this.products.push(product);
        this.userInput = '';
      }
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
    setTimeout( () => {
      product?.classList.remove('shake-text');
    }, 500)
  }

  onClickProduct(event: Event) {
    document.querySelectorAll(".menu").forEach( (e) => e.classList.remove('show'));
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
        next: (data) => console.log(data),
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

}
