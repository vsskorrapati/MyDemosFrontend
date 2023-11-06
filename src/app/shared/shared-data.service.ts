import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, map, tap, Subject, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Apollo } from 'apollo-angular';
import { GET_ALL_ORGS } from '../graphql/graphql.queries';
import { Tab } from './DataModals/shared.modal';
import { NotificationService } from '../notification/notification.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  user: any;
  token: any;
  email: any;
  auth_token: any = "";

  sdos: any = [];
  idos: any = [];
  mcdos: any = [];
  cdos: any = [];
  misc: any = [];
  zsc: any = [];
  zsmc: any = [];
  edos: any = [];
  bookmarked: any = [];
  allorgs: any = [];
  shared_with_me_orgs: any = [];
  shared_to_others_orgs: any = [];

  selectedTab: any;

  private subject = new Subject<any>();
  private moreActions = new Subject<any>();
  private isHome = new Subject<any>();

  constructor(private http: HttpClient, private apollo: Apollo, private notification: NotificationService, private router: Router) { }

  classifyOrgs() {
    if (this.allorgs.length > 0) {
      this.sdos = [...this.allorgs.filter((org: any) => org.type == 'sdo')];
      this.idos = [...this.allorgs.filter((org: any) => org.type == 'ido')];
      this.cdos = [...this.allorgs.filter((org: any) => org.type == 'cdo')];
      this.misc = [...this.allorgs.filter((org: any) => org.type == 'misc')];
      this.mcdos = [...this.allorgs.filter((org: any) => org.type == 'mcdo')];
      this.zsc = [...this.allorgs.filter((org: any) => org.type == 'zsc')];
      this.zsmc = [...this.allorgs.filter((org: any) => org.type == 'zsmc')];
      this.edos = [...this.allorgs.filter((org: any) => org.type == 'edo')];
      this.bookmarked = [...this.allorgs.filter((org: any) => org.is_bookmarked == true)];
      this.shared_with_me_orgs = [...this.allorgs.filter((org: any) => org.is_owner == false)];
      this.shared_to_others_orgs = [...this.allorgs.filter((org: any) => (org.is_owner == true && org.shared_to == true))];
    }
    this.mapDateType();
  }

  mapDateType() {
    this.sdos = (this.sdos && this.sdos.length > 0) ? this.sdos.map((sdo: any) => {
      let org = { ...sdo };
      if (sdo.created_date && sdo.created_date.trim() != '') {
        org.created_date = new Date(sdo.created_date);
      };
      return org;
    }) : [];

    this.idos = (this.idos && this.idos.length > 0) ? this.idos.map((ido: any) => {
      let org = { ...ido };
      if (ido.created_date && ido.created_date.trim() != '') {
        org.created_date = new Date(ido.created_date);
      };
      return org;
    }) : [];

    this.cdos = (this.cdos && this.cdos.length > 0) ? this.cdos.map((cdo: any) => {
      let org = { ...cdo };
      if (cdo.created_date && cdo.created_date.trim() != '') {
        org.created_date = new Date(cdo.created_date);
      };
      return org;
    }) : [];

    this.misc = (this.misc && this.misc.length > 0) ? this.misc.map((mis: any) => {
      let org = { ...mis };
      if (mis.created_date && mis.created_date.trim() != '') {
        org.created_date = new Date(mis.created_date);
      };
      return org;
    }) : [];

    this.zsc = (this.zsc && this.zsc.length > 0) ? this.zsc.map((zs: any) => {
      let org = { ...zs };
      if (zs.created_date && zs.created_date.trim() != '') {
        org.created_date = new Date(zs.created_date);
      };
      return org;
    }) : [];

    this.zsmc = (this.zsmc && this.zsmc.length > 0) ? this.zsmc.map((zsm: any) => {
      let org = { ...zsm };
      if (zsm.created_date && zsm.created_date.trim() != '') {
        org.created_date = new Date(zsm.created_date);
      };
      return org;
    }) : [];

    this.mcdos = (this.mcdos && this.mcdos.length > 0) ? this.mcdos.map((mcdo: any) => {
      let org = { ...mcdo };
      if (mcdo.created_date && mcdo.created_date.trim() != '') {
        org.created_date = new Date(mcdo.created_date);
      };
      return org;
    }) : [];

    this.edos = (this.edos && this.edos.length > 0) ? this.edos.map((edo: any) => {
      let org = { ...edo };
      if (edo.created_date && edo.created_date.trim() != '') {
        org.created_date = new Date(edo.created_date);
      };
      return org;
    }) : [];

    this.bookmarked = (this.bookmarked && this.bookmarked.length > 0) ? this.bookmarked.map((org: any) => {
      let tempOrg = { ...org };
      if (org.created_date && org.created_date.trim() != '') {
        tempOrg.created_date = new Date(org.created_date);
      };
      return tempOrg;
    }) : [];

    this.allorgs = (this.allorgs && this.allorgs.length > 0) ? this.allorgs.map((org: any) => {
      let tempOrg = { ...org };
      if (org.created_date && org.created_date.trim() != '') {
        tempOrg.created_date = new Date(org.created_date);
      };
      return tempOrg;
    }) : [];

    this.shared_with_me_orgs = (this.shared_with_me_orgs && this.shared_with_me_orgs.length > 0) ? this.shared_with_me_orgs.map((org: any) => {
      let tempOrg = { ...org };
      if (org.created_date && org.created_date.trim() != '') {
        tempOrg.created_date = new Date(org.created_date);
      };
      return tempOrg;
    }) : [];

    this.shared_to_others_orgs = (this.shared_to_others_orgs && this.shared_to_others_orgs.length > 0) ? this.shared_to_others_orgs.map((org: any) => {
      let tempOrg = { ...org };
      if (org.created_date && org.created_date.trim() != '') {
        tempOrg.created_date = new Date(org.created_date);
      };
      return tempOrg;
    }) : [];

  }

  getToken(): any {
    return this.token;
  }

  fetchToken(auth_token: any = "") {
    return this.http.post<any>(environment.get_auth_uri, { encrypted_data: auth_token }, {withCredentials: true}).pipe(tap(token => {
      this.token = token
    }));
  }



  fetchAllOrgs() {
    return this.apollo.query({
      query: GET_ALL_ORGS,
      context: {
        headers: new HttpHeaders().set('authorization', this.token.token),
        withCredentials: true
      }
    }).pipe(tap((data: any) => {
      if (data.data.all_orgs && data.data.all_orgs?.userErrors?.length == 0) {
        this.allorgs = data.data.all_orgs.orgs;
      }
      else if (data.data.all_orgs?.userErrors.length > 0 && data.data.all_orgs?.userErrors?.message?.includes("expired")) {
        this.callFetchToken('all');
      }
    }
    ),
      map((data: any) => {
        if (data.data.all_orgs && data.data.all_orgs?.userErrors?.length == 0) {
          return data.data.all_orgs.orgs;
        }
      }),
      catchError((error: any) => {
        console.log("There was error fetching all orgs", error);
        this.showErrorNotification();
        return of([]);
      }));
  }

  getSdos() {
    return this.sdos;
  }

  sendTabChangeEvent(tab: Tab) {
    this.subject.next(tab);
  }

  handleTabChangeEvent(): Observable<Tab> {
    return this.subject.asObservable();
  }

  sendTriggerToFetchData(type: any) {
    this.moreActions.next(type);
  }

  handleTriggerFromActions(): Observable<any> {
    return this.moreActions.asObservable();
  }

  callFetchToken(type: string) {
    this.fetchToken(this.auth_token).subscribe((data: any) => {
      if (data.success) {
        this.token = data.token;
          if (type == 'all') {
          this.fetchAllOrgs();
        }
      }
    }, (error: any) => {
      this.notification.setNotification({
        show: true,
        isToast: true,
        type: "error",
        info: "Unable to update your Org Record!"
      });
    })
  }

  showErrorNotification() {
    this.notification.setNotification({
      show: true,
      isToast: true,
      type: "error",
      info: "There was error while fetching the orgs!"
    });
  }

  onLogin(un: string, ps: string, type: string, orgId: string) {
    const headers = new HttpHeaders().set('authorization', this.token.token);
    return this.http.post<any>(environment.validate_uri, { un, ps, type, orgId }, { headers: headers, withCredentials: true });
  }

  sendHomeNotification(type: any) {
    this.isHome.next(true);
  }

  handleHomeNotification(): Observable<any> {
    return this.isHome.asObservable();
  }

}
