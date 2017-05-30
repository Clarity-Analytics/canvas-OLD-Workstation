// Schema for the Message class

// Users registered to use the system
export class CanvasMessage {
    messageConversationID: number;                  // Conversation thread that joins msgs
    messageID: number;                              // Unique DB id
    messageSenderUserID: string;                    // Created by
    messageSentDateTime: string;                    // Created on
    messageIsSystemGenerated: boolean;              // True if a system message, not created by User
    messageDashboardID: number;                     // Optional Dashboard to which msg is linked, -1 = none
    messageReportID: number;                        // Optional Report to which msg is linked, -1 = none
    messageWidgetID: number;                        // Optional Widget to which msg is linked, -1 = none
    messageSubject: string;                         // Message Subject
    messageBody: string;                            // Message Body text
    messageSentToMe: boolean;                       // True if this msg was sent to me, calced at Runtime
    messageRecipients: [                            // Aray of users to whom msg were sent
        {
            messageRecipientUserID: string;         // UserID to whom msg was sent (groups are collapsed)
            messageRecipientStatus: string;         // UnRead, Read - maybe more later
            messageReadDateTime: string;            // DateTime when msg was Read
        }
    ];
}
