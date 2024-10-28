import { TestBed } from '@angular/core/testing';

import { MapNavigatorService } from './map-navigator.service';

describe('MapNavigatorServiceService', () => {
  let service: MapNavigatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapNavigatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
