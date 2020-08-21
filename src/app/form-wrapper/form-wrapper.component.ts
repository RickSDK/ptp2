import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form-wrapper',
  templateUrl: './form-wrapper.component.html',
  styleUrls: ['./form-wrapper.component.scss']
})
export class FormWrapperComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  @Input('formFields') formFields: any;
  @Input('changesMadeFlg') changesMadeFlg: boolean;
  @Input('loadingFlg') loadingFlg: boolean;
  @Input('errorMessage') errorMessage: string;

  constructor() { }

  ngOnInit(): void {
  }
  verifyForm() {
    console.log('verifyForm', this.changesMadeFlg);
    this.changesMadeFlg = false;

    var failedFlg = false;
    this.formFields.forEach(input => {
      if (input.requiredFlg && (input.value.length == 0 || input.value=='0')) {
        console.log('Field Required: ', input.name);
        failedFlg = true;
        input.warningFlg = true;
      } 
    });
    this.errorMessage = (failedFlg) ? 'Fix required fields!' : '';
    if (!failedFlg) {
      this.loadingFlg = true;
      this.messageEvent.emit('done');
    }
    
  }
  changesMade(inputField: any) {
    this.errorMessage = '';
    this.changesMadeFlg = true;
  }


}
