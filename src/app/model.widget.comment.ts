// Schema for Widget Comment class

// Eazl
export class EazlWidgetComment {
    id: number;                                     // Unique DB ID
    widget_id: number;                              // FK to Widget ID 
    thread_id: number;                              // Thread ID (for 1 or more comments)
    created_on: string;                             // Date time of creation
    created_by: string;                             // UserID who created record
    heading: string;                                // Short message heading
    body: string;                                   // Message body
}

// Canvas
export class WidgetComment {
    widgetCommentID: number;                        // Unique DB ID
    widgetID: number;                               // FK to Widget ID 
    widgetCommentThreadID: number;                  // Thread ID (for 1 or more comments)
    widgetCommentCreatedDateTime: string;           // Date time of creation
    widgetCommentCreatedUserID: string;             // UserID who created record
    widgetCommentHeading: string;                   // Short message heading
    widgetCommentBody: string;                      // Message body
}
 