import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeResolver } from './home/home.resolver';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SpinnerComponent } from './spinner/spinner.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home/:id', component: HomeComponent, resolve: { orgs: HomeResolver } },
  { path: 'home', component: HomeComponent, resolve: { orgs: HomeResolver } },
  { path: 'stockpile', component: HomeComponent, resolve: { orgs: HomeResolver } },
  { path: 'redirect', component: SpinnerComponent},
  { path: '404', component: PageNotFoundComponent},
  {
    path: '**', pathMatch: 'full',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
