import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cEstimator } from './b2c-estimator';

describe('B2cEstimator', () => {
  let component: B2cEstimator;
  let fixture: ComponentFixture<B2cEstimator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [B2cEstimator],
    }).compileComponents();

    fixture = TestBed.createComponent(B2cEstimator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
