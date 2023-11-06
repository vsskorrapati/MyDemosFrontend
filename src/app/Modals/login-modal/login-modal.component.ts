import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { ActionDataService } from '../actions-modal/action-data.service';
import { NotificationService } from 'src/app/notification/notification.service';
import { MixpanelService } from 'src/app/shared/mixpanel.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit, OnChanges {

  username: any;
  parentTab: any;
  password: any;
  showPassword: boolean = false;
  orgData: any;
  @Output() closeLoginModal: EventEmitter<any> = new EventEmitter();
  currentTab: any = 'Overview';
  @Input() org: any
  disable: boolean = false;

  constructor(private dataService: SharedDataService, private actionService: ActionDataService, private notification: NotificationService, private router: Router, private Mixpanel: MixpanelService) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.parentTab = this.org.tab;
    this.fetchOrgData(this.org.row);
  }

  fetchOrgData(org: any) {
    if (org.type == 'sdo') {
      this.orgData = this.dataService.sdos.find((sdo: any) => sdo.id == org.id);
    } else if (org.type == 'ido') {
      this.orgData = this.dataService.idos.find((ido: any) => ido.id == org.id);
    } else if (org.type == 'cdo') {
      this.orgData = this.dataService.cdos.find((cdo: any) => cdo.id == org.id);
    } else if (org.type == 'misc') {
      this.orgData = this.dataService.misc.find((misc: any) => misc.id == org.id);
    } else if (org.type == 'zsc') {
      this.orgData = this.dataService.zsc.find((zsc: any) => zsc.id == org.id);
    } else if (org.type == 'zsmc') {
      this.orgData = this.dataService.zsmc.find((zsmc: any) => zsmc.id == org.id);
    } else if (org.type == 'edo') {
      this.orgData = this.dataService.edos.find((edo: any) => edo.id == org.id);
    } else if (org.type == 'mcdo') {
      this.orgData = this.dataService.mcdos.find((mcdo: any) => mcdo.id == org.id);
    }
    this.username = (this.orgData && this.orgData.username) ? this.orgData.username : '';
    this.password = (this.orgData && this.orgData.password) ? this.orgData.password : '';

  }

  showHidePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.username.trim() != '' && this.password.trim() != '') {
      this.disable = true;
      if (this.orgData.type == 'zsmc') {
        this.actionService.updateZsmc({ username: this.username, pwd: this.password }, this.orgData.id, this.parentTab, 'pass');
      }  else if (this.orgData.type == 'mcdo') {
        this.actionService.updateMcdo({ username: this.username, pwd: this.password }, this.orgData.id, this.parentTab, 'pass');
      }

      this.dataService.onLogin(this.username, this.password, this.orgData.type, this.orgData.id).subscribe(
        data => {
          if (data.expired) {
            this.dataService.fetchToken(this.dataService.auth_token).subscribe((token) => {
              if (token.expired) {
                this.router.navigate(["/redirect"]).then(result => { window.location.href = environment.auth_redirect_uri; });
              } else {
                this.onLogin();
              }  
            }, error => {
              console.log("Error", error);
            })
          } else {
            if (data.validation == true && data.redirectUrl) {
              if (this.orgData.type == 'sdo') {
                this.actionService.updateSdo({ username: this.username, pwd: this.password }, this.orgData.id, this.parentTab, 'pass');
              } else if (this.orgData.type == 'ido') {
                this.actionService.updateIdo({ username: this.username, pwd: this.password }, this.orgData.id, this.parentTab, 'pass');
              } else if (this.orgData.type == 'cdo') {
                this.actionService.updateCdo({ username: this.username, pwd: this.password }, this.orgData.id, this.parentTab, 'pass');
              } else if (this.orgData.type == 'misc') {
                this.actionService.updateMisc({ username: this.username, pwd: this.password }, this.orgData.id, this.parentTab, 'pass');;
              } else if (this.orgData.type == 'zsc') {
                this.actionService.updateZsc({ username: this.username, pwd: this.password }, this.orgData.id, this.parentTab, 'pass');
              } else if (this.orgData.type == 'edo') {
                this.actionService.updateEdo({ username: this.username, pwd: this.password }, this.orgData.id, this.parentTab, 'pass');
              }
              this.Mixpanel.track('One-click Login', { username: this.username, login_success: true });
              this.onClose();
              this.disable = false;
              window.open(data.redirectUrl);
            } else if (data.validation == false) {
              this.Mixpanel.track('One-click Login', { username: this.username, login_success: false });
              this.disable = false;
              this.password = '';
              this.notification.setNotification({
                show: true,
                isToast: true,
                type: "error",
                info: "Unable to login to your Org! Invalid Password or Userlogin, try logging in through Salesforce login page!"
              });
            }
          }

        },
        error => {
          this.Mixpanel.track('One-click Login', { username: this.username, login_success: false, error: error });
          this.disable = false;
          this.password = '';
          this.notification.setNotification({
            show: true,
            isToast: true,
            type: "error",
            info: "Unable to login to your Org! Try logging in through Salesforce login page!"
          });
        }
      );

    } else {
      this.notification.setNotification({
        show: true,
        isToast: true,
        type: "error",
        info: "Both Username and Password are to be provided."
      });
    }
  }

  onClose() {
    this.closeLoginModal.emit(true);
  }

}
