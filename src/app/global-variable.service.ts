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
    companyName: string = 'Clarity Analytics';                  // Optional, set in SystemConfig
    companyLogo: string = '';                                   // Optional file name, set in SystemConfig

    // System-wide related variables, set at Installation
    systemConfigurationID: number = -1;
    systemConfigRecordID: number = -1;
    backendName: string = 'Eazl';
    backendUrl: string = '';                                    // RESTi url, set in SystemConfig
    defaultDaysToKeepResultSet: number = 1;                     // Optional, set in SystemConfig
    frontendName: string = 'Canvas';
    maxRowsDataReturned: number = 1000000;                      // Optional, set in SystemConfig
    maxRowsPerWidgetGraph: number = 1;                          // Optional, set in SystemConfig
    systemTitle: string = 'Canvas';

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
    dirtyDataTextAlignDropdown: boolean = true;
    dirtyDataBorderDropdown: boolean = true;
    dirtyDataBoxShadowDropdown: boolean = true;
    dirtyDataBackgroundImageDropdown: boolean = true;
    dirtyDataDashboardTab: boolean = true;
    dirtyDataCanvasMessage: boolean = true;
    dirtyDataCanvasMessageRecipient: boolean = true;
    dirtyDataDashboardGroup: boolean = true;
    dirtyDataDashboardGroupMembership: boolean = true;
    dirtyDataDashboardGroupRelationship: boolean = true;
    dirtyDataDashboard: boolean = true;
    dirtyDataDashboardsPerUser: boolean = true;
    dirtyDataDashboardUserRelationship: boolean = true;
    dirtyDataDatasource: boolean = true;
    dirtyDataDatasourcesPerUser: boolean = true;
    dirtyDataDataSourceUserAccess: boolean = true;
    dirtyDataFilter: boolean = true;
    dirtyDataFontSizeDropdown: boolean = true;
    dirtyDataFontWeightDropdown: boolean = true;
    dirtyDataGraphType: boolean = true;
    dirtyDataGridSizeDropdown: boolean = true;
    dirtyDataGroup: boolean = true;
    dirtyDataGroupDatasourceAccess: boolean = true;
    dirtyDataImageSourceDropdown: boolean = true;
    dirtyDataNotification: boolean = true;
    dirtyDataPackageTask: boolean = true;
    dirtyDataPersonalisation: boolean = true;
    dirtyDataReport: boolean = true;
    dirtyDataReportWidgetSet: boolean = true;
    dirtyDataReportHistory: boolean = true;
    dirtyDataReportUserRelationship: boolean = true;
    dirtyDataSystemConfiguration: boolean = true;
    dirtyDataTextMarginDropdown: boolean = true;
    dirtyDataTextPaddingDropdown: boolean = true;
    dirtyDataTextPositionDropdown: boolean = true;
    dirtyDataWidget: boolean = true;
    dirtyDataWidgetComment: boolean = true;
    dirtyDataWidgetTemplate: boolean = true;
    dirtyDataWidgetType: boolean = true;
    dirtyDataUser: boolean = true;
    dirtyDataUserGroupMembership: boolean = true;

    // System & operation config
    personalisationID: number = 0; 
    personalisationRecordID: number = 0;
    averageWarningRuntime: number = 0;
    defaultWidgetConfiguration: string = '';
    dashboardIDStartup: number = -1;
    defaultReportFilters: string = '';
    environment = new BehaviorSubject('');
    frontendColorScheme = new BehaviorSubject('');
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