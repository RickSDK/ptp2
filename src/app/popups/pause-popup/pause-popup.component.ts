import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';

declare var $: any;

@Component({
  selector: 'app-pause-popup',
  templateUrl: './pause-popup.component.html',
  styleUrls: ['./pause-popup.component.scss']
})
export class PausePopupComponent extends BaseComponent implements OnInit {

  constructor() { super(); }

  ngOnInit(): void {
  }
  show() {
    $('#pausePopup').modal();
  }
}
