import { Component } from '@angular/core';

import { Product } from '../../models/product/Product';
import product_info from "../../../assets/data/products.json"

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

  // productImages = productImages;
  currentImage = 0;
  productImages: any;

  constructor(){
    //initialize selected product
    if(this.products.length > 0){
      this.selectedProduct = this.products[0];
      this.selectedColor = this.selectedProduct.colors[0];
    }
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

  changeImage(event: MouseEvent){
    const imageWidth = (event.currentTarget as HTMLElement).clientWidth;

    if(event.offsetX < imageWidth/2){
      if(this.currentImage === 0){
        this.currentImage = this.selectedProduct.images.length-1;
      }
      else{
        this.currentImage-=1;
      }
    }
    else{
      if(this.currentImage === this.selectedProduct.images.length-1){
        this.currentImage = 0;
      }
      else{
        this.currentImage+=1;
      }
    }
  }

  get currentColor(): string{
    return this.selectedProduct.images[this.currentImage]
    .split('/')
    .pop()!
    .replace('.png','')
  }

}
