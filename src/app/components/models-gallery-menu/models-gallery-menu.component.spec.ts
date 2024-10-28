import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelsGalleryMenuComponent } from './models-gallery-menu.component';

describe('ModelsGalleryMenuComponent', () => {
  let component: ModelsGalleryMenuComponent;
  let fixture: ComponentFixture<ModelsGalleryMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelsGalleryMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelsGalleryMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
