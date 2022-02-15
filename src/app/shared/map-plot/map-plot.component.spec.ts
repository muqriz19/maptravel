import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPlotComponent } from './map-plot.component';

describe('MapPlotComponent', () => {
  let component: MapPlotComponent;
  let fixture: ComponentFixture<MapPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapPlotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
