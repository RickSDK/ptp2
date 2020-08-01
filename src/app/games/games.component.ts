import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent extends BaseComponent implements OnInit {
  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.loadingFlg = true;
    setTimeout(() => {
      this.loadData();
    }, 10);
  }
  loadData() {
    this.allGames = this.loadGames();
    this.filterGames(true);
    this.loadingFlg = false;
  }
  gotoGameClicked(game: any) {
    if (game.status == 'In Progress')
      this.router.navigate(['/game-live'], { queryParams: { 'id': game.id } });
    else
      this.router.navigate(['/game'], { queryParams: { 'id': game.id } });
  }

}
