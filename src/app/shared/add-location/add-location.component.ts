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

  constructor(
    private fb: FormBuilder,
    private map: MapsService,
    private ui: UiService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.addLocationForm = this.fb.group({
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

    this.initMapAutoComplete();
  }

  private initMapAutoComplete() {
    const autocomplete = this.map.getGoogleAutocomplete('anotherAddress');

    // get address of clicking on the single address
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const addressFormGroup = this.addLocationForm.get('address') as FormGroup;

      if (place.address_components) {
        this.ui.transformAddress(place, addressFormGroup).then(() => {
          console.log(this.addLocationForm.get('address')!.value);
        });
      }
    });
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

  public dismissModal() {
    this.ui.dismissModal();
  }
}
