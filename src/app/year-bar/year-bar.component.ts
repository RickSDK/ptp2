import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-year-bar',
  templateUrl: './year-bar.component.html',
  styleUrls: ['./year-bar.component.scss']
})
export class YearBarComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  @Input('selectedYear') selectedYear: string = '';
  public prevYear: string = '';
  public nextYear: string = '';
  public year: number = 0;
  public nowYear: number = 0;
  public minYear: number = 0;

  constructor() { }

  ngOnInit(): void {
    var now = new Date();
    this.nowYear = now.getFullYear();

    console.log('selectedYear1', this.selectedYear);
    console.log('localStorage.selectedYear', localStorage.selectedYear);

    if (!this.selectedYear)
      this.selectedYear = localStorage.selectedYear || 'Last 10';

      console.log('selectedYear2', this.selectedYear);

    this.year = parseInt(this.selectedYear);
    if (this.selectedYear == 'Last 10')
      this.year = this.nowYear + 1;
    if (this.selectedYear == 'All')
      this.year = this.nowYear + 2;
    if (this.selectedYear == 'Top 5')
      this.year = this.nowYear + 3;

    this.minYear = localStorage.minYear || this.nowYear;
    this.displayYearStrings();
  }
  displayYearStrings() {
    var yearTypes = ['Last 10', 'All', 'Top 5', '-'];
    this.prevYear = (this.year > this.minYear) ? (this.year - 1).toString() : '-';
    this.nextYear = (this.year < this.nowYear) ? (this.year + 1).toString() : 'Last 10';
    var diff = this.year - this.nowYear;
    if (diff >= 2)
      this.prevYear = yearTypes[diff - 2];
    if (diff >= 1)
      this.selectedYear = yearTypes[diff - 1];
    if (diff >= 0)
      this.nextYear = yearTypes[diff];
  }
  changeYear(num: number) {
    this.year += num;
    this.selectedYear = this.year.toString();
    this.displayYearStrings();
    localStorage.selectedYear = this.selectedYear;
    this.messageEvent.emit(this.selectedYear);
  }
}
