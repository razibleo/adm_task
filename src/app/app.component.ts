import { Component, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArcgisMapViewComponent } from './components/arcgis-map-view/arcgis-map-view.component';
import { MapFilterComponent } from './components/map-filter/map-filter.component';
import { FilterResultsComponent } from './components/filter-results/filter-results.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ArcGisMapService } from './services/ArcGISMapService/arc-gis-map.service';
import { CreatePDF, PdfService } from './services/PDFService/pdf.service';
import { IFeatureResults } from './shared/models/FeatureResults.model';
import { Subscription } from 'rxjs';
import { IFirstAdminBoudary } from './shared/models/FirstAdminBoundary.model';
import { ISecondAdminBoundary } from './shared/models/SecondAdminBoundary.model';
import { IThirdAdminBoundary } from './shared/models/ThridAdminBoundary.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ArcgisMapViewComponent,
    MapFilterComponent,
    FilterResultsComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
  title = 'adm_task';
  _mapService = inject(ArcGisMapService);
  _pdfService = inject(PdfService);
  _featureResults: IFeatureResults = {};
  _featureResultsSubscription: Subscription;

  constructor() {
    this._featureResultsSubscription =
      this._mapService.featureResults.subscribe((featureResults) => {
        this._featureResults = featureResults;
      });
  }

  async exportToPDF() {
    const img = await this._mapService.getViewAsImage();
    const imageAspectRatio = img.width / img.height;
    const { pdfWidth, horizontalPageMargin } =
      this._pdfService.getPageProperties();

    const adjustedMapImageWidth = pdfWidth - horizontalPageMargin * 2;
    const adjustedMapImageHeight = adjustedMapImageWidth / imageAspectRatio;

    const { firstAdminFeatures, secondAdminFeatures, thirdAdminFeatures } =
      this._featureResults;
    const tables = [
      (firstAdminFeatures?.length ?? 0) > 0 &&
        this._generateFirstAdminBoundaryTable(
          firstAdminFeatures!.map((e) => e.attributes)
        ),
      (secondAdminFeatures?.length ?? 0) > 0 &&
        this._generateSecondAdminBoundaryTable(
          secondAdminFeatures!.map((e) => e.attributes)
        ),
      (thirdAdminFeatures?.length ?? 0) > 0 &&
        this._generateThirdAdminBoundaryTable(
          thirdAdminFeatures!.map((e) => e.attributes)
        ),
    ].filter((e) => !!e) as CreatePDF['tables'];

    const createdPdf = this._pdfService.createPDF({
      image: {
        image: img.src,
        width: adjustedMapImageWidth,
        height: adjustedMapImageHeight,
      },
      tables: tables,
    });
    createdPdf.download();
  }

  private _generateFirstAdminBoundaryTable(
    firstAdminBoundaries: IFirstAdminBoudary[]
  ) {
    return {
      tableName: '1st Admin Boundaries',
      tableHeaders: ['adm0_name', 'Shape__Area', 'Shape__Length'],
      tableData: firstAdminBoundaries.map(
        ({ adm0_name, Shape__Area, Shape__Length }) => {
          return [adm0_name, Shape__Area.toString(), Shape__Length.toString()];
        }
      ),
    };
  }

  private _generateSecondAdminBoundaryTable(
    secondAdminBoundaries: ISecondAdminBoundary[]
  ) {
    return {
      tableName: '2nd Admin Boundaries',
      tableHeaders: ['adm0_name', 'adm1_name', 'Shape__Area', 'Shape__Length'],
      tableData: secondAdminBoundaries.map(
        ({ adm0_name, adm1_name, Shape__Area, Shape__Length }) => {
          return [
            adm0_name,
            adm1_name,
            Shape__Area.toString(),
            Shape__Length.toString(),
          ];
        }
      ),
    };
  }

  private _generateThirdAdminBoundaryTable(
    thirdAdminBoundaries: IThirdAdminBoundary[]
  ) {
    return {
      tableName: '3rd Admin Boundaries',
      tableHeaders: [
        'adm0_name',
        'adm1_name',
        'adm2_name',
        'Shape__Area',
        'Shape__Length',
      ],
      tableData: thirdAdminBoundaries.map(
        ({ adm0_name, adm1_name, adm2_name, Shape__Area, Shape__Length }) => {
          return [
            adm0_name,
            adm1_name,
            adm2_name,
            Shape__Area.toString(),
            Shape__Length.toString(),
          ];
        }
      ),
    };
  }

  ngOnDestroy(): void {
    this._featureResultsSubscription.unsubscribe();
  }
}
