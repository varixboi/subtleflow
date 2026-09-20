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

  public activeImage: string = '';
  public allImages: string[] = [];
  
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      const rawData = (retailData as any).default || retailData;
      if (Array.isArray(rawData)) {
        this.product = rawData.find((p: RetailProduct) => p.id === productId);
      }
    }

    if(this.product) {
      // 2. Combine the thumbnail (at the front) with the rest of the images
      const combined = [this.product.thumbnail, ...(this.product.images || [])];
      
      // 3. Remove any duplicates (in case thumbnail is already in the images list)
      this.allImages = [...new Set(combined)];
      
      // 4. Set the first image (which is now the thumbnail) as active
      this.activeImage = this.allImages[0];
    }
  }

  changeImage(imageUrl: string) {
    this.activeImage = imageUrl;
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
// --- WHATSAPP ENQUIRY ---
// --- WHATSAPP ENQUIRY ---
  sendWhatsAppEnquiry() {
    if (this.product) {
      // Intelligently handle the color text based on what they clicked (or didn't click)
      const colorText = this.selectedColor 
        ? `(Color: ${this.selectedColor})` 
        : this.product.is_master_set 
          ? `(Master Set)` 
          : `(Color: To be discussed)`;

      // Added the Product ID right next to the Product Name
      const message = `Hi, I am interested in ordering:\n\n*${this.product.name}* (${this.product.id})\n${colorText}\nPrice: ₹${this.product.set_price} per set.\n\nCould you share the next steps?`;
      
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${this.businessWhatsAppNumber}?text=${encodedMessage}`, '_blank');
    }
  }
}