import { Component, Input, OnInit, effect } from '@angular/core';
import { Desk, SpacePlotterService } from '../space-plotter.service';

interface Day {
  day: string;
  hours: number[];
}

@Component({
  selector: 'app-desk-modal',
  templateUrl: './desk-modal.component.html',
  styleUrls: ['./desk-modal.component.scss']
})

export class DeskModalComponent implements OnInit {
  @Input({ required: true }) visible!: boolean;
  @Input({ required: true }) chosenSpace!: any;
  @Input({ required: true }) chosenDay!: any;

  hours: number[]= [];
  desk :Desk = {} as Desk;
  deskNumberString: string = "";
  currentDesk: number = 0;


  constructor(private spacePlotterService:SpacePlotterService) {
    effect(() => {
      if (this.spacePlotterService.deskSignal() != {} as Desk)  {
        this.desk = this.spacePlotterService.deskSignal();
        this.deskNumberString = "Desk: " + this.desk.number.toString();
        this.currentDesk = this.desk.number;
        this.hours = this.desk.hours;
      }
    });
   }

   ngOnChanges() {
    // find index of day in chosenSpace.days
    // if (this.chosenDay == undefined) {
    //   return
    // }
    // if (this.chosenSpace.days == undefined) {
    //   return
    // }
    // console.log(this.chosenSpace)
    //   let day = this.chosenSpace.days.find((selectedDay: Day) => selectedDay.day == this.chosenDay);
    //   if (day == undefined) {
    //     return
    //   }
    // this.hours = day.hours;

  }

  ngOnInit() {
    // filer chosenSpace.days for chosenDay


  }


}
