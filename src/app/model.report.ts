// Schema for the Report class

// Eazl


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