// Schema for the Notification (message layout) class

// Basic message
export class WebSocketBasicMessage {
	webSocketDatetime: Date;			// DateTime when the WS server sent the message
	webSocketSenderUsername: string;	// Sender / originator of the message
	webSocketMessageType: string;		// Type that determines the body content:
										// - WebSocketCanvasMessage
										// - WebSocketSystemMessage
										// - WebSocketCeleryMessage
										// - WebSocketRefDataMessage
	webSocketMessageBody: any;			// Detail, as per message type
}

// Reference Data message format
export class WebSocketRefDataMessage {
	webSocketDatetime: Date;				// DateTime when the WS server sent the message
	webSocketSenderUsername: string;		// Sender / originator of the message
	webSocketMessageType: string;			// = WebSocketRefDataMessage
	webSocketMessageBody: 					// Note: one message per table or record
		{
			webSocketTableName: string;		// Table that was amended
			webSocketAction: string;		// What was done at one of two levels:
											// - table level: Refreshed, Created, Removed
											// - record level: Add, Delete, Update
			webSocketRecordID: number;		// Optional record ID of a single change, ie Delete
			webSocketMessage: string;		// Optional message
		}
}

// System message format
export class WebSocketSystemMessage {
	webSocketDatetime: Date;				// DateTime when the WS server sent the message
	webSocketSenderUsername: string;		// Sender / originator of the message
	webSocketMessageType: string;			// = WebSocketSystemMessage
	webSocketMessageBody:
		{
			webSocketMessage: string;		// Message from the system; ie Please log off system
		}
}

// CanvasMessage, for collaboration and notification
export class WebSocketCanvasMessage {
	webSocketDatetime: Date;				// DateTime when the WS server sent the message
	webSocketSenderUsername: string;		// Sender / originator of the message
	webSocketMessageType: string;			// = WebSocketCanvasMessage
	webSocketMessageBody:
		{
			webSocketRecipients: string;	// CSV list of recipients
			webSocketDashboardID: number;	// Optional Dashboard that was referenced
			webSocketWidgetID: number;		// Optional Widget that was referenced
			webSocketReportID: number;		// Optional Report that was referenced
			webSocketSubject: string;		// Subject of the message / notification
			webSocketBody: string;			// Message body
			webSocketMessage: string;		// Optional message
		}
}

// Celery Message format, for completed results
export class WebSocketCeleryMessage {
	webSocketDatetime: Date;				// DateTime when the WS server sent the message
	webSocketSenderUsername: string;		// Sender / originator of the message
	webSocketMessageType: string;			// = WebSocketCeleryMessage
	webSocketMessageBody:
		{
			webSocketReportID: number;		// Report that was requested
			webSocketCeleryTaskID: number;	// ID in Celery
			webSocketStatus: string;		// How task completed: Passed, Failed
			webSocketSample: any;			// Few sample recrods, in Json
		}
}
