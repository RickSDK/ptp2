import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base/base.component';

declare var $: any;
declare var formatTextForDatabase: any;

@Component({
  selector: 'app-text-entry-popup',
  templateUrl: './text-entry-popup.component.html',
  styleUrls: ['./text-entry-popup.component.scss']
})
export class TextEntryPopupComponent extends BaseComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();

  public formFields = [{ name: 'Comments', type: 'textarea', value: '', requiredFlg: true, max: 500 }];

  constructor() { super(); }

  ngOnInit(): void {
  }
  show(notes: string) {
    this.formFields[0].value = notes;
    $('#textEntryPopup').modal();
  }
  submitButtonClicked(msg: string) {
    this.messageEvent.emit(this.formFields[0].value);
    this.closeModal('#textEntryPopup');
  }

}

