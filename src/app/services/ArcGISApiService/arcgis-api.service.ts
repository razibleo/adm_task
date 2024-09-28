import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { IFirstAdminBoudary } from '../../shared/models/FirstAdminBoundary.model';
import { ISecondAdminBoundary } from '../../shared/models/SecondAdminBoundary.model';
import { IThirdAdminBoundary } from '../../shared/models/ThridAdminBoundary.model';

@Injectable({
  providedIn: 'root',
})
export class ArcgisApiService {
  private http = inject(HttpClient);

  private defaultParams = {
    f: 'json',
    where: `(validity = 'yes') AND (1=1)`,
    returnGeometry: false,
    orderByFields: 'OBJECTID ASC',
    outFields: '*',
  };

  apiUrl: string =
    'https://services5.arcgis.com/sjP4Ugu5s0dZWLjd/arcgis/rest/services/Administrative_Boundaries_Reference_(view_layer)/FeatureServer';

  getFirstAdminBoundaries() {
    return this.http
      .get<any>(`${this.apiUrl}/2/query`, {
        params: { ...this.defaultParams },
      })
      .pipe(
        map((e) =>
          (e.features as any[]).map((e) => e.attributes as IFirstAdminBoudary)
        )
      );
  }
  getSecondAdminBoundaries() {
    return this.http
      .get<any>(`${this.apiUrl}/1/query`, {
        params: { ...this.defaultParams },
      })
      .pipe(
        map((e) =>
          (e.features as any[]).map((e) => e.attributes as ISecondAdminBoundary)
        )
      );
  }
  getThridAdminBoundaries() {
    return this.http
      .get<any>(`${this.apiUrl}/0/query`, {
        params: { ...this.defaultParams },
      })
      .pipe(
        map((e) =>
          (e.features as any[]).map((e) => e.attributes as IThirdAdminBoundary)
        )
      );
  }
}
