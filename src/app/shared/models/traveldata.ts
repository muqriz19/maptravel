export class TravelData {
  private distance: string;
  private distanceValue: number;
  private duration: string;
  private durationValue: number;
  private durationTraffic: string;
  private durationTrafficValue: number;

  constructor(
    distance: string,
    distanceValue: number,
    duration: string,
    durationValue: number,
    durationTraffic: string,
    durationTrafficValue: number
  ) {
    this.distance = distance;
    this.distanceValue = distanceValue;
    this.duration = duration;
    this.durationValue = durationValue;
    this.durationTraffic = durationTraffic;
    this.durationTrafficValue = durationTrafficValue;
  }

  public getValue(whatData: string) {
    let value = 0;
    switch (whatData) {
      case 'distance':
        value = this.distanceValue;  
      break;

      case 'duration':
        value = this.durationValue;  
      break;

      case 'durationTraffic':
        value = this.durationTrafficValue;  
      break;

      default:
        value = 0;
        break;
    }

    return value;
  }
}
