import { Component, inject, OnInit } from '@angular/core';
import { defineCustomElements } from '@arcgis/map-components/dist/loader';
import ArcGisMap from '@arcgis/core/Map';
import { ComponentLibraryModule } from '@arcgis/map-components-angular';
import { ArcGisMapService } from '../../services/ArcGISMapService/arc-gis-map.service';
import MapView from '@arcgis/core/views/MapView';

@Component({
  selector: 'app-arcgis-map-view',
  standalone: true,
  imports: [ComponentLibraryModule],
  templateUrl: './arcgis-map-view.component.html',
  styleUrl: './arcgis-map-view.component.scss',
})
export class ArcgisMapViewComponent implements OnInit {
  private _mapService = inject(ArcGisMapService);

  constructor() {}

  ngOnInit(): void {
    defineCustomElements(window, {
      resourcesUrl: 'https://js.arcgis.com/map-components/4.30/assets',
    });
  }

  arcgisViewReadyChange(event: any) {
    const map = event.target.map as ArcGisMap;
    const view = event.target.view as MapView;
    console.log({ map, view });
    this._mapService.setMapProperties(map, view);
  }
}
