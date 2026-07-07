import { Component, EventEmitter, Output } from '@angular/core';

import frontPrint from "../../../assets/data/front.json"
import type { FrontPrint } from '../../models/product/FrontPrint';

import backPrint from "../../../assets/data/back.json"
import type { BackPrint } from '../../models/product/BackPrint';
import { previewDesign } from '../../models/design/previewDesign';

@Component({
  selector: 'app-design-input',
  imports: [],
  templateUrl: './design-input.html',
  styleUrl: './design-input.css',
})
export class DesignInput {

  MOQ = 20;
  BULK =200;

  frontOptions: FrontPrint[] = frontPrint;
  selectedFront!: FrontPrint;

  backOptions: BackPrint[] = backPrint;
  selectedBack!: BackPrint;

  printCost!: number;

  frontImage?: File;
  backImage?: File;

  frontPreview = "";
  backPreview = "";

  @Output() designSaved = new EventEmitter<previewDesign>();

    constructor(){  
        this.selectedFront = this.frontOptions[1];
        this.selectedBack = this.backOptions[1];
  
        this.calculatePrintCost();
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

    selectFrontImage(event: Event){
      const input = event.target as HTMLInputElement;

      if(input.files?.length){
        this.frontImage = input.files[0];
        this.frontPreview = URL.createObjectURL(this.frontImage);
      }
    }

    selectBackImage(event: Event){
      const input = event.target as HTMLInputElement;
      
      if(input.files?.length){
        this.backImage = input.files[0];
        console.log(this.backImage);
        this.backPreview = URL.createObjectURL(this.backImage);
      }
    }

  savePrintImages() {

      if (this.selectedFront.id !== "NONE" && this.frontPreview === "") {
          alert("Please upload front print.");
          return;
      }

      if (this.selectedBack.id !== "NONE" && this.backPreview === "") {
          alert("Please upload back print.");
          return;
      }

      alert("prints r uploaded")

      const design: previewDesign = {
          name: "",
          frontSize: this.selectedFront.name,
          frontPreview: this.frontPreview,
          backSize: this.selectedBack.name,
          backPreview: this.backPreview,
          price: this.printCost
      };

      this.designSaved.emit(design);
  }
}
