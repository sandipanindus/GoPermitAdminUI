import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewoperatoruserComponent } from './addnewoperatoruser.component';

describe('AddnewoperatoruserComponent', () => {
  let component: AddnewoperatoruserComponent;
  let fixture: ComponentFixture<AddnewoperatoruserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddnewoperatoruserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewoperatoruserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
