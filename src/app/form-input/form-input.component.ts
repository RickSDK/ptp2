import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base/base.component';

const urlRegEx = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');
const phoneNumRegEx = new RegExp('\([0-9]{3}\)\ [0-9]{3}\-[0-9]{4}\ ext\.\ [0-9_]{4}$');
const emailRegex = new RegExp('^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$');

declare var htmlDateStringWhileTyping: any;

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent extends BaseComponent implements OnChanges {
  @Input('inputFieldObj') inputFieldObj: any;
  @Input('disabledFlg') disabledFlg: any;
  @Output() messageEvent = new EventEmitter<string>();
  public showHintFlg: boolean = false;
  public validateVal: boolean = false;
  constructor() { super(); }

  ngOnChanges(changes: any): void {
    if (this.inputFieldObj.type == 'boolean') {
      setTimeout(() => {
        this.setValue(this.inputFieldObj.value);
      }, 250);
    }

    if (!this.inputFieldObj.placeholder)
      this.inputFieldObj.placeholder = this.inputFieldObj.name;

    if (this.inputFieldObj.type == 'tel')
      this.inputFieldObj.placeholder = '(___) ___-____ ext.____';
  }

  checkStringLength(field: any) {
    this.inputFieldObj.value = field.value;
    this.validateField(field);
  }
  validateField(field: any) {
    this.validateVal = true;
    if (this.inputFieldObj.type == 'tel') {
      var phoneNumDigits = field.value.replace(/-/g, '');
      phoneNumDigits = phoneNumDigits.replace(/\(/g, '');
      phoneNumDigits = phoneNumDigits.replace(/\) /g, '');
      var formattedNumber = phoneNumDigits;
      this.validateVal = (phoneNumDigits.length >= 10 && parseInt(phoneNumDigits) > 1000000000);
      if (phoneNumDigits.length >= 6)
        formattedNumber = '(' + phoneNumDigits.substring(0, 3) + ') ' + phoneNumDigits.substring(3, 6) + '-' + phoneNumDigits.substring(6);
      else if (phoneNumDigits.length >= 3)
        formattedNumber = '(' + phoneNumDigits.substring(0, 3) + ') ' + phoneNumDigits.substring(3);

      field.value = formattedNumber;
    }
    if (this.inputFieldObj.type == 'email') {
      this.validateVal = emailRegex.test(field.value);
    }
    if (this.inputFieldObj.type == 'url') {
      this.validateVal = urlRegEx.test(field.value);
    }

    this.inputFieldObj.value = field.value;
    this.inputFieldObj.answer = field.value;
    this.inputFieldObj.warningFlg = (this.inputFieldObj.requiredFlg && field.value.length == 0);
    this.inputFieldObj.errorMessage = (field.value.length == 0 || this.validateVal) ? '' : 'Invalid format';

    if (this.inputFieldObj.type == 'date') {
      this.inputFieldObj.value = htmlDateStringWhileTyping(field.value);
    }
    this.messageEvent.emit(this.inputFieldObj);
  }
  selectOption(name: string) {
    this.inputFieldObj.value = name;
    this.messageEvent.emit(this.inputFieldObj);
  }
  ngStyleField() {
    if (this.inputFieldObj.warningFlg)
      return { 'background-color': 'yellow' }
  }
  toggleSwitch() {
    this.inputFieldObj.value = (<HTMLInputElement>document.getElementById(this.inputFieldObj.id)).checked;
    if (!this.disabledFlg)
      this.messageEvent.emit('changesMade');
  }
  setValue(checked: boolean) {
    let e = (<HTMLInputElement>document.getElementById(this.inputFieldObj.id));
    if (e)
      e.checked = checked;
  }



}
