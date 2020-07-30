import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends BaseComponent implements OnInit {
  public items = [];
  public reportItems:any[] = [
    {name: 'Cash vs Tournament', field: 'type', items: []},
    {name: 'Game', field: 'gameType', items: []},
    {name: 'Stakes', field: 'stakes', items: []},
    {name: 'Limit', field: 'limit', items: []},
    {name: 'Location', field: 'location', items: []},
    {name: 'Year', field: 'year', items: []},
    {name: 'Month', field: 'month', items: []},
    {name: 'Weekday', field: 'weekday', items: []},
    {name: 'Daytime', field: 'daytime', items: []},
  ]

  constructor() { super(); }

  ngOnInit(): void {
    this.allGames = this.loadGames();
    var obj = this.getDateObjFromJSDate();
    this.selectedYear = obj.year;
    this.filterGames(true);

  }
  postFilterGames() {
    var x=0;
    this.reportItems.forEach(report => {
    
      
      var typeHash:any = {}
      this.filteredGames.forEach(game => {
        if (typeHash[game[report.field]])
          typeHash[game[report.field]] += game.profit;
        else
          typeHash[game[report.field]] = game.profit;
      });
      var keys = Object.keys(typeHash);
      
      var items:any[] = [];
      keys.forEach(key => {
        if(key)
          items.push({name: key, amount: typeHash[key], value: this.localCurrency(typeHash[key])});
      });
      this.reportItems[x++].items = items;


    });

  }
}
