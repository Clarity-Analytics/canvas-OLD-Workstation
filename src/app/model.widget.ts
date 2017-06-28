// Schema for the Widget class

// Eazl
export class EazlWidget {
 
    container_background_color: string;
    container_border: string;
    container_box_shadow: string;
    container_color: string;
    container_font_size: number;
    container_height: number;
    container_left: number;
    container_widget_title: string;                   // Title at top of container
    container_top: number;
    container_width: number;

    areas_show_widget_text: boolean;
    areas_show_widget_graph: boolean;
    areas_show_widget_table: boolean;
    areas_show_widget_image: boolean;

    textual_text_text: string;                      // with HTML & keywords (##today##)
    textual_text_backgroundColor: string; 
    textual_text_border: string;          
    textual_text_color: string;          
    textual_text_fontSize: number;                  // in px
    textual_text_fontWeight: string;      
    textual_text_height: number;                    // in px
    textual_text_left: number;                      // in px
    textual_text_margin: string;               
    textual_text_padding: string;                 
    textual_text_position: string;        
    textual_text_textAlign: string;       
    textual_text_top: number;                       // in px
    textual_text_width: number;                     // in px: 0 means it adapts to container

    graph_graph_id: number;
    graph_graph_left: number;                     // in px
    graph_graph_top: number;                      // in px
    graph_vega_parameters_vega_graphHeight: number;
    graph_vega_parameters_vega_graphWidth: number;
    graph_vega_parameters_vega_graphPadding: number;
    graph_vega_parameters_vega_hasSignals: boolean;
    graph_vega_parameters_vega_xcolumn: string;
    graph_vega_parameters_vega_ycolumn: string;
    graph_vega_parameters_vega_fillColor: string;
    graph_vega_parameters_vega_hoverColor: string;
    graph_spec: any; 

    table_color: string;                    // Text color
    table_cols: number;                     // Nr of cols, 0 means all
    table_height: number;                   // in px, cuts of rest if bigger than this
    table_hideHeader: boolean;
    table_left: number;                     // in px
    table_rows: number;                     // Nr of rows in the data, excluding header: 0 means all
    table_top: number;                      // in px
    table_width: number;                    // in px, cuts of rest if bigger than this

    image_alt: string;                      // alt in img tag
    image_heigt: number;                    // in px
    image_left: number;                     // in px
    image_source: string;                   // Path (folder + filename) <img src="pic_mountain.jpg" alt="Mountain View" style="width:304px;height:228px;">
    image_top: number;                      // in px
    image_width: number;                    // in px

    properties_widget_id: number;                      // Unique ID from DB
    properties_dashboard_id: number;                   // FK to DashboardID to which widget belongs
    properties_dashboard_tab_id: number;               // FK to Tab where the widget lives
    properties_dashboard_tab_name: string;             // FK to Tab Name where widget lives
    properties_widget_code: string;                    // Short Code ~ ShortName
    properties_widget_name: string;                    // Descriptive Name
    properties_widget_description: string;             // User description
    properties_widget_default_export_filetype: string; // User can select others at export time
    properties_widget_hyperlink_tab_nr: string;        // Optional Tab Nr to jump to
    properties_widget_hyperlinkWidget_id: string;      // Optional Widget ID to jump to
    properties_widget_refresh_mode: string;            // Manual, OnOpen, Repeatedly
    properties_widget_refresh_frequency: number;       // Nr of seconds if RefreshMode = Repeatedly
    properties_widget_password: string;                // Optional password
    properties_widget_is_liked: boolean;               // @RunTime: True if Widget is liked by me

    properties_widget_report_id: number;               // FK to report (query / data).  -1: dont load any report data
    properties_widget_report_name: string;             // Report (query) name in Eazl (DS implied)
    properties_widget_report_parameters: string;       // Optional Report parameters
    properties_widget_show_limited_rows: number;       // 0 = show all, 5 = TOP 5, -3 = BOTTOM 3
    properties_widget_add_rest_row: boolean;           // True means add a row to  = SUM(rest)
    properties_widget_type: string;                    // Bar, Pie, Text, etc - must correspond to coding
    properties_widget_comments: string;                // Optional comments
    properties_widget_index: number;                   // Sequence number on dashboard
    properties_widget_is_locked: boolean;              // Protected against changes
    properties_widget_size: string;                    // Small, Medium, Large
    properties_widget_system_message: string;          // Optional for Canvas to say something to user
    properties_widget_type_id: number;                 // Widget Type ID (for Bar, Pie, etc)
    properties_widget_refreshed_on: string;            // Data Refreshed on
    properties_widget_refreshed_by: string;            // Date Refreshed by
    properties_widget_Created_on: string;              // Created on
    properties_widget_Created_by: string;              // Created by
    properties_widget_updated_on: string;              // Updated on
    properties_widget_updated_by: string;              // Updated by
};

// Canvas
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
        widgetTitle: string;                    // Title at top of container
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
        textFontSize: number;                   // in em (NB)
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
        tableCols: number;                      // Nr of cols, 0 means all
        tableHeight: number;                    // in px, cuts of rest if bigger than this
        tableHideHeader: boolean;
        tableLeft: number;                      // in px
        tableRows: number;                      // Nr of rows in the data, excluding header: 0 means all
        tableTop: number;                       // in px
        tableWidth: number;                     // in px, cuts of rest if bigger than this
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
        dashboardTabID: number;                 // FK to Tab where the widget lives
        dashboardTabName: string;               // FK to Tab Name where widget lives
        widgetCode: string;                     // Short Code ~ ShortName
        widgetName: string;                     // Descriptive Name
        widgetDescription: string;              // User description
        widgetDefaultExportFileType: string;    // User can select others at export time
        widgetHyperLinkTabNr: string;           // Optional Tab Nr to jump to
        widgetHyperLinkWidgetID: string;        // Optional Widget ID to jump to
        widgetRefreshMode: string;              // Manual, OnOpen, Repeatedly
        widgetRefreshFrequency: number;         // Nr of seconds if RefreshMode = Repeatedly
        widgetPassword: string;                 // Optional password
        widgetIsLiked: boolean;                 // @RunTime: True if Widget is liked by me
        widgetLiked: [                          // Array of UserNames that likes this Widget
            {
                widgetLikedUserName: string;    // UserName that likes this widget
            }
        ];
        widgetReportID: number;                 // FK to report (query / data).  -1: dont load any report data
        widgetReportName: string;               // Report (query) name in Eazl (DS implied)
        widgetReportParameters: string;         // Optional Report parameters
        widgetShowLimitedRows: number;          // 0 = show all, 5 = TOP 5, -3 = BOTTOM 3
        widgetAddRestRow: boolean;              // True means add a row to  = SUM(rest)
        widgetType: string;                     // Bar, Pie, Text, etc - must correspond to coding
        widgetComments: string;                 // Optional comments
        widgetIndex: number;                    // Sequence number on dashboard
        widgetIsLocked: boolean;                // Protected against changes
        widgetSize: string;                     // Small, Medium, Large
        widgetSystemMessage: string;            // Optional for Canvas to say something to user
        widgetTypeID: number;                   // Widget Type ID (for Bar, Pie, etc)
        widgetRefreshedDateTime: string;        // Data Refreshed on
        widgetRefreshedUserName: string;        // Date Refreshed by
        widgetCreatedDateTime: string;          // Created on
        widgetCreatedUserName: string;          // Created by
        widgetUpdatedDateTime: string;          // Updated on
        widgetUpdatedUserName: string;          // Updated by
    };
}
