import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebcamPopupComponent } from './webcam-popup.component';

describe('WebcamPopupComponent', () => {
  let component: WebcamPopupComponent;
  let fixture: ComponentFixture<WebcamPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebcamPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebcamPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
