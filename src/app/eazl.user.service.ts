import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable }  from 'rxjs/Observable';

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

	setAuthToken(username: string, password: string) {
		this.eazl.post<Token>('auth-token', {username: username, password: password}).subscribe(
		    authToken => {
		        window.sessionStorage.setItem('canvas-token', authToken.token);
		        
		        this.eazl.headers.set('Authorization', `token ${authToken.token}`);
		        this.authToken.setValue(authToken);
		        this.setUserDetails();
		       
		    },
		    error => {
		        console.log(JSON.parse(error));
		    }
		);
	}

	setUserDetails() {
		this.eazl.get<User>('users/authenticated-user').subscribe(
			user => {
				console.log(user);

				this.user.setValue(user);
			},
			error => {
				console.log(error);
				console.log('We caught the error!');
			}
		);
	}
}