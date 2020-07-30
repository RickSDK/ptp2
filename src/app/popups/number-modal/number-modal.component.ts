import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base/base.component';

declare var $: any;

@Component({
  selector: 'app-number-modal',
  templateUrl: './number-modal.component.html',
  styleUrls: ['./number-modal.component.scss']
})
export class NumberModalComponent extends BaseComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<number>();
  public amount: number = 0;
  public name: string = '';
  public editingFlg = false;
  public currencyFlg = false;
  public numbers = [1,2,3,4,5,6,7,8,9];

  constructor() { super() }

  ngOnInit(): void {
  }
  show(name: string, amount: number, currencyFlg=false) {
    this.name = name;
    this.amount = amount;
    this.editingFlg = false;
    this.currencyFlg = currencyFlg;

    $('#numberModal').modal();
  }
  numberPressed(num: number) {
    if(num<0) {
      this.amount = 0;
      return;
    }
    if (this.editingFlg) {
      this.amount = (this.amount * 10 + num);
    } else {
      this.amount = num;
      this.editingFlg = true;
    }
  }
  selectPressed() {
    this.messageEvent.emit(this.amount);
    this.closeModal('#numberModal');
  }
}
