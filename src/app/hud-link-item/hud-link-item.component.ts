import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;

@Component({
  selector: 'app-hud-link-item',
  templateUrl: './hud-link-item.component.html',
  styleUrls: ['./hud-link-item.component.scss']
})
export class HudLinkItemComponent extends BaseComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();

  constructor() { super(); }

  ngOnInit(): void {
  }
  show(num: number) {
    this.buttonIdx = num;
    console.log(this.buttonIdx, num);
    $('#hudLinkItem').modal();
  }
  linkItemPressed() {
    this.messageEvent.emit('done');
    this.closeModal('#hudLinkItem');
  }
}
