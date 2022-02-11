import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MapsService } from '../maps/maps.service';
import { Address } from '../models/address';
import { TravelPoints } from '../models/travelpoints';
import { UiService } from '../ui/ui.service';

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.less'],
})
export class TravelComponent implements OnInit, AfterViewInit {
  public name = '';
  public address!: Address;

  private firstTime = true;

  public allTravelPoints: Array<TravelPoints> = [];

  constructor(private ui: UiService, private map: MapsService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.getData();
  }

  // get data after start input name and address
  private getData(): void {
    this.ui.getData().subscribe((data) => {
      console.log(data);

      if (data && this.firstTime) {
        this.name = data.name;
        this.address = data.address as Address;

        const startTravelPoint = new TravelPoints('start', this.address);

        // add to travel points array to keep collection
        this.allTravelPoints.push(startTravelPoint);

        this.firstTime = false;
      } else if (this.firstTime === false) {
        const address = data.address as Address;

        const startTravelPoint = new TravelPoints('mid', address);

        // add to travel points array to keep collection
        this.allTravelPoints.push(startTravelPoint);
      }

      console.log(this.allTravelPoints);
    });
  }

  // bring up the add locations modal
  public openAddlocationModal() {
    this.ui.displayModal('#addAnotherAddressModal');
  }

  public openCalculateModal() {
    this.ui.displayModal('#calculateDistanceModal');
  }

  public returnIcon(travelPointType: string) {
    let iconType = 'bi-arrow-down-square';

    switch (travelPointType) {
      case 'start':
        iconType = 'bi-geo-alt-fill';

        break;

      case 'mid':
        iconType = 'bi-geo-fill';

        break;

      default:
        iconType = 'bi-geo-fill';

        break;
    }

    return iconType;
  }

  public reset() {
    this.allTravelPoints.splice(1);
  }
}
