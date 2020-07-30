import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainMenuComponent } from './main-menu/main-menu.component';
import { GamesComponent } from './games/games.component';
import { StatsComponent } from './stats/stats.component';
import { OptionsComponent } from './options/options.component';
import { StartGameComponent } from './start-game/start-game.component';
import { GameComponent } from './game/game.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { CasinoLocatorComponent } from './casino-locator/casino-locator.component';
import { OddsComponent } from './odds/odds.component';
import { TrackersComponent } from './trackers/trackers.component';
import { ForumComponent } from './forum/forum.component';
import { FriendsComponent } from './friends/friends.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { ColorThemesComponent } from './color-themes/color-themes.component';
import { OldGameComponent } from './old-game/old-game.component';
import { GameLiveComponent } from './game-live/game-live.component';
import { HudComponent } from './hud/hud.component';
import { BarChartsComponent } from './bar-charts/bar-charts.component';
import { FiltersComponent } from './filters/filters.component';
import { ReportsComponent } from './reports/reports.component';
import { GoalsComponent } from './goals/goals.component';
import { PieChartsComponent } from './pie-charts/pie-charts.component'; 
import { HandTrackerComponent } from './hand-tracker/hand-tracker.component';
import { PlayerTrackerComponent } from './player-tracker/player-tracker.component'; 

const routes: Routes = [
  { path: '', component: MainMenuComponent },
  { path: 'games', component: GamesComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'options', component: OptionsComponent },
  { path: 'start-game', component: StartGameComponent },
  { path: 'game', component: GameComponent },
  { path: 'analysis', component: AnalysisComponent },
  { path: 'casino-locator', component: CasinoLocatorComponent },
  { path: 'odds', component: OddsComponent },
  { path: 'trackers', component: TrackersComponent },
  { path: 'forum', component: ForumComponent },
  { path: 'friends', component: FriendsComponent },
  { path: 'upgrade', component: UpgradeComponent },
  { path: 'color-themes', component: ColorThemesComponent },
  { path: 'old-game', component: OldGameComponent },
  { path: 'game-live', component: GameLiveComponent },
  { path: 'hud', component: HudComponent },
  { path: 'bar-charts', component: BarChartsComponent },
  { path: 'filters', component: FiltersComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'goals', component: GoalsComponent },
  { path: 'pie-charts', component: PieChartsComponent },
  { path: 'hand-tracker', component: HandTrackerComponent },
  { path: 'player-tracker', component: PlayerTrackerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
