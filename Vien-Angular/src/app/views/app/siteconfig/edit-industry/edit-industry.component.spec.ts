import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIndustryComponent } from './edit-industry.component';

describe('EditIndustryComponent', () => {
  let component: EditIndustryComponent;
  let fixture: ComponentFixture<EditIndustryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditIndustryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
