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

  private init() {
    this.startForm = this.fb.group({
      captureAddress: new FormControl('', [Validators.required]),
      address: this.fb.group({
        fullAddress: new FormControl('', [Validators.required]),
        street: new FormControl('', []),
        area: new FormControl('', []),
        state: new FormControl('', []),
        city: new FormControl('', []),
        postCode: new FormControl(0, []),
        coords: new FormControl({}, []),
      }),
    });

    this.initGoogleAutoComplete();
  }

  private initGoogleAutoComplete() {
    // Request for geo position if possible
    this.map.getGeoLocations().then((position: GeolocationPosition) => {
      this.currentLat = position.coords.latitude;
      this.currentLong = position.coords.longitude;

      // display modal auto
      this.ui.displayModal('#myModal').then(() => {
        // init google autocomplete
        const bounds = {
          north: this.currentLat + 0.1,
          south: this.currentLat - 0.1,
          east: this.currentLong + 0.1,
          west: this.currentLong - 0.1,
        };

        const autocomplete = this.map.getGoogleAutocomplete('startAddress', bounds, false);

        // get address of clicking on the single address
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          const addressFormGroup = this.startForm.get('address') as FormGroup;

          if (place.address_components) {
            this.ui.transformAddress(place, addressFormGroup).then(() => {
              console.log(this.startForm.get('address')!.value);
            });
          }
        });
      });
    });
  }

  public proceedApp(): void {
    // save the data of addresses

    const fullAddress = this.startForm
      .get('address')!
      .get('fullAddress')!.value;
    const street = this.startForm.get('address')!.get('street')!.value;
    const area = this.startForm.get('address')!.get('area')!.value;
    const state = this.startForm.get('address')!.get('state')!.value;
    const city = this.startForm.get('address')!.get('city')!.value;
    const postCode = this.startForm.get('address')!.get('postCode')!.value;
    const coords = this.startForm.get('address')!.get('coords')!.value;

    const address = new Address(
      fullAddress,
      street,
      area,
      state,
      city,
      postCode,
      coords
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
