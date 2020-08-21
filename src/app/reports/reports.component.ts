import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends BaseComponent implements OnInit {
  public items = [];
  public reportItems: any[] = [
    { name: 'Cash vs Tournament', field: 'type', items: [] },
    { name: 'Game', field: 'gameType', items: [] },
    { name: 'Stakes', field: 'stakes', items: [] },
    { name: 'Limit', field: 'limit', items: [] },
    { name: 'Location', field: 'location', items: [] },
    { name: 'Year', field: 'year', items: [] },
    { name: 'Month', field: 'month', items: [] },
    { name: 'Weekday', field: 'weekday', items: [] },
    { name: 'Daytime', field: 'daytime', items: [] },
  ]

  constructor() { super(); }

  ngOnInit(): void {
    this.selectedYear = localStorage.selectedYear || 'Last 10';

    this.loadingFlg = true;
    setTimeout(() => {
      this.loadData();
    }, 10);
  }
  loadData() {
    this.allGames = this.loadGames();
    var obj = this.getDateObjFromJSDate();
    this.selectedYear = obj.year;
    this.filterGames(true);
    this.loadingFlg = false;
  }
  changeGroup(num: number) {
    this.buttonIdx = num;
  }
  postFilterGames() {
    var x = 0;
    this.reportItems.forEach(report => {
      var profitHash: any = {}
      var gameHash: any = {}
      var minutesHash: any = {}
      this.filteredGames.forEach(game => {
        if (gameHash[game[report.field]]) {
          gameHash[game[report.field]]++;
          profitHash[game[report.field]] += game.profit;
          minutesHash[game[report.field]] += game.minutes;
        } else {
          gameHash[game[report.field]] = 1;
          profitHash[game[report.field]] = game.profit;
          minutesHash[game[report.field]] = game.minutes;
        }
      });
      var keys = Object.keys(gameHash);

      var items: any[] = [];
      keys.forEach(key => {
        if (key) {
          var profit = profitHash[key];
          var games = gameHash[key];
          var minutes = minutesHash[key];
          var hourly = 0;
          if (minutes > 0)
            hourly = Math.round(profit * 60 / minutes);
          items.push({ name: key, amount: profitHash[key], value: this.localCurrency(profitHash[key]), games: gameHash[key], hourly: hourly });
        }
      });
      this.reportItems[x++].items = items;


    });

  }
}
