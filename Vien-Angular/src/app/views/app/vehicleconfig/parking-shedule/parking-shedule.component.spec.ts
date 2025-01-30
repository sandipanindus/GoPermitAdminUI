import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingSheduleComponent } from './parking-shedule.component';

describe('ParkingSheduleComponent', () => {
  let component: ParkingSheduleComponent;
  let fixture: ComponentFixture<ParkingSheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkingSheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingSheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
