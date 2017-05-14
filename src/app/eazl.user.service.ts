import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable }  from 'rxjs/Observable';
import { BehaviorSubject }  from 'rxjs/BehaviorSubject';

import { EazlService } from './eazl.service';
import { Model, ModelFactory } from './models/generic.model';
import { User } from './models/model.user';
import { Token } from './models/model.token';


@Injectable()
export class EazlUserService {
	user: Model<User>;
	authToken: Model<Token>;

	constructor(
		private eazl: EazlService,
		private userFactory: ModelFactory<User>,
		private tokenFactory: ModelFactory<Token>) 
	{
		this.user = this.userFactory.create(null);
		this.authToken = this.tokenFactory.create({token: window.sessionStorage.getItem('canvas-token')});
	}

	get hasAuthToken(): boolean {
		return this.authToken.getValue() != null;
	}

	clearAuthToken() {
		window.sessionStorage.removeItem('canvas-token');

		this.authToken.setValue(null);
	}

	setAuthToken(username: string, password: string) {
		this.eazl.post<Token>('auth-token', {username: username, password: password}).subscribe(
		    authToken => {
		        window.sessionStorage.setItem('canvas-token', authToken.token);
		        
		        this.authToken.setValue(authToken);
		        this.eazl.setAuthToken(authToken.token);
		        this.setUserDetails();
		    },
		    error => {
		        this.clearAuthToken();
		        console.log(JSON.parse(error));
		    }
		);
	}

	setUserDetails() {
		this.eazl.get<User>('users/authenticated-user').subscribe(
			user => {
				this.user.setValue(user);
			},
			error => {
				this.clearAuthToken();
				console.log(JSON.parse(error));
			}
		);
	}
}