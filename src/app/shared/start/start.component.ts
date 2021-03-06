import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MapsService } from '../maps/maps.service';
import { Address } from '../models/address';
import { UiService } from '../ui/ui.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.less'],
})
export class StartComponent implements OnInit {
  public startForm!: FormGroup;

  private currentLat = 0;
  private currentLong = 0;

  constructor(
    private fb: FormBuilder,
    private ui: UiService,
    private map: MapsService
  ) {}

  ngOnInit(): void {
    this.init();
  }

  private init(): void {
    this.initForm();
    this.initGoogleAutoComplete();
  }

  private initForm(): void {
    this.startForm = this.fb.group({
      captureAddress: new FormControl('', [Validators.required]),
      address: this.fb.group({
        generalName: new FormControl('', [Validators.required]),
        streetNo: new FormControl(0, []),
        street: new FormControl('', []),
        area: new FormControl('', []),
        state: new FormControl('', []),
        city: new FormControl('', []),
        postCode: new FormControl(0, []),
        coords: new FormControl({}, []),
      }),
    });
  }

  private startApp(position: any) {
    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;

    // display modal automatically
    this.ui.displayModal('#myModal').then(() => {
      // define start address bounds of 10km
      const bounds = {
        north: this.currentLat + 0.1,
        south: this.currentLat - 0.1,
        east: this.currentLong + 0.1,
        west: this.currentLong - 0.1,
      };

      // init google autocomplete
      const autocomplete = this.map.getGoogleAutocomplete(
        'startAddress',
        bounds,
        false
      );

      // get address event of clicking on the single address
      autocomplete.addListener('place_changed', async () => {
        const place = autocomplete.getPlace();
        const addressFormGroup = this.startForm.get('address') as FormGroup;

        if (place.address_components) {
          // transform address object from google to input into form for later easy readable
          await this.ui.transformAddress(place, addressFormGroup).then(() => {
            console.log(this.startForm.value);
          });
        }
      });
    });
  }

  private initGoogleAutoComplete() {
    // Request for geo position if possible to set start area location
    this.map
      .getGeoLocations()
      .then((position: GeolocationPosition) => {
        console.log(position);
        this.startApp(position);
      })
      .catch((e) => {
        // pass in default KL lat/long
        this.startApp({
          coords: {
            latitude: 3.139003,
            longitude: 101.686852,
          },
        });
      });
  }

  public proceedApp(): void {
    // save the data of addresses
    const generalName = this.startForm
      .get('address')!
      .get('generalName')!.value;
    const street = this.startForm.get('address')!.get('street')!.value;
    const streetNo = this.startForm.get('address')!.get('streetNo')!.value;
    const area = this.startForm.get('address')!.get('area')!.value;
    const state = this.startForm.get('address')!.get('state')!.value;
    const city = this.startForm.get('address')!.get('city')!.value;
    const postCode = this.startForm.get('address')!.get('postCode')!.value;
    const coords = this.startForm.get('address')!.get('coords')!.value;
    const googleName = this.startForm.get('captureAddress')?.value;

    const address = new Address(
      generalName,
      street,
      streetNo,
      area,
      state,
      city,
      postCode,
      coords,
      googleName
    );

    const data = {
      address,
    };

    // send data to behaviral subject to pass to subscribed components
    this.ui.passData(data).then(() => {
      // close the modal
      this.ui.dismissModal();
    });
  }
}
