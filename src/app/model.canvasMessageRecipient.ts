// Schema for the Canvas Message Recipient class

// Eazl
export class EazlCanvasMessageRecipient {
    id: number;                                 // Unique DB id
    // message_id: number;                      // Canvas Message id
    username: string;                           // FK: UserName to whom msg was sent (groups are collapsed)
    is_sender: boolean;                         // True is this was the sender
    status: string;                             // UnRead, Read - maybe more later
    // read_datetime: string;                   // DateTime when msg was Read
}

// Canvas
export class CanvasMessageRecipient {
    canvasMessageRecipientID: number;           // Unique DB id
    // canvasMessageID: number;                 // FK: Canvas Message id
    userName: string;                           // FK: UserName to whom msg was sent (groups are collapsed when sent)
    canvasMessageRecipientIsSender: boolean;    // True is this user was the sender
    canvasMessageRecipientStatus: string;       // UnRead, Read - maybe more later
    // canvasMessageReadDateTime: string;          // DateTime when msg was Read
}
