import { Component, OnInit } from '@angular/core';
import { BaseHttpComponent } from '../base-http/base-http.component';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent extends BaseHttpComponent implements OnInit {
  public title = 'Forum';
  public forumItems: any[] = [];
  public forumItemsInfo: any[] = [];
  public forumItemsGen: any[] = [];
  public forumItemsStrat: any[] = [];
  public category: number = 99;
  public selectedForumPost: any;
  public forumPostItems: any[] = [];
  public loggedInFlg = false;
  public drilldownFlg = false;
  public messageObj = { name: 'message', type: 'textarea', requiredFlg: true, max: 500, value: '' };
  public forumTypes = [
    'Preview', 'Info', 'General', 'Strategy', 'Bad Beats'
  ]

  constructor() { super(); }

  ngOnInit(): void {
    if (!localStorage.email || localStorage.email.length == 0) {
      setTimeout(() => {
        this.showAlertPopup('You must be logged in to use this feature. Go to the Options page.');
      }, 1000);
    } else {
      this.loggedInFlg = true;
      this.loadData(99, '');
    }
  }

  changeType(num: number) {
    this.buttonIdx = num;
    if (num == 0)
      this.loadData(99, '');
    else
      this.loadData(num - 1, 'Category');
  }
  loadData(category: number, type: string) {
    this.messageObj.value = '';
    this.category = category;
    var params = {
      Username: localStorage.email,
      code: localStorage.code,
      category: category,
      type: type
    };
    this.executeApi('forumGetHeadlines.php', params);
  }
  loadPost(item: any) {
    console.log(item);
    var params = {
      Username: localStorage.email,
      code: localStorage.code,
      postId: item.postId,
    };
    this.executeApi('forumGetPost.php', params);
  }
  postReply() {
    var params = {
      Username: localStorage.email,
      code: localStorage.code,
			postId: this.selectedForumPost.postId,
			title: this.selectedForumPost.title,
			body: this.messageObj.value
    };
    console.log(params);
    this.drilldownFlg = false;
    this.executeApi('forumSubmitPost.php', params);
  }
  postSuccessApi(api: string, data: string) {
    console.log(data);
    this.forumItems = [];
    this.forumItemsInfo = [];
    this.forumItemsGen = [];
    this.forumItemsStrat = [];
    console.log('api', api);
    if (api == 'forumGetPost.php') {
      this.drilldownFlg = true;
      var categories = data.split('<br>');
      for (var x = 0; x < categories.length; x++) {
        console.log('categories', x);
        var posts = categories[x].split('<b>');
        for (var y = 0; y < posts.length; y++) {
          console.log(' posts[y]', posts[y]);
          var components = posts[y].split('|');
          var title = components[3];
          var message = components[8];
          var name = components[5];
          var dateText = components[7];
          var postId = components[1];
          var messageId = components[2];
          if (x == 1) {
            postId = components[2];
            message = components[4];
            dateText = components[5];
            name = components[6];
            //city = components[7];
          }
          if (this.forumPostItems.length > 0)
            title = '';
          else
            this.selectedForumPost = { postId: postId, title: title, name: name, dateText: dateText, messageId: messageId, message: message };
          if (name)
            this.forumPostItems.push({ postId: postId, title: title, name: name, dateText: dateText, messageId: messageId, message: message });
        }
      }
      console.log('forumPostItems', this.forumPostItems);
      return;
    }
    this.drilldownFlg = false;
    if (data.substring(0, 7) == 'Success') {
      var category = ['Info', 'General', 'Strategy', 'Bad Beats'];
      var imgages = ['cards.png', 'cardd.png', 'cardc.png', 'cardh.png'];
      var parts = data.split('<br>');
      var categories = parts[1].split('<a>');
      for (var x = 0; x < categories.length; x++) {
        var posts = categories[x].split('<b>');
        for (var y = 0; y < posts.length; y++) {
          var components = posts[y].split('|');
          var name = components[3];
          var newFlg = components[4];
          var imageNum = this.category;
          if (imageNum > 3)
            imageNum = x;
          var img = imgages[imageNum];
          if (newFlg == 'Y')
            img = 'new.png';
          var obj = { img: img, name: components[3], topRight: components[7], botLeft: components[8], botRight: components[5], preview: components[8], postId: components[2] };
          if (name) {
            if (this.category == 99) {
              if (x == 0)
                this.forumItemsInfo.push(obj);
              if (x == 1)
                this.forumItemsGen.push(obj);
              if (x == 2)
                this.forumItemsStrat.push(obj);
              if (x == 3)
                this.forumItems.push(obj);
            } else
              this.forumItems.push(obj);
          }
        }
      }
    }
  }

}
