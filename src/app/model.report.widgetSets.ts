// Schema for the Report WidgetSet class

// Eazl


// Canvas
export class ReportWidgetSet {
    reportID: number;                       // FK to model.report
    widgetSetID: number;                    // Unique DB ID
    widgetSetName: string;                  // Name
    widgetSetDescription: string;           // Description
    vegaSpec: any;                          // Vega spec (layout varies)
}