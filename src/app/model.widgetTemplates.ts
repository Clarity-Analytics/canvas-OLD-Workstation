// Schema for the WidgetTemplates class

// Eazl
export class EazlWidgetTemplate {
    id: number;                                 // Unique DB ID
    name: string;                               // Name
    description: string;                        // Description
    vega_chart_height: number;  // Height of graph
    vega_chart_width: number;   // Width of graph
    vega_chart_padding: number; // Padding around graph
    vega_chart_has_signals: boolean;  // True/False to include Signals section
    vega_chart_x_column: string;       // Column (field) used as X
    vega_chart_y_column: string;       // Column (field) used as Y
    vega_chart_fill_color: string;    // Fill color of mark (of ie bars)
    vega_chart_hover_color: string;   // Color of mark when hovers over it
    vega_chart_specification: any;                             // Vega spec (layout varies)
    creator: string;                         // Created by
    date_created: string;                         // Created on
    editor: string;                         // Updated by
    date_edited: string;                         // Updated on
    url: string;                            // URL for record, in Django
}

// Canvas
export class WidgetTemplate {
    widgetTemplateID: number;                   // Unique DB ID
    widgetTemplateName: string;                 // Name
    widgetTemplateDescription: string;          // Description
    vegaParameters: {                           // Set of parameters used in Vega spec            
        vegaGraphHeight: number;                // Height of graph
        vegaGraphWidth: number;                 // Width of graph
        vegaGraphPadding: number;               // Padding around graph
        vegaHasSignals: boolean;                // True/False to include Signals section
        vegaXcolumn: string;                    // Column (field) used as X
        vegaYcolumn: string;                    // Column (field) used as Y
        vegaFillColor: string;                  // Fill color of mark (of ie bars)
        vegaHoverColor: string;                 // Color of mark when hovers over it
    } 
    vegaSpec: any;                              // Vega spec (layout varies)
    widgetTemplateCreatedDateTime: string;      // Created on
    widgetTemplateCreatedUserName: string;      // Created by
    widgetTemplateUpdatedDateTime: string;      // Updated on
    widgetTemplateUpdatedUserName: string;      // Updated by
}
