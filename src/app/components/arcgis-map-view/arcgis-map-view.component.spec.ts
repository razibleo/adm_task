import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcgisMapViewComponent } from './arcgis-map-view.component';

describe('ArcgisMapViewComponent', () => {
  let component: ArcgisMapViewComponent;
  let fixture: ComponentFixture<ArcgisMapViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArcgisMapViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArcgisMapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
