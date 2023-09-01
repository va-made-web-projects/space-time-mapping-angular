import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { LINES } from '../constants/walls';

@Component({
  selector: 'app-floor-plan',
  templateUrl: './floor-plan.component.html',
  styleUrls: ['./floor-plan.component.scss']
})
export class FloorPlanComponent {
  json_url: string = '/assets/json_floorplan.json';

  private map: any;
  JSONLINES: any[] = [];

  private initMap(): void {
    // this.map = L.map('map', {
    //   center: [ 39.8282, -98.5795 ],
    //   zoom: 3
    // });


    const wallStyle = {
      color: 'black',
      fillColor: 'none',
      weight: 3,
      fillOpacity: 1
    };



    const walls = L.polyline(
      this.JSONLINES,
      wallStyle).bindPopup("Prosthetics Dept");


    const map = L.map('floorplan', {
        crs: L.CRS.Simple,
        minZoom: 0,
        layers: [walls],
        attributionControl:false
        // drawControl: true,
    });

    map.setView([650, 700], 0);
    map.setMinZoom(-3);
    map.setZoom(-1)

    }

  ngAfterViewInit(): void {
    fetch(this.json_url).then(res => res.json())
    .then(json => {
      this.JSONLINES = json.lines;
      this.initMap();

    });

  }

    constructor() {}

}
