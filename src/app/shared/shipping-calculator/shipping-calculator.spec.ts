import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingCalculator } from './shipping-calculator';

describe('ShippingCalculator', () => {
  let component: ShippingCalculator;
  let fixture: ComponentFixture<ShippingCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingCalculator],
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingCalculator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
