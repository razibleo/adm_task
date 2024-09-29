import { Component, inject, OnInit } from '@angular/core';
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
export class MapFilterComponent implements OnInit {
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

  ngOnInit(): void {
    this._getAllFirstAdminBoundaries();
  }

  private _getAllFirstAdminBoundaries() {
    this._apiService
      .getFirstAdminBoundaries()
      .pipe(take(1))
      .subscribe((firstAdminBoundaries) => {
        this._firstAdminBoundaries = firstAdminBoundaries;
        this._setFirstAdminBoundariesOptions();
      });
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
    const hasFilters = this.selectedFirstAdminBoundaries.length > 0;
    console.log('hasFilters', hasFilters);

    if (!hasFilters) {
      this._resetSecondAdminBoundaryFilter();

      return;
    }

    this._apiService
      .getSecondAdminBoundaries(
        this.selectedFirstAdminBoundaries.map((e) => e.label)
      )
      .pipe(take(1))
      .subscribe((e) => {
        this._secondAdminBoundaries = e;
        this._setSecondAdminBoundariesOptions();
      });
  }
  onSecondAdminBoundaryFilterChange() {
    const hasFilters = this.selectedSecondAdminBoundaries.length > 0;

    if (!hasFilters) {
      this._resetThridAdminBoundaryFilter();
      return;
    }

    this._apiService
      .getThridAdminBoundaries(
        this.selectedFirstAdminBoundaries.map((e) => e.label),
        this.selectedSecondAdminBoundaries.map((e) => e.label)
      )
      .pipe(take(1))
      .subscribe((e) => {
        this._thirdAdminBoundaries = e;
        this._setThirdAdminBoundariesOptions();
      });
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

  private _resetFirstAdminBoundaryFilter() {
    this._firstAdminBoundaries = [];
    this.selectedFirstAdminBoundaries = [];
    this.firstAdminBoundariesOptions = [];
    this._resetSecondAdminBoundaryFilter();
  }
  private _resetSecondAdminBoundaryFilter() {
    this._secondAdminBoundaries = [];
    this.secondAdminBoundariesOptions = [];
    this.selectedSecondAdminBoundaries = [];
    this._resetThridAdminBoundaryFilter();
  }
  private _resetThridAdminBoundaryFilter() {
    this._thirdAdminBoundaries = [];
    this.thirdAdminBoundariesOptions = [];
    this.selectedThirdBoundariesOptions = [];
  }
  resetFilter() {
    this._resetFirstAdminBoundaryFilter();
    this._mapService.applyFilters({});
    this._getAllFirstAdminBoundaries();
  }
}
