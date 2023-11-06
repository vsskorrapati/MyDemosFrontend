import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('input') input!: ElementRef
  constructor() { }
  showClearIcon = false;
  ngOnInit(): void {
  }

  search(value: any, event: any){
  //  event.blur();
  if (value && value.length > 0) {
    this.showClearIcon = true
  } else if (!value || (value && value.length == 0)) {
    this.showClearIcon = false;
  }
    this.searchEvent.emit({
      search: value
    });
  };

  onBlur(value: any) {
    this.searchEvent.emit({
      search: value
    });
  }

  // added comments data
  clearSearch() {
    this.input.nativeElement.value = '';
    this.search('', '');
    this.showClearIcon = false;
  }

}
