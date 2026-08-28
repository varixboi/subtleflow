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
import { MockupGenerator } from '../../shared/mockup-generator/mockup-generator';
import { Catalog } from '../catalog/catalog';

import { Signal } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-b2c-estimator',
  imports: [ProductSelector, ColorSelector, Modal, ShippingCalculator, MockupGenerator, Catalog, RouterLink],
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

  activeModal: 'shipping' | 'catalog' | 'mockup' | null = null;

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

      this.quoteButtonDisabled.set(true);
    }
  }

  changeSelectedColor(color: string){
    this.selectedColor = color;
    console.log("Color changed to: ", this.selectedColor);
  }

  changeSelectedFront(front: FrontPrint){
    if(this.selectedBack.type === 'NONE' && front.type==='NONE'){
      alert("Both front & back cannot be empty");
    }

    this.selectedFront = front;
    this.calculatePrintCost();
  }
  
  changeSelectedBack(back: BackPrint){
    if(this.selectedFront.type === 'NONE'  && back.type==='NONE'){
      alert("Both front & back cannot be empty");
    }

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

  quoteButtonDisabled = signal(true);

  totalQty = signal(20);

  updateQuantity(value: number){
    this.totalQty.set(value);

    //should be cleared on change to product OR quantity
    if(this.shippingCalculated===true){
      this.shippingCalculated=false;
      this.shippingText = 'QUANTITY UPDATED! PLEASE RECALCULATE TO VIEW QUOTE'

      this.quoteButtonDisabled.set(true);
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
    let num = this.unitWeight*this.totalQty();

    //converts to only 2 decimals after decimal point
    let res: string = num.toFixed(2);

    //converts back to number
    num = Number(res);
    return num;
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
    if(this.shippingCost===0){
    return `${this.totalQty()} PCS of ${this.selectedProduct.product_name} (${this.selectedColor})
Front: ${this.selectedFront.name}
Back: ${this.selectedBack.name}
⸻⸻⸻⸻⸻⸻⸻⸻
PRICE PER PIECE: ₹${this.ppCost}
⸻⸻⸻⸻⸻⸻⸻⸻
Net Weight: ${this.weightTotal} KG | Shipping Method: ${this.selectedShipping.courier_name}
Tshirt total: ₹${this.subTotal[0]}
⸻⸻⸻⸻⸻⸻⸻⸻
TAXABLE: ₹${this.subTotal[0] + this.shippingCost}/- | GST: ₹${this.subTotal[1].toFixed(2)}/-
FINAL TOTAL: ₹${this.subTotal[2].toFixed(2)}/-

`;
    }
    else{
    return `${this.totalQty()} PCS of ${this.selectedProduct.product_name} (${this.selectedColor})
Front: ${this.selectedFront.name}
Back: ${this.selectedBack.name}
⸻⸻⸻⸻⸻⸻⸻⸻
PRICE PER PIECE: ₹${this.unitPrice}
⸻⸻⸻⸻⸻⸻⸻⸻
Net Weight: ${this.weightTotal} KG
Tshirt total: ₹${this.subTotal[0]} | Shipping cost: ₹${this.shippingCost}
Shipping Method: ${this.selectedShipping.courier_name} (${this.selectedShipping.delivery_in_days}-${this.selectedShipping.delivery_in_days+1} DAYS FROM DISPATCH)
⸻⸻⸻⸻⸻⸻⸻⸻
TAXABLE: ₹${this.subTotal[0] + this.shippingCost}/- | GST: ₹${this.subTotal[1].toFixed(2)}/-
FINAL TOTAL: ₹${this.subTotal[2].toFixed(2)}/-
`;
    }

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
  
  resetSelectedShipping(){
    this.selectedShipping = null;
    this.shippingCalculated=false;
    this.quoteButtonDisabled.set(true);
    this.shippingText= 'CALCULATE SHIPPING TO VIEW QUOTE'
    console.log("RESET shipping: ", this.selectedShipping);

  }

  closeSelectShippingModal(){
    if(this.selectedShipping===null){
      return
    }
    
    this.activeModal=null; 
    this.shippingCalculated=true;
    this.quoteButtonDisabled.set(false);
  }

  featureInProgressAlert(): void {
    alert('Feature in progress!');
  }
}