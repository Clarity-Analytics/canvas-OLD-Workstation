// Schema for the System Configuration class

// Eazl: db_table = 'api_system_configuration'
export class EazlSystemConfiguration {
    id: number;                             // Unique DB ID
    backend_url: string;                    // URL for Backend (RESTi)
    company_name: string;                   // Company Name (of user)
    company_logo: string;                   // File name of Company Logo - for later use
    result_expires: number;                 // Number of days to keep ResultSets (auto delete if older)
    default_row_limit: number;         // Max amount of data rows returned from the Server (ever)
    // max_rows_per_widget_graph: number;      // Max nr of rows used per Widget Graph (not tables)
}

// Canvas
export class SystemConfiguration {
    systemConfigurationID: number;          // Unique DB ID
    backendUrl: string;                     // URL for Backend (RESTi)
    companyName: string;                    // Company Name (of user)
    companyLogo: string;                    // File name of Company Logo - for later use
    defaultDaysToKeepResultSet: number;     // Number of days to keep ResultSets (auto delete if older)
    maxRowsDataReturned: number;            // Max amount of data rows returned from the Server (ever)
    maxRowsPerWidgetGraph: number;          // Max nr of rows used per Widget Graph (not tables)
}
