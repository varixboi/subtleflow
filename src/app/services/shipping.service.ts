import { Service } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ShippingService {
    constructor(private http: HttpClient){}

    getRates(deliveryPincode:string): Observable<any[]>{
        const payload = {
            pickup_pincode:'575003',
            delivery_pincode: deliveryPincode,
            weight: 1.0, // will pass this later
            cod: 0 // prepaid-0,cod-1
        };

        // return this.http.post<any[]>('/api/shipping/rates', payload);
        return this.http.post<any[]>('http://localhost:3000/shipping/rates', payload);
    }
}
