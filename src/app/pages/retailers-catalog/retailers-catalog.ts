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

  // OR if you load it inside ngOnInit():
  ngOnInit() {
    this.products = retailData.filter((item: any) => item.status !== 'hide');
  }

}