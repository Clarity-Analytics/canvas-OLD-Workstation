// Service to interact with a Web Socket

import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { SocketMessage } from './model.websocket';
import { Token } from './model.token';
import * as Rx from 'rxjs/Rx';

@Injectable()
export class WebSocketService {
    private subject: Rx.Subject<MessageEvent>;

    constructor() { }

    public connect(url): Rx.Subject<MessageEvent> {
        if(!this.subject) {
            this.subject = this.create(url);
            console.log("Successfully connected: " + url);
        }

        return this.subject;
    }

    private create(url): Rx.Subject<MessageEvent> {
        let ws = new WebSocket(url);

        let observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
            ws.onmessage = obs.next.bind(obs);
            ws.onerror = obs.error.bind(obs);
            ws.onclose = obs.complete.bind(obs);

            return ws.close.bind(ws);
        });

        let observer = {
            next: (data: Object) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            },
        };

        return Rx.Subject.create(observer, observable);
    }
}

@Injectable()
export class ReconnectingWebSocket {
	baseUri: string = `${window.location.protocol === 
        'http:' ? 'ws:': 'wss:'}//${window.location.hostname}:8000/sockets/`;
	messageWS: ReplaySubject<SocketMessage> = new ReplaySubject(1);
	socket: WebSocketSubject<any>;

	constructor() { }

	connect(authToken: Token) {
	    this.socket = Observable.webSocket(`${this.baseUri}?token=${authToken.token}`);
		this.socket.subscribe((message: SocketMessage) => { this.messageWS.next(message); } )
		this.socket.next('ping');
	}
}