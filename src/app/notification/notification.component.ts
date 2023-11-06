import { Component } from '@angular/core'
import { NotificationService } from './notification.service'
import { ActionDataService } from '../Modals/actions-modal/action-data.service';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html'
})

export class NotificationComponent {
  notificationListner: any;
  clearListener: any;
  deleteWarning: any;

  show: boolean = false;
  isToast: boolean = false;
  success: boolean = false;
  warn: boolean = false;
  error: boolean = false;
  warning: boolean = false;
  info: string = '';
  moreInfo: string = '';
  linkTo: any = {};
  parentTab: any;
  orgtype: any;
  orgId: any;
  sfdc_id: any;
  username: any;

  constructor(private notificationService: NotificationService, private actionData: ActionDataService) {
    this.notificationListner = this.notificationService._notification.subscribe(
      data => this.setNotification(data));

    this.clearListener = this.notificationService._clear.subscribe(
      data => this.clearNotification(data)
    );

    this.deleteWarning = this.notificationService._delete.subscribe(
      data => this.setOrgDeletionWarning(data)
    );
  }

  setNotification(data: any) {
    if (data) {
      this.show = data.show;
      this.success = data.type == 'success' ? true : false;
      this.error = data.type == 'error' ? true : false;
      this.warning = data.type == 'warning' ? true : false;
      this.warn = data.type == 'warn' ? true : false;
      this.info = data.info;
      this.moreInfo = data.moreInfo;
      this.linkTo = data.linkTo;
      this.isToast = data.isToast;
      this.parentTab = data.parentTab;
      this.orgtype = data.orgtype;
      this.orgId = data.orgId;
      this.sfdc_id = data.sfdc_id;
      this.username = data.username;

      var self = this;
    }
  }

  setOrgDeletionWarning(data: any) {

    if (data) {
      this.show = data.show;
      this.success = data.type == 'success' ? true : false;
      this.error = data.type == 'error' ? true : false;
      this.warning = data.type == 'warning' ? true : false;
      this.isToast = data.isToast;
      this.parentTab = data?.parentTab;
      this.orgtype = data.orgtype;
      this.orgId = data?.orgId;
      this.sfdc_id = data?.sfdc_id;
      this.username = data?.username;
      // this.moreInfo = data.moreInfo;
      // this.linkTo = data.linkTo;

      var self = this;
      // if(this.isToast){
      //   setTimeout(function(){
      //     self.show = false;
      //   }, 15000);
      // }
    }

  }

  clearNotification(data: any) {
    if (data) {
      this.show = false;
      this.isToast = false;
    }
  }

  onDelete() {
    this.actionData.deleteOrg(this.parentTab, this.orgtype, this.orgId, this.sfdc_id, this.username);
    this.parentTab = null;
    this.orgtype = null;
    this.orgId = null;
    this.sfdc_id = null;
    this.username = null;
    this.show = false;
  }
}
