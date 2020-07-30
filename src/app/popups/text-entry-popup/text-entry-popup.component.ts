import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';

declare var $: any;

@Component({
  selector: 'app-text-entry-popup',
  templateUrl: './text-entry-popup.component.html',
  styleUrls: ['./text-entry-popup.component.scss']
})
export class TextEntryPopupComponent extends BaseComponent implements OnInit {

  constructor() { super(); }

  ngOnInit(): void {
  }
  show(message: string) {
    $('#textEntryPopup').modal();
  }
}
