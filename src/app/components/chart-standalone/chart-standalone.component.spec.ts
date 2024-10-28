import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartStandaloneComponent } from './chart-standalone.component';

describe('ChartStandaloneComponent', () => {
  let component: ChartStandaloneComponent;
  let fixture: ComponentFixture<ChartStandaloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartStandaloneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartStandaloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
