import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationhydroPopupComponent } from './stationhydro-popup.component';

describe('StationhydroPopupComponent', () => {
  let component: StationhydroPopupComponent;
  let fixture: ComponentFixture<StationhydroPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationhydroPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationhydroPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
