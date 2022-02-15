import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { MapsService } from '../maps/maps.service';
import { Address } from '../models/address';
import { Calculate } from '../models/calculate';
import { TravelPoints } from '../models/travelpoints';
import { UiService } from '../ui/ui.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less'],
})
export class TableComponent implements OnInit, AfterViewInit {
  // AG GRID OPTIONS
  public gridOptions: GridOptions = {
    columnDefs: [
      {
        field: 'from',
        wrapText: true,
      },
      {
        field: 'to',
        wrapText: true,
      },
      {
        field: 'distance',
      },
      {
        field: 'time',
      },
      {
        field: 'time_in_traffic',
      },
    ],
  };

  public rowData: Array<any> = [];
  // for temp only and will be used for manipulation of data
  public tempDataRow: Array<TravelPoints> = [];

  public isFirst = true;

  // need to keep track of index
  // to avoid recalculting already calculated distance and time etc
  private currentIndex = 0;
  private nextIndex = 0;

  constructor(private ui: UiService, private map: MapsService) {}

  ngOnInit(): void {
    this.init();
  }

  ngAfterViewInit(): void {}

  private init(): void {
    this.ui.getData().subscribe((data) => {
      if (data !== null && this.isFirst) {
        this.isFirst = false;
        const address = data.address as Address;

        const travelPoint = new TravelPoints('start', address);

        this.tempDataRow.push(travelPoint);

        this.initGrid();
      } else if (data !== null && this.isFirst === false) {
        const address = data.address as Address;

        const travelPoint = new TravelPoints('mid', address);

        this.tempDataRow.push(travelPoint);
      }

      this.recalculateRowData();
    });

    // listen to if reset is selected
    this.ui.getActions().subscribe((action: string) => {
      if (action === 'reset') {
        this.reset();
      }
    });
  }

  // more than 1 data row should update the table
  // then add to table
  public async recalculateRowData() {
    if (this.tempDataRow.length > 1) {
      this.nextIndex = this.currentIndex + 1;

      if (this.tempDataRow[this.nextIndex]) {
        const fromCoords = this.tempDataRow[this.currentIndex].getCoordinates();
        const fromName = this.tempDataRow[this.currentIndex].getAddress();

        const toCoords = this.tempDataRow[this.nextIndex].getCoordinates();
        const toName = this.tempDataRow[this.nextIndex].getAddress();

        const calculateData = await this.map.googleDistanceMatrix(
          fromCoords,
          fromName,
          toCoords,
          toName
        );

        this.addToTable(calculateData);

        this.currentIndex++;
      }
    }
  }

  private initGrid(): void {
    this.gridOptions.api?.sizeColumnsToFit();

    this.gridOptions.overlayNoRowsTemplate = 'Please add a location';
    this.gridOptions.api?.showNoRowsOverlay();
  }

  private addToTable(calculateData: Calculate) {
    const from = calculateData.getFrom();
    const to = calculateData.getTo();
    const distance = this.ui.conversion(
      'distance',
      calculateData.getValue('distance')
    );
    const time = this.ui.conversion(
      'duration',
      calculateData.getValue('duration')
    );
    const time_in_traffic = this.ui.conversion(
      'durationTraffic',
      calculateData.getValue('durationTraffic')
    );

    const dataRow = {
      from,
      to,
      distance,
      time,
      time_in_traffic,
    };

    this.rowData.push(dataRow);
    this.gridOptions.api?.applyTransaction({
      add: [dataRow],
    });
  }

  // reset variable to defaults
  private reset(): void {
    this.rowData = [];
    this.gridOptions.api?.setRowData(this.rowData);

    this.currentIndex = 0;
    this.nextIndex = 0;

    this.tempDataRow.splice(1);
  }
}
