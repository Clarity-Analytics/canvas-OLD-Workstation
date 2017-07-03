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
    companyName = new BehaviorSubject('Clarity');               // Optional, set in SystemConfig
    companyLogo = new BehaviorSubject('');                      // Optional file name, set in SystemConfig

    // System-wide related variables, set at Installation
    backendName = new BehaviorSubject('Eazl');
    backendUrl = new BehaviorSubject('');                       // RESTi url, set in SystemConfig
    defaultDaysToKeepResultSet = new BehaviorSubject(1);        // Optional, set in SystemConfig
    frontendName = new BehaviorSubject('Canvas');
    maxRowsDataReturned = new BehaviorSubject(1000000);         // Optional, set in SystemConfig
    maxRowsPerWidgetGraph = new BehaviorSubject(15)             // Optional, set in SystemConfig
    systemTitle = new BehaviorSubject('Canvas');

    // Current User
    canvasUser = new BehaviorSubject<CanvasUser>(null);
    isAuthenticatedOnEazl = new BehaviorSubject(false);         // True if authenticated

    // This session
    growlGlobalMessage = new BehaviorSubject<Message>({severity:'', summary:'', detail:'' });
    sessionDateTimeLoggedin = new BehaviorSubject('');
    sessionDashboardTabID = new BehaviorSubject(-1);            // Tab ID to load when form opens, -1 = none
    sessionDebugging = new BehaviorSubject(false);
    sessionLogging = new BehaviorSubject(false);
    sessionLoadOnOpenDashboardID = new BehaviorSubject(-1);     // Dashboard to load when form opens, 0 = none
    sessionLoadOnOpenDashboardName = new BehaviorSubject('');   // Dashboard to load when form opens, '' = none

    // At startup
    startupDashboardID = new BehaviorSubject(0);                // Dashboard to load @start, 0 = none
    startupDashboardName = new BehaviorSubject('Collection of Bar charts');  // Dashboard to load @start, '' = none
    startupDashboardTabID = new BehaviorSubject(0);             // Tab ID to load @start, -1 = none
    startupMessageToShow = new BehaviorSubject('');

    // Environment
    testEnvironmentName = new BehaviorSubject('');   // Spaces = in PROD

    // Dirtiness of system (local) data: True if dirty (all dirty at startup)
    dirtyDataUser = new BehaviorSubject(true);
    dirtyDataGroup = new BehaviorSubject(true);
    dirtyDataDashboardTab = new BehaviorSubject(true);
    dirtyDataCanvasMessage = new BehaviorSubject(true);
    dirtyDataCanvasMessageRecipient = new BehaviorSubject(true);
    
    dirtyDataSystemConfiguration = new BehaviorSubject(true);

    // System & operation config
    averageWarningRuntime = new BehaviorSubject(0);
    defaultWidgetConfiguration = new BehaviorSubject('');
    dashboardIDStartup = new BehaviorSubject(-1);
    defaultReportFilters = new BehaviorSubject('');
    environment = new BehaviorSubject('');
    frontendColorScheme = new BehaviorSubject('lightgray');
    growlSticky = new BehaviorSubject(false);
    growlLife = new BehaviorSubject(3000);
    gridSize = new BehaviorSubject(3);
    snapToGrid = new BehaviorSubject(true);

    // Settings that can be set via UI for next time, from then on it will change
    // as the user uses them, and used the next time (a Widget is created)
    lastContainerFontSize = new BehaviorSubject<SelectedItem>(
        {
            id: 1,
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
            name: '1px solid black'
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
    lastWidgetWidth = new BehaviorSubject(400);
    lastWidgetLeft = new BehaviorSubject(250);
    lastWidgetTop = new BehaviorSubject(80);

    constructor() { }

}