import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent extends BaseComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  public message: string;
  constructor() { super(); }

  ngOnInit(): void {
  }
  show(message: string) {
    this.message = message;
    $('#confirmationPopup').modal();
  }
  cancelButtonPressed() {
    this.closeModal('#confirmationPopup');
  }
  confirmButtonPressed() {
    this.messageEvent.emit('done');
    this.closeModal('#confirmationPopup');
  }

}
