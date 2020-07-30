import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;

@Component({
  selector: 'app-hud-popup',
  templateUrl: './hud-popup.component.html',
  styleUrls: ['./hud-popup.component.scss']
})
export class HudPopupComponent extends BaseComponent implements OnInit {
  public num = 0;
  public buttons = ['HUD','VPIP','PFR','AF'];

  constructor() { super(); }

  ngOnInit(): void {
  }
  show(num: number) {
    this.buttonIdx = num;
    console.log(this.buttonIdx, num);
    $('#hudPopup').modal();
  }
}
