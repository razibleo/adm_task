import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { IFirstAdminBoudary } from '../../shared/models/FirstAdminBoundary.model';
import { ISecondAdminBoundary } from '../../shared/models/SecondAdminBoundary.model';
import { IThirdAdminBoundary } from '../../shared/models/ThridAdminBoundary.model';
import { generateWhereInStatment } from '../../shared/utils/arcgisMapHelper.function';

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
  getSecondAdminBoundaries(adm0_names: string[]) {
    return this.http
      .get<any>(`${this.apiUrl}/1/query`, {
        params: {
          ...this.defaultParams,
          where: `${this.defaultParams.where} AND (${generateWhereInStatment(
            'adm0_name',
            adm0_names
          )})`,
        },
      })
      .pipe(
        map((e) =>
          (e.features as any[]).map((e) => e.attributes as ISecondAdminBoundary)
        )
      );
  }
  getThridAdminBoundaries(adm0_names: string[], adm1_names: string[]) {
    return this.http
      .get<any>(`${this.apiUrl}/0/query`, {
        params: {
          ...this.defaultParams,
          where: `${this.defaultParams.where} AND (${generateWhereInStatment(
            'adm0_name',
            adm0_names
          )}) AND (${generateWhereInStatment('adm1_name', adm1_names)})`,
        },
      })
      .pipe(
        map((e) =>
          (e.features as any[]).map((e) => e.attributes as IThirdAdminBoundary)
        )
      );
  }
}
