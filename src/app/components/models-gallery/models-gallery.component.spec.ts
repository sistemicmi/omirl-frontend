import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelsGalleryComponent } from './models-gallery.component';

describe('ModelGalleryComponent', () => {
  let component: ModelsGalleryComponent;
  let fixture: ComponentFixture<ModelsGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelsGalleryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelsGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
