import { Component, Provider } from '@angular/core';
import product_info from "../../../assets/data/products.json"
import { Product } from '../../models/product/Product';

import frontPrint from "../../../assets/data/front.json"
import type { FrontPrint } from '../../models/product/FrontPrint';

import backPrint from "../../../assets/data/back.json"
import type { BackPrint } from '../../models/product/BackPrint';

@Component({
  selector: 'app-rate-estimator',
  imports: [],
  templateUrl: './rate-estimator.html',
  styleUrl: './rate-estimator.css',
})
export class RateEstimator {
  //save imported json into variable
  products: Product[] = product_info;

  selectedProduct!: Product;
  selectedColor!: string;

  frontOptions: FrontPrint[] = frontPrint;
  selectedFront!: FrontPrint;

  backOptions: BackPrint[] = backPrint;
  selectedBack!: BackPrint;

  ppCost!: number;
  sizeQty: Record<string,number> = {};

  constructor(){
    console.log(this.products[1].display_name);
    
    //initialize selected product
    if(this.products.length > 0){
      this.selectedProduct = this.products[0];
      this.selectedColor = this.selectedProduct.colors[0];
      console.log(this.selectedProduct, this.selectedColor)

      this.selectedFront = this.frontOptions[1];
      this.selectedBack = this.backOptions[1];

      this.calculatePrintCost();
    }
  }
  
  changeSelectedProduct(product: Product){
    this.selectedProduct = product;
    this.selectedColor = this.selectedProduct.colors[0];
    console.log("Product changed to: ", this.selectedProduct,"-",this.selectedColor)
  }

  changeSelectedColor(color: string){
    this.selectedColor = color;
    console.log("Color changed to: ", this.selectedColor)
  }

  changeSelectedFront(front: FrontPrint){
    this.selectedFront = front;
    this.calculatePrintCost();
  }
  
  changeSelectedBack(back: BackPrint){
    this.selectedBack = back;
    this.calculatePrintCost();
  }

  calculatePrintCost(){
    if(this.selectedBack.id==="NONE"){
      this.ppCost= this.selectedFront.price;
    }
    else{
      this.ppCost= this.selectedBack.price + this.selectedFront.addonPrice;
    }
  }

  updateQty(size: string ,event: Event){
    const value = (event.target as HTMLInputElement).value;
    this.sizeQty[size] = Number(value)
    console.log(size,":",value)
  }
}
