import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OmirlsiteComponent } from './omirlsite.component';

describe('OmirlsiteComponent', () => {
  let component: OmirlsiteComponent;
  let fixture: ComponentFixture<OmirlsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OmirlsiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OmirlsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
