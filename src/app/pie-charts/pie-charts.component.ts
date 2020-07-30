import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var drawPieChartForObjs: any;

@Component({
  selector: 'app-pie-charts',
  templateUrl: './pie-charts.component.html',
  styleUrls: ['./pie-charts.component.scss']
})
export class PieChartsComponent extends BaseComponent implements OnInit {
  public buttons = [
    { name: 'Type', icon: 'money', field: 'type' },
    { name: 'Game', icon: 'database', field: 'gameType' },
    { name: 'Limit', icon: 'plane', field: 'limit' },
    { name: 'Stakes', icon: 'usd', field: 'stakes' },
    { name: 'Location', icon: 'globe', field: 'location' },
  ]
  public buttonIdx:number = 0;
  public stakesCount:number = 0;

  constructor() { super(); }

  ngOnInit(): void {
    var obj = this.getDateObjFromJSDate();
    this.selectedYear = obj.year;
    this.allGames = this.loadGames();
    this.filterGames(true);
  }


  changeButton(num: number) {
    this.buttonIdx = num;
    this.filterGames(true);
  }

  postFilterGames() {
    var field = this.buttons[this.buttonIdx].field;
    var typeHash:any = {};
    var stakesCount = 0;

    this.filteredGames.forEach(game => {
      if (game.stakes)
        stakesCount++;
      if (typeHash[game[field]])
        typeHash[game[field]]++;
      else
        typeHash[game[field]] = 1;
    });
    this.stakesCount = stakesCount;
    var keys = Object.keys(typeHash);
    var barList:any[] = [];
    keys.forEach(key => {
      if (key)
        barList.push({ name: key, value: typeHash[key] });
    });
    barList.sort((curr: any, next: any) => {
      return curr.value > next.value ? -1 : 1;
    });
    this.items = barList;

    drawPieChartForObjs(barList, 'myCanvas');

    if(stakesCount==0 && this.buttonIdx==3) {
      this.buttonIdx = 0;
      this.postFilterGames();
    }

  }
}
