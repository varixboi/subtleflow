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

import { Modal } from '../../shared/modal/modal';
import { ShippingCalculator } from '../../shared/shipping-calculator/shipping-calculator';

import { Signal } from '@angular/core';


@Component({
  selector: 'app-b2c-estimator',
  imports: [ProductSelector, ColorSelector, Modal, ShippingCalculator],
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

  nextThreshold!: number;
  nextPpCost!: number;

  shippingCalculated:boolean = false;
  shippingText:string = 'CALCULATE SHIPPING TO VIEW QUOTE'
  selectedShipping: any = null;

  showModal:boolean = false;

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

    //should be cleared on change to product OR quantity
    if(this.shippingCalculated===true){
      this.shippingCalculated=false;
      this.shippingText = 'PRODUCT CHANGED! PLEASE RECALCULATE TO VIEW QUOTE'
    }
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
      this.printCost= this.selectedFront.addonPrice + this.selectedBack.price;

  }

  // updateQty(size: string ,event: Event){
  //   const value = (event.target as HTMLInputElement).value;
  //   this.sizeQty[size] = Number(value)
  //   console.log(size,":",value)
  // }

  // get totalQty():number {
  //   return Object.values(this.sizeQty).reduce((sum,val) => sum + (val || 0), 0)
  // }

  totalQty = signal(20);

  updateQuantity(value: number){
    this.totalQty.set(value);

    //should be cleared on change to product OR quantity
    if(this.shippingCalculated===true){
      this.shippingCalculated=false;
      this.shippingText = 'QUANTITY UPDATED! PLEASE RECALCULATE TO VIEW QUOTE'
    }
  }

  get unitPrice():number{ 
    const priceTiers = this.selectedProduct.b2c_price;

    const thresholds = Object.keys(priceTiers)
    .map(Number)
    .sort((a,b) => b - a);


    for(let i=0; i<thresholds.length; i++){
      const threshold = thresholds[i];

      if(this.totalQty()>=threshold){
        this.nextThreshold = thresholds[i-1];
        this.nextPpCost = priceTiers[this.nextThreshold];

        return priceTiers[threshold]
      }
    }

    return priceTiers[20];
  }

  get unitWeight():number{
    return this.selectedProduct.weight;
  }

  get weightTotal():number{
    return this.unitWeight*this.totalQty();
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

  get shippingCost(): number{
    // if(this.selectedShipping.updatedRate==null){
    //   return this.selectedShipping.rate;
    // }
    return this.selectedShipping.updatedRate;
  }



  get subTotal():number[]{
    return [this.tshirtTotal+this.printTotal,
            (this.tshirtTotal+this.printTotal+this.shippingCost)*0.05,
            (this.tshirtTotal+this.printTotal+this.shippingCost) *1.05
    ];
  }

  get Quote(){
    return `
${this.totalQty()} PCS of ${this.selectedProduct.product_name} (${this.selectedColor})
Front: ${this.selectedFront.name}
Back: ${this.selectedBack.name}
Cost per piece: ₹${this.ppCost}
SUBTOTAL: ₹${this.subTotal[2]}/- + SHIPPING AS PER ACTUAL
`;
  }

  copyQuote(){
    const quote = this.Quote;

    navigator.clipboard.writeText(quote);
    this.copyQuoteButtonText="Copied!!"
    
    setTimeout(() => {
      console.log("timeout fired!!")
      this.copyQuoteButtonText="Copy Quote"
      console.log(this.copyQuoteButtonText);
    }, 1000);
  }

  whatsappQuote(){
    const quote = this.Quote;

    window.open(
      `https://wa.me/918904467234?text=Hello,%20I%20Need%20${encodeURIComponent(quote)}`
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

  changeSelectedShipping(shippingOption: any){
    this.selectedShipping = shippingOption;
    console.log("Stored shipping: ", this.selectedShipping);
  }

  closeSelectShippingModal(){
    if(this.selectedShipping===null){
      return
    }
    
    this.showModal=false; 
    this.shippingCalculated=true;
  }
}

