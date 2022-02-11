import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private currentModal!: bootstrap.Modal;

  private sourceData = new BehaviorSubject<any>(null);

  constructor() {}

  public displayModal(modalName: string) {
    return new Promise<void>((resolve) => {
      this.currentModal = new bootstrap.Modal(
        document.querySelector(modalName) as Element,
        {
          keyboard: false,
          focus: true,
          backdrop: 'static',
        }
      );

      this.currentModal.toggle();
      resolve();
    });
  }

  public dismissModal() {
    return new Promise<void>((resolve) => {
      this.currentModal.hide();
      resolve();
    });
  }

  public passData(data: any): Promise<void> {
    return new Promise((resolve) => {
      this.sourceData.next(data);
      resolve();
    });
  }

  public getData() {
    return this.sourceData.asObservable();
  }

  // transform address from
  public transformAddress(googleAddress: any, formGroupAddress: FormGroup) {
    console.log(googleAddress);
    // console.log(googleAddress.geometry.location.lat());
    // console.log(googleAddress.geometry.location.lng());

    return new Promise<void>((resolve) => {
      // console.log(googleAddress);
      formGroupAddress?.get('fullAddress')?.setValue(googleAddress.name);

      // for distance matrix
      const coords = {
        lat: googleAddress.geometry.location.lat(),
        long: googleAddress.geometry.location.lng(),
      };

      // set coordinates
      formGroupAddress?.get('coords')?.setValue(coords);

      googleAddress.address_components.forEach(
        (addresses: any, index: number) => {
          if (addresses['types'].some((type: string) => type === 'route')) {
            formGroupAddress?.get('street')?.setValue(addresses.long_name);
          }

          if (
            addresses['types'].some((type: string) => type === 'sublocality')
          ) {
            formGroupAddress?.get('area')?.setValue(addresses.long_name);
          }

          if (addresses['types'].some((type: string) => type === 'locality')) {
            formGroupAddress?.get('city')?.setValue(addresses.long_name);
          }

          if (
            addresses['types'].some(
              (type: string) => type === 'administrative_area_level_1'
            )
          ) {
            formGroupAddress?.get('state')?.setValue(addresses.long_name);
          }

          if (
            addresses['types'].some((type: string) => type === 'postal_code')
          ) {
            formGroupAddress?.get('postCode')?.setValue(Number(addresses.long_name));
          }
        }
      );

      resolve();
    });
  }

  public conversion(convertofWhat: string, value: number) {
    let convert = '';

    if (convertofWhat === 'seconds' || convertofWhat === 'duration' || convertofWhat === 'durationTraffic') {
      if (value < 60) {
        // hours
        convert = String(value) + ' seconds';
      } else if (value >= 60 && value < 3600) {
        // minutes
        // round to one decimal place
        let conversion = Math.round((((value + Number.EPSILON) / 60) * 1) / 1);
        convert = String(conversion) + ' minutes';
      } else if (value >= 3600 && value < 86400) {
        // hours
        // now minutes
        let conversion = Math.round((((value + Number.EPSILON) / 3600) * 1) / 1);
        convert = String(conversion) + ' hour';
      } else if (value >= 86400) {
        // day
        let conversion = Math.round((((value + Number.EPSILON) / 86400) * 1) / 1);
        convert = String(conversion) + ' day';
      }
    }

    if (convertofWhat === 'meters' || convertofWhat === 'distance') {
      if (value >= 1000) {
        // round 2 decimals
        let rounded = Math.round((value / 1000 + Number.EPSILON) * 10) / 10;
        convert = String(rounded) + ' Kilometers';
      } else {
        convert = String(value + ' Meters');
      }
    }

    return convert;
  }
}
