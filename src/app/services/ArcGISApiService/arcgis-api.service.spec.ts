import { TestBed } from '@angular/core/testing';

import { ArcgisApiService } from './arcgis-api.service';

describe('ArcgisApiService', () => {
  let service: ArcgisApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArcgisApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
