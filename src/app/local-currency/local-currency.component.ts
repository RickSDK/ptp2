import { Component, OnInit, Input, OnChanges } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-local-currency',
  templateUrl: './local-currency.component.html',
  styleUrls: ['./local-currency.component.scss']
})
export class LocalCurrencyComponent implements OnChanges {
  @Input('amount') amount: number = 0;
  @Input('lightFlg') lightFlg: boolean = false;
  public displayAmount: string = '';

  constructor() { }

  ngOnChanges(): void {
     this.formatNumber(this.amount);
  }
  //ngOnInit(): void {
  //  this.formatNumber(this.amount);
 // }
  formatNumber(amount: number) {
    this.displayAmount = formatNumberToLocalCurrency(amount);
  }
  ngStyleColor(amount: number) {
    if (this.lightFlg) {
      if (amount == 0)
        return { 'color': 'white' }
      if (amount > 0)
        return { 'color': '#00ff00' }
      else
        return { 'color': 'orange' }
    } else {
      if (amount == 0)
        return { 'color': 'black' }
      if (amount > 0)
        return { 'color': 'green' }
      else
        return { 'color': 'red' }
    }
  }
}

function getLang() {
  if (navigator.languages != undefined)
    return navigator.languages[0];
  else
    return navigator.language;
}

function formatNumberToLocalCurrency(amount = 0, refresh = false) {
  if (refresh || !localStorage.geoplugin_currencyCode) {
    $.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function (data:any) {
      localStorage.geoplugin_currencyCode = data.geoplugin_currencyCode;
    });
  }

  const formatter = new Intl.NumberFormat(navigator.language || 'en-US', {
    style: 'currency',
    currency: localStorage.geoplugin_currencyCode || 'USD',
    minimumFractionDigits: 0
  });
  return formatter.format(amount);
}
