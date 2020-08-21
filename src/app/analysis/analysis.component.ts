import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var analysisTextForPlayer: any;
declare var generateAllAnalysis: any;

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent extends BaseComponent implements OnInit {
  public analysisText = ['Analysis Loading...'];

  constructor() { super(); }

  ngOnInit(): void {
    this.items = [];
    this.loadingFlg = true;
    setTimeout(() => {
      this.loadData();
    }, 10);
  }
  loadData() {
    this.selectedYear = 'Last 10';
    this.allGames = this.loadGames();
    this.filterGames();
    this.loadingFlg = false;
  }
  postFilterGames() {
    this.items = [];
    this.items.push({ name: 'Games', value: this.summaryObj.games });
    this.items.push({ name: 'Risked', value: this.summaryObj.riskedStr });
    this.items.push({ name: 'Profit', value: this.summaryObj.profitStr });
    this.items.push({ name: 'ROI', value: this.summaryObj.obj.roiStr });
    this.items.push({ name: 'Hours', value: this.summaryObj.hours });
    this.items.push({ name: 'Hourly', value: this.summaryObj.hourly });
    this.items.push({ name: 'Streak', value: this.summaryObj.streak });

    var obj = this.getDateObjFromJSDate();
    var analysisObj = generateAllAnalysis(this.allGames, obj);

    var gameType = 0;
    if (this.selectedGameType == 'Cash')
      gameType = 1;
    if (this.selectedGameType == 'Tournament')
      gameType = 2;

    this.analysisText = analysisTextForPlayer(this.summaryObj, 'Poker Track Pro', this.selectedYear, gameType, analysisObj.allStatsObj, analysisObj.thisYearObj, analysisObj.thisMonthObj, analysisObj.lastMonthObj, analysisObj.lastYearObj);
  }
}

