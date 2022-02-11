import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartComponent } from './start/start.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiService } from './ui/ui.service';
import { MapsService } from './maps/maps.service';
import { TravelComponent } from './travel/travel.component';
import { AddLocationComponent } from './add-location/add-location.component';
import { CalculateComponent } from './calculate/calculate.component';

@NgModule({
  declarations: [StartComponent, TravelComponent, AddLocationComponent, CalculateComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [UiService, MapsService],
  exports: [StartComponent, TravelComponent, AddLocationComponent, CalculateComponent],
})
export class SharedModule {}
