import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { Observable } from 'rxjs/Observable';
import { BaseHttpService } from './base-http.service';

@Injectable()
export class ReconnectingWebSocket {
	baseUri: string = `${window.location.protocol === 'http:' ? 'ws:': 'wss:'}//${window.location.hostname}:8000/sockets/`;
	socket: WebSocketSubject<any>;

	constructor() {
		let token = localStorage.getItem('canvas-token');
		
	    this.socket = Observable.webSocket(`${this.baseUri}?token=${token}`);
		this.socket.next('ping');
	}
}