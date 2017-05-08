// Schema for Widget object

export class Widget {
    // Widget layout - all dimensions in px EXCEPT font-size in em
    container: {
        backgroundColor: string;
        border: string;
        boxShadow: string;
        color: string;
        fontSize: number;
        height: number;
        left: number;
        widgetTitle: string;                          // Title at top of container
        top: number;
        width: number;
    };
    graph: {
        graphID: number;
        spec: any; 
    };
    properties: {
        widgetID: number;                       // Unique ID from DB
        dashboardID: number;                    // FK to DashboardID to which widget belongs
        widgetTabID: number;                    // FK to Tab where the widget lives
        widgetTabName: string;                  // FK to Tab Name where widget lives
        widgetCode: string;                     // Short Code ~ ShortName
        widgetName: string;                     // Descriptive Name
        widgetAddRestRow: boolean;              // True means add a row to  = SUM(rest)
        widgetCreatedDateTime: string;          // Created on
        widgetCreatedUserID: string;            // Created by
        widgetComments: string;                 // Optional comments
        widgetDefaultExportFileType: string;    // User can select others at export time
        widgetDescription: string;              // User description
        widgetIndex: number;                    // Sequence number on dashboard
        widgetIsLocked: boolean;                // Protected against changes
        widgetHyperLinkTabNr: string;           // Optional Tab Nr to jump to
        widgetHyperLinkWidgetID: string;        // Optional Widget ID to jump to
        widgetIsLiked: boolean;                 // True if Widget is liked by me
        widgetLiked: [                          // Array of UserIDs that likes this Widget
            {
                widgetLikedUserID: string; 
            }
        ];
        widgetPassword: string;                 // Optional password
        widgetRefreshedDateTime: string;        // Data Refreshed on
        widgetRefreshedUserID: string;          // Date Refreshed by
        widgetRefreshFrequency: number;         // Nr of seconds if RefreshMode = Repeatedly
        widgetRefreshMode: string;              // Manual, OnOpen, Repeatedly
        widgetReportID: number;                 // FK to report (query / data)
        widgetReportName: string;               // Report (query) name in Eazl (DS implied)
        widgetReportParameters: string;         // Optional Report parameters
        widgetShowLimitedRows: number;          // 0 = show all, 5 = TOP 5, -3 = BOTTOM 3
        widgetSize: string;                     // Small, Medium, Large
        widgetSystemMessage: string;            // Optional for Canvas to say something to user
        widgetTypeID: number;                   // Widget Type ID (for Bar, Pie, etc)
        widgetType: string;                     // Bar, Pie, Text, etc - must correspond to coding
        widgetUpdatedDateTime: string;          // Updated on
        widgetUpdatedUserID: string;            // Updated by
    };
}
