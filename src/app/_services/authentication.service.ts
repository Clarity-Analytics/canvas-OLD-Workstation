import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BaseHttpService } from './base-http.service';
import { Observable } from 'rxjs/Observable';

import { ReconnectingWebSocket } from './websocket.service';
import { Token, AuthenticationError } from '../_models';


@Injectable()
export class AuthenticationService extends BaseHttpService {

  constructor(private http: Http) { super() }

	login(username: string, password: string): Observable<Token> {
		let route = this.prepareRoute('auth-token');
		let data = JSON.stringify({"username": username, "password": password})
		
		return this.http.post(route, data, this.options)
		    .map(this.parseResponse.bind(this))
		    .catch(this.handleError)
	}

	clearAuthToken() {
		this.storage.removeItem('canvas-token');
	}

	setAuthToken(authToken: Token) {
		this.storage.setItem('canvas-token', authToken.token);
	}

	parseResponse(response: Response) {
		let authToken: Token = super.parseResponse(response);
		this.setAuthToken(authToken);
		return authToken
	}
}
