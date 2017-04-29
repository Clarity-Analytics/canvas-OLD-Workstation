// Service to provide global variables
import { BehaviorSubject }            from 'rxjs/BehaviorSubject';
import { Injectable }                 from '@angular/core';

// PrimeNG
import { Message }                    from 'primeng/primeng';  

@Injectable()
export class GlobalVariableService {
 
  // Company related variables
  companyName = new BehaviorSubject('Clarity');

  // System-wide related variables, set at Installation
  systemTitle = new BehaviorSubject('Canvas');
  frontendName = new BehaviorSubject('Canvas');
  backendName = new BehaviorSubject('Eazl');
  backendUrl = new BehaviorSubject('');
  
  // Current User
  currentUserID = new BehaviorSubject(0);   
  currentUserUserName = new BehaviorSubject('');      // '' means not logged in 
  currentUserPassword = new BehaviorSubject(''); 
  currentUserFirstName = new BehaviorSubject('Not Logged in'); 
  currentUserLastName = new BehaviorSubject('Not Logged in');

  // This session
  sessionDateTimeLoggedin = new BehaviorSubject('');
  sessionDebugging = new BehaviorSubject(false);
  sessionLogging = new BehaviorSubject(false);
  isCurrentUserAdmin = new BehaviorSubject(false);
  growlGlobalMessage = new BehaviorSubject<Message>({severity:'', summary:'', detail:'' });

  // At startup
  startupDashboardIDToShow = new BehaviorSubject('My fav Dashboard');
  startupMessageToShow = new BehaviorSubject('');

  // Environment
  testEnvironmentName = new BehaviorSubject('');   // Spaces = in PROD

  // System & operation config
  frontendColorScheme = new BehaviorSubject('');
  defaultWidgetConfiguration = new BehaviorSubject('');
  averageWarningRuntime = new BehaviorSubject('');
  defaultReportFilters = new BehaviorSubject(''); 
  growlSticky = new BehaviorSubject(false); 
  growlLife = new BehaviorSubject(3000); 

  constructor() { }

}