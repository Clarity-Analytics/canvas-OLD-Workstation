// Schema for the recipients of Canvas Messages

export class EazlCanvasMessageRecipient {
    message_id: number;                         // Unique DB id
    recipient_username: string;                 // UserID to whom msg was sent (groups are collapsed)
    recipient_status: string;                   // UnRead, Read - maybe more later
    read_datetime: string;                      // DateTime when msg was Read
}

export class CanvasMessageRecipient {
    messageID: number;                          // Unique DB id
    canvasMessageID: number;                    // Canvas Message id
    messageRecipientUserID: string;             // UserID to whom msg was sent (groups are collapsed when sent)
    messageRecipientStatus: string;             // UnRead, Read - maybe more later
    messageReadDateTime: string;                // DateTime when msg was Read
}
