import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatelliteRadarComponent } from './satellite-radar.component';

describe('SatelliteRadarComponent', () => {
  let component: SatelliteRadarComponent;
  let fixture: ComponentFixture<SatelliteRadarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SatelliteRadarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SatelliteRadarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
