import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatordetailstableComponent } from './operatordetailstable.component';

describe('OperatordetailstableComponent', () => {
  let component: OperatordetailstableComponent;
  let fixture: ComponentFixture<OperatordetailstableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatordetailstableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatordetailstableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
