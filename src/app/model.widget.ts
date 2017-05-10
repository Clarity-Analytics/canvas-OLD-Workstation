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
    areas: {
        showWidgetText: boolean;
        showWidgetGraph: boolean;
        showWidgetTable: boolean;
        showWidgetImage: boolean;
    };
    textual: {
        textText: string;                       // with HTML & keywords (##today##)
        textBackgroundColor: string; 
        textBorder: string;          
        textColor: string;          
        textFontSize: number;                   // in px
        textFontWeight: string;      
        textHeight: number;                     // in px
        textLeft: number;                       // in px
        textMargin: string,               
        textPadding: string;                 
        textPosition: string;        
        textTextAlign: string;       
        textTop: number;                        // in px
        textWidth: number;                      // in px: 0 means it adapts to container
    };
    graph: {
        graphID: number;
        graphLeft: number;                      // in px
        graphTop: number;                       // in px
        vegaParameters: {                           
            vegaGraphHeight: number;
            vegaGraphWidth: number;
            vegaGraphPadding: number;
            vegaHasSignals: boolean;
            vegaXcolumn: string;
            vegaYcolumn: string;
            vegaFillColor: string;
            vegaHoverColor: string;
        },
        spec: any; 
    }; 
    table:{
        tableColor: string;                     // Text color
        tableCols: number;                      // Nr of cols
        tableHeight: number;                    // in px
        tableHideHeader: boolean;
        tableLeft: number;                      // in px
        tableRows: number;                      // Nr of rows
        tableTop: number;                       // in px
        tableWidth: number;                     // in px
    };
    image: {
        imageAlt: string;                       // alt in img tag
        imageHeigt: number;                     // in px
        imageLeft: number;                      // in px
        imageSource: string;                    // Path (folder + filename) <img src="pic_mountain.jpg" alt="Mountain View" style="width:304px;height:228px;">
        imageTop: number;                       // in px
        imageWidth: number;                     // in px
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
