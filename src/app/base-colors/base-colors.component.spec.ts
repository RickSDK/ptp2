import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseColorsComponent } from './base-colors.component';

describe('BaseColorsComponent', () => {
  let component: BaseColorsComponent;
  let fixture: ComponentFixture<BaseColorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseColorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
