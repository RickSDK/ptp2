import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-hud',
  templateUrl: './hud.component.html',
  styleUrls: ['./hud.component.scss']
})
export class HudComponent extends BaseComponent implements OnInit {
  public noLinkFlg = true;
  public villianObj = { name: 'Villian', fold: 0, check: 0, call: 0, raise: 0, title: '-', img: 'playerType99.png', img1: 'playerType99.png', img2: 'playerType99.png', img3: 'playerType99.png', vpip: '-', pfr: '-', af: '-', vpip2: '0/0', pfr2: '0/0', af2: '0/0', vilFlg: true };
  public heroObj = { name: 'Your', fold: 0, check: 0, call: 0, raise: 0, title: '-', img: 'playerType99.png', img1: 'playerType99.png', img2: 'playerType99.png', img3: 'playerType99.png', vpip: '-', pfr: '-', af: '-', vpip2: '0/0', pfr2: '0/0', af2: '0/0', vilFlg: false };
  
  constructor() { super(); }

  ngOnInit(): void {
    setTimeout(() => {
      if(localStorage.villianObj) {
        this.unpackObj(this.villianObj, localStorage.villianObj);
      }
      if(localStorage.heroObj) {
        this.unpackObj(this.heroObj, localStorage.heroObj);
      }
      this.positionBothBars();
    }, 100);
    
  }
  unpackObj(obj:any, line:string) {
    var c = line.split(':');
    obj.fold = parseInt(c[0]);
    obj.check = parseInt(c[1]);
    obj.call = parseInt(c[2]);
    obj.raise = parseInt(c[3]);
  }
  clearStats(obj: any) {
    obj.fold = 0;
    obj.check = 0;
    obj.call = 0;
    obj.raise = 0;
    this.positionBothBars();
  }
  adjustHudObj(obj: any, num: number) {
    if (num == 0)
      obj.fold++;
    if (num == 1)
      obj.check++;
    if (num == 2)
      obj.call++;
    if (num == 3)
      obj.raise++;

      this.positionBothBars();
  }
  positionBothBars() {
    localStorage.villianObj = this.calculateStats(this.villianObj);
    localStorage.heroObj = this.calculateStats(this.heroObj);
  }
  calculateStats(obj:any, flg = false) {
    //	if(flg && !linkedPlayer && !linkedGame)
    //	this.noLinkFlg=true;
    var hudStats = hudStatsFromObj(obj.fold, obj.check, obj.call, obj.raise);
    obj.vpip = hudStats.vpipStr;
    obj.pfr = hudStats.pfrStr;
    obj.af = hudStats.afStr;
    obj.vpip2 = hudStats.vpip2;
    obj.pfr2 = hudStats.pfr2;
    obj.af2 = hudStats.af2;
    obj.img = hudStats.img;
    obj.img1 = hudStats.img1;
    obj.img2 = hudStats.img2;
    obj.img3 = hudStats.img3;
    obj.title = hudStats.title;
    obj.skill = hudStats.skill;

    var vpip = hudStats.vpip;
    var pfr = hudStats.pfr;
    var af = hudStats.af;
    positionBar('redGreen1', (obj.vilFlg) ? 'bar1vil' : 'bar1hero', boxIntVal(vpip * 50 / 26.975, 0, 100), obj.vilFlg, (obj.vilFlg) ? 'img1vil' : 'img1hero');
    positionBar('redGreen2', (obj.vilFlg) ? 'bar2vil' : 'bar2hero', boxIntVal(pfr * 50 / (vpip / 2), 0, 100), obj.vilFlg, (obj.vilFlg) ? 'img2vil' : 'img2hero');
    positionBar('redGreen3', (obj.vilFlg) ? 'bar3vil' : 'bar3hero', boxIntVal(af * 50 / 24, 0, 100), obj.vilFlg, (obj.vilFlg) ? 'img3vil' : 'img3hero');
    return packageDataForObj(obj);
    //	saveRecord(obj);
  }
  buttonClicked(item:string) {
    console.log('here');
  }

}

//----------------------------------------------------------------------------------------
function packageDataForObj(obj:any) {
  return obj.fold+':'+obj.check+':'+obj.call+':'+obj.raise;
}

