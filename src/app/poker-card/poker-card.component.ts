import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-poker-card',
  templateUrl: './poker-card.component.html',
  styleUrls: ['./poker-card.component.scss']
})
export class PokerCardComponent implements OnInit {
  @Input('card') card: string = '';
  @Input('hiddenFlg') hiddenFlg: boolean = false;
  public face = '';
  public suit = '';
  constructor() { }

  ngOnInit(): void {
    if (this.card == '?')
      this.hiddenFlg = true;
    this.face = this.card.substring(0, 1);
    this.suit = this.card.substring(1, 2);
  }
  ngStyleCardSuit(suit: string) {
    if (suit == 'h')
      return { 'color': 'red' }
    if (suit == 'c')
      return { 'color': 'green' }
    if (suit == 'd')
      return { 'color': 'blue' }

    return { 'color': 'black' }
  }
}
