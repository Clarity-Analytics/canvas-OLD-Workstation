// Schema for the WidgetTemplates class

// Eazl
export class EazlWidgetTemplate {
    id: number;                                 // Unique DB ID
    name: string;                               // Name
    description: string;                        // Description
    vega_parameters_vega_graph_height: number;  // Height of graph
    vega_parameters_vega_graph_width: number;   // Width of graph
    vega_parameters_vega_graph_padding: number; // Padding around graph
    vega_parameters_vega_has_signals: boolean;  // True/False to include Signals section
    vega_parameters_vega_xcolumn: string;       // Column (field) used as X
    vega_parameters_vega_ycolumn: string;       // Column (field) used as Y
    vega_parameters_vega_fill_color: string;    // Fill color of mark (of ie bars)
    vega_parameters_vega_hover_color: string;   // Color of mark when hovers over it
    vega_spec: any;                             // Vega spec (layout varies)
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
}
