import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MapsService } from '../maps/maps.service';
import { TravelData } from '../models/traveldata';
import { TravelPoints } from '../models/travelpoints';
import { UiService } from '../ui/ui.service';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.component.html',
  styleUrls: ['./calculate.component.less'],
})
export class CalculateComponent implements OnInit {
  @Input() allTravelPoints!: Array<TravelPoints>;

  public calculateForm!: FormGroup;

  public templateResult = '';

  constructor(
    private ui: UiService,
    private map: MapsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.calculateForm = this.fb.group({
      calculateBy: new FormControl('distance', [Validators.required]),
    });
  }

  public dismissModal():void {
    this.templateResult = '';
    const initValue = {
      calculateBy: 'distance',
    };

    this.calculateForm.reset(initValue);
    this.ui.dismissModal();
  }

  public async calculateBy() {
    let calculateBy = this.calculateForm.get('calculateBy')!.value;

    const allCalculateData = [];

    // loop through travel points
    for (let at = 0; at < this.allTravelPoints.length; at++) {
      // checking both origin and destination elements exist then calculate
      const nextIndex = at + 1;
      if (this.allTravelPoints[at] && this.allTravelPoints[nextIndex]) {
        // get origin
        const originCoords = this.allTravelPoints[at].getCoordinates();
        const originName = this.allTravelPoints[at].getAddress();

        // get destination
        const destCoords = this.allTravelPoints[nextIndex].getCoordinates();
        const destName = this.allTravelPoints[nextIndex].getAddress();

        // pass to google distance matrix
        const calculateData = await this.map.googleDistanceMatrix(
          originCoords,
          originName,
          destCoords,
          destName
        );

        allCalculateData.push(calculateData);
      }
    }

    let accumulateValue = 0;
    // add up the values
    allCalculateData.forEach((calcData) => {
      accumulateValue += calcData.getValue(calculateBy);
    });

    this.templateResult = this.ui.conversion(calculateBy, accumulateValue);
  }
}
