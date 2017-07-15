// Schema for the Personalisation class

// Eazl
export class EazlPersonalisation {
    id: number;                             // Unique DB ID
    record_id: number;                      // Our DB ID
    average_warning_runtime: number;        // Minutes: Warn user if a report is known to run longer
    dashboard_id_at_startup: number;        // Optional Dashboard ID to show at startup
    environment: string;                    // Live, Test-Environment-Name
    frontend_color_scheme: string;          // Color scheme for Canvas - for later use
    default_report_filters: string;         // Default Report filters - for later use
    default_widget_configuration: string;   // Default Widget configuration - for later use
    grid_size: number;                      // Size of Grid on Dashboard in px
    growl_life: number;                     // Life is seconds of Growls
    growl_sticky: boolean;                  // True: Growls are sticky
    snap_to_grid: boolean;                  // True: snap Widgets to the grid points on Dashboard
}

// Canvas
export class Personalisation {
    personalisationID: number;              // Unique DB ID
    personalisationRecordID: number;        // Our DB ID
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

export class UserProfile {
    id: number; 
    profile_picture: any;
    nick_name: string;
    cell_number: string;
    work_number: string;
    growl_life: number;
    growl_sticky: boolean;
    grid_size: number;
    snap_to_grid: boolean;
    color_scheme: string;
    default_widget_configuration: string;
    query_runtime_warning: number;
}


