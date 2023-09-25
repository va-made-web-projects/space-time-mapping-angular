import { Injectable, signal } from '@angular/core';
import * as L from 'leaflet';

export interface Space {
  name: string;
  description: string;
  types: string[]; // Assuming it can have multiple types, change to string if it's a single type
  occupancy_limit: number;
  occupancy: number;
  desks?: [number, number][];
  days?: any[];
  constraints: [number, number][];
}

export interface Desk {
  name: string;
  number: number;
  hours: number[];
  constraints: [number, number];
}

@Injectable({
  providedIn: 'root'
})
export class SpacePlotterService {
  public showSpaceModal = signal<Space>( {} as Space );
  public showDeskModal = signal<Space>( {} as Space );
  public deskSignal = signal<Desk>( {} as Desk );

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
        return {color: 'black', opacity: 0, fillOpacity: 0.25, fillColor: 'blue' };
      }
      else if (typeSet.has('office')) {
        return {color: 'black', opacity: 0, fillOpacity: 0.5, fillColor: 'green' };
      }
      else if (typeSet.has('clinic')) {
        return {color: 'black', opacity: 0, fillOpacity: 0.75, fillColor: 'pink' };
      }
    }
  }
  private parseDeskColor(occupied: number): any {
    if (occupied == 0) {
      return {color: 'black', opacity: 1, fillOpacity: 1, fillColor: 'green' };
    }
    else {
      return {color: 'black', opacity: 1, fillOpacity: occupied, fillColor: 'red' };
    }
  }

  private randomColor(): string {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }

  public plotSpace(space: Space): any {
    const space_style = this.parseTypeColor(space.types);
    let space_rect = L.rectangle([space.constraints as any], space_style)
    .bindTooltip(space.name, {permanent: true, direction:"center", className: 'tooltipclass'}).openTooltip().on('click',  () => {
      this.showSpaceModal.set(space);
    });
    this.showSpaceModal.set({} as Space);


    return space_rect;
  }

  public  plotDesks(space:Space, dayOfWeek:string): any {
    let desks: L.Rectangle<any>[] = []
    //combine space_rect and desk_rects into one list
    if (space.desks && space.days) {
      const day = space.days.find((day: any) => day.day == dayOfWeek);
      if (day == undefined) {
        return
      }
      const hours = day?.hours;

      //average all the lists into one list of 12 numbers
      const average_hours = this.getAverageArray(hours);
      let count = 0;
      for (var i = 0; i < space.desks.length; i++) {
        const deskHours = this.getNthElements(hours, i);
        const deskObj:Desk = {
          name: space.name,
          number: i,
          hours: deskHours,
          constraints: space.desks[i]
        };
        var desk = space.desks[i]
        let color = this.parseDeskColor(average_hours[count]);
        let desk_rects = L.rectangle([desk as any],color)
        .bindTooltip(count.toString(), {permanent: false, direction:"center", className: 'tooltipclass'}).openTooltip().on('click',  () => {
          this.showDeskModal.set(space);
          const number = count;
          this.deskSignal.set(deskObj);
          // console.log(this.showSpaceModal());
        });
        this.showDeskModal.set({} as Space);
        // this.deskSignal.set(null as any);
        count++;

        desks.push(desk_rects);
      }
    }
    return desks;
  }

  // Function to get all nth elements from the 2D array
 getNthElements(array: number[][], n: number): number[] {
  const nthElements: number[] = [];

  for (let i = 0; i < array.length; i++) {
    if (array[i].length > n) {
      nthElements.push(array[i][n]);
    }
  }

  return nthElements;
}


  public getAverageArray(arr: number[][]): number[] {
    let avgArr: number[] = [];
    for (let i = 0; i < arr[0].length; i++) {
      let sum = 0;
      for (let j = 0; j < arr.length; j++) {
        sum += arr[j][i];
      }
      avgArr.push(sum / arr.length);
    }
    return avgArr;
  }
}
