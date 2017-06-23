// Schema for the System Configuration class

// Eazl
export class EazlSystemConfiguration {
    id: number;                             // Unique DB ID
    company_name: string;                   // Company Name (of user)
    company_logo: string;                   // File name of Company Logo - for later use
    backend_url: string;                    // URL for Backend (RESTi)
    default_days_to_keep_resultset: number; // Number of days to keep ResultSets (auto delete if older)
    max_rows_data_returned: number;         // Max amount of data rows returned from the Server (ever)
    max_rows_per_widget_graph: number;      // Max nr of rows used per Widget Graph (not tables)
}

// Canvas
export class SystemConfiguration {
    systemConfigurationID: number;          // Unique DB ID
    companyName: string;                    // Company Name (of user)
    companyLogo: string;                    // File name of Company Logo - for later use
    backendUrl: string;                     // URL for Backend (RESTi)
    defaultDaysToKeepResultSet: number;     // Number of days to keep ResultSets (auto delete if older)
    maxRowsDataReturned: number;            // Max amount of data rows returned from the Server (ever)
    maxRowsPerWidgetGraph: number;          // Max nr of rows used per Widget Graph (not tables)
}