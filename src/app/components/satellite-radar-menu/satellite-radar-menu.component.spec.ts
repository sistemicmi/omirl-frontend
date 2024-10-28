import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatelliteRadarMenuComponent } from './satellite-radar-menu.component';

describe('SatelliteRadarMenuComponent', () => {
  let component: SatelliteRadarMenuComponent;
  let fixture: ComponentFixture<SatelliteRadarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SatelliteRadarMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SatelliteRadarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
