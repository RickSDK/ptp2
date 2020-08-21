import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var drawBarCharts: any;

@Component({
  selector: 'app-bar-charts',
  templateUrl: './bar-charts.component.html',
  styleUrls: ['./bar-charts.component.scss']
})
export class BarChartsComponent extends BaseComponent implements OnInit {

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
  postFilterGames() {
    var profitType = 0;
    drawBarCharts(this.filteredGames, this.allGames, 1, this.selectedYear, profitType);
  }

}
