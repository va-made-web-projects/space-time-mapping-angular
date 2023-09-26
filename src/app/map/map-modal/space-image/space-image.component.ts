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
      if (current >= 0) {
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

  mapZeroToOneto255(value: number, min: number, max: number) {
    return Math.floor((value - min) * (255 - 0) / (max - min) + 0);
  }

  drawOverallDayRectangles(hours: any) {
    const daysAbv = ["M", "T", "W", "Th", "F", "Sa", "Su"]
    for (let i = 0; i < hours.length; i++) {
      for (let j = 0; j < hours[i].length; j++) {
        this.ctx.beginPath();
        this.ctx.font = "10px serif";
        this.ctx.fillStyle = "#000000"; //<=
        this.ctx.fillText(j, j * 12, 7);
        this.ctx.strokeStyle = 'black';

        const current =  hours[i][j]
        if (current >= 0) {
          let redColor = this.mapZeroToOneto255(current, 0, 1)
          this.ctx.fillStyle = `rgb(
            ${Math.floor(redColor + 25)},
            ${Math.floor(255 - redColor)},
            0)`;
          }
        if (current == 0) {
            this.ctx.fillStyle = `rgb(
              ${Math.floor(0)},
              ${Math.floor(255)},
              0)`;
          }
        this.ctx.rect(j * 12, 12 * i + 10, 10, 10);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
      }
      this.ctx.beginPath();
      this.ctx.font = "10px serif";
      this.ctx.fillStyle = "#000000"; //<=
      this.ctx.fillText(daysAbv[i], 0,  (i + 1.5) * 12);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  drawOverallRectangles(space: Space) {
    console.log(space.days);
    let all_hours: any[] = [];

    //combine hours array into one array
    let overallHours: any[][] = [];
    let days = space.days as any[];
    console.log(days);
    // make a list for each hour of the day
    for (let i = 0; i < 7; i++) {
      overallHours.push([]);
    }

    for (let i = 0; i < days.length; i++) {
      let day_average = []
      for (let j = 0; j < days[i].hours.length; j++) {
        //get the average of the array of hours
        let hourAverage = this.spacePlotterService.calculateAverage(days[i].hours[j]);
        day_average.push(hourAverage);
      }
      overallHours[i] = day_average;
    }
    console.log(overallHours);
    this.drawOverallDayRectangles(overallHours)
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
