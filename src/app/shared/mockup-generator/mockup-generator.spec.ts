import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockupGenerator } from './mockup-generator';

describe('MockupGenerator', () => {
  let component: MockupGenerator;
  let fixture: ComponentFixture<MockupGenerator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockupGenerator],
    }).compileComponents();

    fixture = TestBed.createComponent(MockupGenerator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
