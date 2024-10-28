import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorsHydroBarComponent } from './sensors-hydro-bar.component';

describe('SensorsHydroBarComponent', () => {
  let component: SensorsHydroBarComponent;
  let fixture: ComponentFixture<SensorsHydroBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorsHydroBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorsHydroBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
