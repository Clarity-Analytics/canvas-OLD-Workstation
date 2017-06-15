export class SocketMessage {
	message_type: string;
}


class ChatMessage {
	sender: string;
	receiver: string;
	timestamp: Date;
	message: string
}