import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base/base.component';

declare var $: any;
declare var clockSinceStartTime: any;

@Component({
  selector: 'app-pause-popup',
  templateUrl: './pause-popup.component.html',
  styleUrls: ['./pause-popup.component.scss']
})
export class PausePopupComponent extends BaseComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();

  public timer:string = '00';
  public breakMinutes: number;
  public seconds: number;
  public pauseTime: string;

  constructor() { super(); }

  ngOnInit(): void {
  }

  show(breakMinutes:number, pauseTime:string) {
    this.breakMinutes = breakMinutes;
    this.pauseTime = pauseTime;
    this.displayTimer();
    $('#pausePopup').modal();
  }

  playButtonClicked() {
    this.closeModal('#pausePopup');
    this.messageEvent.emit('ok');
  }
  displayTimer() {
    setTimeout(() => {
      this.displayTimerBG();
    }, 1000);
  }
  displayTimerBG() {
    this.timer = clockSinceStartTime(this.pauseTime);
    var e = document.getElementById('ptpPauseClock');
    if (e) {
      setTimeout(() => {
        this.displayTimerBG();
      }, 1000);
    }
  }

}
