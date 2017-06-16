// Schema for the System Configuration class

// Eazl


// Canvas
export class SystemConfiguration {
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