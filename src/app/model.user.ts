// Schema for the User class

// Eazl
export interface EazlUser 
    {
        // Defines data model for User Entity
        id: number;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        is_superuser: boolean;
        is_staff: boolean;
        is_active: boolean;
        date_joined: Date;
        last_login: Date;
        profile: 
            {
                nick_name: string;
                cell_number: string;
                work_number: string;
                profile_picture: string;
                query_runtime_warning: number;          // Minutes: Warn user if a report is known to run longer
                dashboard_id_at_startup: number;        // Optional Dashboard ID to show at startup
                environment: string;                    // Live, Test-Environment-Name
                color_scheme: string;                   // Color scheme for Canvas - for later use
                default_report_filters: string;         // Default Report filters - for later use
                default_widget_configuration: string;   // Default Widget configuration - for later use
                grid_size: number;                      // Size of Grid on Dashboard in px
                growl_life: number;                     // Life is seconds of Growls
                growl_sticky: boolean;                  // True: Growls are sticky
                snap_to_grid: boolean;                  // True: snap Widgets to the grid points on Dashboard
            }
    }

// Canvas
export class User 
    {
        id: number;
        username: string;
        firstName: string;
        lastName: string;
        nickName: string;
        photoPath: string;
        lastDatetimeLoggedIn: string;
        lastDatetimeReportWasRun: string;
        emailAddress: string;
        cellNumber: string;
        workTelephoneNumber: string;
        activeFromDate: string;
        inactiveDate: string;
        dateCreated: string;
        userNameLastUpdated: string;
        isStaff: boolean;
        isSuperUser: boolean;
        profile: 
            {
                nick_name: string;
                cell_number: string;
                work_number: string;
                profile_picture: string;
                averageWarningRuntime: number;          // Minutes: Warn user if a report is known to run longer
                dashboardIDStartup: number;             // Optional Dashboard ID to show at startup
                environment: string;                    // Live, Test-Environment-Name
                frontendColorScheme: string;            // Color scheme for Canvas - for later use
                defaultReportFilters: string;           // Default Report filters - for later use
                defaultWidgetConfiguration: string;     // Default Widget configuration - for later use
                gridSize: number;                       // Size of Grid on Dashboard in px
                growlLife: number;                      // Life is seconds of Growls
                growlSticky: boolean;                   // True: Growls are sticky
                snapToGrid: boolean;                    // True: snap Widgets to the grid points on Dashboard
            }
    }

// Current user info in Canvas
export class CanvasUser implements EazlUser 
    {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        is_superuser: boolean;
        is_staff: boolean;
        is_active: boolean;
        date_joined: Date;
        last_login: Date;
        profile: 
            {
                nick_name: string;
                cell_number: string;
                work_number: string;
                profile_picture: string;
                query_runtime_warning: number;          // Minutes: Warn user if a report is known to run longer
                dashboard_id_at_startup: number;        // Optional Dashboard ID to show at startup
                environment: string;                    // Live, Test-Environment-Name
                color_scheme: string;                   // Color scheme for Canvas - for later use
                default_report_filters: string;         // Default Report filters - for later use
                default_widget_configuration: string;   // Default Widget configuration - for later use
                grid_size: number;                      // Size of Grid on Dashboard in px
                growl_life: number;                     // Life is seconds of Growls
                growl_sticky: boolean;                  // True: Growls are sticky
                snap_to_grid: boolean;                  // True: snap Widgets to the grid points on Dashboard
            }
    }


