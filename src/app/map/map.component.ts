import { SpacePlotterService } from './space-plotter.service';
import { MapOptions, LayerOptions } from './../../../node_modules/@types/leaflet/index.d';
import { Component, AfterViewInit, signal, ViewChild, computed, effect, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { LINES } from '../constants/walls';
import { SPACE } from '../constants/space';
import { NAMES_LIST } from '../constants/names';
import { Space } from '../map/space-plotter.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('spaceModal') spaceModal: any;

  chosenDay: string = "Monday";

  json_url: string = 'https://raw.githubusercontent.com/va-made-web-projects/space-time-mapping-angular/main/src/assets/spaces.json';
  //json_url: string = "/assets/spaces.json"

    chosenSpace: any;

    visible: boolean = false;
    deskVisible: boolean = false;
    showingSpace: boolean = false;


    closeDialog() {
      this.visible = false;
      this.showingSpace = false;
      this.deskVisible = false;
    }

    ngOnInit() {

      this.visible = false;
      this.showingSpace = false;
      this.deskVisible = false;
      //wait for 500 ms
      setTimeout(() => {
        this.visible = false;
        this.showingSpace = false;
        this.deskVisible = false;
      }, 500);
    }

    onClickedOutside() {
      this.visible = false;
      this.showingSpace = false;
      this.deskVisible = false;
    }

    ngOnDestroy() {
      this.visible = false;
      this.showingSpace = false;
      this.deskVisible = false;
    }

    constructor(public spacePlotterService:SpacePlotterService) {
      effect(() => {
        if (this.spacePlotterService.showSpaceModal() != {} as Space) {
          this.chosenSpace = this.spacePlotterService.showSpaceModal();
          this.visible = true;
        }
      });
      effect(() => {
        if (this.spacePlotterService.showDeskModal() != {} as Space) {
          this.chosenSpace = this.spacePlotterService.showDeskModal();
          this.deskVisible = true;
        }
      });

   }

  private async initMap(): Promise<void> {
    let parsedSpace: Space[] = {} as Space[];
    await fetch(this.json_url).then(res => res.json() )
    .then(json => {
      parsedSpace = json.spaces;
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
      const desk_list = [];
      for (let j = 0; j < parsedSpace.length; j++) {
        let rects = this.spacePlotterService.plotSpace(parsedSpace[j]);
        let desks = this.spacePlotterService.plotDesks(parsedSpace[j], daysOfWeek[i]);
        space_list.push(rects);
        if (desks && desks.length > 0) {
          desk_list.push(...desks);

        }
      }
      space_rects.set(daysOfWeek[i], [...space_list, ...desk_list]);
    }

    const walls = L.polyline(
      LINES,
      wallStyle).bindPopup("Prosthetics Dept");

    const LayerGroups: any[] = [];


    space_rects.forEach((value: any[], key: string) => {
      if (value.length == 0) {
        return
      }
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

    map.on('baselayerchange', (e) => {
      this.chosenDay = e.name;
    });

    L.control.layers(baseMaps,{},{collapsed:false}).addTo(map);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
