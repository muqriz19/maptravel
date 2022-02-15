import { Address } from './address';

export class TravelPoints {
  private type: string;
  private address: Address;

  constructor(type: string, address: Address) {
    this.type = type;
    this.address = address;
  }

  public getType(): string {
    return this.type;
  }

  public getAddress(): string {
    return this.address.getAddress();
  }

  public getGAddress(): string {
    return this.address.getGAddress();
  }

  public getGeneralName(): string {
    return this.address.getGeneralName();
  }

  public getCoordinates(): any {
    return this.address.getCoordinates();
  }
}
