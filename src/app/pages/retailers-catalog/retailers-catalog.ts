import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// 1. Import it as a standard variable (Notice the curly braces and no extension)
import retailData from '../../../assets/retailers/retailers.json';

// 2. Import your interface
import { RetailProduct } from '../../models/retail/RetailProduct';

@Component({
  selector: 'app-retailers-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './retailers-catalog.html',
  styleUrls: ['./retailers-catalog.css']
})
export class RetailersCatalog implements OnInit {
  
  // If you declare it directly as a class property:
  products = retailData.filter((item: any) => item.status !== 'hide');

  searchTerm: string = '';
  selectedCategory: string = '';

  // EDIT THIS TO CHANGE FILTER BUTTONS
  filterButtons: string[] = ['Oversized', 'Hoodies', 'Sweatshirt', "Tshirt"];

  ngOnInit() {
    this.products = retailData.filter((item: any) => item.status !== 'hide');
  }

  getCoverImage(product: any): string {
    if (!product.images || product.images.length === 0) return '';

    // 1. If thumbnail is blank, pick a random image
    if (!product.thumbnail || product.thumbnail.trim() === '') {
      const randomIndex = Math.floor(Math.random() * product.images.length);
      return product.images[randomIndex].url;
    }

    // 2. Otherwise, find the exact label match
    const cover = product.images.find((img: any) => img.label === product.thumbnail);
    
    // 3. Fallback to the first image if there's a typo in the label
    return cover ? cover.url : product.images[0].url;
  }

// 3. Update the search input function
  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    
    // Auto-deselect the filter button if they start typing
    if (this.searchTerm.trim() !== '') {
      this.selectedCategory = '';
    }
  }

  get filteredProducts() {
    // If nothing is searched or clicked, return all
    if (!this.searchTerm && !this.selectedCategory) return this.products;
    
    return this.products.filter((p: any) => {
      
      // === IF A BUTTON IS CLICKED ===
      if (this.selectedCategory) {
        const catLower = this.selectedCategory.toLowerCase();
        
        // 1. Check if it's in a 'categories' array (if you added one to JSON)
        const inCategoryArray = p.categories?.some((c: string) => c.toLowerCase() === catLower);
        
        // 2. Check if it's a single string 'category' (e.g., "category": "Oversized")
        const inCategoryString = p.category?.toLowerCase() === catLower;
        
        // 3. Fallback: Check if the button word is simply in the product name
        const inName = p.name?.toLowerCase().includes(catLower);
        
        return inCategoryArray || inCategoryString || inName;
      }
      
      // === IF THEY ARE TYPING IN THE SEARCH BAR ===
      const term = this.searchTerm.toLowerCase();
      const nameMatch = p.name?.toLowerCase().includes(term);
      const idMatch = p.id?.toLowerCase().includes(term);
      
      // Safely check categories array if they type
      const categoryMatch = p.categories 
        ? p.categories.some((c: string) => c.toLowerCase().includes(term))
        : false;
      
      return nameMatch || idMatch || categoryMatch;
    });
  }

  toggleCategory(category: string) {
    if (this.selectedCategory === category) {
      // If clicked twice, deselect it
      this.selectedCategory = '';
    } else {
      // Otherwise, select the new one and clear the text search
      this.selectedCategory = category;
      this.searchTerm = ''; 
    }
  }
}