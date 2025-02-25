import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteusertableComponent } from './siteusertable.component';

describe('SiteusertableComponent', () => {
  let component: SiteusertableComponent;
  let fixture: ComponentFixture<SiteusertableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteusertableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteusertableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
