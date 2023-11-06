import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SharedDataService } from '../shared/shared-data.service';
import { SearchService } from '../shared/search.service';
import { Subscription } from 'rxjs';
import { Tab } from '../shared/DataModals/shared.modal';
import { NotificationService } from '../notification/notification.service';
import { ActionDataService } from '../Modals/actions-modal/action-data.service';
import { MixpanelService } from '../shared/mixpanel.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, OnDestroy {

  @Output() moreActions: EventEmitter<any> = new EventEmitter();
  @Output() login: EventEmitter<any> = new EventEmitter();

  tabChangeEventSubscription: Subscription;
  searchEventSubscription: Subscription;
  handleTriggerSubscription: Subscription;

  datasource: any = [];
  pages: number[] = [];
  shared_all: any;
  bookmarkedOrgs: any;
  customizableOrgs: any;
  zeroSetupOrgs: any;
  allOrgs: any;
  shared_with_me: any;
  shared_to_others: any;
  allOrgsPaginated: any;
  bookmarkedOrgsPaginated: any;
  customizableOrgsPaginated: any;
  zeroSetupOrgsPaginated: any;
  shared_with_me_Paginated: any;
  shared_to_others_Paginated: any;
  shared_all_Paginated: any;
  shared = "All Shared";
  currentTab: any;
  state_is_expanded = false;
  type_is_expanded = false;
  state_header_name = "Status";
  type_header_name = "Type";
  is_state_sorted = false;
  shared_header_name = 'All Shared';
  is_type_sorted = false;
  is_date_sorted_descending = true;
  are_filters_active = false;
  current_tab_data_source: any = [];
  types_dropdown: any = [];
  are_filters_selected = false;
  filter_count = 0;
  type_filter_count = 0;
  status_filter_count = 0;
  statusFilterSelected = 'all';
  typeFilterSelected = 'all';
  dateFilterSelected = 'desc';
  rowsCount: number = 0;
  pageCount: number = 0;
  activePage: number = 1;
  recordsPerPage = 9;
  isSharedTab = false;
  shared_type_expaned = false;
  showClearFilters = false;
  MainDataSource: any = [];
  MainDataSourcePaginated: any = [];
  search_term = '';
  start = 1;
  end = this.recordsPerPage;
  show_sort_tooltip = false;


  column_headers = [
    { id: 1, name: "State" },
    { id: 2, name: "Type" },
    { id: 3, name: "Name" },
    { id: 4, name: "User Name" },
    { id: 5, name: "Instance" },
    { id: 6, name: "Created Date" },
    { id: 7, name: "Expiry Date" }
  ]

  status_dropdown = [
    { id: 0, name: "All", state: 'all' },
    { id: 1, name: "Active", state: 'active' },
    { id: 2, name: "Expiring", state: 'expiring' },
    { id: 3, name: "Expired", state: 'expired' }
  ]

  types_all = [
    { id: 9, name: "All", type: 'all' },
    { id: 1, name: "Simple Demo Org (SDO)", type: 'sdo' },
    { id: 2, name: "Industry Demo Org (IDO)", type: 'ido' },
    { id: 3, name: "Clean Demo Org (CDO)", type: 'cdo' },
    { id: 4, name: "Marketing Cloud Demo Org (MCDO)", type: 'mcdo' },
    { id: 5, name: "Zero Setup Core (ZSC)", type: 'zsc' },
    { id: 6, name: "Zero Setup Marketing Cloud (ZSMC)", type: 'zsmc' },
    { id: 7, name: "Everybody's Demo Org (EDO)", type: 'edo' },
    { id: 8, name: "Miscellaneous (MISC)", type: 'misc' },
  ];

  types_customizable = [
    { id: 0, name: "All", type: 'all' },
    { id: 1, name: "Simple Demo Org (SDO)", type: 'sdo' },
    { id: 2, name: "Industry Demo Org (IDO)", type: 'ido' },
    { id: 3, name: "Clean Demo Org (CDO)", type: 'cdo' },
    { id: 4, name: "Marketing Cloud Demo Org (MCDO)", type: 'mcdo' },
    { id: 5, name: "Miscellaneous (MISC)", type: 'misc' }
  ];

  types_zero_setup = [
    { id: 0, name: "All", type: 'all' },
    { id: 5, name: "Zero Setup Core (ZSC)", type: 'zsc' },
    { id: 6, name: "Zero Setup Marketing Cloud (ZSMC)", type: 'zsmc' },
    { id: 7, name: "Everybody's Demo Org (EDO)", type: 'edo' }
  ]

  Shared_Types = [
    { id: 0, name: "All Shared", type: "all" },
    { id: 1, name: "Shared With Me", type: "with" },
    { id: 2, name: "Shared With Others", type: "to" }
  ]

  constructor(private dataService: SharedDataService, private searchService: SearchService, private notification: NotificationService, private actionData: ActionDataService, private router: Router, private Mixpanel: MixpanelService) {
    this.tabChangeEventSubscription = this.dataService.handleTabChangeEvent().subscribe((tab: Tab) => {
      this.currentTab = tab.id;
      this.initializeTableControls();
      this.fetchData(tab.id);
      this.modifyDataSource();
    });

    this.searchEventSubscription = this.searchService.handleSearchEvent().subscribe((event: any) => {
      this.search(event);
    })

    this.handleTriggerSubscription = this.dataService.handleTriggerFromActions().subscribe((tab: number) => {
      this.fetchData(tab);
      this.modifyDataSource();
    })

  }

  ngOnInit(): void {
    const count = this.getExpiringOrgs();
    if (count > 0) {
      this.notification.setNotification({
        show: true,
        isToast: true,
        type: "warn",
        info: `${count} org(s) are expiring in less than 7 days.`
      });
    }
  }

  getExpiringOrgs() {
    let expiring_org_count = 0;
    this.allOrgs.forEach((org: any) => {
      if (org.state == 'expiring') {
        expiring_org_count++
      }
    });
    return expiring_org_count;
  }

  clearFilters() {
    this.initializeTableControls();
    this.filter_count = 0;
    this.type_filter_count = 0;
    this.status_filter_count = 0;
    this.checkFilters();
    this.modifyDataSource();
  }

  calculateRecordRange() {
    if (this.activePage > 1) {
      this.start = ((this.activePage - 1) * 9) + 1;
      if (this.activePage == this.pageCount) {
        this.end = this.rowsCount;
      } else {
        this.end = this.activePage * 9;
      }

    } else if (this.activePage == 1) {
      this.start = 1;
      this.end = this.recordsPerPage;
    }
  }

  checkFilters() {
    if ((this.type_filter_count + this.status_filter_count) > 0) {
      this.showClearFilters = true;
    } else {
      this.showClearFilters = false;
    }
  }

  fetchData(tab: number) {
    this.isSharedTab = false;
    let page = +this.activePage - 1;
    if (tab == 1) {
      this.types_dropdown = this.types_all;
      this.allOrgs = [... this.dataService.allorgs];
    } else if (tab == 2) {
      this.types_dropdown = this.types_customizable;
      this.customizableOrgs = [...this.dataService.sdos, ...this.dataService.idos, ...this.dataService.cdos, ...this.dataService.misc, ...this.dataService.mcdos];

    } else if (tab == 3) {
      this.types_dropdown = this.types_zero_setup;
      this.zeroSetupOrgs = [...this.dataService.zsc, ...this.dataService.zsmc, ...this.dataService.edos];
    } else if (tab == 4) {
      this.types_dropdown = this.types_all;
      this.bookmarkedOrgs = [...this.dataService.allorgs.filter((org: any) => org.is_bookmarked == true)];
    } else if (tab == 5) {
      this.isSharedTab = true;
      this.types_dropdown = this.types_all;
      this.shared_with_me = [...this.dataService.shared_with_me_orgs];
      this.shared_to_others = [...this.dataService.shared_to_others_orgs];
      this.shared_all = [...this.shared_with_me, ...this.shared_to_others];
    }
  }

  modifyDataSource() {
    console.log("");
    this.MainDataSource = [...this.populateDataSource()];
    this.MainDataSourcePaginated = [];
    this.MainDataSource = this.MainDataSource.map((item: any) => {
      return {
        ...item,
        showbadge: false,
        show_bookmark: false,
        show_more_actions: false
      }
    });
    if (this.search_term && this.search_term.trim() != '') {
      this.triggerSearch(this.search_term);
    }
    this.filterThroughAllData();
    if (this.MainDataSource.length > 0) {
      this.rowsCount = this.MainDataSource.length;
      this.MainDataSourcePaginated = [...this.sliceIntoChunks([...this.MainDataSource], this.recordsPerPage)];
      this.pageCount = this.MainDataSourcePaginated?.length;
      this.reactToChange(this.rowsCount);
      this.datasource = this.MainDataSourcePaginated.length > 0 ? [...this.MainDataSourcePaginated[this.activePage - 1]] : [];
    } else {
      this.rowsCount = this.MainDataSource.length;
      this.MainDataSourcePaginated = [];
      this.pageCount = 0;
      this.reactToChange(this.rowsCount);
      this.datasource = []
    }

  }


  filterThroughAllData() {
    if (this.statusFilterSelected != 'all') {
      this.MainDataSource = this.MainDataSource.filter((data: any) => data.state == this.statusFilterSelected);
    }
    if (this.typeFilterSelected != 'all') {
      this.MainDataSource = this.MainDataSource.filter((data: any) => data.type == this.typeFilterSelected);
    }

    if (this.dateFilterSelected == 'desc') {
      this.MainDataSource.sort(function (a: any, b: any) {
        return (+(new Date(b.created_date)) - +(new Date(a.created_date)));
      });
    } else if (this.dateFilterSelected == 'asc') {
      this.MainDataSource.sort(function (a: any, b: any) {
        return (+(new Date(a.created_date)) - +(new Date(b.created_date)));
      });
    }
  }

  handleHeader() {
    this.state_is_expanded = !this.state_is_expanded;
    if (this.type_is_expanded) {
      this.type_is_expanded = false;
    }
  }

  handleType() {
    this.type_is_expanded = !this.type_is_expanded;
    if (this.state_is_expanded) {
      this.state_is_expanded = false;
    }
  }

  showBookmark(row: any) {
    row.show_bookmark = true;
  }

  hideBookmark(row: any) {
    row.show_bookmark = false;
  }

  showMoreActions(row: any) {
    row.show_more_actions = true;
  }

  hideMoreActions(row: any) {
    row.show_more_actions = false;
  }


  displayActivePage(activePageNumber: number) {
    this.activePage = activePageNumber;
    this.datasource = this.MainDataSourcePaginated[this.activePage - 1];
    this.calculateRecordRange();
    this.updateVisiblePages();
  }

  initializeTableControls() {
    this.state_is_expanded = false;
    this.type_is_expanded = false;
    this.state_header_name = "Status";
    this.type_header_name = "Type";
    this.is_state_sorted = false;
    this.is_type_sorted = false;
    this.typeFilterSelected = 'all';
    this.statusFilterSelected = 'all';
    this.shared_header_name = "All Shared";
    this.shared_type_expaned = false;
    this.dateFilterSelected = 'desc';
    this.type_filter_count = 0;
    this.status_filter_count = 0;
  }

  handleOver(row: any) {
    row.showbadge = true;
  }

  handleOut(row: any) {
    row.showbadge = false;
  }

  handleStatusDropdownClick(item: any) {
    this.status_filter_count = this.status_filter_count + 1;
    this.checkFilters();
    this.state_is_expanded = !this.state_is_expanded;
    if (item.state == 'all') {
      this.status_filter_count = 0;
      this.is_state_sorted = false
      this.state_header_name = "Status";
      this.statusFilterSelected = 'all';
      this.checkFilters();
    } else if (item.state == 'active') {
      this.is_state_sorted = true;
      this.state_header_name = "Active";
      this.statusFilterSelected = 'active';
    } else if (item.state == 'expiring') {
      this.is_state_sorted = true;
      this.state_header_name = "Expiring";
      this.statusFilterSelected = 'expiring';
    } else if (item.state == 'expired') {
      this.is_state_sorted = true;
      this.state_header_name = "Expired";
      this.statusFilterSelected = 'expired';
    }
    this.modifyDataSource();
  }

  handleTypeDropdownClick(item: any) {
    this.Mixpanel.track('Set Filter', { filter_type: item.type });
    this.type_is_expanded = !this.type_is_expanded;
    this.type_filter_count = this.type_filter_count + 1;
    this.checkFilters();
    if (item.type == 'all') {
      this.is_type_sorted = false;
      this.type_header_name = "Type";
      this.typeFilterSelected = 'all';
      this.type_filter_count = 0;
      this.checkFilters();
    } else if (item.type == 'sdo') {
      this.is_type_sorted = true;
      this.type_header_name = "SDO";
      this.typeFilterSelected = 'sdo';
    } else if (item.type == 'ido') {
      this.is_type_sorted = true;
      this.type_header_name = "IDO";
      this.typeFilterSelected = 'ido';
    } else if (item.type == 'cdo') {
      this.is_type_sorted = true;
      this.type_header_name = "CDO";
      this.typeFilterSelected = 'cdo';
    } else if (item.type == 'misc') {
      this.is_type_sorted = true;
      this.type_header_name = "Miscellaneous";
      this.typeFilterSelected = 'misc';
    } else if (item.type == 'mcdo') {
      this.is_type_sorted = true;
      this.type_header_name = "MCDO";
      this.typeFilterSelected = 'mcdo';
    } else if (item.type == 'zsc') {
      this.is_type_sorted = true;
      this.type_header_name = "ZSC";
      this.typeFilterSelected = 'zsc';
    } else if (item.type == 'zsmc') {
      this.is_type_sorted = true;
      this.type_header_name = "ZSMC";
      this.typeFilterSelected = 'zsmc';
    } else if (item.type == 'edo') {
      this.is_type_sorted = true;
      this.type_header_name = "EDO";
      this.typeFilterSelected = 'edo';
    }
    this.modifyDataSource();
  }

  handleSharedDropDownClick(item: any) {
    let page = +this.activePage - 1;
    this.shared_type_expaned = !this.shared_type_expaned;
    if (item.type == 'all') {
      this.shared_header_name = "All Shared";
    } else if (item.type == 'with') {
      this.shared_header_name = "Shared with me";
    } else if (item.type == 'to') {
      this.shared_header_name = "Shared with others";
    }
    this.modifyDataSource();
  }

  handleDateSort() {
    this.is_date_sorted_descending = !this.is_date_sorted_descending;
    if (this.is_date_sorted_descending) {
      this.dateFilterSelected = 'desc';
    } else {
      this.dateFilterSelected = 'asc';
    }
    this.modifyDataSource();
  }


  handleCloseStatus() {
    this.is_state_sorted = !this.is_state_sorted;
    this.statusFilterSelected = 'all';
    this.state_header_name = "Status";
    this.status_filter_count = 0;
    this.checkFilters();
    this.modifyDataSource();
  }

  handleCloseType() {
    this.is_type_sorted = !this.is_type_sorted;
    this.typeFilterSelected = 'all';
    this.type_header_name = "Type";
    this.type_filter_count = 0;
    this.checkFilters();
    this.modifyDataSource();
  }


  sliceIntoChunks(arr: any, chunkSize: number) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
    }
    return res;
  }

  populateDataSource() {
    let overallData: any = [];
    const tab = this.currentTab;
    if (tab == 1) {
      overallData = [...this.allOrgs];
    } else if (tab == 2) {
      overallData = [...this.customizableOrgs];
    } else if (tab == 3) {
      overallData = [...this.zeroSetupOrgs];
    } else if (tab == 4) {
      overallData = [...this.bookmarkedOrgs];
    } else if (tab == 5) {
      if (this.shared_header_name == 'Shared with me') {
        overallData = [...this.shared_with_me];
      } else if (this.shared_header_name == 'Shared with others') {
        overallData = [...this.shared_to_others];
      } else if (this.shared_header_name == 'All Shared') {
        overallData = [...this.shared_all];
      }
    }
    return overallData;
  }

  // triggerSearch(term: string) {
  //   if (term && (term.trim().length > 0)) {

  //     if (this.MainDataSource && this.MainDataSource.length > 0) {
  //       this.MainDataSource = [...this.MainDataSource.filter(function (e: any) {
  //         if (e.name != null && e.instance_url != null && e.username != null) {
  //           return (
  //             (e.name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
  //               e.instance_url.indexOf(term.toLowerCase()) > -1 ||
  //               e.username.indexOf(term.toLowerCase()) > -1
  //             ));
  //         } else if (e.name != null && e.username != null) {
  //           return (
  //             (e.name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
  //               e.username.toLowerCase().indexOf(term.toLowerCase()) > -1
  //             )
  //           );
  //         } else if (e.name != null && e.instance_url != null) {
  //           return (
  //             (e.name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
  //               e.instance_url.toLowerCase().indexOf(term.toLowerCase()) > -1
  //             )
  //           );
  //         } else if (e.name != null) {
  //           return (
  //             (e.name.toLowerCase().indexOf(term.toLowerCase()) > -1
  //             )
  //           );
  //         } else if (e.instance_url != null && e.username != null) {
  //           return (
  //             (e.instance_url.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
  //               e.username.toLowerCase().indexOf(term.toLowerCase()) > -1
  //             )
  //           );
  //         } else if (e.username != null) {
  //           return (
  //             (
  //               e.username.toLowerCase().indexOf(term.toLowerCase()) > -1
  //             )
  //           );
  //         }
  //         else if (e.instance_url != null) {
  //           return (
  //             (e.instance_url.toLowerCase().indexOf(term.toLowerCase()) > -1
  //             )
  //           );
  //         } else {
  //           return false;
  //         }
  //       })];
  //     }
  //   }
  // }

  triggerSearch(term: string) {
    if (!term?.trim()) {
        return;
    }

    term = term.toLowerCase();

    if (!this.MainDataSource?.length) {
        return;
    }

    this.MainDataSource = this.MainDataSource.filter((e: any) => {
        if (!e) return false;
        const {name, instance_url, username, notes, tags} = e;
        if (name && name.toLowerCase().includes(term)) return true;
        if (instance_url && instance_url.toLowerCase().includes(term)) return true;
        if (username && username.toLowerCase().includes(term)) return true;
        if (notes && notes.some((note: any) => note.note && note.note.toLowerCase().includes(term))) return true;
        if (tags && tags.some((tag: any) => tag.tag && tag.tag.toLowerCase().includes(term))) return true;
        return false;
    });
}


  search(event: any) {
    this.search_term = (event && event.search && event.search.trim() != '') ? event.search : '';
    this.modifyDataSource();
  }

  onLogin(row: any) {
    if (row.type == 'sdo' || row.type == 'cdo' || row.type == 'misc' || row.type == 'ido' || row.type == 'edo' || row.type == 'zsc') {
      if (!row.pwd && row.is_owner) {
        this.login.emit({ row, tab: this.currentTab });
      } else {
        let ps = '';
        let us = '';
        let is_shared_to;
        if (row.is_owner) {
          us = row.username;
          ps = row.pwd;
          is_shared_to = false;
        } else {
          is_shared_to = true;
        }
        this.dataService.onLogin(us, ps, row.type, row.id).subscribe(
          data => {
            if (data.expired) {
              this.dataService.fetchToken(this.dataService.auth_token).subscribe((token) => {
                if (token.expired) {
                  this.router.navigate(["/redirect"]).then(result => { window.location.href = environment.auth_redirect_uri; });
                } else {
                  this.onLogin(row);
                }  
              }, error => {
                console.log("Error", error);
              })
            } else {
              if (data.validation == true && data.redirectUrl) {
                this.Mixpanel.track('One-click Login', { username: row.username, org_type: row.type, login_success: true });
                window.open(data.redirectUrl);
              } else if (data.validation == false) {
                this.Mixpanel.track('One-click Login', { username: row.username, org_type: row.type, login_success: false });
                this.notification.setNotification({
                  show: true,
                  isToast: true,
                  type: "error",
                  info: "Unable to login! Try logging in through Salesforce login page!"
                });
              }
            }
          },
          error => {
            this.Mixpanel.track('One-click Login', { username: row.username, org_type: row.type, login_success: false, error: error });
            this.notification.setNotification({
              show: true,
              isToast: true,
              type: "error",
              info: "Unable to login to your Org! Try logging in through Salesforce login page!"
            });
          }
        )
      }
    }
    // else if (row.type == 'edo') {
    //   window.open("https://login.salesforce.com");
    // }
    else if (row.type == 'mcdo') {
      window.open("https://mc.login.exacttarget.com/hub-cas/login?service=https%3a%2f%2fmc.exacttarget.com%2fcloud%2flogin.html%3fhash%3dOrEn1bG9nZ2VkLWluSXc9PQ2");
    } else if (row.type == 'zsmc') {
      window.open("https://mc.login.exacttarget.com/hub-cas/login?service=https%3a%2f%2fmc.exacttarget.com%2fcloud%2flogin.html%3fhash%3dOrEn1bG9nZ2VkLWluSXc9PQ2");
    } 
    // else if (row.type == 'zsc') {
    //   window.open("https://login.salesforce.com");
    // }

  }

  bookmarkOrg(row: any) {
    row = { ...row, is_bookmarked: !row.is_bookmarked };
    if (row.type == 'sdo') {
      this.actionData.updateSdo({ is_bookmarked: row.is_bookmarked }, row.id, this.currentTab, 'bookmark');
    } else if (row.type == 'ido') {
      this.actionData.updateIdo({ is_bookmarked: row.is_bookmarked }, row.id, this.currentTab, 'bookmark');
    } else if (row.type == 'cdo') {
      this.actionData.updateCdo({ is_bookmarked: row.is_bookmarked }, row.id, this.currentTab, 'bookmark');
    } else if (row.type == 'misc') {
      this.actionData.updateMisc({ is_bookmarked: row.is_bookmarked }, row.id, this.currentTab, 'bookmark');
    } else if (row.type == 'mcdo') {
      this.actionData.updateMcdo({ is_bookmarked: row.is_bookmarked }, row.id, this.currentTab, 'bookmark');
    } else if (row.type == 'zsc') {
      this.actionData.updateZsc({ is_bookmarked: row.is_bookmarked }, row.id, this.currentTab, 'bookmark');
    } else if (row.type == 'zsmc') {
      this.actionData.updateZsmc({ is_bookmarked: row.is_bookmarked }, row.id, this.currentTab, 'bookmark');
    } else if (row.type == 'edo') {
      this.actionData.updateEdo({ is_bookmarked: row.is_bookmarked }, row.id, this.currentTab, 'bookmark');
    }
  }

  onMoreActions(row: any) {
    this.moreActions.emit({ row, tab: this.currentTab });
  }

  reactToChange(totalRecords: any): any {
    const pageCount = this.getPageCount(totalRecords);
    this.updateVisiblePages();
    this.activePage = 1;
  }

  getPageCount(totalRecords: any): number {
    let totalPage = 0;

    if (this.rowsCount > 0 && this.recordsPerPage > 0) {
      const pageCount = this.rowsCount / this.recordsPerPage;
      const roundedPageCount = Math.floor(pageCount);

      totalPage = roundedPageCount < pageCount ? roundedPageCount + 1 : roundedPageCount;
    }

    return totalPage;
  }

  private getArrayOfPage(pageCount: number): number[] {
    const pageArray = [];

    if (pageCount > 0) {
      for (let i = 1; i <= pageCount; i++) {
        pageArray.push(i);
      }
    }

    return pageArray;
  }

  private updateVisiblePages(): void {
    const length = Math.min(this.pageCount, 3);
    const startIndex = Math.max(
      Math.min(
        this.activePage - Math.ceil(length / 2),
        this.pageCount - length
      ),
      0
    );
    this.pages = Array.from(
      new Array(length).keys(),
      (item) => item + startIndex + 1
    );
  }




  ngOnDestroy(): void {
    this.tabChangeEventSubscription.unsubscribe();
    this.searchEventSubscription.unsubscribe();
  }

}
