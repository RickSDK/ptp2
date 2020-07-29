import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { PokerService } from '../poker.service';
import { Filter } from '../classes/filter';

declare var $: any;

@Component({
  selector: 'app-filter-popup',
  templateUrl: './filter-popup.component.html',
  styleUrls: ['./filter-popup.component.scss']
})
export class FilterPopupComponent extends BaseComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  public filter: Filter = new Filter(null);
  public existingFilterFlg: boolean = false;
  public nameObj = { name: 'Name', type: 'text', value: '', requiredFlg: true, warningFlg: false }
  public typeObj = { name: 'Type', type: 'dropdown', value: 'All', options: ['All', 'Cash', 'Tournament'] }
  public dateObj = { name: 'Date Range', type: 'dropdown', value: 'All', options: ['All', 'This Month', 'Last Month', 'This Year', 'Last Year', 'Last 90 Days', 'Last 180 Days', 'Last 365 Days'] }
  public tournamentTypeObj = { name: 'Tournament Type', type: 'dropdown', value: 'All', options: ['All'] }
  public stakesObj = { name: 'Stakes', type: 'dropdown', value: 'All', options: ['All'] }
  public limitObj = { name: 'Limit', type: 'dropdown', value: 'All', options: ['All'] }
  public bankrollObj = { name: 'Bankroll', type: 'dropdown', value: 'All', options: ['All'] }
  public casinoObj = { name: 'Cansino', type: 'dropdown', value: 'All', options: ['All'] }
  public displayObj = { id: 'showFlg', name: 'Display', type: 'boolean', value: true }

  constructor(private _pokerService: PokerService) {
    super();
    this.allGames = this.loadGames();
    this.addOptions(this.tournamentTypeObj, this._pokerService.getUserDataOfType(1, this.allGames));
    this.addOptions(this.stakesObj, this._pokerService.getUserDataOfType(2, this.allGames));
    this.addOptions(this.limitObj, this._pokerService.getUserDataOfType(3, this.allGames));
    this.addOptions(this.bankrollObj, this._pokerService.getUserDataOfType(4, this.allGames));
    this.addOptions(this.casinoObj, this._pokerService.getUserDataOfType(5, this.allGames));
  }
  addOptions(obj: any, options: any) {
    options.forEach((option: { name: string; }) => {
      obj.options.push(option.name);
    });
  }
  ngOnInit(): void {
  }
  show(filter: Filter) {
    if (filter) {
      this.existingFilterFlg = true;
      this.filter = filter;
    } else {
      this.existingFilterFlg = false;
      const newId = this.getNewId('filterList');
      this.filter = new Filter(null, newId);
    }
    console.log(this.filter);

    this.populateFilter();
    $('#filterPopup').modal();
  }
  populateFilter() {
    this.nameObj.value = this.filter.name;
    this.typeObj.value = this.filter.type;
    this.dateObj.value = this.filter.dateRange;
    this.tournamentTypeObj.value = this.filter.tournamentType;
    this.stakesObj.value = this.filter.stakes;
    this.limitObj.value = this.filter.limit;
    this.bankrollObj.value = this.filter.bankroll;
    this.casinoObj.value = this.filter.casino;
    this.displayObj.value = this.filter.displayFlg;
  }
  resetButtonPressed() {
    this.filter = new Filter(null, this.filter.id);
    this.populateFilter();
  }
  saveButtonPressed() {
    if (!this.nameObj.value) {
      this.nameObj.warningFlg = true;
      return;
    }
    this.filter.name = this.nameObj.value;
    this.filter.type = this.typeObj.value;
    this.filter.dateRange = this.dateObj.value;
    this.filter.tournamentType = this.tournamentTypeObj.value;
    this.filter.stakes = this.stakesObj.value;
    this.filter.limit = this.limitObj.value;
    this.filter.bankroll = this.bankrollObj.value;
    this.filter.casino = this.casinoObj.value;
    this.filter.displayFlg = this.displayObj.value;
    console.log(this.filter);
    this.saveRecordToLocalDb('filterList', this.filter);
    this.closeModal('#filterPopup');
    this.messageEvent.emit('done');
  }
}
