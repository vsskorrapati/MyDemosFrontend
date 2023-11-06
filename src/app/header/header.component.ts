import { Component, OnInit } from '@angular/core';
import { SearchService } from '../shared/search.service';
import { MixpanelService } from '../shared/mixpanel.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  showHelpToolTip = false;
  is_expanded=false;

  
  demos = [
    {id: 11, name: "Explore Options", type: 'others', link:"https://q-identity.my.site.com/s/resources/categories/a0O8c00000i7FdDEAU/demo-environments", isheader: false, isExplore: true},
    {id: 0, name: 'Customizable', isheader: true},
    {id: 1, name: "Simple Demo Org (SDO)", type: 'sdo', link:'https://q-central.herokuapp.com/q-signups?additional_params={"org_id":"aa74d1a8-5884-1c5f-082f-8bfbee691add"}', isheader: false},
    {id: 2, name: "Industry Demo Org (IDO)", type: 'ido', link:"https://q-central.herokuapp.com/q-signups", isheader: false},
    {id: 3, name: "Clean Demo Org (CDO)", type: 'cdo', link:'https://q-central.herokuapp.com/q-signups?additional_params={"org_id":"c08e39ae-5286-43cd-815a-19ec27623df8"}', isheader: false},
    {id: 4, name: "Miscelleneous (MISC)", type: 'misc', link:"https://q-central.herokuapp.com/q-signups", isheader: false},
    {id: 5, name: "Marketing Cloud Demo Org (MCDO)", type: 'mcdo', link:"https://help.solutionscentral.io/environment-signups?acct=Customizable%20Demo", isheader: false},
    {id: 6, name: 'Zero Setup Orgs', isheader: true},
    {id: 7, name: "autoNTO (Retail)", type: 'nto', link:"https://solutionscentral.io/topics/814ded40-3bc7-11ea-8366-87fa64439990/autonto-northern-trail-outfitters", isheader: false},
    {id: 8, name: "autoMakana (HLS)", type: 'makana', link:"https://solutionscentral.io/topics/05666290-b8a6-11eb-b875-f905718ad775/automakana", isheader: false},
    {id: 9, name: "autoCumulus (FINS)", type: 'cumulus', link:"https://solutionscentral.io/topics/8009fc50-413d-11ea-85f3-3338d1dffa21/autocumulus", isheader: false},
    {id: 9, name: "autoWelo (HIGH-TECH)", type: 'welo', link:"https://solutionscentral.io/topics/eeadfd30-8b83-11ed-ac25-4f3261592cf4/autowelo", isheader: false},
    {id: 11, name: "Everybody's Demo Org (EDO)", type: 'edo', link:"https://edo-master.force.com/edo/s/signup", isheader: false},
  ]

  constructor(private search: SearchService, private Mixpanel: MixpanelService) { }

  ngOnInit(): void {
  }

  emitSearchValue(event: any) {
    this.search.sendSearchEvent(event);
  }



  handleRequestDemo(item: any) {
    this.is_expanded=false;
    if (!item.isheader) {
      this.Mixpanel.track('Request Demo Org', {org_type_name: item.name});
      window.open(item.link);
    } 
  }

  onNavigate() {
    window.open("https://q-identity.my.site.com/help/s/hc-application/a008c00000YYcaPAAT/demo-environments");
  }

}
