import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
@Component({
  selector: 'app-view-hand-popup',
  templateUrl: './view-hand-popup.component.html',
  styleUrls: ['./view-hand-popup.component.scss']
})
export class ViewHandPopupComponent extends BaseComponent implements OnInit {
  public hand: any;
  public displayMode: number = 0;
  public stages = ['Pre-flop', 'Flop', 'Turn', 'Final'];
  public stage = this.stages[0];

  constructor() { super(); }

  ngOnInit(): void {
  }
  show(hand: any) {
    this.hand = hand;
    console.log(hand);
    $('#viewHandPopup').modal();
  }
  changeStage(num: number) {
    if (this.displayMode == 0 && num < 0)
      return;
    if (this.displayMode == 3 && num > 0)
      return;
    this.displayMode += num;
    this.stage = this.stages[this.displayMode];
  }
}
