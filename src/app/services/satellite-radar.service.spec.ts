import { TestBed } from '@angular/core/testing';

import { SatelliteRadarService } from './satellite-radar.service';

describe('SatelliteRadarService', () => {
  let service: SatelliteRadarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SatelliteRadarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
