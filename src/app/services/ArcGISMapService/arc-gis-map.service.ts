import { Injectable } from '@angular/core';
import ArcGisMap from '@arcgis/core/Map';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { IMapFilters } from '../../shared/models/MapFilters.model';

@Injectable({
  providedIn: 'root',
})
export class ArcGisMapService {
  private _map?: ArcGisMap;
  private _mapFiltersSubject = new BehaviorSubject<IMapFilters>({});
  private _defaultLayers = [
    {
      url: 'https://services5.arcgis.com/sjP4Ugu5s0dZWLjd/arcgis/rest/services/Administrative_Boundaries_Reference_(view_layer)/FeatureServer/0',
    },
    {
      url: 'https://services5.arcgis.com/sjP4Ugu5s0dZWLjd/arcgis/rest/services/Administrative_Boundaries_Reference_(view_layer)/FeatureServer/1',
    },
    {
      url: 'https://services5.arcgis.com/sjP4Ugu5s0dZWLjd/arcgis/rest/services/Administrative_Boundaries_Reference_(view_layer)/FeatureServer/2',
    },
  ];

  set map(map: ArcGisMap) {
    this._map = map;
    this._map.addMany(
      this._defaultLayers.map((layer) => new FeatureLayer(layer))
    );
  }

  get mapFilters() {
    return this._mapFiltersSubject.asObservable();
  }

  applyFilters(filters: IMapFilters) {
    this._mapFiltersSubject.next(filters);
  }
}
