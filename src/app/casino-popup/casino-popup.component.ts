import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;

@Component({
  selector: 'app-casino-popup',
  templateUrl: './casino-popup.component.html',
  styleUrls: ['./casino-popup.component.scss']
})
export class CasinoPopupComponent extends BaseComponent implements OnInit {
  public casino: any;

  constructor() { super(); }

  ngOnInit(): void {
  }
  show(casino: any) {
    this.casino = casino;
    this.items = [];
    this.items.push({name: 'Name', value: casino.name});
    this.items.push({name: 'Street', value: casino.street});
    this.items.push({name: 'City', value: casino.city});
    this.items.push({name: 'State', value: casino.state});
    this.items.push({name: 'zip', value: casino.zip});
    this.items.push({name: 'country', value: casino.country});
    this.items.push({name: 'phone', value: casino.phone});
    this.items.push({name: 'Distance', value: casino.botRight});
    $('#casinoPopup').modal();
  }
}
