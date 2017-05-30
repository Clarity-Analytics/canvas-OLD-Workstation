// Exports all routes for Angular Router
import { AuthGuard }                  from './authguard.service';
import { Route }                      from  '@angular/router';

// Ours
import { DashboardComponent }         from './dashboard.component';
import { DashboardManagerComponent }  from './dashboard.manager.component';
import { LoginComponent }             from './login.component';
import { MessageManagerComponent }    from './message.manager.component';
import { PageNotFoundComponent }      from './pagenotfound.component';
import { UserComponent}               from './user.component';

export const routes: Route[] = [

  { 
    path: '', 
    redirectTo: '/pagenotfound', 
    pathMatch: 'full' 
  },
  { 
    path: 'startup',                  
    component: PageNotFoundComponent,     
    canActivate: [AuthGuard]
  },
  { 
    path: 'users',                    
    component: UserComponent,             
    canActivate: [AuthGuard]
  },
  { 
    path: 'dashboard',                
    component: DashboardComponent,        
    canActivate: [AuthGuard]
  },
  { 
    path: 'dashboardManager',         
    component: DashboardManagerComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'messageManager',         
    component: MessageManagerComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'pagenotfound',             
    component: PageNotFoundComponent
  },  
  { 
    path: '**',                       
    component: PageNotFoundComponent
  }  
]


