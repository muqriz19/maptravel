import { TravelData } from './traveldata';

export class Calculate {
  private to: string;
  private from: string;
  private distanceOfAll: TravelData;

  constructor(from: string, to: string, distanceOfAll: TravelData) {
    this.to = to;
    this.from = from;
    this.distanceOfAll = distanceOfAll;
  }

  public getTo() {
    return this.to;
  }

  public getFrom() {
    return this.from;
  }

  public getValue(whatValue: string) {
    return this.distanceOfAll.getValue(whatValue);
  }
}
