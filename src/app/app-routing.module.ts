import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { OptionsComponent } from './options/options.component';


const routes: Routes = [
  { path: '', component: MainMenuComponent },
  { path: 'options', component: OptionsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
