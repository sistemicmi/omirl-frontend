import { TestBed } from '@angular/core/testing';

import { ModelsGalleryService } from './models-gallery.service';

describe('ModelsGalleryService', () => {
  let service: ModelsGalleryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelsGalleryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
