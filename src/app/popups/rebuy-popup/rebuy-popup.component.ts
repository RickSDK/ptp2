import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';

declare var $: any;

@Component({
  selector: 'app-rebuy-popup',
  templateUrl: './rebuy-popup.component.html',
  styleUrls: ['./rebuy-popup.component.scss']
})
export class RebuyPopupComponent extends BaseComponent implements OnInit {

  constructor() { super(); }

  ngOnInit(): void {
  }
  show() {
    $('#rebuyPopup').modal();
  }
}
