import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin, switchMap, tap } from 'rxjs';
import { SharedDataService } from '../shared/shared-data.service';
import { Apollo } from 'apollo-angular';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})


export class HomeResolver  {

  constructor(private http: HttpClient, private dataService: SharedDataService, private apollo: Apollo, private router: Router) { }
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    console.log("In resolver method");
      return this.dataService.fetchToken("").pipe(
        tap((token) => {
          if(token.expired) {
             this.router.navigate(["/redirect"]).then(result => { window.location.href = environment.auth_redirect_uri; });
          } else {
            this.dataService.token = token;
          } 
        }),
        switchMap(() => {
          return forkJoin([this.dataService.fetchAllOrgs()]);
        })
      ).toPromise();
  }
}

