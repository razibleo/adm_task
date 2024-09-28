import { TestBed } from '@angular/core/testing';

import { ArcGisMapService } from './arc-gis-map.service';

describe('ArcGisMapService', () => {
  let service: ArcGisMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArcGisMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
