import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { BaseHttpComponent } from '../base-http/base-http.component';

declare var $: any;

@Component({
  selector: 'app-friend-popup',
  templateUrl: './friend-popup.component.html',
  styleUrls: ['./friend-popup.component.scss']
})
export class FriendPopupComponent extends BaseHttpComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();

  public friend:any;
  public removeFlg = false;

  constructor() { super(); }

  ngOnInit(): void {
    this.userObj = this.getUserObj();
  }
  show(friend: any) {
    this.friend = friend;
    this.removeFlg = false;
    $('#friendPopup').modal();
  }
  removeFriend() {
    var params = {
      Username: localStorage.email,
      code: localStorage.code,
      friend: this.friend.userId,
      action: 'removeFriend'
    };
    this.executeApi('pokerFriendApi.php', params);
  }
  postSuccessApi(api: string, data: string) {
    console.log('made it!', data);
    this.messageEvent.emit('done');
    this.closeModal('#friendPopup');
  }
}
