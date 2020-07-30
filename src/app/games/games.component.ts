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
    this.allGames = this.loadGames();
    console.log(this.allGames);

    this.filterGames(true);
  }
  gotoGameClicked(game: any) {
    if (game.status == 'In Progress')
      this.router.navigate(['/game-live'], { queryParams: { 'id': game.id } });
    else
      this.router.navigate(['/game'], { queryParams: { 'id': game.id } });
  }

}
