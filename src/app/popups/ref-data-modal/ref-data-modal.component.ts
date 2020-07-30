import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { PokerService } from '../../poker.service';

declare var $: any;
declare var getTextFieldValue: any;

@Component({
  selector: 'app-ref-data-modal',
  templateUrl: './ref-data-modal.component.html',
  styleUrls: ['./ref-data-modal.component.scss']
})
export class RefDataModalComponent extends BaseComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  public options: any[] = [];
  public selectedValue: string = '';
  public dataType: string = '';
  public newValueFlg = false;

  constructor(private _pokerService: PokerService) { super() }

  ngOnInit(): void {
  }
  show(type: number, dataType: string, value = '') {
    this.dataType = dataType;
    this.newValueFlg = false;
    this.selectedValue = value;
    this.allGames = this.loadGames();
    this.options = this._pokerService.getDataTypes(type, 0, this.allGames);
    $('#refDataModal').modal();
  }
  buttonClicked(option: any) {
    this.selectedValue = option.name;
  }
  selectValuePressed(option: any) {
    this.messageEvent.emit(option.name);
    this.closeModal('#refDataModal');
  }
  addRefDataClicked() {
    var value = getTextFieldValue('newValue');
    if (value.length > 0) {
      this.messageEvent.emit(value);
      this.closeModal('#refDataModal');
    }
  }

}
