import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Space, SpacePlotterService } from '../../space-plotter.service';

@Component({
  selector: 'app-space-image',
  templateUrl: './space-image.component.html',
  styleUrls: ['./space-image.component.scss']
})
export class SpaceImageComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('canvas') canvas: ElementRef | undefined;
  ctx: any;
  @Input({ required: true }) hours!: number[];
  @Input({ required: true }) visible!: boolean;
  @Input({ required: true }) choseSpace!: Space;
  @Input({ required: true }) day!: string;

  colorArr = ['redBg', 'greenBg', 'blueBg', 'whiteBg'];
  colVal = this.colorArr[0];
  currentHour: number = 0;
  currentOccupancy: number = 0;

  startTime: number =  0;
  interval: any;
  countAmt: number = 0;

  constructor(private spacePlotterService:SpacePlotterService) {
  }

  ngOnChanges() {
    //wait for 500 ms
    setTimeout(() => {
      this.ctx = this.canvas?.nativeElement.getContext('2d');
      this.ctx.clearRect(0, 0, 1000, 1000);
      if (this.day == 'Overall') {
        this.drawOverallRectangles(this.choseSpace);
      } else {
        this.drawDayRectangles(this.hours);
      }
    }, 500);
  }

  ngOnInit() {
  }

  drawDayRectangles(hours: any) {
    for (let i = 0; i < hours.length; i++) {
      for (let j = 0; j < hours[i].length; j++) {
        this.ctx.beginPath();
        this.ctx.font = "10px serif";
        this.ctx.fillStyle = "#000000"; //<=
        this.ctx.fillText(i, i * 12, 7);
        this.ctx.strokeStyle = 'black';

      this.ctx.font = "10px serif";
        this.ctx.fillStyle = "#000000"; //<=
        this.ctx.fillText(j, 0,  (j + 1.5) * 12);
      const current =  hours[i][j]
      if (current == 1) {
        this.ctx.fillStyle = `rgb(
          ${Math.floor(255)},
          ${Math.floor(0)},
          0)`;
        }
      if (current == 0) {
          this.ctx.fillStyle = `rgb(
            ${Math.floor(0)},
            ${Math.floor(255)},
            0)`;
        }
      this.ctx.rect(i * 12, 12 * j + 10, 10, 10);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.closePath();
      }
    }
  }

  drawOverallRectangles(space: Space) {
    console.log(space.days);
    let all_hours: any[] = [];

    //combine hours array into one array
    let overallHours: any[][] = [];
    let days = space.days as any[];
    // make a list for each hour of the day
    for (let i = 0; i < 24; i++) {
      overallHours.push([]);
    }

    for (let i = 0; i < days.length; i++) {
      for (let j = 0; j < days[i].hours.length; j++) {
        overallHours[j].push(days[i].hours);
      }
    }

    let overallAverage: any[] = [];
    for (let i = 0; i < overallHours.length; i++) {
      let dayAverage = []
      for (let j = 0; j < overallHours[i].length; j++) {
      const averageHours = this.spacePlotterService.getAverageArray(overallHours[i][j]);
      dayAverage.push(averageHours);
      }
      overallAverage.push(dayAverage);
    }

    console.log(overallAverage);
      // const averageHours = this.spacePlotterService.getAverageArray(dayHours);

    // });
    // console.log(overallHours);
    // for (let i = 0; i < days.length; i++) {

    //   overallHours = overallHours.concat(days[i].hours);
    // }
    // console.log(overallHours);

  }

  ngOnDestroy() {
  }


  ngAfterViewInit() {
    // this.cycleThruHours();
    // this.smoothSwitchColorGradient();
  }

  ngAfterViewChecked() {
    // this.cycleThruColors();

  }


}
