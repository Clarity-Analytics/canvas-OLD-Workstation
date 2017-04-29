// Schema for Widget Comment object

export class WidgetComment {
    widgetCommentID: number;                        // Unique DB ID
    widgetID: number;                               // FK to Widget ID 
    widgetCommentThreadID: number;                  // Thread ID (for 1 or more comments)
    widgetCommentCreateDateTime: string;            // Date time of creation
    widgetCommentCreatorUserID: string;             // UserID who created record
    widgetCommentHeading: string;                   // Short message heading
    widgetCommentBody: string;                      // Message body
}
 