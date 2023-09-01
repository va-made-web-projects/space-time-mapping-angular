import { SpacePlotterService } from './space-plotter.service';
import { MapOptions, LayerOptions } from './../../../node_modules/@types/leaflet/index.d';
import { Component, AfterViewInit, signal, ViewChild, computed, effect } from '@angular/core';
import * as L from 'leaflet';
import { LINES } from '../constants/walls';
import { SPACE } from '../constants/space';
import { NAMES_LIST } from '../constants/names';
import { Space } from '../map/space-plotter.service';

interface SpaceType {
  name: string;
  code: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('spaceModal') spaceModal: any;

  json_url: string = 'https://raw.githubusercontent.com/va-made-web-projects/space-time-mapping-angular/main/src/assets/spaces.json';

  spaceTypes: SpaceType[] | undefined;

  chosenSpace: any;

  selectedType: SpaceType | undefined;

    visible: boolean = false;

    ngOnInit() {
      this.visible = false;
        this.spaceTypes = [
            {name: 'Office', code: 'OF'},
            {name: 'Flex', code: 'FL'},
            {name: 'Unavailable', code: 'UN'},
            {name: 'Restroom', code: 'RS'},
            {name: 'Conference', code: 'CF'},
            ];
    }

    constructor(public spacePlotterService:SpacePlotterService) {
      effect(() => {
        if (this.spacePlotterService.showSpaceModal() != {} as Space) {
          this.chosenSpace = this.spacePlotterService.showSpaceModal();
          this.visible = true;
        }
      });

   }

  private async initMap(): Promise<void> {
    let parsedSpace: Space[] = {} as Space[];
    await fetch(this.json_url).then(res => res.json() )
    .then(json => {
      parsedSpace = json.spaces;
      console.log(parsedSpace);
    });

    const wallStyle = {
      color: 'black',
      fillColor: 'none',
      weight: 3,
      fillOpacity: 1
    };

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Overall"];
    let space_rects = new Map<string, any[]>();;

    for (let i = 0; i < daysOfWeek.length; i++) {
      const space_list = [];
      for (let j = 0; j < parsedSpace.length; j++) {
        console.log(parsedSpace[j].name);
        let space_rect = this.spacePlotterService.plotSpace(parsedSpace[j]);
        space_list.push(space_rect);
      }
      space_rects.set(daysOfWeek[i], space_list);
    }

    const walls = L.polyline(
      LINES,
      wallStyle).bindPopup("Prosthetics Dept");

    const LayerGroups: any[] = [];

    space_rects.forEach((value: any[], key: string) => {
      const layerList = [walls, ...value]
      LayerGroups.push(L.layerGroup(layerList));
  });

    const map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: 0,
        layers: [LayerGroups[0]],
        attributionControl:false
        // drawControl: true,
    });

    map.setView([650, 700], 0);
    map.setMinZoom(-3);
    map.setZoom(-1)

    const baseMaps = {
      "Monday": LayerGroups[0],
      "Tuesday": LayerGroups[1],
      "Wednesday": LayerGroups[2],
      "Thursday": LayerGroups[3],
      "Friday": LayerGroups[4],
      "Saturday": LayerGroups[5],
      "Sunday": LayerGroups[6],
      "Overall": LayerGroups[7]

    };

    map.on('baselayerchange', function(e) {
    console.log(e);
    });

    L.control.layers(baseMaps,{},{collapsed:false}).addTo(map);
  }

  ngAfterViewInit(): void {
    this.initMap();
    }
}
