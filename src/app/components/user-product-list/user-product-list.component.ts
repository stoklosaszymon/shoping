import { Component, Input } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductList } from '../../models/product';

@Component({
  selector: 'app-user-product-list',
  standalone: true,
  imports: [],
  template: '<div class="notebook" id="typedtext"></div>',
  styleUrl: './user-product-list.component.scss',
})
export class UserProductListComponent {
  myDiv = {} as HTMLElement;
  @Input() list: ProductList = { name: '', products: [] } as ProductList;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.currentProduct.subscribe((product) => {
      this.aText.push(product.name);
  this.typewriter();
    });
  }

  aText = [``];
  iSpeed = 100; // time delay of print out
  iIndex = 0; // start printing array at this posision
  iArrLength = this.aText[0].length; // the length of the text array
  iScrollAt = 20; // start scrolling up at this many lines

  iTextPos = 0; // initialise text position
  sContents = ''; // initialise contents variable
  iRow: any; // initialise current row

  ngAfterViewInit() {
    this.myDiv = <HTMLElement>document.getElementById('typedtext');
  }

  ngOnChanges() {
    this.aText[0] = this.list.name;
    this.aText = [
      ...this.aText,
      ...this.list.products.map((p) => p.name.toString()),
    ];
    this.typewriter();
  }

  typewriter() {
    let sContents = '';
    this.iRow = Math.max(0, this.iIndex - this.iScrollAt);
    while (this.iRow < this.iIndex) {
      sContents += `<p>` + this.aText[this.iRow++] + '</p>';
    }
    this.myDiv.innerHTML =
      sContents + this.aText[this.iIndex].substring(0, this.iTextPos) + '_';
    if (this.iTextPos++ == this.iArrLength) {
      this.iTextPos = 0;
      this.iIndex++;
      if (this.iIndex != this.aText.length) {
        this.iArrLength = this.aText[this.iIndex].length;
        setTimeout(() => this.typewriter(), 500);
      }
    } else {
      setTimeout(() => this.typewriter(), this.iSpeed);
    }
  }
}
