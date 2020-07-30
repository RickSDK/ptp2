import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';

declare var $: any;

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent extends BaseComponent implements OnInit {
  public version:string = this.getVersion();
  
  constructor() { super(); }

  ngOnInit(): void {
  }
  show() {
    $('#mainMenuInfoPopup').modal();
  }
  okButtonPressed() {
    this.closeModal('#mainMenuInfoPopup');
  }
}
