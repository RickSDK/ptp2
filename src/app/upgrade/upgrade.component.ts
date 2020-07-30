import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class UpgradeComponent extends BaseComponent implements OnInit {
  public title = 'Upgrade';

  constructor() { super(); }

  ngOnInit(): void {
  }

}
