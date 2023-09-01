import { Injectable, signal } from '@angular/core';
import * as L from 'leaflet';

export interface Space {
  name: string;
  description: string;
  types: string[]; // Assuming it can have multiple types, change to string if it's a single type
  occupancy_limit: number;
  occupancy: number;
  constraints: [number, number][];
}

@Injectable({
  providedIn: 'root'
})
export class SpacePlotterService {
  public showSpaceModal = signal<Space>( {} as Space );

  constructor() { }

  private parseTypeColor(type: string[]): any {
    if (type.length == 0) {
      return {color: 'black', opacity: 0, fillOpacity: 0.75, fillColor: 'black' };
    }
    else {
      let typeSet = new Set(type);
      if (typeSet.has('ineligible')) {
        return {color: 'black', opacity: 0, fillOpacity: 0.75, fillColor: 'gray' };
      }
      else if (typeSet.has('float')) {
        return {color: 'black', opacity: 0, fillOpacity: 0.75, fillColor: 'blue' };
      }
      else if (typeSet.has('office')) {
        return {color: 'black', opacity: 0, fillOpacity: 0.75, fillColor: 'green' };
      }
      else if (typeSet.has('clinic')) {
        return {color: 'black', opacity: 0, fillOpacity: 0.75, fillColor: 'pink' };
      }
    }
  }

  private randomColor(): string {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }

  public plotSpace(space: Space): any {
    const space_style = this.parseTypeColor(space.types);
    let space_rect = L.rectangle([space.constraints as any], space_style)
      .bindTooltip(space.name, {permanent: true, direction:"center", className: 'tooltipclass'}).openTooltip().on('click',  () => {
        this.showSpaceModal.set({} as Space);

        this.showSpaceModal.set(space);
        console.log(this.showSpaceModal());
      });
    return space_rect;
  }
}
