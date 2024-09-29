import { Component, inject, OnDestroy } from '@angular/core';
import { FilterResultsCardComponent } from '../filter-results-card/filter-results-card.component';
import { ArcGisMapService } from '../../services/ArcGISMapService/arc-gis-map.service';
import { Subscription } from 'rxjs';
import { IFeatureResults } from '../../shared/models/FeatureResults.model';
import { computeExtentFromFeatures } from '../../shared/utils/arcgisMapHelper.function';
import { CsvService } from '../../services/CSVSerivce/csv.service';

@Component({
  selector: 'app-filter-results',
  standalone: true,
  imports: [FilterResultsCardComponent],
  templateUrl: './filter-results.component.html',
  styleUrl: './filter-results.component.scss',
})
export class FilterResultsComponent implements OnDestroy {
  _mapService = inject(ArcGisMapService);
  _csvService = inject(CsvService);
  _featureResultsSubscription: Subscription;
  results: IFeatureResults = {};

  constructor() {
    this._featureResultsSubscription =
      this._mapService.featureResults.subscribe((results) => {
        this.results = results;
      });
  }

  onFillToMap(adminBoundaryNumber: 1 | 2 | 3) {
    const extentFeaturesMap = {
      1: computeExtentFromFeatures(this.results.firstAdminFeatures),
      2: computeExtentFromFeatures(this.results.secondAdminFeatures),
      3: computeExtentFromFeatures(this.results.thirdAdminFeatures),
    };

    const extent = extentFeaturesMap[adminBoundaryNumber];
    this._mapService.moveViewToTarget(extent);
  }

  onExportCSV(adminBoundaryNumber: 1 | 2 | 3) {
    const featuresMap = {
      1: this.results.firstAdminFeatures,
      2: this.results.secondAdminFeatures,
      3: this.results.thirdAdminFeatures,
    };
    this._csvService.generateCSV(
      featuresMap[adminBoundaryNumber]!.map((e) => e.attributes)
    );
  }
  ngOnDestroy(): void {
    this._featureResultsSubscription.unsubscribe();
  }
}
