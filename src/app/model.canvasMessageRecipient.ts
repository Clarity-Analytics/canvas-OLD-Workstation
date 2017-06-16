// Schema for the Canvas Message Recipient class

// Eazl
export class EazlCanvasMessageRecipient {
    id: number;                                 // Unique DB id
    message_id: number;                         // Canvas Message id
    username: string;                           // FK: UserID to whom msg was sent (groups are collapsed)
    recipient_status: string;                   // UnRead, Read - maybe more later
    read_datetime: string;                      // DateTime when msg was Read
}

// Canvas 
export class CanvasMessageRecipient {
    canvasMessageRecipientID: number;           // Unique DB id
    canvasMessageID: number;                    // FK: Canvas Message id
    username: string;                           // FK: UserID to whom msg was sent (groups are collapsed when sent)
    canvasMessageRecipientStatus: string;       // UnRead, Read - maybe more later
    canvasMessageReadDateTime: string;          // DateTime when msg was Read
}
