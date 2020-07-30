import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { ActivatedRoute, Router } from '@angular/router';

declare var drawGraph: any;
declare var formatNumberToLocalCurrency: any;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent extends BaseComponent implements OnInit {
  public gameId: number;
  public game: any;
  public items = [];

  constructor(private router: Router, private route: ActivatedRoute) {
    super();
    this.route.queryParams
      .subscribe(params => {
        this.gameId = params.id;
        if (this.gameId > 0) {
          this.game = this.getGameOfId(this.gameId);
          console.log(this.game);
          this.items = this.populateData(this.game);
        }

      });
  }

  ngOnInit(): void {
    this.allGames = this.loadGames();
    this.filterGames();
    if (!this.game.profitRecords || this.game.profitRecords.length < 2) {
      this.game.profitRecords = [];
      this.game.profitRecords.push({ startTime: this.game.startTime, profit: 0, gameId: this.game.id })
      this.game.profitRecords.push({ startTime: this.game.endTime, profit: this.game.profit, gameId: this.game.id })
    }
    setTimeout(() => {
      drawGraph(this.game.profitRecords, 0, this.darkColor, "myCanvas");
    }, 100);


  }

  buttonClicked(str: string) {
    this.router.navigate(['/old-game'], { queryParams: { 'id': this.gameId } });
  }

}
