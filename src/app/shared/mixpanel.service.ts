import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedDataService } from './shared-data.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class MixpanelService {

  constructor(private dataService: SharedDataService, private http: HttpClient, private router: Router) { }

  track = (name: any, props: any) => {
    const url = environment.mixpanel_uri;
    const headers = new HttpHeaders().set('authorization', this.dataService.token.token);
    const options = { headers: headers, withCredentials: true };
    this.http.post<any>(url, { ...props, action: name }, options).subscribe(
      (data): any => {
        if (data.expired) {
          this.dataService.fetchToken(this.dataService.auth_token).subscribe((token) => {
            if (token.expired) {
              this.router.navigate(["/redirect"]).then(result => { window.location.href = environment.auth_redirect_uri; });
            } else {
              this.track(name, props);
            }
          }, error => {
            console.log("Error", error);
          })
        } else {
          if (data.success) {

          } else {
            console.log("Event couldn't be logged");
          }
        }
      },
      (error): any => {
        console.log("Exception occured while logging data to mixpanel");
      });
  }
}
