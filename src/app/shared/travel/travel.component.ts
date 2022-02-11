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
        const startAddress = data.address as Address;

        const startTravelPoint = new TravelPoints('start', startAddress);

        // add to travel points array to keep collection
        this.allTravelPoints.push(startTravelPoint);

        this.firstTime = false;
      } else if (this.firstTime === false) {
        const address = data.address as Address;

        const travelPoint = new TravelPoints('mid', address);

        // check if existing travel point of the prev element
        for (let at = 0; at < this.allTravelPoints.length; at++) {
          const prevElemIndex = this.allTravelPoints.length - 1;
          const prevAddress =
            this.allTravelPoints[prevElemIndex].getFullAddress();

          if (prevAddress !== travelPoint.getFullAddress()) {
            // add to travel points array to keep collection
            this.allTravelPoints.push(travelPoint);
            break;
          } else {
            // warn user
          }
        }
      }

      console.log(this.allTravelPoints);
    });
  }

  public removeLocation(point: TravelPoints): void {
    console.log(point);

    const fullAddress = point.getFullAddress();

    for (let fa = 0; fa < this.allTravelPoints.length; fa++) {
      if (this.allTravelPoints[fa].getFullAddress() === fullAddress) {
        this.allTravelPoints.splice(fa, 1);
        break;
      }
    }
  }

  // bring up the add locations modal
  public openAddlocationModal(): void {
    this.ui.displayModal('#addAnotherAddressModal');
  }

  public openCalculateModal(): void {
    this.ui.displayModal('#calculateDistanceModal');
  }

  public returnIcon(travelPointType: string): string {
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

  public reset(): void {
    this.allTravelPoints.splice(1);
  }
}
