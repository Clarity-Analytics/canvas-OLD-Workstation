// User class
import { Http } 					  from '@angular/http';
import { Injectable } 				  from '@angular/core';
import { Observable }  				  from 'rxjs/Observable';

// Our Services
import { EazlService } 				  from './eazl.service';
import { EazlUser } 				  from './model.user';
import { GlobalFunctionService }      from './global-function.service';
import { Model} 					  from './model.generic';
import { ModelFactory } 			  from './model.generic';
import { Token } 					  from './model.token';

@Injectable()
export class EazlUserService {
	eazlUser: Model<EazlUser>;
	authToken: Model<Token>;

	constructor(
		private eazl: EazlService,
        private globalFunctionService: GlobalFunctionService,
		private tokenFactory: ModelFactory<Token>,
		private userFactory: ModelFactory<EazlUser>,
		) 
	{
		this.eazlUser = this.userFactory.create(null);
		this.authToken = this.tokenFactory.create({token: window.sessionStorage.getItem('canvas-token')});
	}

	setAuthToken(username: string, password: string) {
        // Set AuthToken
        this.globalFunctionService.printToConsole(this.constructor.name,'setAuthToken', '@Start');

		this.eazl.post<Token>('auth-token', {username: username, password: password}).subscribe(
		    authToken => {
		        window.sessionStorage.setItem('canvas-token', authToken.token);
this.globalFunctionService.printToConsole(this.constructor.name,'setAuthToken', 'post Token worked');
		        
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
        // Set details for current user
        this.globalFunctionService.printToConsole(this.constructor.name,'setUserDetails', '@Start');

let getWorked: boolean = false;
		this.eazl.get<EazlUser>('users/authenticated-user').subscribe(
			user => {
				console.log(user);
getWorked = true;
				this.eazlUser.setValue(user);
			},
			error => {
				console.log(error);
				console.log('We caught the error!');
			}
		);

this.globalFunctionService.printToConsole(this.constructor.name,'setUserDetails', '@end ' + getWorked.toString());
	}
} 