import { Component, Provider, signal } from '@angular/core';
import product_info from "../../../assets/b2c-data/products.json"
import { Product } from '../../models/product/Product';
import { ProductSelector } from '../../shared/product-selector/product-selector';
import { ColorSelector } from '../../shared/color-selector/color-selector';

import frontPrint from "../../../assets/b2c-data/front.json"
import type { FrontPrint } from '../../models/product/FrontPrint';

import backPrint from "../../../assets/b2c-data/back.json"
import type { BackPrint } from '../../models/product/BackPrint';

import colorMap from "../../../assets/data/colors.json"

import { Signal } from '@angular/core';


@Component({
  selector: 'app-b2c-estimator',
  imports: [ProductSelector, ColorSelector],
  templateUrl: './b2c-estimator.html',
  styleUrl: './b2c-estimator.css',
})
export class B2cEstimator {

    //save imported json into variable
  products: Product[] = product_info;

  selectedProduct!: Product;
  selectedColor!: string;

  colors: Record<string, string> = colorMap;

  frontOptions: FrontPrint[] = frontPrint;
  selectedFront!: FrontPrint;

  backOptions: BackPrint[] = backPrint;
  selectedBack!: BackPrint;

  printCost!: number;
  sizeQty: Record<string,number> = {};
  
  copyQuoteButtonText: string = "Copy Quote";

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
    console.log("Product changed to: ", this.selectedProduct,"-",this.selectedColor);
  }

  changeSelectedColor(color: string){
    this.selectedColor = color;
    console.log("Color changed to: ", this.selectedColor);
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
      this.printCost= this.selectedFront.price;
    }
    else{
      this.printCost= this.selectedBack.price + this.selectedFront.addonPrice;
    }
  }

  // updateQty(size: string ,event: Event){
  //   const value = (event.target as HTMLInputElement).value;
  //   this.sizeQty[size] = Number(value)
  //   console.log(size,":",value)
  // }

  // get totalQty():number {
  //   return Object.values(this.sizeQty).reduce((sum,val) => sum + (val || 0), 0)
  // }

  totalQty = signal(0);

  updateQuantity(value: number){
    this.totalQty.set(value);
  }

  get unitPrice():number{
    if(this.totalQty()<10){
      return this.selectedProduct.sample_price;
    }
    else{
      return this.selectedProduct.price;
    }
  }

  get tshirtTotal():number{
    return this.totalQty()*this.unitPrice
  }

  get printTotal():number{
    return this.printCost*this.totalQty();
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

  copyQuote(){
    const quote = `
    Hello, I need ${this.totalQty()} PCS of ${this.selectedProduct.product_name} (${this.selectedColor})
    Front: ${this.selectedFront.name}
    Back: ${this.selectedBack.name}
    Cost per piece: ₹${this.ppCost}
    SUBTOTAL: ₹${this.subTotal[2]}/- + SHIPPING AS PER ACTUAL
    `;

    navigator.clipboard.writeText(quote);
    this.copyQuoteButtonText="Copied!!"
    
    setTimeout(() => {
      console.log("timeout fired!!")
      this.copyQuoteButtonText="Copy Quote"
      console.log(this.copyQuoteButtonText);
    }, 1000);
  }

  whatsappQuote(){
    const quote = `
Hello, I need ${this.totalQty()} PCS of ${this.selectedProduct.product_name} (${this.selectedColor})
Front Print: ${this.selectedFront.name}
Back Print: ${this.selectedBack.name}
Cost per piece: ₹${this.ppCost}
SUBTOTAL: ₹${this.subTotal[2]}/- + SHIPPING AS PER ACTUAL
`;

    window.open(
      `https://wa.me/918904467234?text=${encodeURIComponent(quote)}`
    )
  };

  sliderBackground() {
    const percent = (this.totalQty() / 1000) * 100;

    return `linear-gradient(
        to right,
        #C9A227 0%,
        #C9A227 ${percent}%,
        #f8fafc ${percent}%,
        #f8fafc 100%
    )`;
  }
}

