import { Desk, Space, SpacePlotterService } from '../../space-plotter.service';
import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild, effect } from '@angular/core';

@Component({
  selector: 'app-desk-hour-image',
  templateUrl: './desk-hour-image.component.html',
  styleUrls: ['./desk-hour-image.component.scss']
})
export class DeskHourImageComponent implements OnInit{

  @ViewChild('canvas') canvas: ElementRef | undefined;
  ctx: any;
  @Input({ required: true }) hours!: number[];
  @Input({ required: true }) visible!: boolean;


  running: boolean = false;
  colorArr = ['redBg', 'greenBg', 'blueBg', 'whiteBg'];
  colVal = this.colorArr[0];
  currentHour: number = 0;
  currentOccupancy: number = 0;

  startTime: number =  0;
  interval: any;
  countAmt: number = 0;
  chosenDesk: Desk = {} as Desk;

  constructor(private spacePlotterService:SpacePlotterService) {
    effect(() => {
      if (this.spacePlotterService.deskSignal() != {} as Desk) {
        this.chosenDesk = this.spacePlotterService.deskSignal();

        // wait for 500 ms
        setTimeout(() => {
          this.ctx = this.canvas?.nativeElement.getContext('2d');
          this.ctx.clearRect(0, 0, 1000, 1000);
          this.drawRectangle();
        }, 500);
        // this.drawRectangle();
      }
    });
  }

  drawRectangle() {

      for (let i = 0; i < 24; i++) {
        this.ctx.beginPath();
        this.ctx.font = "10px serif";
        this.ctx.fillStyle = "#000000"; //<=
        this.ctx.fillText(i, i * 12, 7);
        this.ctx.strokeStyle = 'black';
        const current =  this.hours[i]

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
        this.ctx.rect(i * 12 , 10, 10, 10);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
      }
  }

  ngOnInit() {

  }

}
