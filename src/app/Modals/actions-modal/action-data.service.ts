import { Injectable } from '@angular/core';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { UPDATE_SDO, UPDATE_IDO, UPDATE_CDO, UPDATE_MISC, UPDATE_MCDO, UPDATE_EDO, UPDATE_ZSC, UPDATE_ZSMC, CREATE_NOTE, UPDATE_NOTE } from 'src/app/graphql/graphql.mutations';
import { Apollo } from 'apollo-angular';
import { GET_ALL_ORGS } from 'src/app/graphql/graphql.queries';
import { HttpHeaders } from '@angular/common/http';
import { Observable, Subject, pipe, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/notification/notification.service';
import { environment } from 'src/environments/environment';
import { MixpanelService } from 'src/app/shared/mixpanel.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ActionDataService {

  private subject = new Subject();
  private noteId = new Subject();

  constructor(private dataService: SharedDataService, private apollo: Apollo, private http: HttpClient, private notification: NotificationService, private router: Router, private Mixpanel: MixpanelService) { }

  updateSdo(sdoInput: any, id: string, parentTab: number, update: string) {
    let message = "";
    if (update == 'bookmark') {
      if (sdoInput.is_bookmarked) {
        message = "Org successfully bookmarked";
      } else {
        message = "Org successfully unbookmarked";
      }
    } else if (update == 'pass') {
      message = "Password updated successfully";
    }

    this.apollo.mutate({
      mutation: UPDATE_SDO,
      variables: {
        sdo: sdoInput,
        sdoUpdateId: id
      },
      context: {
        headers: new HttpHeaders().set('authorization', this.dataService.token.token),
        withCredentials: true
      }
    }).subscribe((data: any) => {
      if (update == 'bookmark') {
        this.Mixpanel.track('Bookmark Org', { org_type: 'sdo' });
      } else if (update == 'pass') {
        this.Mixpanel.track('Save User Password', { org_type: 'sdo' });
      }
      this.dataRefresh(parentTab, 'sdo');
      this.notification.setNotification({
        show: true,
        isToast: true,
        type: "success",
        info: message
      });
      if (data.sdoUpdate?.userErrors.length > 0 && data.sdoUpdate?.userErrors?.message?.includes("expired")) {
        this.dataService.fetchToken(this.dataService.auth_token).subscribe((data: any) => {
          if (data.success) {
            this.dataService.token = data.token;
            this.updateSdo(sdoInput, id, parentTab, update);
          }
        })
      }
    },
      (error: any) => {
        if (update == 'bookmark') {
          this.Mixpanel.track('Bookmark Org', { org_type: 'sdo', error: error });
        } else if (update == 'pass') {
          this.Mixpanel.track('Save User Password', { org_type: 'sdo', error: error });
        }
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "error",
          info: "Unable to update your org. Please try logging into your org, run Q Branch app and try again"
        });
      }
    );
  }

  updateIdo(idoInput: any, id: string, parentTab: number, update: string) {
    let message = "";
    if (update == 'bookmark') {
      if (idoInput.is_bookmarked) {
        message = "Org successfully bookmarked";
      } else {
        message = "Org successfully unbookmarked";
      }
    } else if (update == 'pass') {
      message = "Password updated successfully";
    }


    this.apollo.mutate({
      mutation: UPDATE_IDO,
      variables: {
        ido: idoInput,
        idoUpdateId: id
      },
      context: {
        headers: new HttpHeaders().set('authorization', this.dataService.token.token),
        withCredentials: true
      }
    }).subscribe((data: any) => {
      if (update == 'bookmark') {
        this.Mixpanel.track('Bookmark Org', { org_type: 'ido' });
      } else if (update == 'pass') {
        this.Mixpanel.track('Save User Password', { org_type: 'ido' });
      }
      this.dataRefresh(parentTab, 'ido');
      this.notification.setNotification({
        show: true,
        isToast: true,
        type: "success",
        info: message
      });
      if (data.idoUpdate?.userErrors.length > 0 && data.idoUpdate?.userErrors?.message?.includes("expired")) {
        this.dataService.fetchToken(this.dataService.auth_token).subscribe((data: any) => {
          if (data.success) {
            this.dataService.token = data.token;
            this.updateIdo(idoInput, id, parentTab, update);
          }
        })
      }
    },
      (error: any) => {
        if (update == 'bookmark') {
          this.Mixpanel.track('Bookmark Org', { org_type: 'ido', error: error });
        } else if (update == 'pass') {
          this.Mixpanel.track('Save User Password', { org_type: 'ido', error: error });
        }
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "error",
          info: "Unable to update your org. Please try logging into your org, run Q Branch app and try again"
        });
      });
  }

  updateCdo(cdoInput: any, id: string, parentTab: number, update: string) {

    let message = "";
    if (update == 'bookmark') {
      if (cdoInput.is_bookmarked) {
        message = "Org successfully bookmarked";
      } else {
        message = "Org successfully unbookmarked";
      }
    } else if (update == 'pass') {
      message = "Password updated successfully";
    }


    this.apollo.mutate({
      mutation: UPDATE_CDO,
      variables: {
        cdo: cdoInput,
        cdoUpdateId: id
      },
      context: {
        headers: new HttpHeaders().set('authorization', this.dataService.token.token),
        withCredentials: true
      }
    }).subscribe((data: any) => {
      if (update == 'bookmark') {
        this.Mixpanel.track('Bookmark Org', { org_type: 'cdo' });
      } else if (update == 'pass') {
        this.Mixpanel.track('Save User Password', { org_type: 'cdo' });
      }
      this.dataRefresh(parentTab, 'cdo');
      this.notification.setNotification({
        show: true,
        isToast: true,
        type: "success",
        info: message
      });
      if (data.cdoUpdate?.userErrors.length > 0 && data.cdoUpdate?.userErrors?.message?.includes("expired")) {
        this.dataService.fetchToken(this.dataService.auth_token).subscribe((data: any) => {
          if (data.success) {
            this.dataService.token = data.token;
            this.updateCdo(cdoInput, id, parentTab, update);
          }
        })
      }
    },
      (error: any) => {
        if (update == 'bookmark') {
          this.Mixpanel.track('Bookmark Org', { org_type: 'cdo', error: error });
        } else if (update == 'pass') {
          this.Mixpanel.track('Save User Password', { org_type: 'cdo', error: error });
        }
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "error",
          info: "Unable to update your org. Please try logging into your org, run Q Branch app and try again"
        });
      });
  }

  updateMisc(miscInput: any, id: string, parentTab: number, update: string) {
    let message = "";
    if (update == 'bookmark') {
      if (miscInput.is_bookmarked) {
        message = "Org successfully bookmarked";
      } else {
        message = "Org successfully unbookmarked";
      }
    } else if (update == 'pass') {
      message = "Password updated successfully";
    }


    this.apollo.mutate({
      mutation: UPDATE_MISC,
      variables: {
        misc: miscInput,
        miscUpdateId: id
      },
      context: {
        headers: new HttpHeaders().set('authorization', this.dataService.token.token),
        withCredentials: true
      }
    }).subscribe((data: any) => {
      if (update == 'bookmark') {
        this.Mixpanel.track('Bookmark Org', { org_type: 'misc' });
      } else if (update == 'pass') {
        this.Mixpanel.track('Save User Password', { org_type: 'misc' });
      }
      this.dataRefresh(parentTab, 'misc');
      this.notification.setNotification({
        show: true,
        isToast: true,
        type: "success",
        info: message
      });
      if (data.miscUpdate?.userErrors.length > 0 && data.miscUpdate?.userErrors?.message?.includes("expired")) {
        this.dataService.fetchToken(this.dataService.auth_token).subscribe((data: any) => {
          if (data.success) {
            this.dataService.token = data.token;
            this.updateMisc(miscInput, id, parentTab, update);
          }
        })
      }
    },
      (error: any) => {
        if (update == 'bookmark') {
          this.Mixpanel.track('Bookmark Org', { org_type: 'misc', error: error });
        } else if (update == 'pass') {
          this.Mixpanel.track('Save User Password', { org_type: 'misc', error: error });
        }
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "error",
          info: "Unable to update your org. Please try logging into your org, run Q Branch app and try again"
        });
      });
  }

  updateMcdo(mcdoInput: any, id: string, parentTab: number, update: string) {
    let message = "";
    if (update == 'bookmark') {
      if (mcdoInput.is_bookmarked) {
        message = "Org successfully bookmarked";
      } else {
        message = "Org successfully unbookmarked";
      }
    } else if (update == 'pass') {
      message = "Password updated successfully";
    }


    this.apollo.mutate({
      mutation: UPDATE_MCDO,
      variables: {
        mcdo: mcdoInput,
        mcdoUpdateId: id
      },
      context: {
        headers: new HttpHeaders().set('authorization', this.dataService.token.token),
        withCredentials: true
      }
    }).subscribe((data: any) => {
      if (update == 'bookmark') {
        this.Mixpanel.track('Bookmark Org', { org_type: 'mcdo' });
      } else if (update == 'pass') {
        this.Mixpanel.track('Save User Password', { org_type: 'mcdo' });
      }
      this.dataRefresh(parentTab, 'mcdo');
      this.notification.setNotification({
        show: true,
        isToast: true,
        type: "success",
        info: message
      });
      if (data.mcdoUpdate?.userErrors.length > 0 && data.mcdoUpdate?.userErrors?.message?.includes("expired")) {
        this.dataService.fetchToken(this.dataService.auth_token).subscribe((data: any) => {
          if (data.success) {
            this.dataService.token = data.token;
            this.updateMcdo(mcdoInput, id, parentTab, update);
          }
        })
      }
    },
      (error: any) => {
        if (update == 'bookmark') {
          this.Mixpanel.track('Bookmark Org', { org_type: 'mcdo', error: error });
        } else if (update == 'pass') {
          this.Mixpanel.track('Save User Password', { org_type: 'mcdo', error: error });
        }
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "error",
          info: "Unable to update your org. Please try logging into your org, run Q Branch app and try again"
        });
      });
  }

  updateZsc(zscInput: any, id: string, parentTab: number, update: string) {

    let message = "";
    if (update == 'bookmark') {
      if (zscInput.is_bookmarked) {
        message = "Org successfully bookmarked";
      } else {
        message = "Org successfully unbookmarked";
      }
    } else if (update == 'pass') {
      message = "Password updated successfully";
    }


    this.apollo.mutate({
      mutation: UPDATE_ZSC,
      variables: {
        zsc: zscInput,
        zscUpdateId: id
      },
      context: {
        headers: new HttpHeaders().set('authorization', this.dataService.token.token),
        withCredentials: true
      }
    }).subscribe((data: any) => {
      if (update == 'bookmark') {
        this.Mixpanel.track('Bookmark Org', { org_type: 'zsc' });
      } else if (update == 'pass') {
        this.Mixpanel.track('Save User Password', { org_type: 'zsc' });
      }
      this.dataRefresh(parentTab, 'zsc');
      this.notification.setNotification({
        show: true,
        isToast: true,
        type: "success",
        info: message
      });
      if (data.zscUpdate?.userErrors.length > 0 && data.zscUpdate?.userErrors?.message?.includes("expired")) {
        this.dataService.fetchToken(this.dataService.auth_token).subscribe((data: any) => {
          if (data.success) {
            this.dataService.token = data.token;
            this.updateZsc(zscInput, id, parentTab, update);
          }
        })
      }
    },
      (error: any) => {
        if (update == 'bookmark') {
          this.Mixpanel.track('Bookmark Org', { org_type: 'zsc', error: error });
        } else if (update == 'pass') {
          this.Mixpanel.track('Save User Password', { org_type: 'zsc', error: error });
        }
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "error",
          info: "Unable to update your org. Please try logging into your org, run Q Branch app and try again"
        });
      });
  }

  updateZsmc(zsmcInput: any, id: string, parentTab: number, update: string) {

    let message = "";
    if (update == 'bookmark') {
      if (zsmcInput.is_bookmarked) {
        message = "Org successfully bookmarked";
      } else {
        message = "Org successfully unbookmarked";
      }
    } else if (update == 'pass') {
      message = "Password updated successfully";
    }


    this.apollo.mutate({
      mutation: UPDATE_ZSMC,
      variables: {
        zsmc: zsmcInput,
        zsmcUpdateId: id
      },
      context: {
        headers: new HttpHeaders().set('authorization', this.dataService.token.token),
        withCredentials: true
      }
    }).subscribe((data: any) => {
      if (update == 'bookmark') {
        this.Mixpanel.track('Bookmark Org', { org_type: 'zsmc' });
      } else if (update == 'pass') {
        this.Mixpanel.track('Save User Password', { org_type: 'zsmc' });
      }
      this.dataRefresh(parentTab, 'zsmc');
      this.notification.setNotification({
        show: true,
        isToast: true,
        type: "success",
        info: message
      });
      if (data.zsmcUpdate?.userErrors.length > 0 && data.zsmcUpdate?.userErrors?.message?.includes("expired")) {
        this.dataService.fetchToken(this.dataService.auth_token).subscribe((data: any) => {
          if (data.success) {
            this.dataService.token = data.token;
            this.updateZsmc(zsmcInput, id, parentTab, update);
          }
        })
      }
    },
      (error: any) => {
        if (update == 'bookmark') {
          this.Mixpanel.track('Bookmark Org', { org_type: 'zsmc', error: error });
        } else if (update == 'pass') {
          this.Mixpanel.track('Save User Password', { org_type: 'zsmc', error: error });
        }
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "error",
          info: "Unable to update your org. Please try logging into your org, run Q Branch app and try again"
        });
      });
  }

  updateEdo(edoInput: any, id: string, parentTab: number, update: string) {
    let message = "";
    if (update == 'bookmark') {
      if (edoInput.is_bookmarked) {
        message = "Org successfully bookmarked";
      } else {
        message = "Org successfully unbookmarked";
      }
    } else if (update == 'pass') {
      message = "Password updated successfully";
    }

    this.apollo.mutate({
      mutation: UPDATE_EDO,
      variables: {
        edo: edoInput,
        edoUpdateId: id
      },
      context: {
        headers: new HttpHeaders().set('authorization', this.dataService.token.token),
        withCredentials: true
      }
    }).subscribe((data: any) => {
      if (update == 'bookmark') {
        this.Mixpanel.track('Bookmark Org', { org_type: 'edo' });
      } else if (update == 'pass') {
        this.Mixpanel.track('Save User Password', { org_type: 'edo' });
      }
      this.dataRefresh(parentTab, 'edo');
      this.notification.setNotification({
        show: true,
        isToast: true,
        type: "success",
        info: message
      });
      if (data.edoUpdate?.userErrors.length > 0 && data.edoUpdate?.userErrors?.message?.includes("expired")) {
        this.dataService.fetchToken(this.dataService.auth_token).subscribe((data: any) => {
          if (data.success) {
            this.dataService.token = data.token;
            this.updateEdo(edoInput, id, parentTab, update);
          }
        })
      }
    },
      (error: any) => {
        if (update == 'bookmark') {
          this.Mixpanel.track('Bookmark Org', { org_type: 'edo', error: error });
        } else if (update == 'pass') {
          this.Mixpanel.track('Save User Password', { org_type: 'edo', error: error });
        }
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "error",
          info: "Unable to update your org. Please try logging into your org, run Q Branch app and try again"
        });
      });
  }

  createNote(noteInput: any, parentTab: number, type: string, share: boolean = false) {
    const queryName = this.refetchQueryName(type);

    this.apollo.mutate({
      mutation: CREATE_NOTE,
      variables: {
        notes: noteInput
      },
      refetchQueries: [
        { ...queryName }
      ],
      context: {
        headers: new HttpHeaders().set('authorization', this.dataService.token.token),
        withCredentials: true
      }
    }).subscribe((data: any) => {
      console.log("Data in create note", data);
      const notesData = data.data.noteCreate.notes;
      const orgId = notesData.organization_id;
      const type = notesData.orgtype;
      this.Mixpanel.track('Note Created', { org_type: type, orgId });

      if (!share) {
        let temp_org_data = [...this.dataService.allorgs];
        const index = temp_org_data.findIndex((org: any) => org.type == type && org.id == orgId);
        temp_org_data[index] = {...temp_org_data[index],notes: [notesData]};
        this.sendNoteId([notesData]);
        this.dataService.allorgs = [...temp_org_data];
      }
      

      this.dataRefresh(parentTab, type, false, true);
      this.sendTriggerOnSuccess(true);

      if (!share) {
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "success",
          info: "Note updated successfully"
        });
      }

      if (data.notes?.userErrors.length > 0 && data.notes?.userErrors?.message?.includes("expired")) {
        this.dataService.fetchToken(this.dataService.auth_token).subscribe((data: any) => {
          if (data.success) {
            this.dataService.token = data.token;
            this.createNote(noteInput, parentTab, type);
          }
        })
      }
    },
      (error: any) => {
        this.Mixpanel.track('Note Created', { org_type: type, error: error });
        this.sendTriggerOnSuccess(false);
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "error",
          info: "Unable to update your notes!"
        });
      }
    );

  }

  refetchQueryName(type: string) {
    return {
      query: GET_ALL_ORGS,
      context: {
        headers: new HttpHeaders().set('authorization', this.dataService.token.token)
      }
    }
  }


  updateNote(noteInput: any, parentTab: number, type: string, id: string) {

    this.apollo.mutate({
      mutation: UPDATE_NOTE,
      variables: {
        notes: noteInput,
        noteUpdateId: id
      },
      context: {
        headers: new HttpHeaders().set('authorization', this.dataService.token.token),
        withCredentials: true
      }
    }).subscribe((data: any) => {
      if (data.data.noteUpdate?.userErrors.length > 0) {
        this.Mixpanel.track('Note Created', { org_type: type, error: data.data.noteUpdate?.userErrors[0] });
        this.sendTriggerOnSuccess(false);
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "error",
          info: "Unable to update your notes!"
        });
      } else {
        this.Mixpanel.track('Note Updated', { org_type: type });
        this.dataRefresh(parentTab, type);
        this.sendTriggerOnSuccess(true);
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "success",
          info: "Note updated successfully"
        });
        if (data.notes?.userErrors.length > 0 && data.notes?.userErrors?.message?.includes("expired")) {
          this.dataService.fetchToken(this.dataService.auth_token).subscribe((data: any) => {
            if (data.success) {
              this.dataService.token = data.token;
              this.updateNote(noteInput, parentTab, type, id);
            }
          })
        }
      }
    },
      (error: any) => {
        this.Mixpanel.track('Note Created', { org_type: type, error: error });
        this.sendTriggerOnSuccess(false);
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "error",
          info: "Unable to update your notes!"
        });
      }
    );

  }

  extendOrgExpiry(days: number, parentTab: number, type: string, orgId: string, sfdc_id: string, username: string) {
    const url = environment.extender_uri;
    const headers = new HttpHeaders().set('authorization', this.dataService.token.token);
    const payload = {
      identifier: sfdc_id,
      max_extensions: 9999,
      user_name: username,
      extend_by: days
    };
    const options = { headers: headers, withCredentials: true };
    this.http.post<any>(url, {payload, orgId, type}, options).subscribe(
      (data): any => {
        console.log("data", data);
        if (data.expired) {
          this.dataService.fetchToken(this.dataService.auth_token).subscribe((token) => {
            if (token.expired) {
              this.router.navigate(["/redirect"]).then(result => { window.location.href = environment.auth_redirect_uri; });
            } else {
              this.extendOrgExpiry(days, parentTab, type, orgId, sfdc_id, username);
            }
          }, error => {
            console.log("Error", error);
          })
        } else {
          if (data.success) {
            this.Mixpanel.track('Extend Org', { org_type: type, org_id: sfdc_id, extension: days });
            this.sendTriggerOnSuccess(true);
            this.notification.setNotification({
              show: true,
              isToast: true,
              type: "success",
              info: "Request to extend org has been successfully placed, check your email for org extension success notification."
            });
          } else {
            this.Mixpanel.track('Extend Org', { org_type: type, org_id: sfdc_id, extension: days, error: data.message });
            this.sendTriggerOnSuccess(false);
            this.notification.setNotification({
              show: true,
              isToast: true,
              type: "error",
              info: "There was an issue while extending your Org's expiry."
            });
          }
        }
      },
      (error): any => {
        this.Mixpanel.track('Extend Org', { org_type: type, org_id: sfdc_id, extension: days, error: error });
        this.sendTriggerOnSuccess(false);
        this.notification.setNotification({
          show: true,
          isToast: true,
          type: "error",
          info: "There was an issue while extending your Org's expiry."
        });
      });
  }

  deleteOrg(parentTab: number, type: string, orgId: string, sfdc_id: string, username: string) {
    const url = environment.extender_uri;
    const orgs = [...this.dataService.allorgs];
    const currentOrg = orgs.find((org) => org.id == orgId && org.type == type);
    if (currentOrg.state == 'expired') {

    } else {
      const headers = new HttpHeaders().set('authorization', this.dataService.token.token);
      const payload = {
        identifier: sfdc_id,
        max_extensions: 9999,
        user_name: username,
        extend_by: 1,
        send_email: false
      };
      const options = { headers: headers, withCredentials: true };
      this.http.post<any>(url, {payload, orgId, type}, options).subscribe(
        (data): any => {
          if (data.expired) {
            this.dataService.fetchToken(this.dataService.auth_token).subscribe((token) => {
              if (token.expired) {
                this.router.navigate(["/redirect"]).then(result => { window.location.href = environment.auth_redirect_uri; });
              } else {
                this.deleteOrg(parentTab, type, orgId, sfdc_id, username);
              }
            }, error => {
              console.log("Error", error);
            })
          } else {
            this.Mixpanel.track('Delete Org', { org_id: sfdc_id, org_type: type });
            this.sendTriggerOnSuccess(true);
            this.notification.setNotification({
              show: true,
              isToast: true,
              type: "success",
              info: "Request to delete org has been successfully placed, check your email for org deletion notification."
            });
          }
        },
        (error): any => {
          this.Mixpanel.track('Delete Org', { org_id: sfdc_id, org_type: type, error: error });
          this.sendTriggerOnSuccess(false);
          this.notification.setNotification({
            show: true,
            isToast: true,
            type: "error",
            info: "There was an issue while deleting your Org's expiry."
          });
        });
    }

  }

  dataRefresh(parentTab: number, type: string, isShared: boolean = false, isNote: boolean = false) {
    if (type == 'sdo') {
      if (isNote || isShared) {
        this.dataService.sdos = [...this.dataService.allorgs.filter((org: any) => org.type == 'sdo')];
        this.dataService.shared_with_me_orgs = [...this.dataService.allorgs.filter((org: any) => org.is_owner == false)];
        this.dataService.shared_to_others_orgs = [...this.dataService.allorgs.filter((org: any) => (org.is_owner == true && org.shared_to == true))];
        this.dataService.sendTriggerToFetchData(parentTab);
      } else {
        this.dataService.fetchAllOrgs().subscribe(
          data => {
            this.dataService.allorgs = [...data];
            this.dataService.sdos = [...this.dataService.allorgs.filter((org: any) => org.type == 'sdo')];
            this.dataService.shared_with_me_orgs = [...this.dataService.allorgs.filter((org: any) => org.is_owner == false)];
            this.dataService.shared_to_others_orgs = [...this.dataService.allorgs.filter((org: any) => (org.is_owner == true && org.shared_to == true))];
            this.dataService.sendTriggerToFetchData(parentTab);
          },
          error => {
            console.log("Issue Updating", error);
          }
        );
      }
    } else if (type == 'ido') {
      if (isNote || isShared) {
        this.dataService.idos = [...this.dataService.allorgs.filter((org: any) => org.type == 'ido')];
        this.dataService.shared_with_me_orgs = [...this.dataService.allorgs.filter((org: any) => org.is_owner == false)];
        this.dataService.shared_to_others_orgs = [...this.dataService.allorgs.filter((org: any) => (org.is_owner == true && org.shared_to == true))];
        this.dataService.sendTriggerToFetchData(parentTab);
      } else {
        this.dataService.fetchAllOrgs().subscribe(
          data => {
            this.dataService.allorgs = [...data];
            this.dataService.idos = [...this.dataService.allorgs.filter((org: any) => org.type == 'ido')];
            this.dataService.shared_with_me_orgs = [...this.dataService.allorgs.filter((org: any) => org.is_owner == false)];
            this.dataService.shared_to_others_orgs = [...this.dataService.allorgs.filter((org: any) => (org.is_owner == true && org.shared_to == true))];
            this.dataService.sendTriggerToFetchData(parentTab);
          },
          error => {
            console.log("Issue Updating", error);
          }
        );
      }

    } else if (type == 'cdo') {
      if (isNote || isShared) {
        this.dataService.cdos = [...this.dataService.allorgs.filter((org: any) => org.type == 'cdo')];
        this.dataService.shared_with_me_orgs = [...this.dataService.allorgs.filter((org: any) => org.is_owner == false)];
        this.dataService.shared_to_others_orgs = [...this.dataService.allorgs.filter((org: any) => (org.is_owner == true && org.shared_to == true))];
        this.dataService.sendTriggerToFetchData(parentTab);
      } else {
        this.dataService.fetchAllOrgs().subscribe(
          data => {
            this.dataService.allorgs = [...data];
            this.dataService.cdos = [...this.dataService.allorgs.filter((org: any) => org.type == 'cdo')];
            this.dataService.shared_with_me_orgs = [...this.dataService.allorgs.filter((org: any) => org.is_owner == false)];
            this.dataService.shared_to_others_orgs = [...this.dataService.allorgs.filter((org: any) => (org.is_owner == true && org.shared_to == true))];
            this.dataService.sendTriggerToFetchData(parentTab);
          },
          error => {
            console.log("Issue Updating", error);
          }
        );
      }

    } else if (type == 'misc') {
      if (isNote || isShared) {
        this.dataService.misc = [...this.dataService.allorgs.filter((org: any) => org.type == 'misc')];
        this.dataService.shared_with_me_orgs = [...this.dataService.allorgs.filter((org: any) => org.is_owner == false)];
        this.dataService.shared_to_others_orgs = [...this.dataService.allorgs.filter((org: any) => (org.is_owner == true && org.shared_to == true))];
        this.dataService.sendTriggerToFetchData(parentTab);
      } else {
        this.dataService.fetchAllOrgs().subscribe(
          data => {
            this.dataService.allorgs = [...data];
            this.dataService.misc = [...this.dataService.allorgs.filter((org: any) => org.type == 'misc')];
            this.dataService.shared_with_me_orgs = [...this.dataService.allorgs.filter((org: any) => org.is_owner == false)];
            this.dataService.shared_to_others_orgs = [...this.dataService.allorgs.filter((org: any) => (org.is_owner == true && org.shared_to == true))];
            this.dataService.sendTriggerToFetchData(parentTab);
          },
          error => {
            console.log("Issue Updating", error);
          }
        );
      }

    } else if (type == 'mcdo') {
      if (isNote || isShared) {
        this.dataService.mcdos = [...this.dataService.allorgs.filter((org: any) => org.type == 'mcdo')];
        this.dataService.shared_with_me_orgs = [...this.dataService.allorgs.filter((org: any) => org.is_owner == false)];
        this.dataService.shared_to_others_orgs = [...this.dataService.allorgs.filter((org: any) => (org.is_owner == true && org.shared_to == true))];
        this.dataService.sendTriggerToFetchData(parentTab);
      } else {
        this.dataService.fetchAllOrgs().subscribe(
          data => {
            this.dataService.allorgs = [...data];
            this.dataService.mcdos = [...this.dataService.allorgs.filter((org: any) => org.type == 'mcdo')];
            this.dataService.shared_with_me_orgs = [...this.dataService.allorgs.filter((org: any) => org.is_owner == false)];
            this.dataService.shared_to_others_orgs = [...this.dataService.allorgs.filter((org: any) => (org.is_owner == true && org.shared_to == true))];
            this.dataService.sendTriggerToFetchData(parentTab);
          },
          error => {
            console.log("Issue Updating", error);
          }
        );
      }

    } else if (type == 'zsc') {
      if (isNote || isShared) {
        this.dataService.zsc = [...this.dataService.allorgs.filter((org: any) => org.type == 'zsc')];
        this.dataService.shared_with_me_orgs = [...this.dataService.allorgs.filter((org: any) => org.is_owner == false)];
        this.dataService.shared_to_others_orgs = [...this.dataService.allorgs.filter((org: any) => (org.is_owner == true && org.shared_to == true))];
        this.dataService.sendTriggerToFetchData(parentTab);
      } else {
        this.dataService.fetchAllOrgs().subscribe(
          data => {
            this.dataService.allorgs = [...data];
            this.dataService.zsc = [...this.dataService.allorgs.filter((org: any) => org.type == 'zsc')];
            this.dataService.shared_with_me_orgs = [...this.dataService.allorgs.filter((org: any) => org.is_owner == false)];
            this.dataService.shared_to_others_orgs = [...this.dataService.allorgs.filter((org: any) => (org.is_owner == true && org.shared_to == true))];
            this.dataService.sendTriggerToFetchData(parentTab);
          },
          error => {
            console.log("Issue Updating", error);
          }
        );
      }

    } else if (type == 'zsmc') {
      if (isNote || isShared) {
        this.dataService.zsmc = [...this.dataService.allorgs.filter((org: any) => org.type == 'zsmc')];
        this.dataService.shared_with_me_orgs = [...this.dataService.allorgs.filter((org: any) => org.is_owner == false)];
        this.dataService.shared_to_others_orgs = [...this.dataService.allorgs.filter((org: any) => (org.is_owner == true && org.shared_to == true))];
        this.dataService.sendTriggerToFetchData(parentTab);
      } else {
        this.dataService.fetchAllOrgs().subscribe(
          data => {
            this.dataService.allorgs = [...data];
            this.dataService.zsmc = [...this.dataService.allorgs.filter((org: any) => org.type == 'zsmc')];
            this.dataService.shared_with_me_orgs = [...this.dataService.allorgs.filter((org: any) => org.is_owner == false)];
            this.dataService.shared_to_others_orgs = [...this.dataService.allorgs.filter((org: any) => (org.is_owner == true && org.shared_to == true))];
            this.dataService.sendTriggerToFetchData(parentTab);
          },
          error => {
            console.log("Issue Updating", error);
          }
        );
      }

    } else if (type == 'edo') {
      if (isNote || isShared) {
        this.dataService.edos = [...this.dataService.allorgs.filter((org: any) => org.type == 'edo')];
        this.dataService.shared_with_me_orgs = [...this.dataService.allorgs.filter((org: any) => org.is_owner == false)];
        this.dataService.shared_to_others_orgs = [...this.dataService.allorgs.filter((org: any) => (org.is_owner == true && org.shared_to == true))];
        this.dataService.sendTriggerToFetchData(parentTab);
      } else {
        this.dataService.fetchAllOrgs().subscribe(
          data => {
            this.dataService.allorgs = [...data];
            this.dataService.edos = [...this.dataService.allorgs.filter((org: any) => org.type == 'edo')];
            this.dataService.shared_with_me_orgs = [...this.dataService.allorgs.filter((org: any) => org.is_owner == false)];
            this.dataService.shared_to_others_orgs = [...this.dataService.allorgs.filter((org: any) => (org.is_owner == true && org.shared_to == true))];
            this.dataService.sendTriggerToFetchData(parentTab);
          },
          error => {
            console.log("Issue Updating", error);
          }
        );
      }

    }
  }

  sendTriggerOnSuccess(type: any) {
    this.subject.next(true);
  }

  sendNoteId(id: any) {
    this.noteId.next(id);
  }

  handleTriggerFromActions(): Observable<any> {
    return this.subject.asObservable();
  }

  handleNoteId(): Observable<any> {
    return this.noteId.asObservable();
  }

  handleOrgRefresh(id: string, type: string) {
    const headers = new HttpHeaders().set('authorization', this.dataService.token.token);
    return this.http.post<any>(environment.refresh_uri, { orgId: id, orgType: type }, {headers: headers, withCredentials: true});
  }

  shareOrg(id: any, type: string, message: string, email: string) {

    const shared_to_email = email;
    const org_id = id;
    const org_type = type;
    const headers = new HttpHeaders().set('authorization', this.dataService.token.token);
    return this.http.post<any>(environment.share_uri, { shared_to_email, org_id, org_type }, {headers: headers, withCredentials: true});
  }

  fetch_user_emails(sfdc_id: string | null, username: string | null, mid: string | null, email: string | null, type: string) {
    const headers = new HttpHeaders().set('authorization', this.dataService.token.token);
    const payload = {
      sfdc_id,
      username,
      mid,
      email,type
    };
    return this.http.post<any>(environment.fetch_shared_user_emails, {...payload}, {headers: headers, withCredentials: true});
  }

  changePassword(orgId: string, orgType: string, newPassword: string) {
    const payload = {
      orgId,
      orgType,
      newPassword
    };
    const headers = new HttpHeaders().set('authorization', this.dataService.token.token);
    return this.http.post<any>(environment.change_password_uri, {...payload}, {headers: headers, withCredentials: true});
  }

  imageUpload(org_id: string, org_type: string, image: any ) {
    const payload = {
      org_id,
      org_type,
      image
    }
    const headers = new HttpHeaders().set('authorization', this.dataService.token.token);
    return this.http.post<any>(environment.image_upload_uri, {...payload}, {headers: headers, withCredentials: true});
  }

  updatePwd(orgId: string, type: string, un: string, ps: string) {
    const payload = {
      orgId,
      type,
      un,
      ps
    }
    const headers = new HttpHeaders().set('authorization', this.dataService.token.token);
    return this.http.post<any>(environment.update_password_uri, {...payload}, {headers: headers, withCredentials: true});
  }


}
