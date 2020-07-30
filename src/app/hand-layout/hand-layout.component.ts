import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hand-layout',
  templateUrl: './hand-layout.component.html',
  styleUrls: ['./hand-layout.component.scss']
})
export class HandLayoutComponent implements OnInit {
  @Input('playerHand') playerHand:any;
  @Input('displayMode') displayMode:number = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
