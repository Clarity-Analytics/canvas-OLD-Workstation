// Schema for Report History (ran by users)
export class ReportHistory {
    reportHistoryID: number;                    // Unique ID
    userName: string;                           // User who ran report
    reportID: number;                           // Report ID
    reportHistoryStartDateTime: string;         // Start DateTime
    reportHistoryEndDateTime: string;           // End DateTime
    reportHistoryStatus: string;                // Result status: Failed, Success
    reportHistoryNrRowsReturned: number;        // Nr row returned
    reportHistoryComments: string;              // Optional Comments
}