// Schema for the CanvasMessage class, used in collaboration

// Eazl
export class EazlCanvasMessage {
    id: number;                                     // Unique DB id
    conversation: number;                           // Conversation thread that joins msgs
    subject: string;                                // Message Subject
    body: string;                                   // Message Body text
    dashboard_id: number;                           // Optional Dashboard to which msg is linked, -1 = none
    package_id: number;                             // Optional Report to which msg is linked, -1 = none
    widget_id: number;                              // Optional Widget to which msg is linked, -1 = none
    recipients: [                                   // Array of recipients
        {
            id: number;
            message: string;                        // url of message
            user: number;                           // url of user
            is_sender: boolean;                     // True if the sender
            status: string;                         // Read /UnRead
            url: string;                            // message receipient url
        }
        ];
    is_system_generated: boolean;                   // True if a system message, not created by User'
    date_created: Date;                             // Sent on
    url: string;                                    // url of the message
}



            // 'id',
            // 'user_id',
            // 'is_sender',
            // 'status',
            // 'url')

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
            canvasMessageRecipientID: number;       // Recipient ID
            canvasMessageRecipientMessageURL: string; // Url for message
            canvasMessageRecipientUserName: number; // UserName to whom msg was sent (groups are collapsed)
            canvasMessageRecipientIsSender: boolean;    // True if this is the sender
            canvasMessageRecipientStatus: string;   // UnRead, Read - maybe more later
            canvasMessageReadDateTime: string;      // DateTime when msg was Read
        }
    ];
}

