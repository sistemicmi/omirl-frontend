import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomVisualizationMenuComponent } from './bottom-visualization-menu.component';

describe('BottomVisualizationMenuComponent', () => {
  let component: BottomVisualizationMenuComponent;
  let fixture: ComponentFixture<BottomVisualizationMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BottomVisualizationMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomVisualizationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
