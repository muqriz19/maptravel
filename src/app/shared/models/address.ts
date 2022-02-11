export class Address {
  private fullAddress: string;
  private coordinates: any;

  private street: string;
  private area: string;
  private state: string;
  private city: string;
  private postcode: number;

  constructor(
    fullAddress: string,
    street: string,
    area: string,
    state: string,
    city: string,
    postcode: number,
    coordinates: any
  ) {
    this.fullAddress = fullAddress;
    this.coordinates = coordinates;

    this.street = street;
    this.area = area;
    this.state = state;
    this.city = city;
    this.postcode = postcode;
  }

  public getAddress(): string {
    return `${this.street}${this.street !== '' ? ',' : ''} 
    ${this.area}${this.area !== '' ? ',' : ''} 
    ${this.city}${this.city !== '' ? ',' : ''} 
    ${this.postcode}${this.postcode !== 0 ? ',' : ''} 
    ${this.state}${this.state !== '' ? ',' : ''}`;
  }

  public getFullAddress(): string {
    return this.fullAddress;
  }

  public getCoordinates(): any {
    return this.coordinates;
  }
}
