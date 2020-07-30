import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';

declare var $: any;

@Component({
  selector: 'app-game-info-popup',
  templateUrl: './game-info-popup.component.html',
  styleUrls: ['./game-info-popup.component.scss']
})
export class GameInfoPopupComponent extends BaseComponent implements OnInit {

  constructor() { super(); }

  ngOnInit(): void {
  }
  show() {
    $('#gameInfoPopup').modal();
  }
}
