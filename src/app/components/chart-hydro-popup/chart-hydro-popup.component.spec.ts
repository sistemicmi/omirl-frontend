import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartHydroPopupComponent } from './chart-hydro-popup.component';

describe('ChartHydroPopupComponent', () => {
  let component: ChartHydroPopupComponent;
  let fixture: ComponentFixture<ChartHydroPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartHydroPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartHydroPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
