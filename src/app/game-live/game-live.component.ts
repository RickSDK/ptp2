import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatesService } from '../dates.service';
import { RefDataModalComponent } from '../popups/ref-data-modal/ref-data-modal.component';
import { NumberModalComponent } from '../popups/number-modal/number-modal.component';
import { InfoPopupComponent } from '../popups/info-popup/info-popup.component';
import { GameInfoPopupComponent } from '../popups/game-info-popup/game-info-popup.component';
import { TextEntryPopupComponent } from '../popups/text-entry-popup/text-entry-popup.component';
import { PokerService } from '../poker.service';

declare var getDateObjFromJSDate: any;
declare var drawGraph: any;

@Component({
  selector: 'app-game-live',
  templateUrl: './game-live.component.html',
  styleUrls: ['./game-live.component.scss']
})
export class GameLiveComponent extends BaseComponent implements OnInit {
  @ViewChild(RefDataModalComponent) refDataModalComponent: RefDataModalComponent = new RefDataModalComponent(this._pokerService);
  @ViewChild(NumberModalComponent) numberModalComponent: NumberModalComponent = new NumberModalComponent;
  @ViewChild(InfoPopupComponent) infoPopupComponent: InfoPopupComponent = new InfoPopupComponent;
  @ViewChild(GameInfoPopupComponent) gameInfoPopupComponent: GameInfoPopupComponent = new GameInfoPopupComponent;
  @ViewChild(TextEntryPopupComponent) textEntryPopupComponent: TextEntryPopupComponent = new TextEntryPopupComponent;
  public game: any;
  public timer: string = '';
  public buttonNum: number = 0;
  public cashoutObj: any;
  public foodObj: any;
  public tipsObj: any;

  public items:any[] = [];
  public buttons:any[] = [
    { icon: 'comment', name: 'Notes' },
    { icon: 'pencil', name: 'Edit' },
    { icon: 'user-secret', name: 'HUD' }];

  constructor(private _pokerService: PokerService, private router: Router, private route: ActivatedRoute, private _dateService: DatesService) {
    super();
    this.route.queryParams
      .subscribe(params => {
        var gameId = params.id;
        this.game = this.getGameOfId(gameId);
      });
  }
  ngOnInit(): void {
    this.displayTimer();
    this.displayGameData();
    console.log(this.game);
    if (this.game.profitRecords) {
      setTimeout(() => {
        drawGraph(this.game.profitRecords, 0, this.darkColor, "myCanvas");
      }, 100);
    }

  }
  confirmButtonClicked() {
    var obj = getDateObjFromJSDate();
    this.game.endTime = obj.oracle;
    this.game.status = 'Completed';
    this.saveThisGame(this.game);
    this.infoPopupComponent.show('Success!');
  }
  displayGameData() {
    this.items = this.populateData(this.game);
    this.cashoutObj = this.currencyObj(this.game.cashout);
    this.foodObj = this.currencyObj(this.game.food);
    this.tipsObj = this.currencyObj(this.game.tips);
    drawGraph(this.game.profitRecords, 0, this.darkColor, "myCanvas");
  }
  buttonPressed(button: any) {
    if (button.name == 'Notes')
      this.textEntryPopupComponent.show('message');
    if (button.name == 'Edit')
      this.router.navigate(['/old-game'], { queryParams: { 'id': this.game.id } });
    if (button.name == 'HUD')
      this.router.navigate(['/hud'], { queryParams: { 'id': this.game.id } });
  }
  buttonNumberClicked(name: string, buttonNum: number, amount: number, currencyFlg = false) {
    this.buttonNum = buttonNum;
    this.numberModalComponent.show(name, amount, currencyFlg);
  }
  infoButtonClicked(name:string) {
    this.gameInfoPopupComponent.show();
  }
  displayTimer() {
    this.timer = this._dateService.clockSinceStartTime(this.game.startTime);
    var e = document.getElementById('ptpClock');
    if (e) {
      setTimeout(() => {
        this.displayTimer();
      }, 1000);
    }
  }
  okButtonPressed() {
    this.router.navigate(['/']);
  }
  refreshScreen() {
    this.buttonNum = 0;
    this.numberSelected(0);
  }
  numberSelected(amount: number) {
    this.game.endTime = this._dateService.oracleDateStampFromDate();
    if (this.buttonNum == 1) {
      if (!this.game.profitRecords) {
        this.game.profitRecords = [];
        this.game.profitRecords.push({ startTime: this.game.startTime, profit: 0, gameId: this.game.id });
      }
      this.game.cashout = amount;
    }
    if (this.buttonNum == 2) {
      this.game.food = amount;
    }
    if (this.buttonNum == 3) {
      this.game.tips = amount;
    }
    this.saveThisGame(this.game, (this.buttonNum == 1));
    this.displayGameData();
  }
  refDataSelected(name: string) {
    console.log(name);
  }

}
