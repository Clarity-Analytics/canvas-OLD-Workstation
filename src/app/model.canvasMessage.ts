// Schema for the CanvasMessage class

// DB
export class EazlCanvasMessage {
    conversation_id: number;                    // Conversation thread that joins msgs
    id: number;                                 // Unique DB id
    sender_username: string;                    // Created by
    sent_datetime: string;                      // Created on
    issystem_generated: boolean;                // True if a system message, not created by User
    dashboard_id: number;                       // Optional Dashboard to which msg is linked, -1 = none
    report_id: number;                          // Optional Report to which msg is linked, -1 = none
    widget_id: number;                          // Optional Widget to which msg is linked, -1 = none
    subject: string;                            // Message Subject
    body: string;                               // Message Body text
    sent_to_me: boolean;                        // True if this msg was sent to me, calced at Runtime
    my_status: string;                          // Read, UnRead by me, calced at Runtime
    Recipients: [                               // Aray of users to whom msg were sent
        {
            messageRecipientUserID: string;         // UserID to whom msg was sent (groups are collapsed)
            messageRecipientStatus: string;         // UnRead, Read - maybe more later
            messageReadDateTime: string;            // DateTime when msg was Read
        }
    ];
}

// Canvas
export class CanvasMessage {
    messageConversationID: number;              // Conversation thread that joins msgs
    messageID: number;                          // Unique DB id
    messageSenderUserID: string;                // Created by
    messageSentDateTime: string;                // Created on
    messageIsSystemGenerated: boolean;          // True if a system message, not created by User
    messageDashboardID: number;                 // Optional Dashboard to which msg is linked, -1 = none
    messageReportID: number;                    // Optional Report to which msg is linked, -1 = none
    messageWidgetID: number;                    // Optional Widget to which msg is linked, -1 = none
    messageSubject: string;                     // Message Subject
    messageBody: string;                        // Message Body text
    messageSentToMe: boolean;                   // True if this msg was sent to me, calced at Runtime
    messageMyStatus: string;                    // Read, UnRead by me, calced at Runtime
    messageRecipients: [                        // Aray of users to whom msg were sent
        {
            messageRecipientUserID: string;     // UserID to whom msg was sent (groups are collapsed)
            messageRecipientStatus: string;     // UnRead, Read - maybe more later
            messageReadDateTime: string;        // DateTime when msg was Read
        }
    ];
}
