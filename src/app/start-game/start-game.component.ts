import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss']
})
export class StartGameComponent extends BaseComponent implements OnInit {

  constructor() { super(); }

  ngOnInit(): void {
    console.log('ngOnInit');
   
  }


}
