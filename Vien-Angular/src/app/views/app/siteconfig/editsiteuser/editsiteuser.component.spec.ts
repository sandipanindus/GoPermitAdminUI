import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditsiteuserComponent } from './editsiteuser.component';

describe('EditsiteuserComponent', () => {
  let component: EditsiteuserComponent;
  let fixture: ComponentFixture<EditsiteuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditsiteuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditsiteuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
