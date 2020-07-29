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
    this.allGames = this.loadGames();
    var obj = this.getDateObjFromJSDate();
    this.selectedYear = obj.year;
    this.filterGames(true);
  }
  postFilterGames() {
    var profitType = 0;
    drawBarCharts(this.filteredGames, this.allGames, 1, this.selectedYear, profitType);
  }

}
