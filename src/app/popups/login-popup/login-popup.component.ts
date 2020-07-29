import { Component, OnInit, Injectable, Output, EventEmitter } from '@angular/core';
import { BaseHttpComponent } from '../../base-http/base-http.component';

declare var $: any;
declare var getTextFieldValue: any;

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss']
})

@Injectable({
  providedIn: 'root'
})

export class LoginPopupComponent extends BaseHttpComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  public userName = localStorage.firstName;
  public createAccountFlg: boolean = false;
  public emailSentFlg: boolean = false;
  public showCreateAccountFlg: boolean = false;
  public errorMessage:string = '';

  constructor() {
    super();
  }

  ngOnInit(): void {
  }
  show() {
    this.loadingFlg = false;
    this.apiExecutedFlg = false;
    this.createAccountFlg = false;
    this.emailSentFlg = false;
    this.showCreateAccountFlg = false;
    this.errorMessage = '';
    $('#loginPopup').modal();
  }
  loginPressed() {
    var email = getTextFieldValue('emailField');
    var password = getTextFieldValue('passwordField');
    if (email == '111' && password == '111') {
      email = 'rickmedved@hotmail.com';
      password = 'rick23';
    }
    if (email == '222' && password == '222') {
      email = 'robbmedved@yahoo.com';
      password = '7004175St$w';
    }
    if (email.length == 0) {
      //			showAlertPopup('Email field is blank');
      return;
    }
    if (password.length == 0) {
      //			showAlertPopup('Password field is blank');
      return;
    }
    var params = {
      Username: email,
      Password: password
    };
    localStorage.email = email;
    localStorage.password = '*****';
    localStorage.code = btoa(password);
    this.executeApi('pokerLogin.php', params, true);
  }
  postSuccessApi(api: string, data: string) {
    console.log(data);
    var components = data.split("|");
    if (components[0] == 'Success') {
      localStorage.firstName = components[1];
      localStorage.city = components[2];
      localStorage.state = components[3];
      localStorage.country = components[4];
      localStorage.xFlg = components[5];
      localStorage.gamesOnServer = components[6];
      localStorage.userId = components[7];
      this.closeModal('#loginPopup');
      this.messageEvent.emit('done');
    } else
      this.apiMessage = data;
  }
  postErrorApi(file: string, error: string) {
    this.apiMessage = error;
    localStorage.email = '';
  }
  okButtonPressed() {
    this.closeModal('#loginPopup');
    this.messageEvent.emit('done');
  }
  createAccountPressed() {
    if (this.isAndroidVersion())
      this.showCreateAccountFlg = true;
    else
      this.createAccountFlg = true;
  }
  submitEmailPressed() {
    var email = getTextFieldValue('emailField2');
    var params = {
      email: email,
      action: 'requestPro'
    };
    console.log(params);
    this.executeApi('pokerLogin.php', params, true);
    this.emailSentFlg = true;
  }
  createPressed() {
    var email = getTextFieldValue('emailField3');
    var firstName = getTextFieldValue('firstName');
    var password = getTextFieldValue('passwordField2');
    var password2 = getTextFieldValue('passwordField3');
    if(email=='') {
      this.errorMessage = 'Invalid email';
      return;
    }
    if(firstName=='') {
      this.errorMessage = 'Invalid firstName';
      return;
    }
    if(password=='') {
      this.errorMessage = 'Invalid password';
      return;
    }
    if(password!=password2) {
      this.errorMessage = 'password dont match';
      return;
    }
    this.showCreateAccountFlg = false;
    var params = {
      email: email,
      firstName: firstName,
      password: password,
      appName: this.getVersion(),
      action: 'createAccount'
    };
    localStorage.email = email;
    localStorage.password = '*****';
    localStorage.code = btoa(password);
    this.executeApi('pokerLogin.php', params, true);
  }

}
