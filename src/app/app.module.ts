import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { TabsComponent } from './tabs/tabs.component';
import { SolutionsWorkspaceLayoutComponent } from './solutions-workspace-layout/solutions-workspace-layout.component';
import { HeaderComponent } from './header/header.component';
import { SearchComponent } from './search/search.component';
import { DataTableComponent } from './data-table/data-table.component';
import { ActionsModalComponent } from './Modals/actions-modal/actions-modal.component';
import { LoginModalComponent } from './Modals/login-modal/login-modal.component';
import { NotificationComponent } from './notification/notification.component';
import { StopPropagationDirective } from './stop-propagation.directive';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NoDemosComponent } from './no-demos/no-demos.component';
import { AutoFocusDirective } from './auto-focus.directive';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TabsComponent,
    SolutionsWorkspaceLayoutComponent,
    HeaderComponent,
    SearchComponent,
    DataTableComponent,
    ActionsModalComponent,
    LoginModalComponent,
    NotificationComponent,
    StopPropagationDirective,
    PageNotFoundComponent,
    NoDemosComponent,
    AutoFocusDirective,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
