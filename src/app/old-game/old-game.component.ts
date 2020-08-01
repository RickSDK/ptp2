import { Component, OnInit, ViewChild } from '@angular/core';
//import { BaseComponent } from '../base/base.component';
import { BaseHttpComponent } from '../base-http/base-http.component';
import { Router, ActivatedRoute } from '@angular/router';
import { PokerService } from '../poker.service';
import { RefDataModalComponent } from '../popups/ref-data-modal/ref-data-modal.component';
import { NumberModalComponent } from '../popups/number-modal/number-modal.component';
import { InfoPopupComponent } from '../popups/info-popup/info-popup.component';

declare var dateStampFromHtml5Time: any;
declare var minutesBetween2DateStamps: any;
declare var currencyObj: any;
declare var numberVal: any;
declare var $: any;
declare var getTextFieldValue: any;
declare var oracleDateStampFromDate: any;
declare var deleteThisGame: any;
declare var netTrackerUpdate: any;

@Component({
  selector: 'app-old-game',
  templateUrl: './old-game.component.html',
  styleUrls: ['./old-game.component.scss']
})
export class OldGameComponent extends BaseHttpComponent implements OnInit {
  @ViewChild(RefDataModalComponent) refDataModalComponent: RefDataModalComponent = new RefDataModalComponent(this._pokerService);
  @ViewChild(NumberModalComponent) numberModalComponent: NumberModalComponent = new NumberModalComponent;
  @ViewChild(InfoPopupComponent) infoPopupComponent: InfoPopupComponent = new InfoPopupComponent;

  public game: any;
  public gameId: number = 0;
  public gameTypes: any;
  public tournamentTypes: any;
  public stakes: any;
  public limits: any;
  public casino: string = '';
  public bankroll: string = '';
  public button2Idx = 0;
  public button3Idx = 0;
  public button4Idx = 0;
  public button5Idx = 0;
  public gameMinutes = 0;
  public rebuys = 0;
  public breakMinutes = 0;
  public selectedType = 0;
  public buyinObj = currencyObj(0);
  public buttonNum = 0;
  public newGameFlg: boolean = false;
  public cashoutObj = currencyObj(0);
  public tipsObj = currencyObj(0);
  public foodObj = currencyObj(0);
  public hourlyObj = currencyObj(0);
  public rebuyAmountObj = currencyObj(0);
  public formDisabledFlg = false;
  public changesMadeFlg = false;
  public profitObj: any;
  public liveFlg: boolean = false;
  public startDateObj = { id: 'startDate', name: 'Start Time', requiredFlg: true, value: '' }
  public endDateObj = { id: 'endDate', name: 'End Time', requiredFlg: true, errorMessage: '', value: '' }

