import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsiteuserComponent } from './addsiteuser.component';

describe('AddsiteuserComponent', () => {
  let component: AddsiteuserComponent;
  let fixture: ComponentFixture<AddsiteuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsiteuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsiteuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
