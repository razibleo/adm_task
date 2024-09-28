import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArcgisMapViewComponent } from './components/arcgis-map-view/arcgis-map-view.component';
import { MapFilterComponent } from './components/map-filter/map-filter.component';
import { FilterResultsComponent } from './components/filter-results/filter-results.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
export class AppComponent {
  title = 'adm_task';
}
