import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import retailData from '../../../assets/retailers/retailers.json';
import sizeChartData from '../../../assets/retailers/size-charts.json';
import { RetailProduct } from '../../models/retail/RetailProduct';

@Component({
  selector: 'app-retail-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './retail-product.html',
  styleUrls: ['./retail-product.css']
})
export class RetailProductComponent implements OnInit {
  public product: RetailProduct | undefined;
  public selectedColor: string | null = null;
  public sizeCharts: any = (sizeChartData as any).default || sizeChartData;
  
  public businessWhatsAppNumber = '918904467234'; // Replace with your number

  public activeImage: { label: string, url: string } = { label: '', url: '' };
  public allImages: { label: string, url: string }[] = [];

  // Add these variables for the swipe logic
  public touchStartX = 0;
  public touchEndX = 0;
  
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      window.scrollTo(0, 0);

      const productId = params.get('id');
      const foundProduct = retailData.find((p: any) => p.id === productId);
      
      if (foundProduct) {
        this.product = foundProduct as any; // (Or as RetailProduct)
        this.allImages = this.product?.images || [];
        
        // Always show the first image in the array when opening the page
        if (this.allImages.length > 0) {
          this.activeImage = this.allImages[0];
        }
      }
    });
  }

  changeImage(image: { label: string, url: string }) {
    this.activeImage = image;
  }
  
  selectColor(color: string) {
    this.selectedColor = color;
  }

  // --- SIZE CHART DYNAMIC HELPERS ---
  getSizes(chartId: string): string[] {
    if (!this.sizeCharts || !this.sizeCharts[chartId]) return [];
    return Object.keys(this.sizeCharts[chartId]);
  }

  getMeasurements(chartId: string): string[] {
    if (!this.sizeCharts || !this.sizeCharts[chartId]) return [];
    const firstSize = this.getSizes(chartId)[0];
    return Object.keys(this.sizeCharts[chartId][firstSize]);
  }

  // --- FINANCIAL CALCULATORS ---
  getCostPerPiece(): number {
    return this.product ? (this.product.set_price / this.product.set_qty) : 0;
  }

  getRetailValue(): number {
    return this.product ? (this.product.suggested_mrp * this.product.set_qty) : 0;
  }

  getProfitMargin(): number {
    if (!this.product) return 0;
    return this.getRetailValue() - this.product.set_price;
  }

// --- WHATSAPP ENQUIRY ---
  // sendWhatsAppEnquiry() {
  //   if (this.product) {
  //     // Intelligently handle the color text based on what they clicked (or didn't click)
  //     const colorText = this.selectedColor 
  //       ? `(Color: ${this.selectedColor})` 
  //       : this.product.is_master_set 
  //         ? `(Master Set)` 
  //         : `(Color: To be discussed)`;

  //     // Added the Product ID right next to the Product Name
  //     const message = `Hi, I am interested in ordering:\n\n*${this.product.name}* (${this.product.id})\n${colorText}\nPrice: ₹${this.product.set_price} per set.\n\nCould you share the next steps?`;
      
  //     const encodedMessage = encodeURIComponent(message);
  //     window.open(`https://wa.me/${this.businessWhatsAppNumber}?text=${encodedMessage}`, '_blank');
  //   }
  // }

  // --- WHATSAPP ENQUIRY ---
  sendWhatsAppEnquiry() {
    if (this.product) {
      // 1. Grab the exact URL the user is currently on
      const productLink = window.location.href;

      // Intelligently handle the color text based on what they clicked (or didn't click)
      const colorText = this.selectedColor 
        ? `(Color: ${this.selectedColor})` 
        : this.product.is_master_set 
          ? `(Master Set)` 
          : `(Color: To be discussed)`;

      // 2. Added the link at the bottom and fixed the bold markdown for the product name
      const message = `Hi, I am interested in ordering:\n\n*${this.product.name}* (${this.product.id})\n${colorText}\nPrice: ₹${this.product.set_price} per set.\n\nView Product: ${productLink}\n\nCould you share the next steps?`;
      
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${this.businessWhatsAppNumber}?text=${encodedMessage}`, '_blank');
    }
  }

  // 1. Get the current image number
  get currentIndex(): number {
    return this.allImages.findIndex(img => img.url === this.activeImage.url);
  }

  // 2. Next & Previous functions
  nextImage() {
    if (this.allImages.length <= 1) return;
    const nextIdx = (this.currentIndex + 1) % this.allImages.length;
    this.activeImage = this.allImages[nextIdx];
  }

  prevImage() {
    if (this.allImages.length <= 1) return;
    const prevIdx = (this.currentIndex - 1 + this.allImages.length) % this.allImages.length;
    this.activeImage = this.allImages[prevIdx];
  }

  // 3. Touch event handlers for swiping
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const swipeThreshold = 50; // Requires a 50px swipe to trigger
    if (this.touchEndX < this.touchStartX - swipeThreshold) {
      this.nextImage(); // Swiped left
    }
    if (this.touchEndX > this.touchStartX + swipeThreshold) {
      this.prevImage(); // Swiped right
    }
  }
}