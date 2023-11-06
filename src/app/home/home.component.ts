import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedDataService } from '../shared/shared-data.service';
import { MixpanelService } from '../shared/mixpanel.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  orgs: any;
  user: any;
  token: any;
  openActionsModal = false;
  openLoginModal = false;
  orgData: any;
  isHome: any = false;

  notification: Subscription;
  constructor(private route: ActivatedRoute, private router: Router, private dataService: SharedDataService, private location: Location, private Mixpanel: MixpanelService) {
    this.notification = this.dataService.handleHomeNotification().subscribe(() => {
      this.isHome = true;
    })
   }

  ngOnInit(): void {
    this.user = this.route.snapshot.data['orgs'];
    this.dataService.classifyOrgs();
    this.logData();
    this.location.go('/stockpile');
  }

  handleMoreActions(event: any) {
    this.openActionsModal = true;
    this.orgData = event;
  }

  handleLogin(event: any) {
    this.openLoginModal = true;
    this.orgData = event;
  }

  handleClose(event: any) {
    this.openActionsModal = false;
  }

  handleLoginClose(event: any) {
    this.openLoginModal = false;
  }

  logData() {
    this.Mixpanel.track('Page View', {});
  }

  ngOnDestroy(): void {
    this.notification.unsubscribe();
  }


}
