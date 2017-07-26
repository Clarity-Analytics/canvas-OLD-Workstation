// Schema for the Report History (ran by users) class

// Eazl
export class EazlReportHistory {
    id: number;                                 // Unique ID
    username: string;                           // User who ran report
    model_name: string;                         // Model linked to: package, query
    object_id: number;                          // Id of model-object 
    // report_id: number;                          // Report ID
    // datasource_id: number;                      // Underlying Datasource for the report
    start_on: string;                           // Start DateTime
    end_on: string;                             // End DateTime
    status: string;                             // Result status: Failed, Success
    nr_rows_returned: number;                   // Nr row returned
}

            // 'id',
            // 'username',
            // 'checksum',
            // 'run_time',
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
    reportHistoryStartDateTime: string;         // Start DateTime
    reportHistoryEndDateTime: string;           // End DateTime
    reportHistoryStatus: string;                // Result status: Failed, Success
    reportHistoryNrRowsReturned: number;        // Nr row returned
}