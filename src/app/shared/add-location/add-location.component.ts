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
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.less'],
})
export class AddLocationComponent implements OnInit {
  public addLocationForm!: FormGroup;
  private firstTime = true;
  private google: any;
  private gMap!: any;
  private autoComplete: any;

  private currentMarker: any;
  private rangeCirlce: any;

  private lat = 0;
  private long = 0;

  constructor(
    private fb: FormBuilder,
    private map: MapsService,
    private ui: UiService
  ) {}

  ngOnInit(): void {
    this.init();
  }

  private init(): void {
    this.initForm();

    // receive data from first time address
    this.ui.getData().subscribe((data) => {
      if (data !== null && this.firstTime) {
        // console.log(data);
        // set for bound later
        this.lat = (data.address as Address).getCoordinates().lat;
        this.long = (data.address as Address).getCoordinates().long;

        // inital bounds
        const bounds = {
          north: this.lat + 0.1,
          south: this.lat - 0.1,
          east: this.long + 0.1,
          west: this.long - 0.1,
        };

        this.initMap(data.address);
        this.initMapAutoComplete(bounds);

        // delay place change event
        setTimeout(() => {
          this.initMapAutoCompleteEvent();
        }, 2000);

        this.firstTime = false;
      }
    });
  }

  private initForm(): void {
    this.addLocationForm = this.fb.group({
      range: new FormControl(10, []),
      anotherAddress: new FormControl('', [Validators.required]),
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

    // listen to range circle values update
    this.addLocationForm.get('range')?.valueChanges.subscribe((value) => {
      const circleRange = value * 1000;
      // update circle radius
      this.updateCircleRange(circleRange);

      const boundsKM = (value * 1000) / 1000 / 100;

      const bounds = {
        north: this.lat + boundsKM,
        south: this.lat - boundsKM,
        east: this.long + boundsKM,
        west: this.long - boundsKM,
      };

      // update bounds aswell
      this.initMapAutoComplete(bounds);
    });
  }

  private initMap(startCoords: Address): void {
    // starting address coords
    const startAddressCoord = {
      lat: startCoords.getCoordinates().lat,
      lng: startCoords.getCoordinates().long,
    };
    this.google = this.map.getGoogle();

    this.gMap = new this.google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        zoom: 15,
        center: startAddressCoord,
      }
    );

    // The starting marker - should not be removed
    const marker = new this.google.maps.Marker({
      position: startAddressCoord,
      map: this.gMap,
      draggable: false,
    });

    // 1000 m === 1km
    // for start range 10km === 10000m
    // need to check back?
    this.rangeCirlce = new this.google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 1,
      strokeWeight: 1,
      fillOpacity: 0.1,
      clickable: true,
      map: this.gMap,
      center: startAddressCoord,
      radius: 10000,
    });

    // current select pin marker with custom icon
    this.currentMarker = new this.google.maps.Marker({
      draggable: false,
      icon: '/assets/images/pin-icon.png',
    });

    // click event for inside range cicle only
    this.rangeCirlce.addListener('click', (ev: any) => {
      // console.log(ev);

      const lat = ev.latLng.lat();
      const long = ev.latLng.lng();

      // update marker on map
      this.updateNewAddressMarker(lat, long);

      // show on address field
      this.map.reverseGeoCode(lat, long).then((address) => {
        // console.log(address);

        this.addLocationForm.get('anotherAddress')?.setValue(address as string);

        const inputAddress = document.querySelector(
          '#anotherAddress'
        ) as HTMLInputElement;

        inputAddress.focus();
      });
    });
  }

  private async initMapAutoComplete(bounds: any) {
    if (this.firstTime) {
      this.autoComplete = await this.map.getGoogleAutocomplete(
        'anotherAddress',
        bounds,
        true
      );
    } else {
      this.autoComplete.unbind('bounds');
      this.autoComplete.setBounds(bounds);

      this.currentMarker.setMap(null);
    }
  }

  // needds to happen once
  private initMapAutoCompleteEvent():void {
    // get address of clicking on the single address
    this.autoComplete.addListener('place_changed', () => {
      const place = this.autoComplete.getPlace();
      // console.log(place);
      const addressFormGroup = this.addLocationForm.get('address') as FormGroup;

      // also update pin to the map based on lat long
      const lat = place.geometry.location.lat();
      const long = place.geometry.location.lng();

      this.updateNewAddressMarker(lat, long);

      if (place.address_components) {
        this.ui.transformAddress(place, addressFormGroup).then(() => {
          console.log(this.addLocationForm.get('address')!.value);
        });
      }
    });
  }

  // only change the one that created via initMap function
  public updateNewAddressMarker(lat: number, long: number): void {
    const location = {
      lat,
      lng: long,
    };

    // set position on map
    this.currentMarker.setPosition(location);
    // show on map
    this.currentMarker.setMap(this.gMap);
  }

  // update range circle
  public updateCircleRange(rangeValue: number): void {
    this.rangeCirlce.setRadius(rangeValue);
  }

  public addAnotherLocation(): void {
    // save the addresses
    const fullAddress = this.addLocationForm
      .get('address')!
      .get('fullAddress')!.value;
    const street = this.addLocationForm.get('address')!.get('street')!.value;
    const area = this.addLocationForm.get('address')!.get('area')!.value;
    const state = this.addLocationForm.get('address')!.get('state')!.value;
    const city = this.addLocationForm.get('address')!.get('city')!.value;
    const postCode = this.addLocationForm
      .get('address')!
      .get('postCode')!.value;
    const coords = this.addLocationForm.get('address')!.get('coords')!.value;

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
    this.ui.passData(data).then(() => {});
  }

  public dismissModal(): void {
    const resetAddressInitVal = {
      range: 10,
      anotherAddress: '',
      address: {
        fullAddress: '',
        street: '',
        area: '',
        state: '',
        city: '',
        postCode: 0,
        coords: {},
      },
    };

    this.currentMarker.setMap(null);
    this.addLocationForm.reset(resetAddressInitVal);
    this.ui.dismissModal();
  }
}
