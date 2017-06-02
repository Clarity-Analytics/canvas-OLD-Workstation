import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BaseHttpService } from './base-http.service';

import { Token, AuthenticationError } from '../_models';

@Injectable()
export class AuthenticationService extends BaseHttpService {

  constructor(private http: Http) { super() }

	authenticate(username: string, password: string) {
		let route = this.prepareRoute('auth-token');
		let data = JSON.stringify({"username": username, "password": password})
		
		this.http.post(route, data, this.options)
		    .map(this.parseResponse)
		    .catch(this.handleError)
		    .subscribe(
		    	(authToken: Token) => {

		    	},
		    	(error: AuthenticationError) => {
		    		alert(error.non_field_errors)
		    	}
		    )
	}

	setAuthToken(authToken: Token): Token {
		this.storage.setItem('canvas-token', authToken.token);

		return authToken;
	}

	clearAuthToken() {
		this.storage.removeItem('canvas-token');
	}

	// Over-ride because auth is not standard issue
	parseResponse(response: Response) {	
		return this.setAuthToken(response.json());
	}

}
