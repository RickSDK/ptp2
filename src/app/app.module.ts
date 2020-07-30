import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseComponent } from './base/base.component';
import { BaseColorsComponent } from './base-colors/base-colors.component';
import { BaseHttpComponent } from './base-http/base-http.component';
import { PageShellComponent } from './page-shell/page-shell.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { OptionsComponent } from './options/options.component';
import { ButtonComponent } from './button/button.component';
import { LoginComponent } from './login/login.component';
import { InfoPopupComponent } from './popups/info-popup/info-popup.component';
import { SpinnerComponent } from './popups/spinner/spinner.component';
import { FormInputComponent } from './form-input/form-input.component';
import { FormWrapperComponent } from './form-wrapper/form-wrapper.component';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { LoginPopupComponent } from './popups/login-popup/login-popup.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { BarChartsComponent } from './bar-charts/bar-charts.component';
import { CasinoLocatorComponent } from './casino-locator/casino-locator.component';
import { CasinoPopupComponent } from './casino-popup/casino-popup.component';
import { ChooseCardPopupComponent } from './choose-card-popup/choose-card-popup.component';
import { ColorThemesComponent } from './color-themes/color-themes.component';
import { DateInputComponent } from './date-input/date-input.component';
import { FilterPopupComponent } from './filter-popup/filter-popup.component';
import { FiltersComponent } from './filters/filters.component';
import { ForumComponent } from './forum/forum.component';
import { SummaryBarComponent } from './summary-bar/summary-bar.component';
import { YearBarComponent } from './year-bar/year-bar.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { GameTypeBarComponent } from './game-type-bar/game-type-bar.component';
import { FriendPopupComponent } from './friend-popup/friend-popup.component';
import { FriendRequestPopupComponent } from './friend-request-popup/friend-request-popup.component';
import { FriendsComponent } from './friends/friends.component';
import { GameComponent } from './game/game.component';
import { GameLiveComponent } from './game-live/game-live.component';
import { GamesComponent } from './games/games.component';
import { GoalsComponent } from './goals/goals.component';
import { HandLayoutComponent } from './hand-layout/hand-layout.component';
import { HandTrackerComponent } from './hand-tracker/hand-tracker.component';
import { HandTrackerPopupComponent } from './hand-tracker-popup/hand-tracker-popup.component';
import { HudComponent } from './hud/hud.component';
import { HudLinkItemComponent } from './hud-link-item/hud-link-item.component';
import { HudPopupComponent } from './hud-popup/hud-popup.component';
import { LocalCurrencyComponent } from './local-currency/local-currency.component';
import { OddsComponent } from './odds/odds.component';
import { OldGameComponent } from './old-game/old-game.component';
import { PieChartsComponent } from './pie-charts/pie-charts.component';
import { PlayerTrackerComponent } from './player-tracker/player-tracker.component';
import { PlayerTrackerPopupComponent } from './player-tracker-popup/player-tracker-popup.component';
import { PokerCardComponent } from './poker-card/poker-card.component';
import { GameInfoPopupComponent } from './popups/game-info-popup/game-info-popup.component';
import { InfoModalComponent } from './popups/info-modal/info-modal.component';
import { NumberModalComponent } from './popups/number-modal/number-modal.component';
import { PausePopupComponent } from './popups/pause-popup/pause-popup.component';
import { RebuyPopupComponent } from './popups/rebuy-popup/rebuy-popup.component';
import { RefDataModalComponent } from './popups/ref-data-modal/ref-data-modal.component';
import { TextEntryPopupComponent } from './popups/text-entry-popup/text-entry-popup.component';
import { ViewHandPopupComponent } from './view-hand-popup/view-hand-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    BaseColorsComponent,
    BaseHttpComponent,
    PageShellComponent,
    MainMenuComponent,
    OptionsComponent,
    ButtonComponent,
    LoginComponent,
    InfoPopupComponent,
    SpinnerComponent,
    FormInputComponent,
    FormWrapperComponent,
    ConfirmationPopupComponent,
    LoginPopupComponent,
    AnalysisComponent,
    BarChartsComponent,
    CasinoLocatorComponent,
    CasinoPopupComponent,
    ChooseCardPopupComponent,
    ColorThemesComponent,
    DateInputComponent,
    FilterPopupComponent,
    FiltersComponent,
    ForumComponent,
    SummaryBarComponent,
    YearBarComponent,
    ProgressBarComponent,
    GameTypeBarComponent,
    FriendPopupComponent,
    FriendRequestPopupComponent,
    FriendsComponent,
    GameComponent,
    GameLiveComponent,
    GamesComponent,
    GoalsComponent,
    HandLayoutComponent,
    HandTrackerComponent,
    HandTrackerPopupComponent,
    HudComponent,
    HudLinkItemComponent,
    HudPopupComponent,
    LocalCurrencyComponent,
    OddsComponent,
    OldGameComponent,
    PieChartsComponent,
    PlayerTrackerComponent,
    PlayerTrackerPopupComponent,
    PokerCardComponent,
    GameInfoPopupComponent,
    InfoModalComponent,
    NumberModalComponent,
    PausePopupComponent,
    RebuyPopupComponent,
    RefDataModalComponent,
    TextEntryPopupComponent,
    ViewHandPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
