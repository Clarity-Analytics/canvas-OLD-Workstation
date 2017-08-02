// Service to interact with a Web Socket

import { Injectable }                 from '@angular/core';
import { Observable }                 from 'rxjs/Observable';
import { ReplaySubject }              from 'rxjs/ReplaySubject';
import { WebSocketSubject }           from 'rxjs/observable/dom/WebSocketSubject';

// Our Models
import { Token }                      from './model.token';
import { WebSocketSystemMessage }     from './model.notification';

import * as Rx from 'rxjs/Rx';


@Injectable()
export class ReconnectingWebSocket {
	baseUri: string = `${window.location.protocol === 
        'http:' ? 'ws:': 'wss:'}//${window.location.hostname}:8000/sockets/`;
	webSocketSystemMessage: ReplaySubject<WebSocketSystemMessage> = new ReplaySubject(1);
        // System msg to sent via WS
	socket: WebSocketSubject<any>;

	constructor() { }

	connect(authToken: Token) {

	    this.socket = Observable.webSocket(`${this.baseUri}?token=${authToken.token}`);
		this.socket.subscribe(
            (
                message: WebSocketSystemMessage) => { 
                    this.webSocketSystemMessage.next(message); 
                } 
            )
		this.socket.next('ping');

	}
}

// TODO - physically delete this one: it give a weird Zone runtime error if I delete it !!
export class WebSocketServiceX {
    private subject: Rx.Subject<MessageEvent>;
    
    constructor() { }

    public connectX(url): Rx.Subject<MessageEvent> {
        // if(!this.subject) {
        //     this.subject = this.createX(url);
        //     console.log("Successfully connected: " + url);
        // }

        return this.subject;
    }

    private createX(url): Rx.Subject<MessageEvent> {
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

