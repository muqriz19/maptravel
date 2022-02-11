import { Injectable } from '@angular/core';
import { Calculate } from '../models/calculate';
import { TravelData } from '../models/traveldata';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  constructor() {}

  public getGeoLocations() {
    return new Promise<GeolocationPosition>((resolve) => {
      // check if can get location
      // return GeolocationPosition
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve(position);
        });
      } else {
        // if not return default KL lat and long
        let geoPosition = {
          coords: {
            latitude: 3.139003,
            longitude: 101.686852,
          },
        };

        resolve(geoPosition as GeolocationPosition);
      }
    });
  }

  public getGoogle() {
    console.log(google);

    return google;
  }

  public getGoogleAutocomplete(
    inputHTMLID: string,
    value?: string,
    anyBounds?: any
  ) {
    const startInputAddress = document.getElementById(
      inputHTMLID
    ) as HTMLInputElement;

    startInputAddress.value = value ? value : '';

    console.log(startInputAddress);

    // const bounds = {
    //   north: this.currentLat + 0.1,
    //   south: this.currentLat - 0.1,
    //   east: this.currentLong + 0.1,
    //   west: this.currentLong - 0.1,
    // };

    const options = {
      // bounds,
      componentRestrictions: { country: 'my' },
      fields: ['address_components', 'geometry', 'name'],
      strictBounds: false,
      // types: ['address'],
    };

    const google = this.getGoogle();

    const autocomplete = new google.maps.places.Autocomplete(
      startInputAddress,
      options
    );

    return autocomplete;
  }

  public geoCode(givenAddress: string) {
    return new Promise((resolve, reject) => {
      const google = this.getGoogle();
      const geoCoder = new google.maps.Geocoder();

      const addressObj = { address: givenAddress };

      geoCoder.geocode(addressObj, (result: any, status: string) => {
        console.log(result);
        // console.log(status);

        if (status === 'OK') {
          const location = result[0].geometry.location;

          resolve(location);
        } else {
          reject('Cannot geocode because ' + status);
        }
      });
    });
  }

  public reverseGeoCode(lat: number, long: number) {
    return new Promise((resolve, reject) => {
      const google = this.getGoogle();

      const geoCoder = new google.maps.Geocoder();
      const location = { lat, lng: long };

      geoCoder
        .geocode({ location })
        .then((response: any) => {
          console.log(response);

          if (response.results[0]) {
            const address = response.results[0].formatted_address as string;
            resolve(address);
          } else {
            reject('No results found');
          }
        })
        .catch((e: any) => window.alert('Geocoder failed due to: ' + e));
    });
  }

  public googleDistanceMatrix(
    originCoords: any,
    originName: string,
    destCoords: any,
    destName: string
  ): Promise<Calculate> {
    return new Promise((resolve) => {
      console.log(originName);
      console.log(destName);

      const google = this.getGoogle();

      const googleOrignCoords = new google.maps.LatLng(
        originCoords.lat,
        originCoords.long
      );
      const googleDestinationCoords = new google.maps.LatLng(
        destCoords.lat,
        destCoords.long
      );

      let service = new google.maps.DistanceMatrixService();

      // set up traffic coditions
      const drivingOptions = {
        departureTime: new Date(),
        trafficModel: 'pessimistic',
      };

      service.getDistanceMatrix(
        {
          origins: [googleOrignCoords, originName],
          destinations: [googleDestinationCoords, destName],
          travelMode: 'DRIVING',
          drivingOptions: drivingOptions,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        },
        async (resp: any, status: any) => {
          const data = await this.parseDistanceResults(resp, status);
          resolve(data);
        }
      );
    });
  }

  public parseDistanceResults(
    response: any,
    status: string
  ): Promise<Calculate> {
    console.log(response);
    // console.log(status);

    return new Promise((resolve) => {
      if (status == 'OK') {
        // index 0 this is the most accurate of address
        // if not mistaken the second element gives the one i gave
        let origin = response.originAddresses[0];
        let destination = response.destinationAddresses[0];

        let element = response.rows[0].elements[0];

        let distance = element.distance.text;
        let distanceValue = element.distance.value;

        let duration = element.duration.text;
        let durationValue = element.duration.value;

        let durationInTraffic = element.duration_in_traffic.text;
        let durationInTrafficValue = element.duration_in_traffic.value;

        let travelData = new TravelData(
          distance,
          distanceValue,
          duration,
          durationValue,
          durationInTraffic,
          durationInTrafficValue
        );

        console.log(travelData);

        const calculateDistance = new Calculate(
          origin,
          destination,
          travelData
        );

        resolve(calculateDistance);
      }
    });
  }
}
