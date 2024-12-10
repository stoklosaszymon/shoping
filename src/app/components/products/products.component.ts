import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatBottomSheetModule, MatBottomSheetRef, MatBottomSheet } from '@angular/material/bottom-sheet';
import { ProductFormComponent } from '../editProductForm/product-form.component';
import { Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MatMenuModule,
    MatIconModule,
    FormsModule,
    MatBottomSheetModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnChanges {

  @Input() keyword: string = '';
  products: Product[] = []
  selected: number = 0;
  loaded = false;
  private keyHoldTimeout: any;
  private holdTime = 1000;
  @ViewChild('keywordRef') keywordRef: any;
  isDesktop = false;
  keyboardEvents: Subscription[] = [];

  constructor(private productService: ProductService,
    private deviceService: DeviceDetectorService,
    private bottomSheet: MatBottomSheet) {
    this.isDesktop = deviceService.isDesktop();

  }

  onKeyPressed(event: KeyboardEvent) {
    this.showKeyword();
    if (this.isLetterOrSpace(event) && this.deviceService.isDesktop()) {
      this.keyword += event.key;
      this.products = this.filterProductsByKeyword();
    }
  }

  OnBackspacePressed() {
    if (!this.keyHoldTimeout && this.deviceService.isDesktop()) {
      this.keyword = this.keyword.slice(0, -1);
      if (this.keyword.length == 0) {
        this.getProducts();
      }

      this.keyHoldTimeout = setTimeout(() => {
        this.clearKeyword();
      }, this.holdTime);
    }
  }

  onEnterPressed() {
    if (this.products.length === 1) {
      this.productService.selectProduct(this.products[0]);
      this.clearKeyword();
    }

    if (this.products.length === 0) {
      this.createNewProduct();
    }
  }

  onBackspaceUp() {
    if (this.keyHoldTimeout) {
      clearTimeout(this.keyHoldTimeout);
      this.keyHoldTimeout = null;
    }
  }

  ngOnInit() {
    this.getProducts();
    this.setupKeyboardEvents();

  }

  setupKeyboardEvents() {
    this.keyboardEvents = [];
    this.keyboardEvents.push(
      fromEvent(document, 'keyup').subscribe({
        next: (event) => {
          this.onKeyPressed(event as KeyboardEvent)
        }
      })
    )


    this.keyboardEvents.push(
      fromEvent(document, 'keydown').subscribe({
        next: (event: Event) => {
          if ((event as KeyboardEvent).code == 'Backspace') {
            this.OnBackspacePressed()
          }
        }
      })
    )


    this.keyboardEvents.push(
      fromEvent(document, 'keyup').subscribe({
        next: (event: Event) => {
          switch ((event as KeyboardEvent).code) {
            case 'Enter':
              this.onEnterPressed()
              break;
            case 'Backspace':
              this.onBackspaceUp()
              break;
          }
        }
      })
    )
  }

  unsubscribeEvents() {
    for (let sub of this.keyboardEvents) {
      sub.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    let currentKeyword = changes['keyword'].currentValue;
    if (currentKeyword) {
      this.products = this.filterProductsByKeyword();
    }

    if (this.keyword == '') {
      this.clearKeyword();
    }
  }

  selectProduct(product: Product) {
    this.productService.selectProduct(product);
    this.clearKeyword();
  }

  getProducts(category = '') {
    this.productService.getProducts(category)
      .subscribe({
        next: (data: Product[]) => { this.products = data },
        error: (error) => console.log(error),
        complete: () => this.loaded = true
      })
  }

  clearKeyword() {
    this.keyword = '';
    this.getProducts();
  }

  createNewProduct() {
    this.productService.createNewProduct(this.keyword).subscribe({
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

  onDelete() {
    this.productService.deleteProduct(this.selected).subscribe({
      next: (resp) => {
        this.clearKeyword();
      },
      error: (error) => console.log(error)
    })
  }

  onEdit() {
    this.bottomSheet.open(ProductFormComponent, {
        data: { id: this.selected }
    });
    this.bottomSheet._openedBottomSheetRef?.afterDismissed().subscribe(() => {
      this.setupKeyboardEvents();
      this.getProducts();
    });
    this.unsubscribeEvents();
  }

  showKeyword() {
    if (this.isDesktop) {
      this.keywordRef.nativeElement.classList.add("show");
      setTimeout(() => {
        this.keywordRef.nativeElement.classList.remove("show");
      }, 1000);
    }
  }

  isLetterOrSpace(event: KeyboardEvent) {
    return event.code == `Key${event.key.toUpperCase()}` || event.code == 'Space';
  }

  filterProductsByKeyword() {
    return this.products.filter(product => product.name.toLowerCase().startsWith(this.keyword.toLowerCase()));
  }

  ngOnDestroy() {
    this.unsubscribeEvents();
  }

}
