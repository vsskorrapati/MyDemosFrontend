import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../shared/shared-data.service';
import { Tab } from '../shared/DataModals/shared.modal';



@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})


export class TabsComponent implements OnInit {

  tabs = [
    { id: 1, name: 'All Demos', active: true },
    { id: 2, name: 'Customizable', active: false },
    { id: 3, name: 'Zero Setup', active: false },
    { id: 4, name: 'Bookmarked', active: false },
    { id: 5, name: 'Shared', active: false },
  ]
  constructor(private dataService: SharedDataService) { }

  ngOnInit(): void {
    this.dataService.sendTabChangeEvent(this.tabs[0]);
  }

  handleTabNavigation(tab: Tab) {
    this.tabs.map(tab => tab.active = false);
    tab.active = true;
    this.dataService.sendTabChangeEvent(tab);
  }

}
