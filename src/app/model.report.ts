// Schema for the Report class

// Eazl
export class EazlReport {
    id: number;                         // Unique DB ID
    name: string;                       // Name
    description: string;                // Description
    parameters: string;                 // Parameters (optional)
    datasource_id: number;              // FK to DataSource
    datasource_parameters: string;      // Data Source Parameters
    report_fields: string[];            // Array of report fields, obtained from DB
    report_data: any[];                 // Array (json) of data rows

}

// Canvas
export class Report {
    reportID: number;                   // Unique DB ID
    reportName: string;                 // Name
    description: string;                // Description
    reportParameters: string;           // Parameters (optional)
    dataSourceID: number;               // FK to DataSource
    dataSourceParameters: string;       // Data Source Parameters
    reportFields: string[];             // Array of report fields, obtained from DB
    reportData: any[];                  // Array (json) of data rows

}