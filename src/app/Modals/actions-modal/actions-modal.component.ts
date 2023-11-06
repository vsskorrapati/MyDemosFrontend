import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { ActionDataService } from './action-data.service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/notification/notification.service';
import { MixpanelService } from 'src/app/shared/mixpanel.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-actions-modal',
  templateUrl: './actions-modal.component.html',
  styleUrls: ['./actions-modal.component.css']
})
export class ActionsModalComponent implements OnInit, OnDestroy, OnChanges {

  @Output() closeActionsModal: EventEmitter<any> = new EventEmitter();
  currentTab: any = 'Overview';
  @Input() org: any;
  typeChanged = false;
  parentTab: any;
  notes: any;
  loading = false;
  show_pwd_field = false;
  showPassword = false;
  password: string | null = null;
  disableLogin = false;
  reset_username = '';
  reset_password = '';
  actionServiceSubscription: Subscription;
  noteSubscription: Subscription;
  image_loading = false;
  open_reset_modal = false;
  resetting_state = false;
  disable_pwd_field: boolean = false;
  expired_in_last_30_days = false;

  type_is_expanded = false;
  orgData: any;
  tabs = [
    { id: 1, name: 'Overview', active: true },
    { id: 2, name: 'Extend', active: false },
    { id: 3, name: 'Notes', active: false },
    { id: 4, name: 'Share', active: false },
    // { id: 5, name: 'Password Reset', active: false }
  ];
  types_dropdown = [
    { id: 1, name: "Simple Demo Org", type: 'sdo' },
    { id: 2, name: "Industry Demo Org", type: 'ido' },
    { id: 3, name: "Clean Demo Org", type: 'cdo' },
    { id: 4, name: "Marketing Cloud Demo Org", type: 'mcdo' },
    { id: 5, name: "Zero Setup Core", type: 'zsc' },
    { id: 6, name: "Zero Setup Marketing Cloud", type: 'zsmc' },
    { id: 7, name: "Everybody's Demo Org", type: 'edo' },
    { id: 8, name: "Miscellaneous", type: 'misc' },
  ];

  noPwd = false;
  buttonContent = "Login";
  messageContent = '';
  email = '';
  daysToExtend = 120;
  success = "Login";
  saving = false;
  buttonData = "Login";
  isSharedOrg = false;
  sharedOrgs: any;
  shared_count = 0;
  shared_emails: any[] = [];
  expireDate: any;
  selectedFile: File | null = null;

  constructor(private dataService: SharedDataService, private actionData: ActionDataService, private notification: NotificationService, private router: Router, private Mixpanel: MixpanelService) {
    this.actionServiceSubscription = this.actionData.handleTriggerFromActions().subscribe((data: boolean) => {
      if (this.buttonContent == "Login") {
        if (data) {
          this.buttonData = "Saved";
          setTimeout(() => {
            this.buttonData = "Login";
            this.saving = false;
          }, 2000);
        } else {
          this.buttonData = "Login";
          this.saving = false;
        }
      } else if (this.buttonContent == "Save Note") {
        if (data) {
          this.buttonData = "Note Saved";
          setTimeout(() => {
            this.buttonData = "Save Note";
            this.saving = false;
          }, 2000);
        } else {
          this.buttonData = "Save Note";
          this.saving = false;
        }

      } else if (this.buttonContent == "Share") {
        if (data) {
          this.buttonData = "Shared";
          setTimeout(() => {
            this.buttonData = "Share";
            this.saving = false;
          }, 2000);
        } else {
          this.buttonData = "Share";
          this.saving = false;
        }
      } else if (this.buttonContent == "Extend") {
        if (data) {
          this.buttonData = "Extended";
          setTimeout(() => {
            this.buttonData = "Extend";
            this.saving = false;
          }, 2000);
        } else {
          this.buttonData = "Extend";
          this.saving = false;
        }
      } else if (this.buttonContent == "Password Reset") {
        if (data) {
          this.buttonData = "Password Reset Successful";
          setTimeout(() => {
            this.buttonData = "Password Reset";
            this.saving = false;
          }, 2000);
        } else {
          this.buttonData = "Password Reset";
          this.saving = false;
        }
      }
    });
    this.noteSubscription = this.actionData.handleNoteId().subscribe((data: any) => {
      this.orgData.notes = [...data]
    })
  };

