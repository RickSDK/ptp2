import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var randomCard: any;

@Component({
  selector: 'app-choose-card-popup',
  templateUrl: './choose-card-popup.component.html',
  styleUrls: ['./choose-card-popup.component.scss']
})
export class ChooseCardPopupComponent extends BaseComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  public hand: any;
  public usedCardHash: any;
  public conflictsExistsFlg = false;
  public selectedCard:any;
  public selectedCardNum = 99;
  public selectedFace = '2';
  public selectedSuit = 'h';
  public faces = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']

  constructor() { super(); }

  ngOnInit(): void {
  }
  show(hand: any, usedCardHash: any) {
    this.hand = hand;
    this.usedCardHash = usedCardHash;
    $('#chooseCardPopup').modal();
  }
  selectThisCard(card: any, i: number) {
    if (this.selectedCardNum == i) {
      this.selectedCardNum = 99;
    } else {
      this.selectedCardNum = i;
      this.selectedCard = card;
    }
  }
  selectButtonPressed() {
    this.closeModal('#chooseCardPopup');
  }
  chooseFace(face: string) {
    this.selectedFace = face;
    this.updateCard();
  }
  chooseSuit(suit: string) {
    this.selectedSuit = suit;
    this.updateCard();
  }
  updateCard() {
    var cards:any[] = [];
    var x = 0;
    this.hand.cards.forEach((card: any) => {
      if (x++ == this.selectedCardNum)
        cards.push(this.selectedFace + this.selectedSuit);
      else
        cards.push(card);
    });
    this.hand.cards = cards;
    this.messageEvent.emit('done');
  }

  randomButtonPressed() {
    var usedCardHash = this.usedCardHash;
    var cards:any[] = [];
    this.hand.cards.forEach((card: any) => {
      cards.push(randomCard(usedCardHash));
    });
    this.hand.cards = cards;
    this.usedCardHash = usedCardHash;
    this.messageEvent.emit('done');
  }

}
