import { Injectable } from '@angular/core';
import { mkConfig, generateCsv, download } from 'export-to-csv';

@Injectable({
  providedIn: 'root',
})
export class CsvService {
  private _csvConfig = mkConfig({ useKeysAsHeaders: true });

  generateCSV(data: Record<string, string>[]) {
    const csv = generateCsv(this._csvConfig)(data);
    download(this._csvConfig)(csv);
  }
}
