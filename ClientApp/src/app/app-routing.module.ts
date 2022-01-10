import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleListComponent } from './components/dashboard-components/article-list/article-list.component';
import { UserSummaryComponent } from './components/dashboard-components/user-summary/user-summary.component';
import { WikiEditComponent } from './components/dashboard-components/wiki-edit/wiki-edit.component';
import { WikiListComponent } from './components/dashboard-components/wiki-list/wiki-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { UserComponent } from './components/user/user.component';
import { WikiFormComponent } from './components/dashboard-components/wiki-form/wiki-form.component';
import { WikiComponent } from './components/wiki/wiki.component';
import { AuthGuard } from './helpers';
import { Role } from './models';
import { ConfirmEmailComponent } from './components/auth/confirm-email/confirm-email.component';
import { ConfirmEmailFailureComponent } from './components/auth/confirm-email-components/confirm-email-failure/confirm-email-failure.component';
import { ConfirmEmailSuccessComponent } from './components/auth/confirm-email-components/confirm-email-success/confirm-email-success.component';
import { ConfirmEmailDefaultComponent } from './components/auth/confirm-email-components/confirm-email-default/confirm-email-default.component';
import { ArticleEditComponent } from './components/dashboard-components/article-edit/article-edit.component';
import { ArticleComponent } from './components/article/article.component';
import { ArticleFormComponent } from './components/dashboard-components/article-form/article-form.component';
import { MaintainerFormComponent } from './components/dashboard-components/maintainer-form/maintainer-form.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { WikisComponent } from './components/wikis/wikis.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'user',component: UserComponent, canActivate: [AuthGuard]},
  { path: 'home', component: HomeComponent},

  //auth
  { path: 'auth', redirectTo: 'auth/login', pathMatch: 'full'},
  { path: 'auth/login', component: LoginComponent},
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/confirm-email', component: ConfirmEmailComponent,
    children: [
      { path: '', redirectTo: 'failure', pathMatch: 'full'},
      { path: 'success', component: ConfirmEmailSuccessComponent},
      { path: 'failure', component: ConfirmEmailFailureComponent},
    ]
  },

  //dashboard
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'wiki', pathMatch: 'full'},
      { path: 'summary', component: UserSummaryComponent, canActivate: [AuthGuard]},
      { path: 'wiki', component: WikiListComponent, canActivate: [AuthGuard]},
      { path: 'wiki/:wikiURL', component: WikiEditComponent, canActivate: [AuthGuard]},
      { path: 'wiki-form', component: WikiFormComponent, canActivate: [AuthGuard]},
      { path: 'wiki/:wikiURL/article/:articleId', component: ArticleEditComponent, canActivate: [AuthGuard]},
      { path: 'wiki/:wikiURL/maintainer-form', component: MaintainerFormComponent, canActivate: [AuthGuard]},

      { path: 'wiki/:wikiURL/article-form', component: ArticleFormComponent, canActivate: [AuthGuard]},
      { path: 'article', component: ArticleListComponent, canActivate: [AuthGuard]},
      { path: 'article/:articleId', component: ArticleEditComponent, canActivate: [AuthGuard]},
    ]
  },

  { path: 'wiki/:wikiURL/article/:articleId', component: ArticleComponent },
  { path: 'wiki/:wikiURL', component: WikiComponent },
  { path: 'wiki', component: WikisComponent },
  { path: 'article', component: ArticlesComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: "reload",
    scrollPositionRestoration: "enabled"
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
