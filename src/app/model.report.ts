// Schema for Report
export class Report {
    repordID: number;                   // Unique DB ID
    reportName: string;                 // Name
    description: string;                // Description
    reportParameters: string;           // Parameters (optional)
    dataSourceID: number;               // FK to DataSource
    dataSourceParameters: string;       // Data Source Parameters
    reportData: any[];                  // Array (json) of data rows
}