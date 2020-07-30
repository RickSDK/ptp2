import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-trackers',
  templateUrl: './trackers.component.html',
  styleUrls: ['./trackers.component.scss']
})
export class TrackersComponent extends BaseComponent implements OnInit {
  public title = 'Trackers';

  constructor() { super(); }

  ngOnInit(): void {
  }

}
