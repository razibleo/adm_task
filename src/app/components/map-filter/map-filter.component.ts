import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArcgisApiService } from '../../services/ArcGISApiService/arcgis-api.service';
import {
  IDropdownSettings,
  NgMultiSelectDropDownModule,
} from 'ng-multiselect-dropdown';
import { combineLatest, take } from 'rxjs';
import { IFirstAdminBoudary } from '../../shared/models/FirstAdminBoundary.model';
import { ISecondAdminBoundary } from '../../shared/models/SecondAdminBoundary.model';
import { IThirdAdminBoundary } from '../../shared/models/ThridAdminBoundary.model';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ArcGisMapService } from '../../services/ArcGISMapService/arc-gis-map.service';

type Option = {
  id: string;
  label: string;
};

@Component({
  selector: 'app-map-filter',
  standalone: true,
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './map-filter.component.html',
  styleUrl: './map-filter.component.scss',
})
export class MapFilterComponent {
  private _apiService = inject(ArcgisApiService);
  private _mapService = inject(ArcGisMapService);

  private _firstAdminBoundaries: IFirstAdminBoudary[] = [];
  private _secondAdminBoundaries: ISecondAdminBoundary[] = [];
  private _thirdAdminBoundaries: IThirdAdminBoundary[] = [];
  isloading = this._mapService.isLoading;

  firstAdminBoundariesOptions: Option[] = [];
  selectedFirstAdminBoundaries: Option[] = [];
  secondAdminBoundariesOptions: Option[] = [];
  selectedSecondAdminBoundaries: Option[] = [];
  thirdAdminBoundariesOptions: Option[] = [];
  selectedThirdBoundariesOptions: Option[] = [];

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'label',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: true,
  };

  constructor() {
    combineLatest([
      this._apiService.getFirstAdminBoundaries(),
      this._apiService.getSecondAdminBoundaries(),
      this._apiService.getThridAdminBoundaries(),
    ])
      // .pipe(take(1))
      .subscribe(
        ([
          firstAdminBoundaries,
          secondAdminBoundaries,
          thridAdminBoundaries,
        ]) => {
          this._firstAdminBoundaries = firstAdminBoundaries;
          this._secondAdminBoundaries = secondAdminBoundaries;
          this._thirdAdminBoundaries = thridAdminBoundaries;
          this._setFirstAdminBoundariesOptions();
        }
      );
  }

  private _setFirstAdminBoundariesOptions() {
    this.firstAdminBoundariesOptions = this._firstAdminBoundaries.map((e) => ({
      id: e.OBJECTID.toString(),
      label: e.adm0_name,
    }));
    this._setSecondAdminBoundariesOptions();
  }
  private _setSecondAdminBoundariesOptions() {
    const selectedFirstBoundaryLabels = this.selectedFirstAdminBoundaries.map(
      (e) => e.label
    );
    this.secondAdminBoundariesOptions = this._secondAdminBoundaries
      .filter((e) => selectedFirstBoundaryLabels.includes(e.adm0_name))
      .map((e) => ({ id: e.OBJECTID.toString(), label: e.adm1_name }));

    this._setThirdAdminBoundariesOptions();
  }
  private _setThirdAdminBoundariesOptions() {
    const selectedSecondBoundaryLabels = this.selectedSecondAdminBoundaries.map(
      (e) => e.label
    );
    this.thirdAdminBoundariesOptions = this._thirdAdminBoundaries
      .filter((e) => selectedSecondBoundaryLabels.includes(e.adm1_name))
      .map((e) => ({ id: e.OBJECTID.toString(), label: e.adm2_name }));
  }

  onFirstAdminBoundaryFilterChange() {
    this._setSecondAdminBoundariesOptions();
  }
  onSecondAdminBoundaryFilterChange() {
    this._setThirdAdminBoundariesOptions();
  }

  applyFilter() {
    const filteredFirstAdminBoundaries = this._firstAdminBoundaries.filter(
      (e) =>
        this.selectedFirstAdminBoundaries.find(
          (selected) => selected.id === e.OBJECTID.toString()
        )
    );

    const filteredSecondAdminBoundaries = this._secondAdminBoundaries.filter(
      (e) =>
        this.selectedSecondAdminBoundaries.find(
          (selected) => selected.id === e.OBJECTID.toString()
        )
    );

    const filteredThridAdminBoundaries = this._thirdAdminBoundaries.filter(
      (e) =>
        this.selectedThirdBoundariesOptions.find(
          (selected) => selected.id === e.OBJECTID.toString()
        )
    );

    this._mapService.applyFilters({
      firstAdminBoundarires: filteredFirstAdminBoundaries,
      secondAdminBoundarires: filteredSecondAdminBoundaries,
      thirdAdminBoundarires: filteredThridAdminBoundaries,
    });
  }
  resetFilter() {
    this.selectedFirstAdminBoundaries = [];
    this.selectedSecondAdminBoundaries = [];
    this.selectedThirdBoundariesOptions = [];

    this._setFirstAdminBoundariesOptions();
    this._mapService.applyFilters({});
  }
}
