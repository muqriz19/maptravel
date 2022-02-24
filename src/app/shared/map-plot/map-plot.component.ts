import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { AlertsService } from '../alerts/alerts/alerts.service';
import { MapsService } from '../maps/maps.service';
import { Address } from '../models/address';
import { UiService } from '../ui/ui.service';

@Component({
  selector: 'app-map-plot',
  templateUrl: './map-plot.component.html',
  styleUrls: ['./map-plot.component.less'],
})
export class MapPlotComponent implements OnInit, AfterViewInit {
  public isFirstTime = true;

  private allPoints: any[] = [];
  private directionsRendererArray: any[] = [];
  private allMarkers: any[] = [];

  private google: any;
  private gMap: any;

  private currentIndex = 0;
  private nextIndex = 0;

  public mapStyles = {
    height: '',
    width: '',
  };

  constructor(
    private map: MapsService,
    private ui: UiService,
    private alert: AlertsService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.init();
  }

  private init(): void {
    // receive data from first time address
    this.ui.getData().subscribe((data) => {
      if (data !== null && this.isFirstTime) {
        const address = (data.address as Address).getGAddress();
        const lat = (data.address as Address).getCoordinates().lat;
        const long = (data.address as Address).getCoordinates().long;

        this.initMap(lat, long);
        this.addPoint(lat, long, address);

        this.isFirstTime = false;
      } else if (data !== null && this.isFirstTime === false) {
        const address = (data.address as Address).getGAddress();
        const lat = (data.address as Address).getCoordinates().lat;
        const long = (data.address as Address).getCoordinates().long;

        this.addPoint(lat, long, address);
      }
    });

    this.ui.getActions().subscribe((action: string) => {
      if (action === 'reset') {
        this.reset();
      }
    });
  }

  private initMap(lat: number, long: number) {
    this.google = this.map.getGoogle();

    const centerCoords = {
      lat,
      lng: long,
    };

    this.gMap = new this.google.maps.Map(
      document.getElementById('map-plot') as HTMLElement,
      {
        zoom: 15,
        center: centerCoords,
      }
    );

    setTimeout(() => {
      // console.log(this.el.nativeElement);
      const tempHeight = this.el.nativeElement.parentElement.clientHeight;
      const height = String(tempHeight < 500 ? 500 : tempHeight - 50) + 'px';

      const tempWidth =
        this.el.nativeElement.parentElement.parentElement.clientWidth;
      const width = String(tempWidth < 300 ? 300 : tempWidth - 50) + 'px';

      this.mapStyles.height = height;

      this.mapStyles.width = width;

      console.log(this.mapStyles);
    }, 500);
  }

  private addPoint(lat: number, long: number, address: string) {
    this.allPoints.push({
      coords: {
        lat,
        lng: long,
      },
      meta: {
        address,
      },
    });

    this.calculateRoute();
  }

  private calculateRoute(): void {
    if (this.allPoints.length > 1) {
      this.nextIndex = this.currentIndex + 1;

      const fromAddress = this.allPoints[this.currentIndex].meta.address;

      const toAddress = this.allPoints[this.nextIndex].meta.address;

      this.map
        .googleDirection(fromAddress, toAddress)
        .then((response: any) => {
          const directionRenderer = new this.google.maps.DirectionsRenderer({
            map: this.gMap,
            preserveViewport: true,
            suppressMarkers: true,
          });

          directionRenderer.setDirections(response);
          this.directionsRendererArray.push(directionRenderer);

          const path = response.routes[0].overview_path;
          const fromLat = path[0].lat();
          const fromLong = path[0].lng();

          const fromCoords = { lat: fromLat, lng: fromLong };

          const toLat = path[path.length - 1].lat();
          const toLong = path[path.length - 1].lng();

          const toCoords = { lat: toLat, lng: toLong };

          this.addMarker(fromCoords, toCoords);

          this.currentIndex++;
        })
        .catch((e) => {
          this.alert.displayAlerts('danger', e);
        });
    }
  }

  private addMarker(fromCoords: any, toCoords: any) {
    const markerStart = new this.google.maps.Marker({
      position: fromCoords,
      label: String(this.currentIndex + 1),
      map: this.gMap,
    });

    const markerEnd = new this.google.maps.Marker({
      position: toCoords,
      label: String(this.nextIndex + 1),
      map: this.gMap,
    });

    this.allMarkers.push(markerStart);
    this.allMarkers.push(markerEnd);
  }

  private reset(): void {
    this.currentIndex = 0;
    this.nextIndex = 0;

    this.allPoints.splice(1);

    this.directionsRendererArray.forEach((dr) => {
      dr.setMap(null);
    });

    this.directionsRendererArray = [];

    this.allMarkers.forEach((mrk) => {
      mrk.setMap(null);
    });

    this.allMarkers = [];
  }
}
