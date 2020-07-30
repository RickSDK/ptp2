import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseHttpComponent } from '../base-http/base-http.component';

declare var $: any;

@Component({
  selector: 'app-friend-request-popup',
  templateUrl: './friend-request-popup.component.html',
  styleUrls: ['./friend-request-popup.component.scss']
})
export class FriendRequestPopupComponent extends BaseHttpComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  public emailObj = { name: 'Friend Email', type: 'email', requiredFlg: true, value: '', warningFlg: false, errorMessage: '' };
  public friendFoundFlg = false;
  public friendAddedFlg = false;
  public friendObj: any;
  public friendList: any;

  constructor() { super(); }

  ngOnInit(): void {
    this.userObj = this.getUserObj();
  }
  show() {
    this.friendFoundFlg = false;
    this.friendAddedFlg = false;
    $('#friendRequestPopup').modal();
    this.lookupdata();
  }
  findUser() {
    if (this.emailObj.value.length == 0 || this.emailObj.errorMessage.length > 0) {
      this.emailObj.warningFlg = true;
      return;
    }
    console.log(this.emailObj);
    this.lookupdata();
  }
  lookupdata() {
    var params = {
      Username: localStorage.email,
      code: localStorage.code,
      email: this.emailObj.value,
      action: 'friendLookup'
    };
    this.executeApi('pokerFriendApi.php', params);
  }
  postSuccessApi(api: string, data: string) {
    this.processData(data);
  }
  postErrorApi(api: string, data: string) {
    this.processData(data);
  }
  processData(data: string) {
    console.log(data);
    var c = data.split('<a>');
    if (c.length > 1) {
      var friend = c[0].split('|');
      var items = c[1].split(':');
      var friendList = [];
      items.forEach(item => {
        var elements = item.split('|');
        var id = parseInt(elements[0]);
        var status = elements[3];
        if (id > 0 && (status == 'Active' || status == 'Requested' || status == 'Request Pending'))
          friendList.push({ id: id, email: elements[1], firstName: elements[2], status: status });
      });
      this.friendList = friendList;

      var id = parseInt(friend[0]);
      if (id > 0)
        this.friendObj = { id: parseInt(friend[0]), email: friend[1], firstName: friend[2], status: friend[3] }
      this.friendFoundFlg = id > 0;
      console.log(this.friendObj);
      console.log(this.friendList);
      if (this.friendAddedFlg) {
        this.messageEvent.emit('done');
        this.closeModal('#friendRequestPopup');
      }

    } else {
      this.messageEvent.emit('done');
      this.closeModal('#friendRequestPopup');
    }
  }
  addFriend() {
    this.friendAddedFlg = true;
    var params = {
      Username: localStorage.email,
      code: localStorage.code,
      friend: this.friendObj.id,
      action: 'addFriend'
    };
    this.executeApi('pokerFriendApi.php', params);
  }
  acceptFriend(friend: any) {
    console.log(friend);
    this.friendAddedFlg = true;
    var params = {
      Username: localStorage.email,
      code: localStorage.code,
      friend: friend.id,
      action: 'acceptFriend'
    };
    this.executeApi('pokerFriendApi.php', params);
  }

}
