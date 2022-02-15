export class Address {
  private generalName: string;
  private street: string;
  private streetNo: number;
  private area: string;
  private state: string;
  private city: string;
  private postcode: number;
  private coordinates: any;
  private googleAddress: string;

  constructor(
    generalName: string,
    street: string,
    streetNo: number,
    area: string,
    state: string,
    city: string,
    postcode: number,
    coordinates: any,
    googleAddress: string
  ) {
    this.generalName = generalName;
    this.coordinates = coordinates;
    this.streetNo = streetNo;
    this.street = street;
    this.area = area;
    this.state = state;
    this.city = city;
    this.postcode = postcode;
    this.googleAddress = googleAddress;
  }

  public getAddress(): string {
    return `
    ${this.streetNo === 0 ? '' : this.streetNo}${
      this.streetNo !== 0 ? ',' : ''
    } 
    ${this.street}${this.street !== '' ? ',' : ''} 
    ${this.area}${this.area !== '' ? ',' : ''} 
    ${this.city}${this.city !== '' ? ',' : ''} 
    ${this.postcode}${this.postcode !== 0 ? ',' : ''} 
    ${this.state}${this.state !== '' ? ',' : ''}`;
  }

  public getGAddress() {
    return this.googleAddress;
  }

  public getCoordinates(): any {
    return this.coordinates;
  }
}
