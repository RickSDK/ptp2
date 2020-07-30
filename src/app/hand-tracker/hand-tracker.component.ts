import { Component, OnInit, ViewChild } from '@angular/core';
import { HandTrackerPopupComponent } from '../hand-tracker-popup/hand-tracker-popup.component';
import { Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-hand-tracker',
  templateUrl: './hand-tracker.component.html',
  styleUrls: ['./hand-tracker.component.scss']
})
export class HandTrackerComponent extends BaseComponent implements OnInit {
  @ViewChild(HandTrackerPopupComponent) handTrackerPopupComponent: HandTrackerPopupComponent = new HandTrackerPopupComponent;
  public handList: any;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.handList = this.loadDataFromLocalDb('handList');
    console.log(this.handList);
  }
  rightButtonPressed() {
    this.router.navigate(['odds'], { queryParams: { 'type': 'hand' } });
  }

}
