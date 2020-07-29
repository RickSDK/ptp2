import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseHttpComponent } from '../base-http/base-http.component';
import { Router } from '@angular/router';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { InfoPopupComponent } from '../popups/info-popup/info-popup.component';
import { Hand } from '../classes/hand';
import { Game } from '../classes/game';
import { Filter } from '../classes/filter';
import { Player } from '../classes/player';

declare var $: any;
declare var saveThisGame: any;
declare var gameFromLine: any;
declare var bigHandFromLine: any;
declare var playerFromLine: any;
declare var filterFromLine: any;
declare var packageBigHands: any;
declare var packagePlayers: any;
declare var packageFilters: any;
declare var packageGamess: any;

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent extends BaseHttpComponent implements OnInit {
  @ViewChild(ConfirmationPopupComponent) confirmationPopupComponent: ConfirmationPopupComponent;
  @ViewChild(InfoPopupComponent) infoPopupComponent: InfoPopupComponent;
  public selectedOption: number;
  public blockNum = 0;
  public title = 'Options';
  public lastExportCount: string = localStorage.lastExportCount || 'never';
  public lastImportText: string = localStorage.lastImportText || 'never';

  public options = [
    { id: 1, icon: 'fa-upload', name: 'Export', hover: false },
    { id: 2, icon: 'fa-download', name: 'Import', hover: false },
    { id: 3, icon: 'fa-trash', name: 'Clear All Server Data', hover: false },
    { id: 4, icon: 'fa-arrow-down', name: 'Import Poker Journal Data', hover: false },
    { id: 5, icon: 'fa-arrow-down', name: 'Import Poker Income Data', hover: false },
    { id: 6, icon: 'fa-trash', name: 'Delete All Data', hover: false },
    { id: 7, icon: 'fa-paint-brush', name: 'Edit Colors & Theme', hover: false },
  ];
  public importObject: any;
  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.allGames = this.loadGames();
    this.userObj = this.getUserObj();
    console.log(this.userObj);
  }
  buttonClicked(option) {
    this.selectedOption = option.id;
    if (option.id <= 5 && !this.userObj.firstName) {
      this.infoPopupComponent.show('You must be logged in to use this feature.');
      return;
    }
    if (option.id == 1 || option.id == 2)
      this.confirmationPopupComponent.show(option.name + '?');
    if (option.id == 3 || option.id == 4 || option.id == 5)
      this.infoPopupComponent.show('Not coded yet');
    if (option.id == 6)
      this.confirmationPopupComponent.show('Permanently delete All games and data on this device? Note, this cannot be un-done.');
    if (option.id == 7) {
      this.router.navigate(['color-themes']);
    }
  }
  loginComplete(mes: string) {
    this.userObj = this.getUserObj();
    console.log('login complete!');
  }
  getinitializedImportObject() {
    return {
      gamesOnServer: 0,
      gamesImported: 0,
      handsOnServer: 0,
      handsImported: 0,
      playersOnServer: 0,
      playersImported: 0,
      filtersOnServer: 0,
      filtersImported: 0
    };
  }
  addImportObjectValues(obj: any) {
    this.importObject.gamesOnServer += obj.gamesOnServer;
    this.importObject.gamesImported += obj.gamesImported;
    this.importObject.handsOnServer += obj.handsOnServer;
    this.importObject.handsImported += obj.handsImported;
    this.importObject.playersOnServer += obj.playersOnServer;
    this.importObject.playersImported += obj.playersImported;
    this.importObject.filtersOnServer += obj.filtersOnServer;
    this.importObject.filtersImported += obj.filtersImported;
  }
  confirmButtonClicked(message: string) {
    if (this.selectedOption == 1) {
      this.startSpinner();
      this.exportData();
    }
    if (this.selectedOption == 2) {
      this.startSpinner();
      this.importObject = this.getinitializedImportObject();
      this.executeApi('ImportData.php');
    }
    if (this.selectedOption == 6) {
      localStorage.removeItem("ptpGames");
      localStorage.removeItem("handList");
      localStorage.removeItem("playersList");
      localStorage.removeItem("filterList");
      this.infoPopupComponent.show('All data has been deleted.');
    }
  }
  postSuccessApi(filename: string, data: string) {
    if (filename == "ImportData.php") {
      this.processImportData(data);
    }
    if (filename == "ImportData2.php") {
      this.inportData2(data);
      localStorage.lastImportText = this.allGames.length+ ' games';
      this.lastImportText = this.allGames.length + ' games';
    }
    if (filename == "ExportData.php") {
      console.log('ExportData done!!');
    }
    if (filename == "ExportData2.php") {
      console.log('ExportData2 done!!');
      localStorage.lastExportCount = this.allGames.length+ ' games';
      this.lastExportCount = this.allGames.length + ' games';
      this.setApiMessage('Success');
    }
  }
  exportData() {
    this.exportNonGameData();
    this.exportGameData();
  }
  exportNonGameData() {
    var handList = this.loadDataFromLocalDb('handList');
    var playersList = this.loadDataFromLocalDb('playersList');
    var filterList = this.loadDataFromLocalDb('filterList');
    console.log(handList);
    console.log(playersList);
    console.log(filterList);
    var data = packageBigHands(handList, '-----BIGHAND-----\n');
    data += packagePlayers(playersList, '\n-----EXTRA-----\n');
    data += packageFilters(filterList, '\n-----FILTER-----\n');
    console.log(data);

    var params = {
      Username: localStorage.email,
      code: localStorage.code,
      data: data
    }
    this.setLoadingMessage('Uploading game data...');
    this.executeApi('ExportData.php', params);
  }
  exportGameData() {
    var max = 1000;
    var batchNum = 1;
    var games = [];
    for (var x = 0; x < this.allGames.length; x++) {
      games.push(this.allGames[x]);
      if (games.length >= max) {
        this.exportTheseGames(games, batchNum, this.allGames.length);
        games = [];
        batchNum++;
      }
    }
    if (games.length > 0)
      this.exportTheseGames(games, batchNum, this.allGames.length);

  }
  exportTheseGames(games: any, batchNum: number, totalLength: number) {
    var data = packageGamess(games, '-----GAME-----\n');
    var params = {
      Username: localStorage.email,
      code: localStorage.code,
      data: data,
      numGames: totalLength,
			blockNum: batchNum
    }
    this.setLoadingMessage('Uploading game batch '+batchNum);
    this.executeApi('ExportData2.php', params);
//    console.log(data);
  }
  processImportData(data: string) {
    var lines = data.split("<br>");
    var type = '';
    var importObject = this.getinitializedImportObject();
    this.setLoadingMessage('Loading Hands...');

    //-----hand-------------------
    var handList = this.loadDataFromLocalDb('handList');
    var handId = 1;
    var bigHandHash = {};
    handList.forEach(record => {
      var name = record.handDate + record.yourHand;
      bigHandHash[name] = true;
      if (record.id >= handId)
        handId = record.id + 1;
    });
    var newHandFlg = false;
    console.log('x', bigHandHash);

    //-----player-------------------
    var playersList = this.loadDataFromLocalDb('playersList');
    var playerId = 1;
    var playerHash = {};
    playersList.forEach(record => {
      var name = record.name + record.casino;
      playerHash[name] = true;
      if (record.id >= playerId)
        playerId = record.id + 1;
    });
    var newPlayerFlg = false;

    //-----filters-------------------
    var filterList = this.loadDataFromLocalDb('filterList');
    var filterId = 1;
    var filterHash = {};
    filterHash['This Month'] = true;
    filterHash['Last Month'] = true;
    filterList.forEach(record => {
      filterHash[record.name] = true;
      if (record.id >= filterId)
        filterId = record.id + 1;
    });
    var newFilterFlg = false;

    this.setLoadingMessage('Loading Games...');

    lines.forEach(function (line) {
      if (line.substring(0, 5) == '-----') {
        type = line;
        console.log('importing: ', type);
      }
      if (type == '-----GAME-----') {
        importObject.gamesOnServer++;
        importObject.gamesImported += saveThisGame(gameFromLine(line));
      }
      if (type == '-----BIGHAND-----') {
        var bigHand = bigHandFromLine(line, []);
        if (bigHand && bigHand.player1Hand) {
          importObject.handsOnServer++;
          let name = bigHand.handDate + bigHand.yourHand;
          if (!bigHandHash[name]) {
            bigHandHash[name] = true;
            var hand: Hand = new Hand(bigHand, handId++);
            handList.push(hand);
            newHandFlg = true;
            importObject.handsImported++;
            console.log('+++hand added+++ ', hand);
          }
        }
      }
      if (type == '-----EXTRA-----') {
        var obj = playerFromLine(line);
        if (obj.name) {
          importObject.playersOnServer++;
          var player: Player = new Player(obj, playerId++);
          let name = player.name + player.casino;
          if (!playerHash[name]) {
            playerHash[name] = true;
            playersList.push(player);
            newPlayerFlg = true;
            importObject.playersImported++;
            console.log('+++player added+++ ', player);
          }
        }
      }
      if (type == '-----FILTER-----') {
        var obj = filterFromLine(line);
        if (obj.name) {
          importObject.filtersOnServer++;
          var filter: Filter = new Filter(obj, filterId++);
          if (!filterHash[filter.name]) {
            filterHash[filter.name] = true;
            filterList.push(filter);
            newFilterFlg = true;
            importObject.filtersImported++;
            console.log('+++newFilterFlg added+++ ', filter);
          }
        }
      }
    });
    this.addImportObjectValues(importObject);
    console.log('xxx', this.importObject);

    if (newHandFlg)
      this.saveDataToLocalDb('handList', handList);

    if (newPlayerFlg)
      this.saveDataToLocalDb('playersList', playersList);

    if (newFilterFlg)
      this.saveDataToLocalDb('filterList', filterList);

    this.importData();
  }
  inportData2(data: string) {
    var lines = data.split("<br>");
    var type = '';
    var importObject = this.getinitializedImportObject();

    lines.forEach(function (line) {
      if (line.substring(0, 5) == '-----') {
        type = line;
      }
      if (type == '-----GAME-----') {
        importObject.gamesOnServer++;
        importObject.gamesImported += saveThisGame(gameFromLine(line));
      }
    });

    this.addImportObjectValues(importObject);
    console.log('importObject', this.importObject);

    if (lines.length > 10 && this.blockNum < 10) {
      this.importData();
    } else {
      this.showSuccessMessage();
    }
  }
  postErrorApi(file: string, error: string) {
    console.log('postErrorApi', file, error);
    if (file == 'ImportData2.php')
      this.showSuccessMessage();
    else
      this.setApiMessage(error);
  }
  showSuccessMessage() {
    if (this.importObject)
      this.setApiMessage('Import Complete. Games on Server: ' + this.importObject.gamesOnServer + ', Games Loaded: ' + this.importObject.gamesImported);
  }
  importData() {
    this.blockNum++;
    var params = {
      Username: localStorage.email,
      code: localStorage.code,
      blockNum: this.blockNum
    }
    this.setLoadingMessage('Loading More Games...');
    this.executeApi('ImportData2.php', params);
  }
  logoutUser() {
    localStorage.firstName = '';
    localStorage.email = '';
    localStorage.code = '';
    localStorage.userId = '';
    this.userObj = this.getUserObj();
  }
}

