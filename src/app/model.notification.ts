// Schema for the Notification (message layout) class

// Eazl
export class EazlNotification {
    id: number;
    author: string;
    date_send: string;
    message_type: string;
    message: string;
}

// Canvas
export class Notification {
    notificationID: number;
    author: string;
    dateSend: string;
    messageType: string;
    message: string;
}