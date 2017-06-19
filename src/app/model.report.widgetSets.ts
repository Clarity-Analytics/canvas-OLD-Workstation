// Schema for the Report WidgetSet class

// Eazl
export class EazlReportWidgetSet {
    id: number;                             // Unique DB ID
    report_id: number;                      // FK to model.report
    name: string;                           // Name
    description: string;                    // Description
    vega_spec: any;                         // Vega spec (layout varies)
    updated_on: string;
    updated_by: string;
    created_on: string;
    created_by: string;
}

// Canvas
export class ReportWidgetSet {
    widgetSetID: number;                    // Unique DB ID
    reportID: number;                       // FK to model.report
    widgetSetName: string;                  // Name
    widgetSetDescription: string;           // Description
    vegaSpec: any;                          // Vega spec (layout varies)
	reportWidgetSetUpdatedDateTime: string; // Updated on
	reportWidgetSetUpdatedUserName: string; // Updated by    
	reportWidgetSetCreatedDateTime: string; // Created on
	reportWidgetSetCreatedUserName: string; // Created by
}