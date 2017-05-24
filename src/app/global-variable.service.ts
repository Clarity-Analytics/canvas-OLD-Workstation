// Service to provide global variables
import { BehaviorSubject }            from 'rxjs/BehaviorSubject';
import { Injectable }                 from '@angular/core';

// PrimeNG
import { Message }                    from 'primeng/primeng';  

// Our Models
import { CanvasUser }                 from './model.user';
import { SelectedItem }               from './model.selectedItem';
import { SelectedItemColor }          from './model.selectedItemColor';

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
    canvasUser = new BehaviorSubject<CanvasUser>(null);
    isAuthenticatedOnEazl = new BehaviorSubject(false);        // True if authenticated

    // This session
    sessionDateTimeLoggedin = new BehaviorSubject('');
    sessionDebugging = new BehaviorSubject(false);
    sessionLogging = new BehaviorSubject(false);
    growlGlobalMessage = new BehaviorSubject<Message>({severity:'', summary:'', detail:'' });
    sessionLoadOnOpenDashboardID = new BehaviorSubject(-1);     // Dashboard to load when form opens, 0 = none
    sessionLoadOnOpenDashboardCode = new BehaviorSubject('');   // Dashboard to load when form opens, '' = none
    sessionLoadOnOpenDashboardName = new BehaviorSubject('');   // Dashboard to load when form opens, '' = none
    sessionDashboardTabID = new BehaviorSubject(-1);            // Tab ID to load when form opens, -1 = none

    // Dirty data flags (true => will be reloaded from DB) - true @Start
    isDirtyUsers = new BehaviorSubject(true);                   // For Users

    // At startup
    startupDashboardID = new BehaviorSubject(0);                // Dashboard to load @start, 0 = none
    startupDashboardCode = new BehaviorSubject('Bar charts');   // Dashboard to load @start, '' = none
    startupDashboardName = new BehaviorSubject('Collection of Bar charts');  // Dashboard to load @start, '' = none
    startupdashboardTabID = new BehaviorSubject(0);             // Tab ID to load @start, -1 = none
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
    gridSize = new BehaviorSubject(3);
    snapToGrid = new BehaviorSubject(true);

    // Settings that can be set via UI for next time, from then on it will change
    // as the user uses them, and used the next time (a Widget is created)
    lastContainerFontSize = new BehaviorSubject<SelectedItem>(
        {
            id:1, 
            name: '1'
        }
    );
    lastColor = new BehaviorSubject<SelectedItemColor>(
        {
            id: 'black', 
            name: 'black', 
            code: '#000000'
        }
    );
    lastBoxShadow = new BehaviorSubject<SelectedItem>(
        {
            id:1, 
            name: ''
        }
    );
    lastBorder = new BehaviorSubject<SelectedItem>(
        {
            id:1, 
            name: 'transparent'
        }
    );
    lastBackgroundColor = new BehaviorSubject<SelectedItemColor>(
        {
            id: 'white', 
            name: 'white', 
            code: '#FFFFFF'
        }
    );
    lastWidgetHeight = new BehaviorSubject(300);
    lastWidgetWidth = new BehaviorSubject(300);
    lastWidgetLeft = new BehaviorSubject(250);
    lastWidgetTop = new BehaviorSubject(80);

    constructor() { }

}