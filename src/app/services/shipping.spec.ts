import { TestBed } from '@angular/core/testing';

import { Shipping } from './shipping.service';

describe('Shipping', () => {
  let service: Shipping;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Shipping);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
