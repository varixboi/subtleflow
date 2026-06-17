import { Component } from '@angular/core';

import { Product } from '../../models/product/Product';
import product_info from "../../../assets/data/products.json"

import productImages from "../../../assets/data/productImages.json"

@Component({
  selector: 'app-catalog',
  imports: [],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {
  products: Product[] = product_info;

  selectedProduct!: Product;
  selectedColor!: string;

  productImages = productImages;
  currentImage = 0;

  constructor(){
    //initialize selected product
    if(this.products.length > 0){
      this.selectedProduct = this.products[0];
      this.selectedColor = this.selectedProduct.colors[0];
    }

    console.log(this.productImages);
  }

  changeSelectedProduct(product: Product){
    this.selectedProduct = product;
    this.selectedColor = this.selectedProduct.colors[0];
    console.log("Product changed to: ", this.selectedProduct,"-",this.selectedColor);
  }

  changeSelectedColor(color: string){
    this.selectedColor = color;
    console.log("Color changed to: ", this.selectedColor);
  }

  changeImage(){
    if(this.currentImage === productImages.length-1){
      this.currentImage = 0;
    }
    else{
      this.currentImage+=1;
    }
  }
}
