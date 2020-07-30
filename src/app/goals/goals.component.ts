import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class GoalsComponent extends BaseComponent implements OnInit {

  constructor() { super(); }

  ngOnInit(): void {
  }

}
