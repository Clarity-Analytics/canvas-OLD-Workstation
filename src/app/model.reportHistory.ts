// Schema for the Report History (ran by users) class

// Eazl


// Canvas
export class ReportHistory {
    reportHistoryID: number;                    // Unique ID
    username: string;                           // User who ran report
    reportID: number;                           // Report ID
    datasourceID: number;                       // Underlying Datasource for the report
    reportHistoryStartDateTime: string;         // Start DateTime
    reportHistoryEndDateTime: string;           // End DateTime
    reportHistoryStatus: string;                // Result status: Failed, Success
    reportHistoryNrRowsReturned: number;        // Nr row returned
    reportHistoryComments: string;              // Optional Comments
}