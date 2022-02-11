import { Address } from './address';

export class TravelPoints {
  private type: string;
  private address: Address;

  constructor(type: string, address: Address) {
    this.type = type;
    this.address = address;
  }

  public getType() {
    return this.type;
  }

  public getAddress() {
    return this.address.getAddress();
  }

  public getCoordinates() {
    return this.address.getCoordinates();
  }

  public getFullAddress() {
    return this.address.getFullAddress();
  }
}
