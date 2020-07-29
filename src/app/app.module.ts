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
    GameTypeBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
