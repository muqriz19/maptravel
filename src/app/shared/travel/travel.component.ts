import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AlertsService } from 'src/app/shared/alerts/alerts/alerts.service';
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

  constructor(private ui: UiService, private alerts: AlertsService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.getData();
  }

  // get data after input address
  private getData(): void {
    this.ui.getData().subscribe((data) => {
      // console.log(data);

      if (data !== null && this.firstTime) {
        const startAddress = data.address as Address;

        // this is the starting address travel point - in no matter what it should not be deleted/removed
        const startTravelPoint = new TravelPoints('start', startAddress);

        // add to travel points array to keep collection
        this.allTravelPoints.push(startTravelPoint);

        this.firstTime = false;
      } else if (data !== null && this.firstTime === false) {
        const address = data.address as Address;

        // all other new address added should be classified as mid
        const travelPoint = new TravelPoints('mid', address);

        // check if existing travel point of the prev element is same. If same warn the use not to put same address
        for (let at = 0; at < this.allTravelPoints.length; at++) {
          const prevElemIndex = this.allTravelPoints.length - 1;
          const prevAddress = this.allTravelPoints[prevElemIndex].getAddress();

          if (prevAddress !== travelPoint.getAddress()) {
            // add to travel points array to keep collection
            this.allTravelPoints.push(travelPoint);
            break;
          } else {
            // warn user
            this.alerts.displayAlerts(
              'danger',
              'Cannot put same travel point as previous last travel'
            );
          }
        }
      }
    });
  }

  // remove location when user clicks the x icon
  public removeLocation(point: TravelPoints): void {
    const address = point.getAddress();

    for (let fa = 0; fa < this.allTravelPoints.length; fa++) {
      if (this.allTravelPoints[fa].getAddress() === address) {
        this.allTravelPoints.splice(fa, 1);
      }
    }
  }

  // bring up the add locations modal
  public openAddlocationModal(): void {
    this.ui.displayModal('#addAnotherAddressModal');
  }

  // bring up the calculate modal
  public openCalculateModal(): void {
    this.ui.displayModal('#calculateDistanceModal');
  }

  // returns appropriate icon for each travel point
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

  // clears all travel points except for the starting point
  public reset(): void {
    this.allTravelPoints.splice(1);

    // send to other components to reset
    this.ui.sendActions('reset');
  }
}