  handleTabChange(tab: any) {
    this.tabs.map(tab => tab.active = false);
    tab.active = true;
    this.currentTab = tab.name;
    if (this.currentTab == 'Notes') {
      this.buttonContent = "Save Note";
    } else if (this.currentTab == 'Overview') {
      this.buttonContent = "Login";
    }
    else {
      this.buttonContent = tab.name;
    }
  }

  ngOnInit(): void {
  }


  setTabs() {
    if (this.org.row.type == "zsc" || this.org.row.type == "zsmc" || this.org.row.type == "edo" || this.org.row.type == "mcdo" || (this.org.row.state == 'expired' && !this.expired_in_last_30_days)) {
      this.tabs = [
        { id: 1, name: 'Overview', active: true },
        { id: 2, name: 'Notes', active: false },
        { id: 3, name: 'Share', active: false }
      ]
    }
    if (this.org.row.is_owner == false || this.org.row.state == "expired") {
      const index = this.tabs.findIndex((tab) => tab.name == 'Share');
      if (index > -1) {
        this.tabs.splice(index, 1);
      }
    }
  }

  onLogin() {
    const row = this.orgData;

    if (row.type == 'sdo' || row.type == 'cdo' || row.type == 'misc' || row.type == 'ido' || row.type == 'edo' || row.type == 'zsc') {
      if (!row.pwd && row.is_owner) {
        console.log("No Password");
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
        this.dataService.onLogin(row.username, row.pwd, this.orgData.type, this.orgData.id).subscribe(
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
                this.Mixpanel.track('One-click Login', { username: row.username, org_type: row.type, login_success: true });
                window.open(data.redirectUrl);
              } else if (data.validation == false) {
                this.Mixpanel.track('One-click Login', { username: row.username, org_type: row.type, login_success: false });
                this.notification.setNotification({
                  show: true,
                  isToast: true,
                  type: "error",
                  info: "Looks like your saved password is incorrect, please update your saved password"
                });
              }
            }
          },
          error => {
            this.Mixpanel.track('One-click Login', { username: row.username, org_type: row.type, login_success: true, error: error });
            this.notification.setNotification({
              show: true,
              isToast: true,
              type: "error",
              info: "Looks like your saved password is incorrect, please update your saved password"
            });
          }
        )
      }

    }
    //  else if (row.type == 'edo') {
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

  async onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.image_loading = true;
      const image_type = this.selectedFile?.type ? this.selectedFile.type : 'image/png';
      const image = await this.toBase64(this.selectedFile, image_type);
      const image_data = String(image);
      if ((image_data.length * 2) > ((2 ** 11) * 10)) {
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "error",
          info: "The uploaded file size shouldn't exceed 20KB"
        });
      } else {
        this.actionData.imageUpload(this.orgData.id, this.orgData.type, image).subscribe(
          data => {
            if (data.expired) {
              this.dataService.fetchToken(this.dataService.auth_token).subscribe((token) => {
                if (token.expired) {
                  this.router.navigate(["/redirect"]).then(result => { window.location.href = environment.auth_redirect_uri; });
                } else {
                  this.onFileChanged(event);
                }
              }, error => {
                console.log("Error", error);
              })
            } else {
              if (data.success) {
                this.Mixpanel.track('Image Upload', { org_type: this.orgData.type, org_id: this.orgData.sfdc_id, image_upload_success: true });
                this.orgData = { ...this.orgData, logo: image };
                let temp_org_data = [...this.dataService.allorgs];
                const index = temp_org_data.findIndex((org: any) => org.type == this.orgData.type && org.id == this.orgData.id);
                const temp_data = { ...temp_org_data[index], logo: image };
                temp_org_data[index] = { ...temp_data };
                this.dataService.allorgs = [...temp_org_data];
                this.actionData.dataRefresh(this.parentTab, this.orgData.type, true);
                this.image_loading = false;
                this.notification.setNotification({
                  show: true,
                  isToast: true,
                  type: "success",
                  info: "Company logo has been successfully updated"
                })
              } else {
                this.Mixpanel.track('Image Upload', { org_type: this.orgData.type, org_id: this.orgData.sfdc_id, image_upload_success: false });
                this.image_loading = false;
                this.notification.setNotification({
                  show: true,
                  isToast: true,
                  type: "error",
                  info: "Unable to update the company logo"
                })
              }
            }


          },
          error => {
            console.log("error in image upload", error);
            this.image_loading = false;
            this.Mixpanel.track('Image Upload', { org_type: this.orgData.type, org_id: this.orgData.sfdc_id, image_upload_success: false, error: error });
            this.notification.setNotification({
              show: true,
              isToast: true,
              type: "error",
              info: "Unable to update the company logo"
            })
            console.log("error", error);
          }
        );
      }
    }
  }

  toBase64(file: any, ContentType: string) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    })
  }


  handleTypeDropdownClick(item: any) {
    this.org.row.type = item.type;
  }

  showHidePassword() {
    this.showPassword = !this.showPassword;
  }

  ngOnChanges(): void {
    if (this.org.row.type == "sdo" || this.org.row.type == "ido" || this.org.row.type == "cdo" || this.org.row.type == "misc") {
      this.expired_in_last_30_days = this.isDateInLast30Days(new Date(this.org.row.org_expiry));
    }
    this.setTabs();
    this.parentTab = this.org.tab;
    this.expireDate = this.org.row.org_expiry;
    this.fetchOrgData(this.org.row);
  }

  isDateInLast30Days(date: Date) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);  // Set the time to 00:00:00

    // Clone the date to avoid modifying the original
    const normalizedDate = new Date(date.getTime());
    normalizedDate.setHours(0, 0, 0, 0);  // Set the time to 00:00:00

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysSinceDate = (currentDate.getTime() - normalizedDate.getTime()) / millisecondsPerDay;

    return daysSinceDate >= 0 && daysSinceDate < 30;  // Only return true if the date is within the last 30 days
  }



  //changes

  fetchOrgData(org: any) {
    this.isSharedOrg = this.org.row.shared_to == true;

    if (org.type == 'sdo') {
      this.orgData = this.dataService.sdos.find((sdo: any) => sdo.id == org.id);

      if (this.isSharedOrg) {
        this.actionData.fetch_user_emails(this.orgData.sfdc_id, this.orgData.username, null, null, 'sdo').subscribe(
          data => {
            if (data.expired) {
              this.dataService.fetchToken(this.dataService.auth_token).subscribe((token) => {
                if (token.expired) {
                  this.router.navigate(["/redirect"]).then(result => { window.location.href = environment.auth_redirect_uri; });
                } else {
                  this.fetchOrgData(org);
                }
              }, error => {
                console.log("Error", error);
              })
            } else {
              if (data.success) {
                this.shared_emails = data.users,
                  this.shared_count = data.users?.length
              }
            }

          },
          error => {
            console.log("Error", error);
          }
        )
      }

    } else if (org.type == 'ido') {
      this.orgData = this.dataService.idos.find((ido: any) => ido.id == org.id);
      if (this.isSharedOrg) {
        this.actionData.fetch_user_emails(this.orgData.sfdc_id, this.orgData.username, null, null, 'ido').subscribe(
          data => {
            if (data.expired) {
              this.dataService.fetchToken(this.dataService.auth_token).subscribe((token) => {
                if (token.expired) {
                  this.router.navigate(["/redirect"]).then(result => { window.location.href = environment.auth_redirect_uri; });
                } else {
                  this.fetchOrgData(org);
                }
              }, error => {
                console.log("Error", error);
              })
            } else {
              if (data.success) {
                this.shared_emails = data.users,
                  this.shared_count = data.users?.length
              }
            }

          },
          error => {
            console.log("Error", error);
          }
        )
      }
    } else if (org.type == 'cdo') {
      this.orgData = this.dataService.cdos.find((cdo: any) => cdo.id == org.id);

      if (this.isSharedOrg) {
        this.actionData.fetch_user_emails(this.orgData.sfdc_id, this.orgData.username, null, null, 'cdo').subscribe(
          data => {
            if (data.expired) {
              this.dataService.fetchToken(this.dataService.auth_token).subscribe((token) => {
                if (token.expired) {
                  this.router.navigate(["/redirect"]).then(result => { window.location.href = environment.auth_redirect_uri; });
                } else {
                  this.fetchOrgData(org);
                }
              }, error => {
                console.log("Error", error);
              })
            } else {
              if (data.success) {
                this.shared_emails = data.users,
                  this.shared_count = data.users?.length
              }
            }

          },
          error => {
            console.log("Error", error);
          }
        )
      }
    } else if (org.type == 'misc') {
      this.orgData = this.dataService.misc.find((misc: any) => misc.id == org.id);

      if (this.isSharedOrg) {
        this.actionData.fetch_user_emails(this.orgData.sfdc_id, this.orgData.username, null, null, 'misc').subscribe(
          data => {
            if (data.expired) {
              this.dataService.fetchToken(this.dataService.auth_token).subscribe((token) => {
                if (token.expired) {
                  this.router.navigate(["/redirect"]).then(result => { window.location.href = environment.auth_redirect_uri; });
                } else {
                  this.fetchOrgData(org);
                }
              }, error => {
                console.log("Error", error);
              })
            } else {
              if (data.success) {
                this.shared_emails = data.users,
                  this.shared_count = data.users?.length
              }
            }

          },
          error => {
            console.log("Error", error);
          }
        )
      }
    } else if (org.type == 'zsc') {
      this.orgData = this.dataService.zsc.find((zsc: any) => zsc.id == org.id);

      if (this.isSharedOrg) {
        this.actionData.fetch_user_emails(null, this.orgData.username, null, this.orgData.email, 'zsc').subscribe(
          data => {
            if (data.expired) {
              this.dataService.fetchToken(this.dataService.auth_token).subscribe((token) => {
                if (token.expired) {
                  this.router.navigate(["/redirect"]).then(result => { window.location.href = environment.auth_redirect_uri; });
                } else {
                  this.fetchOrgData(org);
                }
              }, error => {
                console.log("Error", error);
              })
            } else {
              if (data.success) {
                this.shared_emails = data.users,
                  this.shared_count = data.users?.length
              }
            }

          },
          error => {
            console.log("Error", error);
          }
        )
      }
    } else if (org.type == 'zsmc') {
      this.orgData = this.dataService.zsmc.find((zsmc: any) => zsmc.id == org.id);

      if (this.isSharedOrg) {
        this.actionData.fetch_user_emails(null, this.orgData.username, null, this.orgData.email, 'zsmc').subscribe(
          data => {
            if (data.expired) {
              this.dataService.fetchToken(this.dataService.auth_token).subscribe((token) => {
                if (token.expired) {
                  this.router.navigate(["/redirect"]).then(result => { window.location.href = environment.auth_redirect_uri; });
                } else {
                  this.fetchOrgData(org);
                }
              }, error => {
                console.log("Error", error);
              })
            } else {
              if (data.success) {
                this.shared_emails = data.users,
                  this.shared_count = data.users?.length
              }
            }

          },
          error => {
            console.log("Error", error);
          }
        )
      }
    } else if (org.type == 'edo') {
      this.orgData = this.dataService.edos.find((edo: any) => edo.id == org.id);

      if (this.isSharedOrg) {
        this.actionData.fetch_user_emails(null, this.orgData.username, null, this.orgData.email, 'edo').subscribe(
          data => {
            if (data.expired) {
              this.dataService.fetchToken(this.dataService.auth_token).subscribe((token) => {
                if (token.expired) {
                  this.router.navigate(["/redirect"]).then(result => { window.location.href = environment.auth_redirect_uri; });
                } else {
                  this.fetchOrgData(org);
                }
              }, error => {
                console.log("Error", error);
              })
            } else {
              if (data.success) {
                this.shared_emails = data.users,
                  this.shared_count = data.users?.length
              }
            }

          },
          error => {
            console.log("Error", error);
          }
        )
      }
    } else if (org.type == 'mcdo') {
      this.orgData = this.dataService.mcdos.find((mcdo: any) => mcdo.id == org.id);

      if (this.isSharedOrg) {
        this.actionData.fetch_user_emails(null, null, this.orgData.mid, this.orgData.email, 'mcdo').subscribe(
          data => {
            if (data.expired) {
              this.dataService.fetchToken(this.dataService.auth_token).subscribe((token) => {
                if (token.expired) {
                  this.router.navigate(["/redirect"]).then(result => { window.location.href = environment.auth_redirect_uri; });
                } else {
                  this.fetchOrgData(org);
                }
              }, error => {
                console.log("Error", error);
              })
            } else {
              if (data.success) {
                this.shared_emails = data.users,
                  this.shared_count = data.users?.length
              }
            }
          },
          error => {
            console.log("Error", error);
          }
        )
      }

    }

    this.reset_username = this.orgData.username ? this.orgData.username : '';
    this.notes = this.orgData?.notes[0]?.note;
    if (this.orgData.type == "sdo" || this.orgData.type == "ido" || this.orgData.type == "cdo" || this.orgData.type == "misc" || this.orgData.type == "edo" || this.orgData.type == "zsc") {
      if (this.orgData.is_owner) {
        this.noPwd = (this.orgData.pwd && this.orgData.pwd.trim() != '') ? false : true;
      } else {
        this.noPwd = false;
      }
      
    } else {
      this.noPwd = true;
    }
    this.password = (this.orgData.pwd && this.orgData.pwd.trim() != '') ? this.orgData.pwd : '';
  }

  onSave(): void {
    if (this.buttonContent == 'Login') {
      this.onLogin();
    } else if (this.buttonContent == 'Save Note') {
      if (this.notes != this.orgData?.notes[0]?.note) {
        this.saveNotes();
      }
    } else if (this.buttonContent == 'Extend') {
      console.log("Extend");
      this.onExtend();
    } else if (this.buttonContent == 'Share') {
      this.onShare();
    } else if (this.buttonContent == 'Password Reset') {
      this.onPasswordReset();
    }
  }

  onReset() {
    this.resetting_state = true;
    this.buttonData = "Resetting";
    this.show_pwd_field = false;
    if (!this.reset_username && !this.reset_password) {
      this.resetting_state = false;
      this.notification.setNotification({
        show: true,
        isToast: true,
        type: "error",
        info: "username or password not provided"
      })
    }
    this.actionData.changePassword(this.orgData.id, this.orgData.type, this.reset_password).subscribe((data) => {

      if (data.expired) {
        this.dataService.fetchToken(this.dataService.auth_token).subscribe((token) => {
          if (token.expired) {
            this.router.navigate(["/redirect"]).then(result => { window.location.href = environment.auth_redirect_uri; });
          } else {
            this.onReset();
          }
        }, error => {
          console.log("Error", error);
        })
      } else {
        if (data.success) {
          this.notification.setNotification({
            show: true,
            isToast: true,
            type: "success",
            info: "Password reset successful"
          });
          let temp_org_data = [...this.dataService.allorgs];
          const index = temp_org_data.findIndex((org: any) => org.type == this.orgData.type && org.id == this.orgData.id);
          temp_org_data[index].pwd = this.reset_password;
          this.dataService.allorgs = [...temp_org_data];
          this.orgData.pwd = this.reset_password;
          this.password = this.orgData.pwd;
          this.noPwd = false;
          this.actionData.dataRefresh(this.parentTab, this.orgData.type, true);
          this.resetting_state = false;
          this.reset_password = '';
          this.open_reset_modal = false;
          this.Mixpanel.track('Password Reset', { username: this.reset_username, orgId: this.orgData.sfdc_id, password_reset_success: true });
        } else {
          this.notification.setNotification({
            show: true,
            isToast: true,
            type: "error",
            info: data.message
          });
          this.resetting_state = false;
          this.reset_password = '';
          this.Mixpanel.track('Password Reset', { username: this.reset_username, orgId: this.orgData.sfdc_id, password_reset_success: false, error: data.message });
        }
      }

    },
      (error) => {
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "error",
          info: "There has been an issue while resetting your password, Try logging into the org and change it"
        });
        this.resetting_state = false;
        this.reset_password = '';
        this.Mixpanel.track('Password Reset', { username: this.reset_username, orgId: this.orgData.sfdc_id, password_reset_success: false, error: error });
      })
  }

  onExtend() {
    this.success = "Saving";
    this.buttonData = "Extending";
    this.saving = true;
    const days = this.daysToExtend;
    if (!this.orgData.username && !this.orgData.sfdc_id) {
      this.notification.setNotification({
        show: true,
        isToast: true,
        type: "error",
        info: "username or sfdc_id not provided"
      });
      this.saving = false;
    }
    this.actionData.extendOrgExpiry(days, this.parentTab, this.orgData.type, this.orgData.id, this.orgData.sfdc_id, this.orgData.username);
  }

  onDelete() {
    if (!this.orgData.username && !this.orgData.sfdc_id) {
      this.notification.setNotification({
        show: true,
        isToast: true,
        type: "error",
        info: "username or sfdc_id not provided"
      })
    }

    this.notification.setNotification({
      show: true,
      isToast: true,
      type: "warning",
      info: "delete",
      parentTab: this.parentTab,
      orgtype: this.orgData.type,
      orgId: this.orgData.id,
      sfdc_id: this.orgData.sfdc_id,
      username: this.orgData.username
    })
    // this.actionData.extendOrgExpiry(days, this.parentTab, this.orgData.type, this.orgData.id, this.orgData.sfdc_id, this.orgData.username);
  }

  updateOrgExpiryDate() {
    let expiry = new Date();
    this.expireDate = new Date(expiry);
    this.expireDate.setDate(this.expireDate.getDate() + this.daysToExtend);
    return this.expireDate;
  }

  updatePassword() {
    if (this.password != this.orgData.pwd || (this.password == '' && this.orgData.pwd == null)) {
      this.disable_pwd_field = true;
      const payload = { pwd: this.password };
      if (this.orgData.type == "sdo" || this.orgData.type == "ido" || this.orgData.type == "cdo" || this.orgData.type == "misc" || this.orgData.type == "edo" || this.orgData.type == "zsc") {
        this.noPwd = (this.orgData.pwd && this.orgData.pwd.trim() != '') ? false : true;
      } else {
        this.noPwd = true;
      }

      if (this.password) {
        this.actionData.updatePwd(this.orgData.id, this.orgData.type, this.orgData.username, this.password).subscribe((data) => {
          if (data.expired) {
            this.dataService.fetchToken(this.dataService.auth_token).subscribe((token) => {
              if (token.expired) {
                this.router.navigate(["/redirect"]).then(result => { window.location.href = environment.auth_redirect_uri; });
              } else {
                this.updatePassword();
              }
            }, error => {
              console.log("Error", error);
            })
          } else {
            if (data.validation) {
              if (Number(data.updateCount) > 0) {
                this.orgData = { ...this.orgData, pwd: this.password };
                let temp_org_data = [...this.dataService.allorgs];
                const index = temp_org_data.findIndex((org: any) => org.type == this.orgData.type && org.id == this.orgData.id);
                temp_org_data[index] = { ...temp_org_data[index], pwd: this.password };
                this.dataService.allorgs = [...temp_org_data];
                this.actionData.dataRefresh(this.parentTab, this.orgData.type, true);
                this.show_pwd_field = !this.show_pwd_field;
                this.disableLogin = !this.disableLogin;
                this.noPwd = (this.orgData.pwd && this.orgData.pwd.trim() != '') ? false : true;

                this.notification.setNotification({
                  show: true,
                  isToast: true,
                  type: "success",
                  info: "Password updated successfully"
                })
              }
            } else {
              this.password = null;
              this.disable_pwd_field = false;
              this.notification.setNotification({
                show: true,
                isToast: true,
                type: "error",
                info: "Invalid Credentails, please check the password provided"
              });
            }
          }

        },
          (error) => {
            this.disable_pwd_field = false;
            this.notification.setNotification({
              show: true,
              isToast: true,
              type: "error",
              info: "Unable to update your org. Please try logging into your org, run Q Branch app and try again"
            });
          })
      } else if (this.orgData.pwd && this.password == '') {
        this.disable_pwd_field = false;
        if (this.orgData.pwd) {
          this.password = this.orgData.pwd;
        }
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "error",
          info: "Please enter the password!!"
        });
      } else {
        this.disable_pwd_field = false;
        this.show_pwd_field = !this.show_pwd_field
        this.disableLogin = !this.disableLogin
      }
    } else {
      this.show_pwd_field = !this.show_pwd_field
      this.disableLogin = !this.disableLogin
    }
  }

  onBookmark() {
    this.orgData = { ...this.orgData, is_bookmarked: !this.orgData.is_bookmarked };
    const payload = { is_bookmarked: this.orgData.is_bookmarked };
    this.updateOrg(payload, 'bookmark');
  }

  updateOrg(payload: any, update: string) {
    if (this.orgData.type == 'sdo') {
      this.actionData.updateSdo(payload, this.orgData.id, this.parentTab, update);
    } else if (this.orgData.type == 'ido') {
      this.actionData.updateIdo(payload, this.orgData.id, this.parentTab, update);
    } else if (this.orgData.type == 'cdo') {
      this.actionData.updateCdo(payload, this.orgData.id, this.parentTab, update);
    } else if (this.orgData.type == 'misc') {
      this.actionData.updateMisc(payload, this.orgData.id, this.parentTab, update);
    } else if (this.orgData.type == 'mcdo') {
      this.actionData.updateMcdo(payload, this.orgData.id, this.parentTab, update);
    } else if (this.orgData.type == 'zsc') {
      this.actionData.updateZsc(payload, this.orgData.id, this.parentTab, update);
    } else if (this.orgData.type == 'zsmc') {
      this.actionData.updateZsmc(payload, this.orgData.id, this.parentTab, update);
    } else if (this.orgData.type == 'edo') {
      this.actionData.updateEdo(payload, this.orgData.id, this.parentTab, update);
    }
  }

  saveNotes() {
    this.saving = true;
    this.buttonData = "Saving"
    if (this.orgData.notes && this.orgData.notes.length == 0) {
      this.orgData = { ...this.orgData, notes: [{ note: this.notes }] };
      this.actionData.createNote({ organization_id: this.orgData.id, note: this.notes, orgtype: this.orgData.type }, this.parentTab, this.orgData.type);
    } else if (this.orgData.notes && this.orgData.notes.length > 0) {
      this.orgData = { ...this.orgData, notes: [{ ...this.orgData.notes[0], note: this.notes }] };
      this.actionData.updateNote({ note: this.notes }, this.parentTab, this.orgData.type, this.orgData.notes[0]?.id);
    }
  }

  checkOrgState(org_expiry: any) {
    const expiryDate = new Date(org_expiry);
    const currentDate = new Date();
    const difference = expiryDate.valueOf() - currentDate.valueOf();

    if (expiryDate > currentDate) {
      const days = Math.round((difference) / (1000 * 60 * 60 * 24));
      if (days < 7) {
        return 'expiring'
      }
      return 'active'

    } else {
      return 'expired'
    }
  }

  onRefreshOrg() {
    this.loading = true;
    this.actionData.handleOrgRefresh(this.orgData.id, this.orgData.type).subscribe(
      (data: any) => {
        if (data.expired) {
          this.dataService.fetchToken(this.dataService.auth_token).subscribe((token) => {
            if (token.expired) {
              this.router.navigate(["/redirect"]).then(result => { window.location.href = environment.auth_redirect_uri; });
            } else {
              this.onRefreshOrg();
            }
          }, error => {
            console.log("Error", error);
          })
        } else {
          if (data.success) {
            this.orgData = { ...data.org, created_date: data.org.org_created_date, username: this.orgData.username, notes: this.orgData.notes, pwd: this.orgData.pwd };
            this.Mixpanel.track('Refresh Org Info', { org_type: this.orgData.type, org_id: this.orgData.sfdc_id ? this.orgData.sfdc_id : null, refresh_success: true });
            let temp_org_data = [...this.dataService.allorgs];
            const index = temp_org_data.findIndex((org: any) => org.type == this.orgData.type && org.id == this.orgData.id);
            const org_status = this.checkOrgState(data.org.org_expiry);
            temp_org_data[index] = { ...temp_org_data[index], created_date: data.org.org_created_date, logo: data.org.logo, sfdc_id: data.org.sfdc_id, org_expiry: data.org.org_expiry, state: org_status, instance_name: data.org.instance_name, org_exp_type: data.org.org_exp_type, org_edition: data.org.org_edition };
            this.dataService.allorgs = [...temp_org_data];
            this.actionData.dataRefresh(this.parentTab, this.orgData.type, true);
            this.loading = false;
            this.notification.setNotification({
              show: true,
              isToast: true,
              type: "success",
              info: "Org refresh successful"
            })
          } else {
            this.loading = false;
            this.Mixpanel.track('Refresh Org Info', { org_type: this.orgData.type, org_id: this.orgData.sfdc_id ? this.orgData.sfdc_id : null, refresh_success: false });
            this.notification.setNotification({
              show: true,
              isToast: true,
              type: "error",
              info: "Org refresh failed, please try again after adding your password to org"
            })
          }
        }

      },
      (error: any) => {
        this.Mixpanel.track('Refresh Org Info', { org_type: this.orgData.type, org_id: this.orgData.sfdc_id ? this.orgData.sfdc_id : null, refresh_success: false, error: error });
        this.loading = false;
        console.log("Error", error);
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "error",
          info: "Org refresh failed"
        })
      }
    )
  }

  onShare() {
    if (this.shared_emails.includes(this.email)) {
      this.email = '';
      this.messageContent = '';
      return this.notification.setNotification({
        show: true,
        isToast: true,
        type: "error",
        info: "The Org is already shared to the user"
      });
    }
    if ((!this.orgData.pwd || (this.orgData.pwd && this.orgData.pwd.trim() == '')) && !(this.orgData.type == 'zsmc' || this.orgData.type == 'mcdo')) {
      this.email = '';
      this.messageContent = '';
      return this.notification.setNotification({
        show: true,
        isToast: true,
        type: "error",
        info: "The Org needs to have the password stored in order to be shared"
      });
    }
    this.saving = true;
    this.buttonData = "Sharing";
    this.actionData.shareOrg(this.orgData.id, this.orgData.type, this.messageContent, this.email).subscribe(
      (data: any) => {
        if (data.expired) {
          this.dataService.fetchToken(this.dataService.auth_token).subscribe((token) => {
            if (token.expired) {
              this.router.navigate(["/redirect"]).then(result => { window.location.href = environment.auth_redirect_uri; });
            } else {
              this.onShare();
            }
          }, error => {
            console.log("Error", error);
          })
        } else {
          if (data.success) {
            this.Mixpanel.track('Share Org', { org_type: this.orgData.type, org_id: this.orgData.id, share_success: true });
            let temp_org_data = [...this.dataService.allorgs];
            const index = temp_org_data.findIndex((org: any) => org.type == this.orgData.type && org.id == this.orgData.id);
            const temp_data = { ...temp_org_data[index], shared_to: true };
            temp_org_data[index] = { ...temp_data };
            this.dataService.allorgs = [...temp_org_data];
            this.shared_count = this.shared_count + 1;
            this.shared_emails = [...this.shared_emails, this.email]
            this.actionData.dataRefresh(this.parentTab, this.orgData.type, true);
            if (this.messageContent && this.messageContent.trim() != '') {
              this.actionData.createNote({ organization_id: data.orgShared.id, note: this.messageContent, orgtype: this.orgData.type }, this.parentTab, data.orgShared.type, true);
            }
            this.saving = false;
            this.buttonData = "Share";
            this.email = '';
            this.messageContent = '';
            this.notification.setNotification({
              show: true,
              isToast: true,
              type: "success",
              info: "Org successfully shared"
            })
          } else {
            this.Mixpanel.track('Share Org', { org_type: this.orgData.type, org_id: this.orgData.id, share_success: false });
            this.saving = false;
            this.buttonData = "Share";
            this.email = '';
            this.notification.setNotification({
              show: true,
              isToast: true,
              type: "error",
              info: "Failed to share org, please retry after sometime"
            })
          }
        }
      },
      (error: any) => {
        this.Mixpanel.track('Share Org', { org_type: this.orgData.type, org_id: this.orgData.id, share_success: false, error: error });
        console.log('Error', error);
        this.saving = false;
        this.buttonData = "Share";
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "error",
          info: "Failed to share org, please retry after sometime"
        })
      }
    )
  }

  onPasswordReset() {
    this.saving = true;
    this.buttonData = "Resetting";
    if (!this.reset_username && !this.reset_password) {
      this.saving = false;
      this.buttonData = "Password Reset";
      this.notification.setNotification({
        show: true,
        isToast: true,
        type: "error",
        info: "username or password not provided"
      })
    }
    this.actionData.changePassword(this.orgData.id, this.orgData.type, this.reset_password).subscribe((data) => {
      if (data.success) {
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "success",
          info: "Password reset successful"
        });
        let temp_org_data = [...this.dataService.allorgs];
        const index = temp_org_data.findIndex((org: any) => org.type == this.orgData.type && org.id == this.orgData.id);
        temp_org_data[index].pwd = this.reset_password;
        this.dataService.allorgs = [...temp_org_data];
        this.orgData.pwd = this.reset_password;
        this.noPwd = false;
        this.actionData.dataRefresh(this.parentTab, this.orgData.type, true);
        this.saving = false;
        this.buttonData = "Password Reset";
        this.reset_password = '';
        this.Mixpanel.track('Password Reset', { username: this.reset_username, orgId: this.orgData.sfdc_id, password_reset_success: true });
      } else {
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "error",
          info: data.message
        });
        this.saving = false;
        this.buttonData = "Password Reset";
        this.reset_password = '';
        this.Mixpanel.track('Password Reset', { username: this.reset_username, orgId: this.orgData.sfdc_id, password_reset_success: false, error: data.message });
      }
    },
      (error) => {
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "error",
          info: "There has been an issue while resetting your password, Try logging into the org and change it"
        });
        this.saving = false;
        this.buttonData = "Password Reset";
        this.reset_password = '';
        this.Mixpanel.track('Password Reset', { username: this.reset_username, orgId: this.orgData.sfdc_id, password_reset_success: false, error: error });
      })
  }

  onClose(): void {
    this.show_pwd_field = false;
    this.closeActionsModal.emit(true);
    this.notification.clearNotification({});
  }

  ngOnDestroy(): void {
    this.actionServiceSubscription.unsubscribe();
  }

}
