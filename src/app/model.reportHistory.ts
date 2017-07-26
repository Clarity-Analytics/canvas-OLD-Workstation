// Schema for the Report History (ran by users) class

// Eazl
export class EazlReportHistory {
    id: number;                                 // Unique ID
    username: string;                           // User who ran report
    model_name: string;                         // Model linked to: package, query
    object_id: number;                          // Id of model-object 
    checksum: string;                           // Checksum to make name & parameters unique
    date_created: string;                       // Start DateTime
    run_time: number;                           // End DateTime
    state: string;                              // Result status: Failed, Success
    nr_rows_returned: number;                   // Nr row returned
}

            // '',
            // 'state',
            // 'row_count',
            // 'error',
            // 'date_created',
            // 'url')
// NO comments

// Canvas
export class ReportHistory {
    reportHistoryID: number;                    // Unique ID
    userName: string;                           // User who ran report
    reportID: number;                           // Report ID
    datasourceID: number;                       // Underlying Datasource for the report
    checksum: string;                           // Checksum to make name & parameters unique    
    reportHistoryStartDateTime: string;         // Start DateTime
    reportHistoryEndDateTime: string;           // End DateTime
    reportHistoryStatus: string;                // Result status: Failed, Success
    reportHistoryNrRowsReturned: number;        // Nr row returned
}