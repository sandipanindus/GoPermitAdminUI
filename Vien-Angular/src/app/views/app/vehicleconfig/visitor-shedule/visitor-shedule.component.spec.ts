import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorSheduleComponent } from './visitor-shedule.component';

describe('VisitorSheduleComponent', () => {
  let component: VisitorSheduleComponent;
  let fixture: ComponentFixture<VisitorSheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorSheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorSheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
