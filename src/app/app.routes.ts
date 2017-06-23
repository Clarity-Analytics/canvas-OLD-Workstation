// Exports all routes for Angular Router
import { AuthGuard }                  from './authguard.service';
import { Route }                      from  '@angular/router';

// Ours
import { DashboardComponent }         from './dashboard.component';
import { DashboardManagerComponent }  from './dashboard.manager.component';
import { DataSourceComponent }        from './datasource.component';
import { DocDiscussionsComponent }    from './doc.discussions.component';
import { DocReferenceComponent }      from './doc.reference.component';
import { DocTutorialsComponent }      from './doc.tutorials.component';
import { GroupComponent }             from './group.component';
import { LoginComponent }             from './login.component';
import { MessageManagerComponent }    from './message.manager.component';
import { MyProfileComponent }         from './myprofile.component';
import { PageNotFoundComponent }      from './pagenotfound.component';
import { PersonalisationComponent }   from './personalisation.component';
import { ReportComponent }            from './report.component';
import { SystemConfigComponent }      from './systemconfig.component';
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
    canActivate: [AuthGuard],
    canDeactivate: [AuthGuard]
  },
  { 
    path: 'users',                    
    component: UserComponent,             
    canActivate: [AuthGuard],
    canDeactivate: [AuthGuard]
  },
  { 
    path: 'group',                    
    component: GroupComponent,             
    canActivate: [AuthGuard],
    canDeactivate: [AuthGuard]
  },  
  { 
    path: 'dashboard',                
    component: DashboardComponent,        
    canActivate: [AuthGuard],
    canDeactivate: [AuthGuard]
  },
  { 
    path: 'dashboardManager',         
    component: DashboardManagerComponent, 
    canActivate: [AuthGuard],
    canDeactivate: [AuthGuard]
  },
  { 
    path: 'dataSource',         
    component: DataSourceComponent, 
    canActivate: [AuthGuard],
    canDeactivate: [AuthGuard]
  },
  { 
    path: 'report',         
    component: ReportComponent, 
    canActivate: [AuthGuard],
    canDeactivate: [AuthGuard]
  },
  { 
    path: 'myprofile',         
    component: MyProfileComponent, 
    canActivate: [AuthGuard],
    canDeactivate: [AuthGuard]
  },
  { 
    path: 'systemconfig',         
    component: SystemConfigComponent, 
    canActivate: [AuthGuard],
    canDeactivate: [AuthGuard]
  },
  { 
    path: 'messageManager',         
    component: MessageManagerComponent, 
    canActivate: [AuthGuard],
    canDeactivate: [AuthGuard]
  },
  { 
    path: 'doc-discussions',         
    component: DocDiscussionsComponent, 
    canActivate: [AuthGuard],
    canDeactivate: [AuthGuard]
  },
  { 
    path: 'doc-reference',         
    component: DocReferenceComponent, 
    canActivate: [AuthGuard],
    canDeactivate: [AuthGuard]
  },
  { 
    path: 'doc-tutorials',         
    component: DocTutorialsComponent, 
    canActivate: [AuthGuard],
    canDeactivate: [AuthGuard]
  },
  { 
    path: 'personalisation',             
    component: PersonalisationComponent,
    canActivate: [AuthGuard],
    canDeactivate: [AuthGuard]
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

