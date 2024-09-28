import { Component, Input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-filter-results-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './filter-results-card.component.html',
  styleUrl: './filter-results-card.component.scss',
})
export class FilterResultsCardComponent {
  @Input()
  title: string = '';

  @Input()
  count: number = 0;

  onFillToMap = output<void>();

  onExportCSV = output<void>();

  onFillToMapClick() {
    this.onFillToMap?.emit();
  }

  onExportCSVClick() {
    this.onExportCSV?.emit();
  }
}
