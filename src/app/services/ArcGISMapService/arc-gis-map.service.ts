import { Injectable, OnDestroy } from '@angular/core';
import ArcGisMap from '@arcgis/core/Map';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { IMapFilters } from '../../shared/models/MapFilters.model';
import MapView from '@arcgis/core/views/MapView';
import { Subscription } from 'rxjs';
import { colors } from '../../shared/utils/colors.function';
import {
  clearDisplay,
  computeExtentFromFeatures,
  displayResults,
  generateWhereInStatment,
  loadImage,
} from '../../shared/utils/arcgisMapHelper.function';
import { IFeatureResults } from '../../shared/models/FeatureResults.model';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Injectable({
  providedIn: 'root',
})
export class ArcGisMapService implements OnDestroy {
  private _map?: ArcGisMap;
  private _mapView?: MapView;
  private _mapFiltersSubject = new BehaviorSubject<IMapFilters>({});
  private _mapFilterSubscription?: Subscription;
  private _defaultConfigFeatureLayers = [
    {
      id: '1',
      url: 'https://services5.arcgis.com/sjP4Ugu5s0dZWLjd/arcgis/rest/services/Administrative_Boundaries_Reference_(view_layer)/FeatureServer/2',
    },

    {
      id: '2',
      url: 'https://services5.arcgis.com/sjP4Ugu5s0dZWLjd/arcgis/rest/services/Administrative_Boundaries_Reference_(view_layer)/FeatureServer/1',
    },
    {
      id: '3',
      url: 'https://services5.arcgis.com/sjP4Ugu5s0dZWLjd/arcgis/rest/services/Administrative_Boundaries_Reference_(view_layer)/FeatureServer/0',
    },
  ];
  private _defaultFeatureLayers = this._defaultConfigFeatureLayers.map(
    (config) => new FeatureLayer(config)
  );
  private _featureResultsSubject = new BehaviorSubject<IFeatureResults>({});
  private _isLoading = false;

  get isLoading() {
    return this._isLoading;
  }
  get mapFilters() {
    return this._mapFiltersSubject.asObservable();
  }

  get layers() {
    return [...this._defaultFeatureLayers];
  }

  get featureResults() {
    return this._featureResultsSubject.asObservable();
  }

  setMapProperties(map: ArcGisMap, view: MapView) {
    this._map = map;
    this._mapView = view;

    this._map.addMany(this._defaultFeatureLayers);
    this._mapFilterSubscription?.unsubscribe();
    this._mapFilterSubscription = this._mapFilterSubscription =
      this.mapFilters.subscribe(this._onFilterChange.bind(this));
  }

  applyFilters(filters: IMapFilters) {
    this._mapFiltersSubject.next(filters);
    this._isLoading = true;
  }

  private async _onFilterChange({
    firstAdminBoundarires,
    secondAdminBoundarires,
    thirdAdminBoundarires,
  }: IMapFilters) {
    const baseQuery = {
      where: `(1=1)`, // Set by select element
      spatialRelationship: 'intersects' as const,
      // geometry: extent, // Restricted to visible extent of the map
      outFields: ['*'], // Attributes to return
      returnGeometry: true,
    };

    const [firstLayer, secondLayer, thridLayer] = this.layers;

    const firstWhereClause = generateWhereInStatment(
      `adm0_name`,
      firstAdminBoundarires?.map((e) => e.adm0_name) || []
    );

    const secondWhereClause =
      firstWhereClause +
      ' AND ' +
      generateWhereInStatment(
        `adm1_name`,
        secondAdminBoundarires?.map((e) => e.adm1_name) || []
      );

    const thirdWhereClause =
      secondWhereClause +
      ' AND ' +
      generateWhereInStatment(
        `adm2_name`,
        thirdAdminBoundarires?.map((e) => e.adm2_name) || []
      );

    const promise1 =
      firstAdminBoundarires?.length ?? 0 > 0
        ? firstLayer.queryFeatures({
            ...baseQuery,
            where: firstWhereClause,
          })
        : null;

    const promise2 =
      secondAdminBoundarires?.length ?? 0 > 0
        ? secondLayer.queryFeatures({
            ...baseQuery,
            where: secondWhereClause,
          })
        : null;

    const promise3 =
      thirdAdminBoundarires?.length ?? 0 > 0
        ? thridLayer.queryFeatures({
            ...baseQuery,
            where: thirdWhereClause,
          })
        : null;

    const promiseList = [promise1, promise2, promise3];

    const results = await Promise.all(promiseList);

    clearDisplay(this._mapView!);

    results
      .filter((result) => !!result)
      .forEach((result, index) =>
        displayResults(
          this._mapView!,
          result?.features ?? [],
          Object.values(colors)[index],
          index + 1
        )
      );

    const extent = computeExtentFromFeatures(
      results.flatMap((e) => e?.features || [])
    );

    await this._mapView?.goTo({
      target: extent,
    });

    const [firstAdminFeatures, secondAdminFeatures, thirdAdminFeatures] =
      results.map((e) => e?.features);
    this._featureResultsSubject.next({
      firstAdminFeatures,
      secondAdminFeatures,
      thirdAdminFeatures,
    });
  }

  moveViewToTarget(extent: any[]) {
    this._mapView?.goTo({
      target: extent,
    });
  }

  async getViewAsImage() {
    const screenshot = await this._mapView!.takeScreenshot({ format: 'png' });
    return loadImage(screenshot.dataUrl);
  }

  ngOnDestroy(): void {
    this._mapFilterSubscription?.unsubscribe();
  }
}
