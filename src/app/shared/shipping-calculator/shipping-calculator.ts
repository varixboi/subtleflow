import { Component, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { ShippingMethods } from '../../models/order/ShippingMethods';
import { ShippingService } from '../../services/shipping.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shipping-calculator',
  imports: [FormsModule],
  templateUrl: './shipping-calculator.html',
  styleUrl: './shipping-calculator.css',
})
export class ShippingCalculator {
  readonly ShippingMethods = ShippingMethods;

  // NEW: This is the megaphone that sends the final selection back to your Cart
  @Output() shippingSelected = new EventEmitter();

  selectedShippingMethod: ShippingMethods = ShippingMethods.COURIER;
  deliveryPincode: string = "";
  availableCouriers: any[] = [];
  selectedCourier: any = null;
  isLoading: boolean = false;
  errorMessage: string = "";

  constructor(private shippingService: ShippingService,
    private cdr: ChangeDetectorRef
  ){
    // const inputCourierPincode = document.getElementById('input-courier-pincode') as HTMLElement;
    // inputCourierPincode.addEventListener('blur', this.checkShippingRates);
    this.availableCouriers = []; 
  }

  // Runs when they switch between "Courier" and "Pickup"
  onMethodChange() {
    // this.selectedCourier = null; 
    
    if (this.selectedShippingMethod === ShippingMethods.PICKUP) {
      
      // Create a fake courier object for Pickup (Price is 0)
      this.selectedCourier = {
        courier_name: 'Self Pickup',
        rate: 0,
        estimated_delivery_date: 'Today'
      };
      
      // Instantly send this free option up to the Cart
      this.emitSelection();
    }
  }

  // Runs when they click "Submit"
  checkShippingRates() {
    if (!this.deliveryPincode || this.deliveryPincode.toString().length !== 6) {
      this.errorMessage = 'Please enter a valid 6-digit pincode';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.availableCouriers = [];

    // Ask the NestJS backend for the rates
    this.shippingService.getRates(this.deliveryPincode.toString()).subscribe({
      next: (rates) => {
        const today = new Date();
        today.setHours(0,0,0,0);

        console.log('Angular received: ', rates)
        this.availableCouriers = rates.map((courier:any) => {
          const estDate = new Date(courier.estimated_delivery_date);
          estDate.setHours(0,0,0,0);

          const diffInMs = estDate.getTime() - today.getTime();
          const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

          let updatedRate;
          
          if(courier.rate>=1000){
             updatedRate = courier.rate + 110
          }else if(courier.price>=300){
             updatedRate = courier.rate + 80
          }else{
             updatedRate = courier.rate + 50
          }

          return{
            ...courier,
            delivery_in_days: diffInDays > 0 ? diffInDays : 1,
            updatedRate
          }
        });

        
        // Auto-select the first courier in the list to save the user a click
        if (this.availableCouriers.length > 0) {
          this.selectedCourier = this.availableCouriers[0];
          this.emitSelection(); // Send the price up to the Cart
        } else {
          this.errorMessage = 'No delivery options found for this pincode.';
        }
        
        this.isLoading = false;

        // NEW: Force Angular to redraw the HTML with the new array!
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Could not fetch delivery rates right now.';
        this.isLoading = false;
      }
    });
  }

  // Helper function to actually trigger the Megaphone
  emitSelection() {
    this.shippingSelected.emit(this.selectedCourier);
  }
}