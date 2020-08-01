import { Component, OnInit, ViewChild } from '@angular/core';
import { Game } from '../classes/game';


declare var $: any;
declare var loadGames: any;
declare var saveGames: any;
declare var saveThisGame: any;
declare var createNewGame: any;
declare var getGameOfId: any;
declare var generateSummaryObj: any;
declare var drawGraph: any;
declare var formatNumberToLocalCurrency: any;
declare var currencyObj: any;
declare var getDateObjFromJSDate: any;
declare var loadDataFromLocalDb: any;
declare var saveDataToLocalDb: any;
declare var saveRecordToLocalDb: any;
declare var nowYear: any;
declare var getUserObj: any;

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  public title: string = 'title';
  public buttonIdx: number = 0;
  public graphType: number = 0;
  public lightColor: string = localStorage.lightColor || '#e6e15c';
  public darkColor: string = localStorage.darkColor || '#228822';
  public navBarColor: string = localStorage.navBarColor || '#006600';
  public grayColor: string = localStorage.grayColor || '#bbbbbb';
  public games: any[] = [];
  public allGames: any[] = [];
  public filteredGames: any[] = [];
  public changesMadeFlg: boolean = false;
  public items: any[] = [];
  public selectedYear: string = 'Last 10';
  public selectedGameType: string = 'All';
  public summaryObj: any;
  public segments = ['1', '2', '3'];
  public params: any;
  public currentYear = nowYear();
  public userObj: any;
  public loadingFlg = true;

  constructor() { }

  ngOnInit(): void {
  }

  getVersion() {
    var version = '2.0.5';
    if (this.isAndroidVersion())
      return 'Android '+version;
    else
      return 'Web'+version;
  }
  isAndroidVersion() {
    return false;
  }
  getUserObj() {
    return getUserObj();
  }
  segmentChanged(num: number) {
    this.changesMadeFlg = true;
    this.buttonIdx = num;
  }
  changesMade(input: any) {
    this.changesMadeFlg = true;
  }
  getGameOfId(gameId: number) {
    return getGameOfId(gameId);
  }
  localCurrency(amount: number) {
    return formatNumberToLocalCurrency(amount);
  }
  loadDataFromLocalDb(name: string) {
    return loadDataFromLocalDb(name);
  }
  saveDataToLocalDb(name: string, data: any) {
    saveDataToLocalDb(name, data);
  }
  saveRecordToLocalDb(name: string, newRecord: any) {
    saveRecordToLocalDb(name, newRecord);
  }
  getNewId(name: string) {
    var newId = 1;
    var records = this.loadDataFromLocalDb(name);
    records.forEach(record => {
      if (record.id >= newId)
        newId = record.id + 1;
    });
    return newId;
  }
  loadGames() {
    var games = loadGames();
    var scrubbedGames: any[] = [];
    games.forEach((game: any) => {
      var g: Game = new Game(game, game.id);
      scrubbedGames.push(g);
    });
    return scrubbedGames;
  }
  saveGames(games: any[]) {
    saveGames(games);
  }
  saveThisGame(game: any, addProfitFlg = false) {
    saveThisGame(game, addProfitFlg);
  }
  createNewGame() {
    return createNewGame();
  }
  currencyObj(amount: number) {
    return currencyObj(amount);
  }
  getDateObjFromJSDate(dateStr: string = '') {
    return getDateObjFromJSDate(dateStr);
  }
  loadColors() {
    this.lightColor = localStorage.lightColor || '#e6e15c';
    this.darkColor = localStorage.darkColor || '#228822';
    this.navBarColor = localStorage.navBarColor || '#006600';
    this.grayColor = localStorage.grayColor || '#bbbbbb';
  }
  ngClassSegment(num: number, buttonIdx: number) {
    if (num == buttonIdx)
      return 'btn btn-warning segmentButton roundButton';
    else
      return 'btn btn-success segmentButton roundButton';
  }
  ngStyleSegment(num: number, buttonIdx: number, formDisabledFlg = false) {
    if (formDisabledFlg)
      return this.ngStyleButton(1, true);
    if (num == buttonIdx)
      return this.ngStyleButton(2);
    else
      return this.ngStyleButton(1);
  }
  ngStyleButton(num: number, disabledFlg: boolean = false, hover = false, clicked = false) {
    if (disabledFlg)
      return { 'background-color': '#777', 'color': '#999' };
    if (clicked)
      return { 'background-color': 'black', 'color': 'white' };
    if (hover)
      return { 'background-color': 'white', 'color': 'black' };
    if (num == 1) // light colored
      return { 'background-color': this.lightColor, 'color': 'black' };
    if (num == 2) // dark colored
      return { 'background-color': this.darkColor, 'color': 'white' };
    if (num == 3) //gray
      return { 'background-color': 'gray', 'color': 'white' };
    if (num == 4) //red
      return { 'background-color': 'red', 'color': 'white' };
  }
  getNavBarColor() {
    return localStorage.navBarColor || '#006600';
  }
  ngStyleLightColor() {
    return { 'color': this.getLightColor() };
  }
  ngStyleNavBar() {
    return { 'background-color': this.getNavBarColor(), 'color': 'white' };
  }
  getDarkColor() {
    return localStorage.darkColor || '#228822';
  }
  ngStyleBackground() {
    return { 'background-color': this.getDarkColor(), 'color': 'white' };
  }
  getGrayColor() {
    return localStorage.grayColor || '#bbbbbb';
  }
  ngStyleGrayColor() {
    return { 'background-color': this.getGrayColor(), 'color': 'black' };
  }
  getLightColor() {
    return localStorage.lightColor || '#e6e15c';
  }
  ngStyleIcon(num: number) {
    if (num == 1) // light colored
      return { 'color': this.getLightColor() };
  }
  ngStylehighlightedValue() {
    return { 'background-color': this.lightColor, 'color': this.darkColor, 'padding': '3px', 'font-weight': '700' };
  }
  openModal(id: string) {
    $(id).modal();
  }
  closeModal(id: string) {
    $(id).modal('hide');
  }
  ngStyleSkill(skillNumber: number) {
    if (skillNumber == 5)
      return { 'background-color': '#00cc00' }
    if (skillNumber == 4)
      return { 'background-color': '#44ff00' }
    if (skillNumber == 3)
      return { 'background-color': 'yellow' }
    if (skillNumber == 2)
      return { 'background-color': 'orange' }
    if (skillNumber == 1)
      return { 'background-color': 'red', 'color': 'white' }
    if (skillNumber == 0)
      return { 'background-color': '#990000', 'color': 'white' }
  }
  yearChanged(year: string) {
    this.selectedYear = year;
    this.filterGames(true);
  }
  gameTypeChanged(gameType: string) {
    this.selectedGameType = gameType;
    this.filterGames(true);
  }
  filterGames(reverseSortFlg = false) {
    if (this.selectedYear == 'Last 10')
      reverseSortFlg = true;

    if (this.selectedYear == 'Top 5') {
      this.allGames.sort((curr: any, next: any) => {
        return curr.profit > next.profit ? -1 : 1;
      });
    } else {
      if (reverseSortFlg) {
        this.allGames.sort((curr: any, next: any) => {
          return curr.startTime > next.startTime ? -1 : 1;
        });
      } else {
        this.allGames.sort((curr: any, next: any) => {
          return curr.startTime < next.startTime ? -1 : 1;
        });
      }
    }
    var filteredGames: any[] = [];
    this.allGames.forEach(game => {
      if (!game.year)
        return;

      if ((this.selectedGameType == 'Cash' && game.type != 'Cash') || (this.selectedGameType == 'Tournament' && game.type != 'Tournament'))
        return;

      if (parseInt(this.selectedYear) > 0 && game.year != this.selectedYear)
        return;

      filteredGames.push(game);
    });
    if (this.selectedYear == 'Last 10')
      this.filteredGames = filteredGames.slice(0, 10);
    else if (this.selectedYear == 'Top 5')
      this.filteredGames = filteredGames.slice(0, 5);
    else
      this.filteredGames = filteredGames;

    console.log('filteredGames', this.selectedYear, this.filteredGames);
    this.summaryObj = generateSummaryObj(this.filteredGames);
    this.postFilterGames();
  }
  postFilterGames() {
    //override this function
  }
  drawGraph(toogleFlg = false) {
    if (toogleFlg)
      this.graphType = (this.graphType) ? 0 : 1;
    var e = document.getElementById('myCanvas');
    if (e)
      drawGraph(this.filteredGames, this.graphType, this.lightColor);
  }
  populateData(game: any) {
    var items = [];
    items.push({ name: 'Type', value: game.type })
    items.push({ name: 'Location', value: game.location })
    items.push({ name: 'Game', value: game.gameType })
    if (game.type == 'Cash')
      items.push({ name: 'Stakes', value: game.stakes })
    else
      items.push({ name: 'Tournament Type', value: game.tournamentType })
    items.push({ name: 'Limit', value: game.limit })
    items.push({ name: 'Date', value: game.localStartTime })
    items.push({ name: 'Weekday', value: game.weekday + ' ' + game.daytime })
    items.push({ name: 'Buyin', value: formatNumberToLocalCurrency(game.buyin) })
    if (game.rebuys > 0) {
      items.push({ name: 'Rebuys', value: game.rebuys })
      items.push({ name: 'Rebuy Amount', value: formatNumberToLocalCurrency(game.rebuyAmount) })
    }
    if (game.status == 'In Progress')
      items.push({ name: 'Chipstack', value: formatNumberToLocalCurrency(game.cashout) })
    else {
      items.push({ name: 'Cashout', value: formatNumberToLocalCurrency(game.cashout) })
      items.push({ name: 'Hours', value: game.hours })
    }
    if (game.tips > 0)
      items.push({ name: 'Tips', value: formatNumberToLocalCurrency(game.tips) })
    if (game.food > 0)
      items.push({ name: 'Food', value: formatNumberToLocalCurrency(game.food) })
    items.push({ name: 'Profit', value: formatNumberToLocalCurrency(game.profit) })
    if (game.breakMinutes > 0)
      items.push({ name: 'Break Minutes', value: game.breakMinutes })

    items.push({ name: 'Hourly', value: game.hourly })
    items.push({ name: 'ROI', value: game.roiStr })
    if (game.bankroll != 'Default')
      items.push({ name: 'Bankroll', value: game.bankroll })
    if (game.notes != '')
      items.push({ name: 'Notes', value: game.notes })
    return items;
  }
}

