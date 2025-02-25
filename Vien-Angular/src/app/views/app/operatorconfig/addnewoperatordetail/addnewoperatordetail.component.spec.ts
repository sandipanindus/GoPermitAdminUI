import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewoperatordetailComponent } from './addnewoperatordetail.component';

describe('AddnewoperatordetailComponent', () => {
  let component: AddnewoperatordetailComponent;
  let fixture: ComponentFixture<AddnewoperatordetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddnewoperatordetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewoperatordetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
