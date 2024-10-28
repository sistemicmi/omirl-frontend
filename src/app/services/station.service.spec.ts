import { TestBed } from '@angular/core/testing';

import { StationService } from './station.service';

describe('StationServiceService', () => {
  let service: StationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
