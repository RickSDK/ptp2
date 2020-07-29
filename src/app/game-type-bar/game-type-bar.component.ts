import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-game-type-bar',
  templateUrl: './game-type-bar.component.html',
  styleUrls: ['./game-type-bar.component.scss']
})
export class GameTypeBarComponent extends BaseComponent implements OnInit {
  @Input('selectedGameType') selectedGameType: string = '';
  @Output() messageEvent = new EventEmitter<string>();

  public gameTypes = ['All', 'Cash', 'Tournament'];

  constructor() { super(); }

  ngOnInit(): void {
    if (this.selectedGameType == 'Cash')
      this.buttonIdx = 1;
    if (this.selectedGameType == 'Tournament')
      this.buttonIdx = 2;
  }
  changeType(num: number) {
    this.buttonIdx = num;
    this.messageEvent.emit(this.gameTypes[this.buttonIdx]);
  }

}
