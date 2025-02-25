import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditoperatoruserComponent } from './editoperatoruser.component';

describe('EditoperatoruserComponent', () => {
  let component: EditoperatoruserComponent;
  let fixture: ComponentFixture<EditoperatoruserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditoperatoruserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditoperatoruserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
