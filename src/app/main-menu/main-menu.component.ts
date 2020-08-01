import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { InfoModalComponent } from '../popups/info-modal/info-modal.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent extends BaseComponent implements OnInit {
  @ViewChild(InfoModalComponent) infoModalComponent: InfoModalComponent;
  public appVersion = this.getVersion();
  public colorThemeName = localStorage.colorThemeName || 'Default Theme';

  constructor() { super(); }

  ngOnInit(): void {
    this.loadingFlg = true;
    setTimeout(() => {
      this.loadData();
    }, 10);
  }
  loadData() {
    this.allGames = this.loadGames();
    var numGames = localStorage.numGames || 0;
    if (this.allGames.length > numGames)
      this.findMinYear(this.allGames);
    this.filterGames();
    this.drawGraph();
    this.loadingFlg = false;
  }
  findMinYear(games) {
    localStorage.numGames = games.length;
    var minYear = localStorage.minYear || 9999;
    games.sort((curr: any, next: any) => {
      return curr.startTime < next.startTime ? -1 : 1;
    });
    var year = games[0].year;
    if (year < minYear)
      localStorage.minYear = year;
    console.log('min year: ', year);
  }
  infoButtonClicked(str:string) {
    this.infoModalComponent.show();
  }
}
