// Schema for the CanvasMessage class, used in collaboration

// Eazl
export class EazlCanvasMessage {
    id: number;                                     // Unique DB id
    conversation_id: number;                        // Conversation thread that joins msgs
    sender_username: string;                        // Created by
    sent_datetime: string;                          // Created on
    issystem_generated: boolean;                    // True if a system message, not created by User
    dashboard_id: number;                           // Optional Dashboard to which msg is linked, -1 = none
    report_id: number;                              // Optional Report to which msg is linked, -1 = none
    widget_id: number;                              // Optional Widget to which msg is linked, -1 = none
    subject: string;                                // Message Subject
    body: string;                                   // Message Body text
    sent_to_me: boolean;                            // True if this msg was sent to me, calced at Runtime
    my_status: string;                              // Read, UnRead by me, calced at Runtime

}

// Canvas
export class CanvasMessage {
    canvasMessageID: number;                        // Unique DB id
    canvasMessageConversationID: number;            // Conversation thread that joins msgs
    canvasMessageSenderUserName: string;            // Created by
    canvasMessageSentDateTime: string;              // Created on
    canvasMessageIsSystemGenerated: boolean;        // True if a system message, not created by User
    canvasMessageDashboardID: number;               // Optional Dashboard to which msg is linked, -1 = none
    canvasMessageReportID: number;                  // Optional Report to which msg is linked, -1 = none
    canvasMessageWidgetID: number;                  // Optional Widget to which msg is linked, -1 = none
    canvasMessageSubject: string;                   // Message Subject
    canvasMessageBody: string;                      // Message Body text
    canvasMessageSentToMe: boolean;                 // True if this msg was sent to me, calced at Runtime
    canvasMessageMyStatus: string;                  // Read, UnRead by me, calced at Runtime
    canvasMessageRecipients: [                      // Aray of users to whom msg were sent
        {
            canvasMessageRecipientUserName: string; // UserName to whom msg was sent (groups are collapsed)
            canvasMessageRecipientStatus: string;   // UnRead, Read - maybe more later
            canvasMessageReadDateTime: string;      // DateTime when msg was Read
        }
    ];
}

