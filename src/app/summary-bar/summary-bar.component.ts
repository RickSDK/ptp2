import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-summary-bar',
  templateUrl: './summary-bar.component.html',
  styleUrls: ['./summary-bar.component.scss']
})
export class SummaryBarComponent implements OnInit {
  @Input('summaryObj') summaryObj: any;

  constructor() { }

  ngOnInit(): void {
  }

}
