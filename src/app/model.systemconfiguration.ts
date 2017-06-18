// Schema for the System Configuration class

// Eazl
export class EazlSystemConfiguration {
    id: number;                             // Unique DB ID
    company_name: string;                   // Company Name (of user)
    company_logo: string;                   // File name of Company Logo - for later use
    backend_url: string;                    // URL for Backend (RESTi)
    default_days_to_keep_resultset: number; // Number of days to keep ResultSets (auto delete if older)
    average_warning_runtime: number;        // Minutes: Warn user if a report is known to run longer
    max_rows_data_returned: number;         // Max amount of data rows returned from the Server (ever)
    max_rows_per_widget_graph: number;      // Max nr of rows used per Widget Graph (not tables)
    keep_dev_logged_in: boolean;            // True: keep Dev logged in Dev Environment - for later use
    frontend_color_scheme: string;          // Color scheme for Canvas - for later use
    default_widget_configuration: string;   // Default Widget configuration - for later use
    default_report_filters: string;         // Default Report filters - for later use
    growl_sticky: boolean;                  // True: Growls are sticky
    growl_life: number;                     // Life is seconds of Growls
    grid_size: number;                      // Size of Grid on Dashboard in px
    snap_to_grid: boolean;                  // True: snap Widgets to the grid points on Dashboard
}

// Canvas
export class SystemConfiguration {
    systemConfigurationID: number;          // Unique DB ID
    companyName: string;                    // Company Name (of user)
    companyLogo: string;                    // File name of Company Logo - for later use
    backendUrl: string;                     // URL for Backend (RESTi)
    defaultDaysToKeepResultSet: number;     // Number of days to keep ResultSets (auto delete if older)
    averageWarningRuntime: number;          // Minutes: Warn user if a report is known to run longer
    maxRowsDataReturned: number;            // Max amount of data rows returned from the Server (ever)
    maxRowsPerWidgetGraph: number;          // Max nr of rows used per Widget Graph (not tables)
    keepDevLoggedIn: boolean;               // True: keep Dev logged in Dev Environment - for later use
    frontendColorScheme: string;            // Color scheme for Canvas - for later use
    defaultWidgetConfiguration: string;     // Default Widget configuration - for later use
    defaultReportFilters: string;           // Default Report filters - for later use
    growlSticky: boolean;                   // True: Growls are sticky
    growlLife: number;                      // Life is seconds of Growls
    gridSize: number;                       // Size of Grid on Dashboard in px
    snapToGrid: boolean;                    // True: snap Widgets to the grid points on Dashboard
}