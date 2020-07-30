import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseHttpComponent } from '../base-http/base-http.component';
import { FriendRequestPopupComponent } from '../friend-request-popup/friend-request-popup.component'; 

declare var netUserFromLine: any;
declare var netTrackerMonth: any;
declare var drawGraphOfFriends: any;

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent extends BaseHttpComponent implements OnInit {
  @ViewChild(FriendRequestPopupComponent) friendRequestPopupComponent: FriendRequestPopupComponent;
  public title = 'Friends';
  public friendItems: any[] = [];
  public buttonNames = ['Last 10', 'Month', 'Year'];
  public loggedInFlg:boolean = false;

  constructor() { super(); }

  ngOnInit(): void {
    this.userObj = this.getUserObj();
    console.log(this.userObj);
    if (!localStorage.email || localStorage.email.length == 0) {
      setTimeout(() => {
        this.showAlertPopup('You must be logged in to use this feature. Go to the Options page.');
      }, 1000);
    } else {
      this.loggedInFlg = true;
      this.loadData();
    }
  }
  changeType(num: number) {
    this.buttonIdx = num;
  }
  loadData() {
    var params = {
      Username: localStorage.email,
      code: localStorage.code,
      localFlg: 'N',
      dateText: netTrackerMonth(),
      friendFlg: 'Y'
    };
    this.executeApi('pokerFriendTracker.php', params);
  }
  postSuccessApi(api: string, data: string) {
    console.log(data);
    var parts = data.split('<br>');
    this.friendItems = [];
    for (var x = 0; x < parts.length; x++) {
      if (parts[x].length > 30)
        this.friendItems.push(netUserFromLine(parts[x], x));
    }
    console.log(this.friendItems)
    this.drawFriendsGraph();

  }
  buttonClicked(str: string) {
    this.friendRequestPopupComponent.show();
  }
  refreshScreen(str: string) {
    this.loadData();
  }

  drawFriendsGraph() {
    var points = [];
    this.friendItems.forEach(function (item) {
      var games = item.last90Days.split(':');
      for (var x = 0; x < games.length; x++) {
        var items = games[x].split('|');
        if (items.length > 1)
          points.push({ profit: items[1], startTime: items[0] });
      }
    })
    drawGraphOfFriends(points, this.friendItems, 1, 'red');
  }
}

function getMonthType(line) {
  if (!line)
    return '';
  var c = line.split('|');
  return c[0];
}