import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ReconnectingWebSocket {
	socketUri: string = `${window.location.protocol === 'http:' ? 'ws:': 'wss:'}//${window.location.hostname}:8000/sockets/`;
	socket: Subject<any>;

	constructor() {
    this.socket = Observable.webSocket(`${this.socketUri}`);
    this.socket.next('ping');
	}
}