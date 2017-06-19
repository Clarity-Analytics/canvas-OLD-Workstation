// Service to listen to a Web Socket
import { Injectable }                 from '@angular/core';
import { Observable }                 from 'rxjs/Rx';
import { Subject }                    from 'rxjs/Rx';
import { WebSocketService }           from './websocket.service';

// Our Models
import { Notification }               from './model.notification';

const CHAT_URL = 'ws://localhost:1337/chat';
// const CHAT_URL = 'ws://localhost:8000/sockets/';

export interface Notification {
    author: string;
    dateSend: string,
    messageType: string,
    message: string;
}

@Injectable()
export class NotificationService {
    public messages: Subject<Notification>;

    constructor(wsService: WebSocketService) {

        this.messages = <Subject<Notification>>wsService
            .connect(CHAT_URL)
            .map((response: MessageEvent): Notification => {
console.log('not', response)                
                let data = JSON.parse(response.data);
                return {
                    notificationID: 0,
                    author: data.author,
                    dateSend: data.dateSend,
                    messageType: data.messageType,
                    message: data.message,
                }
            });

    }
}