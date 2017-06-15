import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BaseHttpService } from './base-http.service';
import { SocketMessage } from '../_models/model.socket.message';
import { Token } from '../_models/model.token';

@Injectable()
export class ReconnectingWebSocket {
	baseUri: string = `${window.location.protocol === 'http:' ? 'ws:': 'wss:'}//${window.location.hostname}:8000/sockets/`;
	message: ReplaySubject<SocketMessage> = new ReplaySubject(1);
	socket: WebSocketSubject<any>;

	constructor() { }

	connect(authToken: Token) {
	    this.socket = Observable.webSocket(`${this.baseUri}?token=${authToken.token}`);
		this.socket.subscribe((message: SocketMessage) => { this.message.next(message); } )
		this.socket.next('ping');
	}
}