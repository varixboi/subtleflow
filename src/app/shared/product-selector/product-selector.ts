import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Component } from '@angular/core';
import { Product } from '../../models/product/Product';

@Component({
  selector: 'app-product-selector',
  imports: [],
  templateUrl: './product-selector.html',
  styleUrl: './product-selector.css',
})
export class ProductSelector {

  @Input() products!: Product[];

  @Input() selectedProduct!: Product;

  @Output() productChanged = new EventEmitter<Product>();
  
}
