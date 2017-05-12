// Service to provide global variables
import { BehaviorSubject }            from 'rxjs/BehaviorSubject';
import { Injectable }                 from '@angular/core';

// PrimeNG
import { Message }                    from 'primeng/primeng';  

export class SelectedItem {
    id: any;
    name: string;
}

export class SelectedItemColor {
    id: any;
    name: string;
    code: string;
}

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
    sessionLoadOnOpenDashboardID = new BehaviorSubject(-1);    // Dashboard to load when form opens, 0 = none
    sessionLoadOnOpenDashboardCode = new BehaviorSubject('');  // Dashboard to load when form opens, '' = none
    sessionLoadOnOpenDashboardName = new BehaviorSubject('');  // Dashboard to load when form opens, '' = none
    sessionWidgetTabName = new BehaviorSubject('');            // Tab to load when form opens, '' = none

    // At startup
    startupDashboardID = new BehaviorSubject(0);                // Dashboard to load @start, 0 = none
    startupDashboardCode = new BehaviorSubject('Bar charts');   // Dashboard to load @start, '' = none
    startupDashboardName = new BehaviorSubject('Collection of Bar charts');  // Dashboard to load @start, '' = none
    startupWidgetTabName = new BehaviorSubject('Value');        // Tab to load @start, '' = none
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
    ContainerFontSize = new BehaviorSubject<SelectedItem>(
        {
            id:1, 
            name: '1'
        }
    );
    selectedColor = new BehaviorSubject<SelectedItemColor>(
        {
            id: 'black', 
            name: 'black', 
            code: '#000000'
        }
    );
    selectedBoxShadow = new BehaviorSubject<SelectedItemColor>(
        {
            id:1, 
            name: '',                      
            code: ''
        }
    );
    selectedBorder = new BehaviorSubject<SelectedItemColor>(
        {
            id:1, 
            name: 'transparent',           
            code: ''}
    );
    selectedBackgroundColor = new BehaviorSubject<SelectedItemColor>(
        {
            id: 'white', 
            name: 'white', 
            code: '#FFFFFF'
        }
    );
    
    constructor() { }

}