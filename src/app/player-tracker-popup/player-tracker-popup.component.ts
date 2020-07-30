import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { PokerService } from '../poker.service';
import { Player } from '../classes/player';

declare var $: any;

@Component({
  selector: 'app-player-tracker-popup',
  templateUrl: './player-tracker-popup.component.html',
  styleUrls: ['./player-tracker-popup.component.scss']
})
export class PlayerTrackerPopupComponent extends BaseComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  public segments = ['Weak', 'Average', 'Strong', 'Pro'];
  public player: Player;
  public looseTight = 'Loose';
  public passiveAgressive = 'Passive';
  public nameObj = { name: 'Player Name', max: 30, type: 'text', requiredFlg: true, value: '', warningFlg: false };
  public commentsObj = { name: 'Comments', max: 500, type: 'textarea', value: '' };
  public casinoObj = { name: 'Primary Casino', type: 'dropdown', options: [], value: '' };
  public playersList = [];
  public deleteConfirm = false;
  public newPlayerFlg = false;

  constructor(private _pokerService: PokerService) { super(); }

  ngOnInit(): void {
  }
  show(player: any) {
    console.log(player);
    this.deleteConfirm = false;
    this.newPlayerFlg = false;
    this.playersList = this.loadDataFromLocalDb('playersList');
    this.changesMadeFlg = false;
    if (player) {
      this.player = player;
      this.nameObj.value = player.name;
      this.commentsObj.value = player.comments;
      this.casinoObj.value = player.casino;
      this.buttonIdx = player.skill;
    } else {
      var newId = this.getNewId('playersList');
      this.player = new Player(null, newId);
      this.newPlayerFlg = true;
      this.nameObj.value = this.player.name;
      this.commentsObj.value = this.player.comments;
      this.casinoObj.value = this.player.casino;
      this.buttonIdx = 0;
    }
    this.positionBars();
    this.allGames = this.loadGames();
    var casinos = this._pokerService.getUserDataOfType(5, this.allGames);
    var options: any[] = [];
    casinos.forEach(casino => {
      options.push(casino.name);
    });
    options.sort((curr: any, next: any) => {
      return curr < next ? -1 : 1;
    });
    this.casinoObj.options = options;

    setTimeout(() => {
      this.positionBars();
    }, 500);

    $('#playerTrackerPopup').modal();
  }
  savePlayer() {
    if (!this.nameObj.value) {
      this.nameObj.warningFlg = true;
      return;
    }

    this.player.name = this.nameObj.value;
    this.player.comments = this.commentsObj.value;
    this.player.casino = this.casinoObj.value;
    this.player.skill = this.buttonIdx;

    this.player = new Player(this.player, this.player.id);
    this.saveList(true);
  }
  saveList(addPlayerFlg: boolean) {
    var newList = [];
    this.playersList.forEach(player => {
      if (player['id'] != this.player.id)
        newList.push(player);
    });
    if(addPlayerFlg)
      newList.push(this.player);

    this.saveDataToLocalDb('playersList', newList);
    this.closeModal('#playerTrackerPopup');
    this.messageEvent.emit('');
  }
  deletePlayer() {
    this.saveList(false);
  }
  changesMade(field: any) {
    this.changesMadeFlg = true;
  }
  segmentChanged(num: number) {
    this.changesMadeFlg = true;
    this.buttonIdx = num;
    var playerTypes = [0, 2, 4, 5];
    this.player.playerType = playerTypes[num];
  }
  positionBars() {
    this.positionBar('looseImg', 'looseBar', this.player.looseNum);
    this.positionBar('passiveImg', 'passiveBar', this.player.aggresiveNum);
    this.looseTight = (this.player.looseNum <= 50) ? 'Loose' : 'Tight';
    this.passiveAgressive = (this.player.aggresiveNum <= 50) ? 'Passive' : 'Aggressive';
    this.player.label = this.looseTight + ' ' + this.passiveAgressive;
  }
  positionBar(imgId: string, barId: string, num: number) {
    var i = document.getElementById(imgId);
    var b = document.getElementById(barId);
    if (i && b) {
      var xoffset = -10;
      var yoffset = -10;
      var rect = i.getBoundingClientRect();
      var distance = rect.right - rect.left;
      var left = rect.left + distance * num / 100 + xoffset;
      var top = window.pageYOffset + rect.top + yoffset;

      b.style.top = top + 'px';
      b.style.left = left + 'px';
    }
  }
  changeLooseTight(num: number) {
    this.changesMadeFlg = true;
    this.player.looseNum += num;
    if (this.player.looseNum < 0)
      this.player.looseNum = 0;
    if (this.player.looseNum > 100)
      this.player.looseNum = 100;

    this.positionBars();
  }
  changePassiveAgg(num: number) {
    this.changesMadeFlg = true;
    this.player.aggresiveNum += num;
    if (this.player.aggresiveNum < 0)
      this.player.aggresiveNum = 0;
    if (this.player.aggresiveNum > 100)
      this.player.aggresiveNum = 100;
    this.positionBars();
  }

}
