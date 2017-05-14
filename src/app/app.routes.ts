// Exports all routes for Angular Router
import { AuthGuard }                  from './authguard.service';
import { Route }                      from  '@angular/router';

// Ours
import { DashboardComponent }         from './dashboard.component';
import { LoginComponent }             from './login.component';
import { PageNotFoundComponent }      from './pagenotfound.component';
import { UserComponent}               from './user.component';
import { PackagesComponent } from './packages/packages.component';
import { PackageTasksComponent } from './package-tasks/package-tasks.component';

export const routes: Route[] = [

  { path: '', redirectTo: '/pagenotfound', pathMatch: 'full' },

  { path: 'startup',                  component: PageNotFoundComponent,   canActivate: [AuthGuard]},
  { path: 'users',                    component: UserComponent,           canActivate: [AuthGuard]},
  { path: 'dashboard',                component: DashboardComponent},  
  { path: 'packages', component: PackagesComponent},
  { path: 'packages-tasks', component: PackageTasksComponent},
  { path: 'pagenotfound',             component: PageNotFoundComponent},  
  { path: '**',                       component: PageNotFoundComponent}  
]