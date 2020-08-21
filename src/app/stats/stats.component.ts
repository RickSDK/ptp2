import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Filter } from '../classes/filter';

declare var generateSummaryObj: any;
declare var daysTillDate: any;

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent extends BaseComponent implements OnInit {
  public title = 'Stats';
  public buttons = [
    { icon: 'bar-chart', name: 'Bar Charts', routerLink: ['/bar-charts'] },
    { icon: 'list-alt', name: 'Reports', routerLink: ['/reports'] },
    //   { icon: 'star', name: 'Goals', routerLink: ['/goals'] },
    { icon: 'pie-chart', name: 'Pie Charts', routerLink: ['/pie-charts'] }];
  public filters = [
    { name: 'none', action: 'none' },
  ];
  public items = [];
  public dateObj = this.getDateObjFromJSDate();

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
    this.filterGames();
    this.drawGraph();

    var filterList = this.loadDataFromLocalDb('filterList');
    if(filterList.length == 0) {
      var f1 = new Filter(null, 1);
      var f2 = new Filter(null, 2);
      f1.name = 'Last Month';
      f1.dateRange = 'Last Month';
      f2.name = 'This Month';
      f2.dateRange = 'This Month';
      filterList.push(f1);
      filterList.push(f2);
      this.saveDataToLocalDb('filterList', filterList);
    }
    var filters = [
      { name: 'none', action: 'none' },
    ];

    filterList.forEach(filter => {
      if (filter.dateRange == 'This Month')
        filter.name = this.dateObj.month;
      if (filter.dateRange == 'Last Month')
        filter.name = this.dateObj.prevMonth;

      if (filter.displayFlg) {
        filters.push(filter);
      }
    });
    this.filters = filters;
    this.loadingFlg = false;
  }
  changeFilter(filter: any, i: number) {
    this.buttonIdx = i;

    if (filter.action == 'none') {
      this.filterGames();
    }
    else {
      var filteredGames: any[] = [];
      console.log('f', filter);
      console.log('o', this.dateObj);
      this.allGames.forEach(game => {


        if (filter.type != 'All' && game.type != filter.type)
          return;
        if (filter.tournamentType != 'All' && game.tournamentType != filter.tournamentType)
          return;
        if (filter.stakes != 'All' && game.stakes != filter.stakes)
          return;
        if (filter.limit != 'All' && game.limit != filter.limit)
          return;
        if (filter.bankroll != 'All' && game.bankroll != filter.bankroll)
          return;
        if (filter.casino != 'All' && game.location != filter.casino)
          return;


        if (filter.dateRange == 'This Month' && (game.year != this.dateObj.year || game.month != this.dateObj.month))
          return;
        if (filter.dateRange == 'Last Month' && (game.year != this.dateObj.prevYear || game.month != this.dateObj.prevMonth))
          return;
        if (filter.dateRange == 'This Year' && game.year != this.dateObj.year)
          return;
        if (filter.dateRange == 'Last Year' && game.year != this.dateObj.year - 1)
          return;

        if (filter.dateRange == 'Last 90 Days') {
          var days = daysTillDate(game.startTime);
          if(days + 90 <0)
            return;
        }
        if (filter.dateRange == 'Last 180 Days') {
          var days = daysTillDate(game.startTime);
          if(days + 180 <0)
            return;
        }
        if (filter.dateRange == 'Last 365 Days') {
          var days = daysTillDate(game.startTime);
          if(days + 365 <0)
            return;
        }
        filteredGames.push(game);

      });
      this.filteredGames = filteredGames;
      this.postFilterGames();
    }

  }
  postFilterGames() {
    this.summaryObj = generateSummaryObj(this.filteredGames);
    this.drawGraph();
    this.items = [];
    this.items.push({ name: 'Games', value: this.summaryObj.games });
    this.items.push({ name: 'Risked', value: this.summaryObj.risked });
    this.items.push({ name: 'Profit', value: this.summaryObj.profit });
    this.items.push({ name: 'ROI', value: this.summaryObj.obj.roiStr });
    this.items.push({ name: 'Hours', value: this.summaryObj.hours });
    this.items.push({ name: 'Hourly', value: this.summaryObj.hourly });
    this.items.push({ name: 'Streak', value: this.summaryObj.streak });
  }

}
