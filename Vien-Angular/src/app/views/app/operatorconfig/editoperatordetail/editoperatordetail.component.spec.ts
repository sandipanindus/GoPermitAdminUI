import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditoperatordetailComponent } from './editoperatordetail.component';

describe('EditoperatordetailComponent', () => {
  let component: EditoperatordetailComponent;
  let fixture: ComponentFixture<EditoperatordetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditoperatordetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditoperatordetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
