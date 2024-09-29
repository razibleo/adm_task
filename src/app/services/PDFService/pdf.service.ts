import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ContentImage } from 'pdfmake/interfaces';

export interface CreatePDF {
  image?: ContentImage;
  tables: {
    tableName: string;
    tableHeaders: string[];
    tableData: string[][];
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private _pdfWidth = 595.28;
  private _verticalPageMargin = 40;
  private _horizontalPageMargin = 60;

  getPageProperties() {
    return {
      pdfWidth: this._pdfWidth,
      verticalPageMargin: this._verticalPageMargin,
      horizontalPageMargin: this._horizontalPageMargin,
    };
  }

  createPDF({ image, tables }: CreatePDF) {
    {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;

      const docDefinition = {
        pageSize: {
          width: this._pdfWidth,
          height: 'auto',
        },
        pageMargins: [
          this._horizontalPageMargin,
          this._verticalPageMargin,
          this._horizontalPageMargin,
          this._verticalPageMargin,
        ],
        content: [
          image,
          ...tables
            .map(({ tableName, tableHeaders, tableData }) => [
              {
                text: tableName,
                margin: [2, 16, 2, 8],
                fontSize: 18,
                bold: true,
                alignment: 'center',
              },
              ,
              {
                table: {
                  headerRows: 1,
                  body: [tableHeaders, ...tableData],
                },
              },
            ])
            .flat(),
        ],
      };
      return pdfMake.createPdf(docDefinition as any);
    }
  }
}
