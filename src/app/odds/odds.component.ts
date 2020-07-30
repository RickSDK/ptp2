import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Hand } from '../classes/hand';
import { InfoPopupComponent } from '../popups/info-popup/info-popup.component';

declare var randomCard: any;
declare var getHandValue: any;
declare var handName: any;

@Component({
  selector: 'app-odds',
  templateUrl: './odds.component.html',
  styleUrls: ['./odds.component.scss']
})
export class OddsComponent extends BaseComponent implements OnInit {
  @ViewChild(InfoPopupComponent) infoPopupComponent: InfoPopupComponent = new InfoPopupComponent;
  public title = 'Hand';
  public numPlayers = 0;
  public hands: Hand[] = [];
  public options = [
    { name: '2 Players', num: 2 },
    { name: '3 Players', num: 3 },
    { name: '4 Players', num: 4 },
    { name: '5 Players', num: 5 },
    { name: '6 Players', num: 6 },
  ];
  public oddsOptions: any[] = [];
  public dateObj = { name: 'Date', type: 'date', requiredFlg: true, value: '' };
  public potSizeObj = { name: 'Pot Size', type: 'number', options: [], value: '' };
  public commentsObj = { name: 'Comments', max: 500, type: 'textarea', value: '' };
  public buttonObj = { name: 'Button', type: 'dropdown', options: [], value: '' };
  public formFields = [this.dateObj, this.potSizeObj, this.commentsObj, this.buttonObj];

