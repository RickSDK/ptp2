import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterPopupComponent } from '../filter-popup/filter-popup.component';
import { BaseComponent } from '../base/base.component';
import { PokerService } from '../poker.service';
import { Filter } from '../classes/filter';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent extends BaseComponent implements OnInit {
  @ViewChild(FilterPopupComponent) filterPopupComponent: FilterPopupComponent = (new FilterPopupComponent(this._pokerService));
  public filterList: any[] = [];

  constructor(private _pokerService: PokerService) { super(); }

  ngOnInit(): void {
    this.loadingFlg = true;
    setTimeout(() => {
      this.loadData();
    }, 10);
  }
  loadData() {
    this.refreshFilters('');
    this.loadingFlg = false;
  }
  rightButtonPressed() {
    this.filterPopupComponent.show(null);
  }
  refreshFilters(event: string) {
    this.filterList = this.loadDataFromLocalDb('filterList');
    console.log('refresh');
  }
}
