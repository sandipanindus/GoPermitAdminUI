import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorusertableComponent } from './operatorusertable.component';

describe('OperatorusertableComponent', () => {
  let component: OperatorusertableComponent;
  let fixture: ComponentFixture<OperatorusertableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorusertableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorusertableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