  public oddsItems: any[] = [];
  public usedCardHash: any = {};
  public someCardsAreBlankFlg = true;
  public allCardsAreBlankFlg = true;
  public calculateDoneFlg = false;
  public highestVal = 0;
  public handList: any[] = [];
  public hand: any = {};
  public isHandFlg: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    super();
    this.route.queryParams
      .subscribe(params => {
        this.params = params;
        this.isHandFlg = (params.type == 'hand');
      });
  }

  ngOnInit(): void {
    this.handList = this.loadDataFromLocalDb('handList');
    if (this.params.id > 0)
      this.loadHandOfId(this.params.id);
  }
  loadHandOfId(id: number) {
    var selectedHand;
    this.handList.forEach(hand => {
      if (hand.id == id)
        selectedHand = hand;
    });
    this.hand = selectedHand;
    this.numPlayers = this.hand.allHands.length - 3;
    this.oddsOptions = this.hand.allHands;
    this.isHandFlg = true;
    this.dateObj.value = this.hand.handDate;
    this.potSizeObj.value = this.hand.potSize;
    this.commentsObj.value = this.hand.comments;
    this.buttonObj.value = this.hand.button;
    this.calculateDoneFlg = (this.hand && this.hand.allHands && this.hand.allHands.length > 0 && this.hand.allHands[0].val > 0);
    this.changesMadeFlg = false;
    if (!this.calculateDoneFlg)
      this.changesMadeFlg = true;
    var oddsItems: any[] = [];
    for (var x = 0; x < this.hand.allHands.length - 3; x++) {
      oddsItems.push(this.hand.allHands[x]);
      this.buttonObj.options.push(this.hand.allHands[x].name);
    }
    this.oddsItems = oddsItems;
    this.setSomeCardsAreBlankFlg();
    console.log('x', this.hand);

  }
  confirmButtonClicked(message: string) {
    //delete hand!
    var newList = [];
    this.handList.forEach(hand => {
      if (hand.id != this.hand.id)
        newList.push(hand);
    });
    this.saveDataToLocalDb('handList', newList);

    this.router.navigate(['hand-tracker']);
  }
  buttonClicked(option: any) {
    this.numPlayers = option.num;
    this.usedCardHash = {};
    this.oddsOptions = [];
    this.buttonObj.options.push('Your Hand');
    this.oddsOptions.push({ name: 'Your Hand', cards: ['?', '?'], wins: 0, losses: 0 });

    for (var x = 2; x <= this.numPlayers; x++) {
      var playerName = 'Player ' + x;
      this.buttonObj.options.push(playerName);
      this.oddsOptions.push({ name: playerName, cards: ['?', '?'], wins: 0, losses: 0 });
    }
    this.oddsOptions.push({ name: 'Flop', cards: ['?', '?', '?'] });
    this.oddsOptions.push({ name: 'Turn', cards: ['?'] });
    this.oddsOptions.push({ name: 'River', cards: ['?'] });
  }

  setSomeCardsAreBlankFlg() {
    var someCardsAreBlankFlg = false;
    this.hand.allHands.forEach(hand => {
      hand.cards.forEach(card => {
        if (card == '?')
          someCardsAreBlankFlg = true;
      });

    });
    this.someCardsAreBlankFlg = someCardsAreBlankFlg;
  }
  randomButtonPressed() {
    this.calculateDoneFlg = false;
    var usedCardHash = {};
    this.oddsOptions.forEach(option => {
      var cards: any[] = []
      option.cards.forEach(card => {
        if (card == '?')
          cards.push(randomCard(usedCardHash));
        else
          cards.push(card);
      });
      option.cards = cards;
    });
    this.usedCardHash = usedCardHash;
    this.someCardsAreBlankFlg = false;
    this.allCardsAreBlankFlg = false;
    this.changesMadeFlg = true;
  }
  cardChanged(event: string) {
    this.changesMadeFlg = true;
    this.calculateDoneFlg = false;
  }
  clearButtonPressed() {
    this.changesMadeFlg = false;
    this.calculateDoneFlg = false;
    this.oddsOptions.forEach(option => {
      var cards: any[] = []
      option.cards.forEach(card => {
        cards.push('?');
      });
      option.cards = cards;
    });
    this.usedCardHash = {};
    this.someCardsAreBlankFlg = true;
    this.allCardsAreBlankFlg = true;
    this.oddsItems = [];
    this.numPlayers = 0;
  }
  calculateButtonPressed() {
    this.randomButtonPressed();
    this.calculatePreFlopOdds();
    this.calculateFlopOdds();
    this.calculateTurnOdds();
    this.calculateFinalHand();
    this.populateFormIntoHand();
    this.calculateDoneFlg = true;
    this.changesMadeFlg = true;
  }
  calculatePreFlopOdds() {
    this.resetWinsAndLosses(this.oddsOptions, this.numPlayers);
    for (var x = 0; x < 500; x++) {
      var flop1 = randomCard(this.usedCardHash);
      var flop2 = randomCard(this.usedCardHash);
      var flop3 = randomCard(this.usedCardHash);
      var turn = randomCard(this.usedCardHash);
      var river = randomCard(this.usedCardHash);
      this.usedCardHash[flop1] = false;
      this.usedCardHash[flop2] = false;
      this.usedCardHash[flop3] = false;
      this.usedCardHash[turn] = false;
      this.usedCardHash[river] = false;
      this.runGameForHands(this.oddsOptions, this.numPlayers, [flop1, flop2, flop3], [turn], [river]);
    }
    for (var x = 0; x < this.numPlayers; x++) {
      var handObj = this.oddsOptions[x];
      var odds = 0;
      var total = handObj.wins + handObj.losses;
      if (total > 0)
        odds = Math.round(handObj.wins * 100 / total);

      handObj.preflopOdds = odds;
      this.oddsItems.push({ name: handObj.name, preflopOdds: odds, postflopOdds: 0, turnOdds: 0, result: '', val: 0, wins: 0, losses: 0 })
    }
  }
  calculateFlopOdds() {
    this.resetWinsAndLosses(this.oddsOptions, this.numPlayers);
    for (var x = 0; x < 500; x++) {
      var turn = randomCard(this.usedCardHash);
      var river = randomCard(this.usedCardHash);
      this.usedCardHash[turn] = false;
      this.usedCardHash[river] = false;
      this.runGameForHands(this.oddsOptions, this.numPlayers, this.oddsOptions[this.numPlayers].cards, [turn], [river]);
    }
    for (var x = 0; x < this.numPlayers; x++) {
      var handObj = this.oddsOptions[x];
      var odds = 0;
      var total = handObj.wins + handObj.losses;
      if (total > 0)
        odds = Math.round(handObj.wins * 100 / total);

      handObj.postflopOdds = odds;
      this.oddsItems[x].postflopOdds = odds;
    }
  }
  calculateTurnOdds() {
    this.resetWinsAndLosses(this.oddsOptions, this.numPlayers);
    for (var x = 0; x < 500; x++) {
      var river = randomCard(this.usedCardHash);
      this.usedCardHash[river] = false;
      this.runGameForHands(this.oddsOptions, this.numPlayers, this.oddsOptions[this.numPlayers].cards, this.oddsOptions[this.numPlayers + 1].cards, [river]);
    }
    for (var x = 0; x < this.numPlayers; x++) {
      var handObj = this.oddsOptions[x];
      var odds = 0;
      var total = handObj.wins + handObj.losses;
      if (total > 0)
        odds = Math.round(handObj.wins * 100 / total);

      handObj.turnOdds = odds;
      this.oddsItems[x].turnOdds = odds;
    }
  }
  calculateFinalHand() {
    this.resetWinsAndLosses(this.oddsOptions, this.numPlayers);
    this.runGameForHands(this.oddsOptions, this.numPlayers, this.oddsOptions[this.numPlayers].cards, this.oddsOptions[this.numPlayers + 1].cards, this.oddsOptions[this.numPlayers + 2].cards)
    var highestVal = 0;
    for (var x = 0; x < this.numPlayers; x++) {
      var handObj = this.oddsOptions[x];
      this.oddsItems[x].result = handObj.result;
      this.oddsItems[x].val = handObj.val;
      this.oddsItems[x].wins = handObj.wins;
      this.oddsItems[x].losses = handObj.losses;
      if (handObj.val > highestVal)
        highestVal = handObj.val;
    }
    this.highestVal = highestVal;
  }
  resetWinsAndLosses(oddsOptions: any, numPlayers: number) {
    for (var x = 0; x < numPlayers; x++) {
      var handObj = oddsOptions[x];
      handObj.wins = 0;
      handObj.losses = 0;
    }
  }
  runGameForHands(oddsOptions: any, numPlayers: number, flop: any, turn: any, river: any) {
    var highestVal = 0;
    for (var x = 0; x < numPlayers; x++) {
      var handObj = oddsOptions[x];
      handObj.hand = handObj.cards.join(' ') + ' ' + flop.join(' ') + ' ' + turn.join(' ') + ' ' + river.join(' ');
      handObj.val = getHandValue(handObj.hand);
      handObj.result = handName(handObj.val);
      if (handObj.val > highestVal)
        highestVal = handObj.val;
    }
    for (var x = 0; x < numPlayers; x++) {
      var handObj = oddsOptions[x];
      if (handObj.val == highestVal)
        handObj.wins++;
      else
        handObj.losses++;
    }
  }
  checkFormForErrors(fields: any) {
    var hasErrors = false;
    fields.forEach(field => {
      if (field.requiredFlg && !field.value) {
        hasErrors = true;
        field.warningFlg = true;
      }
    });
    if (hasErrors)
      this.infoPopupComponent.show('Form has required fields that have not been filled out.');
    return hasErrors;
  }
  populateFormIntoHand() {
    this.hand['handDate'] = this.dateObj.value;
    this.hand['potSize'] = this.potSizeObj.value;
    this.hand['comments'] = this.commentsObj.value;
    this.hand['button'] = this.buttonObj.value;
    this.hand['allHands'] = this.oddsOptions;
    this.hand['yourHand'] = this.oddsOptions[0].cards.join('-');
    this.hand['winFlg'] = (this.oddsOptions[0].wins > 0);
    var flopIdx = this.oddsOptions.length - 3;
    this.hand['flop'] = this.oddsOptions[flopIdx].cards.join('-');
    this.hand['turn'] = this.oddsOptions[flopIdx + 1].cards.join('-');
    this.hand['river'] = this.oddsOptions[flopIdx + 2].cards.join('-');

    var newId = this.hand.id;
    if (!newId || newId == 0)
      newId = this.getNewId('handList');
    this.hand = new Hand(this.hand, newId);
    console.log('this.hand', this.hand);
  }
  saveButtonPressed() {
    this.isHandFlg = true;
    if (this.checkFormForErrors(this.formFields))
      return;

    this.populateFormIntoHand();

    var newList: any[] = [];
    this.handList.forEach(hand => {
      if (hand.id != this.hand.id)
        newList.push(hand);
    });
    newList.push(this.hand);
    this.handList = newList;
    console.log(this.oddsOptions);
    console.log(this.formFields);

    this.saveDataToLocalDb('handList', this.handList);

    this.router.navigate(['hand-tracker']);
  }

}
//----------------------end of component------------------
