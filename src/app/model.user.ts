// Schema for the User class

// Eazl
export class EazlUser
    {
        // Defines data model for User Entity
        date_joined: Date;
        email: string;
        first_name: string;
        group: [
            {
                name: string;
            }
        ];
        id: number;
        is_active: boolean;
        is_superuser: boolean;
        is_staff: boolean;
        last_login: Date;
        last_name: string;
        password: string;
        username: string;
        profile:
            {
                cell_number: string;
                color_scheme: string;                   // Color scheme for Canvas - for later use
                dashboard_id_at_startup: number;        // Optional Dashboard ID to show at startup
                default_report_filters: string;         // Default Report filters - for later use
                default_widget_configuration: string;   // Default Widget configuration - for later use
                environment: string;                    // Live, Test-Environment-Name
                grid_size: number;                      // Size of Grid on Dashboard in px
                growl_life: number;                     // Life is seconds of Growls
                growl_sticky: boolean;                  // True: Growls are sticky
                nick_name: string;
                profile_picture: string;
                query_runtime_warning: number;          // Minutes: Warn user if a report is known to run longer
                snap_to_grid: boolean;                  // True: snap Widgets to the grid points on Dashboard
                work_number: string;
            }
    }

// Canvas
export class User
    {
        id: number;
        username: string;
        firstName: string;
        lastName: string;
        lastDatetimeLoggedIn: string;
        lastDatetimeReportWasRun: string;
        emailAddress: string;
        activeFromDate: string;
        inactiveDate: string;
        dateCreated: string;
        userNameLastUpdated: string;
        isStaff: boolean;
        isSuperUser: boolean;
        profile:
            {
                nickName: string;
                cellNumber: string;
                workTelephoneNumber: string;
                photoPath: string;
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
        date_joined: Date;
        email: string;
        first_name: string;
        group: [
            {
                name: string;
            }
        ];
        id: number;
        is_superuser: boolean;
        is_staff: boolean;
        is_active: boolean;
        last_login: Date;
        last_name: string;
        password: string;
        username: string;
        profile:
            {
                cell_number: string;
                color_scheme: string;                   // Color scheme for Canvas - for later use
                dashboard_id_at_startup: number;        // Optional Dashboard ID to show at startup
                default_report_filters: string;         // Default Report filters - for later use
                default_widget_configuration: string;   // Default Widget configuration - for later use
                grid_size: number;                      // Size of Grid on Dashboard in px
                environment: string;                    // Live, Test-Environment-Name
                growl_life: number;                     // Life is seconds of Growls
                growl_sticky: boolean;                  // True: Growls are sticky
                profile_picture: string;
                query_runtime_warning: number;          // Minutes: Warn user if a report is known to run longer
                snap_to_grid: boolean;                  // True: snap Widgets to the grid points on Dashboard
                nick_name: string;
                work_number: string;
            }
    }


