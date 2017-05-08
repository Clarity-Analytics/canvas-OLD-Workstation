// Schema for WidgetTemplates
export class WidgetTemplate {
    widgetTemplateID: number;                   // Unique DB ID
    widgetTemplateName: string;                 // Name
    widgetTemplateDescription: string;          // Description
    vegaParameters: {                           // Set of parameters used in Vega spec            
        vegaGraphHeight: number;                    // Height of graph
        vegaGraphWidth: number;                     // Width of graph
        vegaGraphPadding: number;                   // Padding around graph
        vegaHasSignals: boolean;                // True/False to include Signals section
        vegaXcolumn: string;                    // Column (field) used as X
        vegaYcolumn: string;                    // Column (field) used as Y
        vegaFillColor: string;                  // Fill color of mark (of ie bars)
        vegaHoverColor: string;                 // Color of mark when hovers over it
    } 
    vegaSpec: any;                              // Vega spec (layout varies)
}