  constructor(private _pokerService: PokerService, private router: Router, private route: ActivatedRoute) {
    super();
    this.route.queryParams
      .subscribe(params => {
        this.gameId = params.id;
        this.liveFlg = params.liveFlg == 'yes';
        if (this.gameId > 0) {
          this.title = 'Edit Game';
          this.game = this.getGameOfId(this.gameId);
          this.populateFormForGame();
        } else {
          this.title = (this.liveFlg) ? 'New Game' : 'Old Game';
          this.game = this.createNewGame();
          this.game.status = 'Completed';
          this.initializeForm();
        }
      });
  }
  ngOnInit(): void {

  }
  initializeForm() {
    this.allGames = this.loadGames();
    //netTrackerUpdate(this.allGames, this.game)
    this.gameTypes = this._pokerService.getDataTypes(0, 3, this.allGames);
    this.tournamentTypes = this._pokerService.getDataTypes(1, 2, this.allGames);
    this.stakes = this._pokerService.getDataTypes(2, 4, this.allGames);
    this.limits = this._pokerService.getDataTypes(3, 3, this.allGames);

    this.buttonIdx = 0;
    this.changeGameType(this.buttonIdx);

    this.bankroll = this._pokerService.getTopDataType(4, this.allGames);
    this.casino = this._pokerService.getTopDataType(5, this.allGames);
  }
  populateFormForGame() {
    this.buttonIdx = (this.game.type == 'Tournament') ? 1 : 0;

    this.gameTypes = [this.game.gameType, 'edit'];
    this.tournamentTypes = [this.game.tournamentType, 'edit'];
    this.stakes = [this.game.stakes, 'edit'];
    this.limits = [this.game.limit, 'edit'];

    this.bankroll = this.game.bankroll;
    this.casino = this.game.location;

    this.buyinObj = currencyObj(numberVal(this.game.buyin));
    this.cashoutObj = currencyObj(numberVal(this.game.cashout));
    this.tipsObj = currencyObj(numberVal(this.game.tips));
    this.foodObj = currencyObj(numberVal(this.game.food));
    this.rebuyAmountObj = currencyObj(numberVal(this.game.rebuyAmount));
    this.rebuys = this.game.rebuys;
    this.breakMinutes = this.game.breakMinutes;
    this.startDateObj.value = this.game.startTime;
    this.endDateObj.value = this.game.endTime;
    this.displayGameMinutes();
    console.log(this.game);
  }
  changeGameType(num: number) {
    this.changesMadeFlg = true;
    this.buttonIdx = num;
    if(this.buyinObj.amount==0) {
      var buyin = this._pokerService.getTopDataType(num + 6, this.allGames);
      this.buyinObj = currencyObj(numberVal(buyin));
      this.profitObj = currencyObj(buyin * -1);  
    }
  }
  timeChanged() {
    this.changesMadeFlg = true;
    this.game.startDate = $('#startDate').val();
    this.game.startDateTime = $('#startDateTimeField').val();
    this.game.endDate = $('#endDate').val();
    this.game.endDateTime = $('#endDateTimeField').val();
    this.game.startTime = dateStampFromHtml5Time(this.game.startDate, this.game.startDateTime);
    this.game.endTime = dateStampFromHtml5Time(this.game.endDate, this.game.endDateTime);
    this.displayGameMinutes();
  }
  displayGameMinutes() {
    this.gameMinutes = minutesBetween2DateStamps(this.game.startTime, this.game.endTime);
    if (this.gameMinutes == 0)
      this.endDateObj.errorMessage = 'Game cannot be zero minutes';
    if (this.gameMinutes < 0)
      this.endDateObj.errorMessage = 'End time must be after start time';

    this.displayProfit();
  }
  displayProfit() {
    this.profitObj = currencyObj(this.cashoutObj.amount + this.foodObj.amount - this.buyinObj.amount);
    if (this.gameMinutes > 0) {
      this.hourlyObj = currencyObj(this.profitObj.amount * 60 / this.gameMinutes);
    }
  }
  populateMainValues() {
    this.game.type = (this.buttonIdx == 0) ? 'Cash' : 'Tournament';
    this.game.gameType = this.gameTypes[this.button2Idx];
    if (this.buttonIdx == 0)
      this.game.stakes = this.stakes[this.button4Idx];
    else
      this.game.tournamentType = this.tournamentTypes[this.button3Idx];
    this.game.limit = this.limits[this.button5Idx];

    this.game.location = this.casino;
    this.game.bankroll = this.bankroll;
    this.game.tips = 0;
    this.game.food = 0;
    this.game.cashout = 0;
    this.game.rebuys = 0;
    this.game.breakMinutes = 0;
    this.game.rebuyAmount = 0;
    this.game.notes = '';
    this.game.buyin = this.buyinObj.amount;
  }
  startLiveGame() {
    this.populateMainValues();
    this.game.status = 'In Progress';
    this.game.cashout = this.game.buyin;
    this.game.startTime = oracleDateStampFromDate();
    this.game.endTime = oracleDateStampFromDate()
    console.log(this.game);
    this.saveThisGame(this.game);
    this.router.navigate(['/game-live'], { queryParams: { 'id': this.game.id } });
  }
  submitButtonPressed() {
    this.populateMainValues();
    this.game.tips = this.tipsObj.amount;

    if (this.buttonIdx == 0)
      this.game.food = this.foodObj.amount;

    this.game.cashout = this.cashoutObj.amount;
    this.game.rebuys = this.rebuys;
    this.game.breakMinutes = this.breakMinutes;
    this.game.rebuyAmount = this.rebuyAmountObj.amount;
    this.game.notes = getTextFieldValue('notes');

    console.log(this.game);
    this.saveThisGame(this.game);
    this.infoPopupComponent.show('Success!');

  }
  deleteGame() {
    deleteThisGame(this.game);
    this.infoPopupComponent.show('Success!');
  }
  okButtonPressed() {
    this.router.navigate(['']);
  }
  refDataButtonPressed(type: number, name: string, currentValue = '') {
    this.selectedType = type;
    this.refDataModalComponent.show(type, name, currentValue);
  }
  refDataSelected(value: string) {
    this.changesMadeFlg = true;
    if (this.selectedType == 0) {
      this.gameTypes[0] = value;
      this.button2Idx = 0;
    }
    if (this.selectedType == 1) {
      this.tournamentTypes[0] = value;
      this.button3Idx = 0;
    }
    if (this.selectedType == 2) {
      this.stakes[0] = value;
      this.button4Idx = 0;
    }
    if (this.selectedType == 3) {
      this.limits[0] = value;
      this.button5Idx = 0;
    }
    if (this.selectedType == 4) {
      this.bankroll = value;
    }
    if (this.selectedType == 5) {
      this.casino = value;
    }
  }
  segmentButtonClicked(num: number, type: number, name: string) {
    if (type == 0) {
      if (name == 'edit')
        this.refDataButtonPressed(type, 'Games');
      else
        this.button2Idx = num;
    }
    if (type == 1) {
      if (name == 'edit')
        this.refDataButtonPressed(type, 'Tournament Types');
      else
        this.button3Idx = num;
    }
    if (type == 2) {
      if (name == 'edit')
        this.refDataButtonPressed(type, 'Stakes');
      else
        this.button4Idx = num;
    }
    if (type == 3) {
      if (name == 'edit')
        this.refDataButtonPressed(type, 'Limits');
      else
        this.button5Idx = num;
    }
  }
  doInput(target: any) {
    //console.log('hey', target);
  }
  buttonNumberClicked(name: string, buttonNum: number, amount: number, currencyFlg = false) {
    this.buttonNum = buttonNum;
    this.numberModalComponent.show(name, amount, currencyFlg);
  }
  numberSelected(value: number) {
    this.changesMadeFlg = true;
    if (this.buttonNum == 1)
      this.buyinObj = currencyObj(value);
    if (this.buttonNum == 2)
      this.cashoutObj = currencyObj(value);
    if (this.buttonNum == 3)
      this.tipsObj = currencyObj(value);
    if (this.buttonNum == 4)
      this.foodObj = currencyObj(value);
    if (this.buttonNum == 5)
      this.rebuys = value;
    if (this.buttonNum == 6)
      this.rebuyAmountObj = currencyObj(value);
    if (this.buttonNum == 7)
      this.breakMinutes = value;

    if (this.buttonNum == 10)
      this.game.tournamentSpots = value;

    if (this.buttonNum == 11)
      this.game.tournamentPaid = value;

    if (this.buttonNum == 12)
      this.game.tournamentFinish = value;

    this.displayProfit();
  }

}

