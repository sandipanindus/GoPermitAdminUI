import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadlogoComponent } from './uploadlogo.component';

describe('UploadlogoComponent', () => {
  let component: UploadlogoComponent;
  let fixture: ComponentFixture<UploadlogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadlogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadlogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
