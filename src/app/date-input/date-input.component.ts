import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

declare var dateComponentFromDateStamp: any;
declare var htmlDateStringWhileTyping: any;


@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss']
})
export class DateInputComponent implements OnInit {
  @Input('inputFieldObj') inputFieldObj: any;
  @Input('disabledFlg') disabledFlg: any;
  @Output() messageEvent = new EventEmitter<string>();

  public dateField: string = '';
  public timeField: string = '';
  public minDate: string = '';

  constructor() { }

  ngOnInit(): void {
    this.minDate = ''; //formet: 2020-05-08
    if (this.inputFieldObj.requiredFutureFlg)
      this.minDate = dateComponentFromDateStamp();

    if(this.inputFieldObj.value) {
      this.inputFieldObj.dateField = dateComponentFromDateStamp(this.inputFieldObj.value);
      this.inputFieldObj.timeField = dateComponentFromDateStamp(this.inputFieldObj.value, true); 
    } else if(this.inputFieldObj.requiredFlg) {
      this.inputFieldObj.dateField = dateComponentFromDateStamp(); // now day
      this.inputFieldObj.timeField = dateComponentFromDateStamp(null, true); // now time '00:00', '23:59'
    }
  }
  changesMade() {
    this.inputFieldObj.warningFlg = false;
    this.inputFieldObj.errorMessage = '';
    var checkDate = new Date(this.inputFieldObj.dateField+' '+this.inputFieldObj.timeField);
    this.inputFieldObj.errorMessage = (checkDate.toString() === 'Invalid Date')?'Invalid time! Use format: HH:MM AM/PM':'';
    this.messageEvent.emit('changesMade');
  }
  changesMadeDate(value:string) {
    var result = htmlDateStringWhileTyping(value);
    this.inputFieldObj.dateField = result;
    this.inputFieldObj.warningFlg =  (this.inputFieldObj.requiredFlg && this.inputFieldObj.dateField.length==0);

    var checkDate = new Date(this.inputFieldObj.dateField);
    this.inputFieldObj.errorMessage = (checkDate.toString() === 'Invalid Date')?'Invalid date! Check the month and day. Use format: YYYY-MM-DD':'';

    this.messageEvent.emit('changesMade');
  }

}
