import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartComponent } from './start/start.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiService } from './ui/ui.service';
import { MapsService } from './maps/maps.service';
import { TravelComponent } from './travel/travel.component';
import { AddLocationComponent } from './add-location/add-location.component';
import { CalculateComponent } from './calculate/calculate.component';
import { AlertsComponent } from './alerts/alerts.component';
import { AlertsService } from './alerts/alerts/alerts.service';
import { TableComponent } from './table/table.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [StartComponent, TravelComponent, AddLocationComponent, CalculateComponent, AlertsComponent, TableComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AgGridModule.withComponents([])],
  providers: [UiService, MapsService, AlertsService],
  exports: [StartComponent, TravelComponent, AddLocationComponent, CalculateComponent, AlertsComponent, TableComponent],
})
export class SharedModule {}
