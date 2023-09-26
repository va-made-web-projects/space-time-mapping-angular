import { Component, Input, OnInit } from '@angular/core';

interface Day {
  day: string;
  hours: number[];
}

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss']
})

export class MapModalComponent implements OnInit {
  @Input({ required: true }) visible!: boolean;
  @Input({ required: true }) chosenSpace!: any;
  @Input({ required: true }) chosenDay!: any;

  hours: number[] = [];


  constructor() {
   }

   ngOnChanges() {
    // find index of day in chosenSpace.days
    if (this.chosenSpace == undefined) {
      return
    }
    if (this.chosenSpace.days == undefined ) {
      return
    }
    if (this.chosenDay == 'Overall') {
      this.hours = [0,0,0,0,0]
      return
    }


    let day = this.chosenSpace.days.find((selectedDay: Day) => selectedDay.day == this.chosenDay);
    if (day == undefined) {
      return
    }
    this.hours = day.hours;

  }

  ngAfterViewInit() {

  }

  ngOnInit() {
    // filer chosenSpace.days for chosenDay


  }


}
