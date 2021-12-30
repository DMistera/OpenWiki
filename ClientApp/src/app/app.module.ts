import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HomeComponent } from './components/home/home.component';
import { WikicardComponent } from './components/cards/wiki-card/wiki-card.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';

import { ErrorInterceptor} from '@app/helpers';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserComponent } from './components/user/user.component';
import { WikiComponent } from './components/wiki/wiki.component';
import { WikiFormComponent } from './components/forms/wiki-form/wiki-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WikiListComponent } from './components/dashboard-components/wiki-list/wiki-list.component';
import { ArticleListComponent } from './components/dashboard-components/article-list/article-list.component';
import { WikiEditComponent } from './components/dashboard-components/wiki-edit/wiki-edit.component';
import { UserSummaryComponent } from './components/dashboard-components/user-summary/user-summary.component';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { ArticleCardComponent } from './components/cards/article-card/article-card.component';
import { ConfirmEmailComponent } from './components/auth/confirm-email/confirm-email.component';
import { ConfirmEmailSuccessComponent } from './components/auth/confirm-email-components/confirm-email-success/confirm-email-success.component';
import { ConfirmEmailFailureComponent } from './components/auth/confirm-email-components/confirm-email-failure/confirm-email-failure.component';
import { ConfirmEmailDefaultComponent } from './components/auth/confirm-email-components/confirm-email-default/confirm-email-default.component';
import { ArticleFormComponent } from './components/forms/article-form/article-form.component';
import { ArticleComponent } from './components/article/article.component';
import { ArticleEditComponent } from './components/dashboard-components/article-edit/article-edit.component';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    WikicardComponent,
    RegisterComponent,
    LoginComponent,
    UserComponent,
    WikiComponent,
    WikiFormComponent,
    DashboardComponent,
    WikiListComponent,
    ArticleListComponent,
    WikiEditComponent,
    UserSummaryComponent,
    NotFoundComponent,
    ArticleCardComponent,
    ConfirmEmailComponent,
    ConfirmEmailSuccessComponent,
    ConfirmEmailFailureComponent,
    ConfirmEmailDefaultComponent,
    ArticleFormComponent,
    ArticleComponent,
    ArticleEditComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FontAwesomeModule,
    LayoutModule
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

