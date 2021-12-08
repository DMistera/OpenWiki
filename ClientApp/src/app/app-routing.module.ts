import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleListComponent } from './components/dashboard-components/article-list/article-list.component';
import { UserSummaryComponent } from './components/dashboard-components/user-summary/user-summary.component';
import { WikiEditComponent } from './components/dashboard-components/wiki-edit/wiki-edit.component';
import { WikiListComponent } from './components/dashboard-components/wiki-list/wiki-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserComponent } from './components/user/user.component';
import { WikiFormComponent } from './components/wiki-form/wiki-form.component';
import { WikiComponent } from './components/wiki/wiki.component';
import { AuthGuard } from './helpers';
import { Role } from './models';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'user',component: UserComponent, canActivate: [AuthGuard]},
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'summary', pathMatch: 'full'},
      { path: 'summary', component: UserSummaryComponent, canActivate: [AuthGuard]},
      { path: 'wiki', component: WikiListComponent, canActivate: [AuthGuard]},
      { path: 'wiki/:id', component: WikiEditComponent, canActivate: [AuthGuard]},

      { path: 'article', component: ArticleListComponent, canActivate: [AuthGuard]},
      { path: 'article/:id', component: ArticleListComponent, canActivate: [AuthGuard]},
    ]
  },


  { path: 'wiki/:id', component: WikiComponent },
  { path: 'wiki-form', component: WikiFormComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
