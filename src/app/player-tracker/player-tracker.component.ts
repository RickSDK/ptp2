import { Component, OnInit, ViewChild } from '@angular/core';
import { PlayerTrackerPopupComponent } from '../player-tracker-popup/player-tracker-popup.component';
import { BaseComponent } from '../base/base.component';
import { PokerService } from '../poker.service';

@Component({
  selector: 'app-player-tracker',
  templateUrl: './player-tracker.component.html',
  styleUrls: ['./player-tracker.component.scss']
})
export class PlayerTrackerComponent extends BaseComponent implements OnInit {
  @ViewChild(PlayerTrackerPopupComponent) playerTrackerPopupComponent: PlayerTrackerPopupComponent = (new PlayerTrackerPopupComponent(this._pokerService));
  public playersList = [];

  constructor(private _pokerService: PokerService) { super(); }

  ngOnInit(): void {
    this.playersList = this.loadDataFromLocalDb('playersList');
    console.log(this.playersList );

  }
  rightButtonPressed() {
    this.playerTrackerPopupComponent.show(null);
  }
  playerCreated(msg:string) {
    this.playersList = this.loadDataFromLocalDb('playersList');
  }
}