function positionBar(imgId:string, barId:string, num:number, vilFlg:boolean, iconImg:string) {
  var i = document.getElementById(imgId);
  if (!i)
    return;
  var rect = i.getBoundingClientRect();
  var b = document.getElementById(barId);
  var icon = document.getElementById(iconImg);
  var distance = rect.bottom - rect.top - 15;
  var offset = (vilFlg) ? -40 : 12;
  var offset2 = (vilFlg) ? -40 : 31;
  var left = rect.left + offset;
  var left2 = rect.left + offset2;
  var top = window.pageYOffset + rect.bottom - distance * num / 100 - 15;
  if(b && icon) {
    b.style.top = top + 'px';
    b.style.left = left + 'px';
    icon.style.top = (top - 8) + 'px';
    icon.style.left = left2 + 'px';
  }
}

function hudStatsFromObj(fo:string, ch:string, ca:string, ra:string) {
  var fold = parseInt(fo);
  var check = parseInt(ch);
  var call = parseInt(ca);
  var raise = parseInt(ra);
  var hudObj = {
    fold: 0, check: 0, call: 0, raise: 0, hands: 0, vpip2: '', pfr2: '', af2: '',
    vpip: 0, pfr: 0, af: 0, img: '', img1: '', img2: '', img3: '', title: '', vpipStr: '', pfrStr: '', afStr: '', skill: ''
  };
  hudObj.fold = fold;
  hudObj.check = check;
  hudObj.call = call;
  hudObj.raise = raise;
  hudObj.hands = fold + call + raise;

  hudObj.vpip2 = (call + raise).toString() + '/' + hudObj.hands.toString();
  hudObj.pfr2 = (raise).toString() + '/' + hudObj.hands.toString();
  hudObj.af2 = (raise).toString() + '/' + (call + raise).toString();

  hudObj.vpip = 26.975;
  hudObj.pfr = 13.4875;
  hudObj.af = 24;
  hudObj.img = 'playerType99.png';
  hudObj.img1 = 'playerType99.png';
  hudObj.img2 = 'playerType99.png';
  hudObj.img3 = 'playerType99.png';
  hudObj.title = '-';
  hudObj.vpipStr = '-';
  hudObj.pfrStr = '-';
  hudObj.afStr = '-';
  if (hudObj.hands > 0) {
    hudObj.vpip = (call + raise) * 100 / hudObj.hands;
    hudObj.pfr = (raise * 100) / hudObj.hands;
    if (call + raise > 0)
      hudObj.af = (raise * 100) / (call + raise);

    hudObj.vpipStr = Math.round(hudObj.vpip) + '%';
    hudObj.pfrStr = Math.round(hudObj.pfr) + '%';
    hudObj.afStr = Math.round(hudObj.af) + '%';

    var skill1 = boxIntVal(7.15 - (hudObj.vpip / 6.5), 0, 5);
    var skill2Percent = 0;
    if (hudObj.vpip > 0)
      skill2Percent = hudObj.pfr * 100 / hudObj.vpip;
    var skill2 = boxIntVal(skill2Percent / 10 - 2, 0, 5);
    var skill3 = boxIntVal(hudObj.af / 8, 0, 5);
    var style1 = (skill1 >= 3) ? 'Tight' : 'Loose';
    var style2 = (skill2 + skill3 >= 6) ? 'Aggressive' : 'Passive';
    var finalNumber = boxIntVal((skill1 + skill3) / 2, 0, 5);
    hudObj.title = style1 + '-' + style2;
    hudObj.img = 'playerType' + finalNumber + '.png';
    hudObj.img1 = 'playerType' + skill1 + '.png';
    hudObj.img2 = 'playerType' + skill2 + '.png';
    hudObj.img3 = 'playerType' + skill3 + '.png';
    var skills = ['Donkey', 'Fish', 'Rounder', 'Grinder', 'Shark', 'Pro'];
    hudObj.skill = skills[finalNumber];
  }
  return (hudObj);
}
function boxIntVal(num:number, low:number, high:number) {
  if (num < low)
    return low;
  if (num > high)
    return high;
  return Math.round(num);
}