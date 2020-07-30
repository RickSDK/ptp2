import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;

@Component({
  selector: 'app-hand-tracker-popup',
  templateUrl: './hand-tracker-popup.component.html',
  styleUrls: ['./hand-tracker-popup.component.scss']
})
export class HandTrackerPopupComponent extends BaseComponent implements OnInit {

  constructor() { super(); }

  ngOnInit(): void {
  }
  show(player: any) {
    $('#handTrackerPopup').modal();
  }
}
