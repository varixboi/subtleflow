import { Component, Provider } from '@angular/core';
import product_info from "../../../assets/data/products.json"
import { Product } from '../../models/product/Product';
import { ProductSelector } from '../../shared/product-selector/product-selector';
import { ColorSelector } from '../../shared/color-selector/color-selector';

import frontPrint from "../../../assets/data/front.json"
import type { FrontPrint } from '../../models/product/FrontPrint';

import backPrint from "../../../assets/data/back.json"
import type { BackPrint } from '../../models/product/BackPrint';

import colorMap from "../../../assets/data/colors.json"

import { Modal } from '../../shared/modal/modal';
import { DesignSelector } from '../../shared/design-selector/design-selector';
import { DesignInput } from '../../shared/design-input/design-input';

@Component({
  selector: 'app-create-order',
  imports: [ProductSelector, ColorSelector, Modal, DesignInput],
  templateUrl: './create-order.html',
  styleUrl: './create-order.css',
})
export class CreateOrder {

  MOQ = 20;
  BULK =200;

   //save imported json into variable
  products: Product[] = product_info;

  selectedProduct!: Product;
  selectedColor!: string;

  colors: Record<string, string> = colorMap;

  frontOptions: FrontPrint[] = frontPrint;
  selectedFront!: FrontPrint;

  backOptions: BackPrint[] = backPrint;
  selectedBack!: BackPrint;

  // printCost!: number;
  sizeQty: Record<string,number> = {};
  
  copyQuoteButtonText: string = "Copy Quote";

  //above all are copied from rate-estimator
  //below values are unique to place-order

  customerName = "";
  customerPhone = "";

  designId = "";

  showModal = false;
  previewImage = false;

  constructor(){
    console.log(this.products[1].display_name);
    
    //initialize selected product
    if(this.products.length > 0){
      this.selectedProduct = this.products[0];
      this.selectedColor = this.selectedProduct.colors[0];
      console.log(this.selectedProduct, this.selectedColor)

      this.selectedFront = this.frontOptions[1];
      this.selectedBack = this.backOptions[1];

      // this.calculatePrintCost();
    }
  }

  //code unique to place-order from here on out

  changeSelectedDesign(designName: string){
    this.designId = designName;
  }


  //unique code ends here

  // below code is copied from rate-estimator
  changeSelectedProduct(product: Product){
    this.selectedProduct = product;
    this.selectedColor = this.selectedProduct.colors[0];
    console.log("Product changed to: ", this.selectedProduct,"-",this.selectedColor);
  }

  changeSelectedColor(color: string){
    this.selectedColor = color;
    console.log("Color changed to: ", this.selectedColor);
  }

  changeSelectedFront(front: FrontPrint){
    this.selectedFront = front;
    // this.calculatePrintCost();

  }
  
  changeSelectedBack(back: BackPrint){
    this.selectedBack = back;
    // this.calculatePrintCost();
  }

  get printCost(): number{
    if(this.selectedBack.id==="NONE"){
      if(this.totalQty<this.MOQ){
        return this.selectedFront.price_sample;
      }
      else if(this.totalQty>this.BULK){
        return this.selectedFront.price_bulk;
      }
      else{
        return this.selectedFront.price;
      }
    }
    else{
      if(this.totalQty<this.MOQ){
        return this.selectedBack.price_sample + this.selectedFront.addonPrice;
      }
      else if(this.totalQty>this.BULK){
        return this.selectedBack.price_bulk + this.selectedFront.addonPrice;
      }
      else{
        return this.selectedBack.price + this.selectedFront.addonPrice;
      }
    }
  }

  updateQty(size: string ,event: Event){
    const value = (event.target as HTMLInputElement).value;
    this.sizeQty[size] = Number(value)
    console.log(size,":",value)
  }



  get totalQty():number {
    return Object.values(this.sizeQty).reduce((sum,val) => sum + (val || 0), 0)
  }

  get unitPrice():number{
    if(this.totalQty<20){
      return this.selectedProduct.sample_price;
    }
    else{
      return this.selectedProduct.price;
    }
  }

  get tshirtTotal():number{
    return this.totalQty*this.unitPrice
  }

  get printTotal():number{
    return this.printCost*this.totalQty;
  }

  get ppCost(): number{
    return this.unitPrice+this.printCost
  }

  get subTotal():number[]{
    return [this.tshirtTotal+this.printTotal,
            (this.tshirtTotal+this.printTotal)*0.05,
            (this.tshirtTotal+this.printTotal) *1.05
    ];
  }

  copyQuote(element: HTMLElement){
    navigator.clipboard.writeText(element.innerText);
    this.copyQuoteButtonText="Copied!!"
    
    setTimeout(() => {
      this.copyQuoteButtonText="Copy Quote"
    }, 1000);
  }
}
