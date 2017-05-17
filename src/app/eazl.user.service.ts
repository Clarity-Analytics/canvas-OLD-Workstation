import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable }  from 'rxjs/Observable';
import { BehaviorSubject }  from 'rxjs/BehaviorSubject';
import { EazlService } from './eazl.service';


// Token came along for now.
interface AuthenticationError {
	non_field_errors: string[];
}

export interface Token {
	token: string;
}

export interface User {
    pk: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    is_superuser: boolean;
    is_staff: boolean;
    is_active: boolean;
    date_joined: Date;
    last_login: Date;
}


abstract class BaseEazlService {
	abstract route: string;
	
	constructor() {}

	abstract refresh();
	abstract add(): void;
	abstract update(): void;
	abstract delete(): void;
}


@Injectable()
export class EazlUserService extends BaseEazlService {
	route: string = 'users'; 
	user: BehaviorSubject<User>;
	authToken: BehaviorSubject<Token>;
	authError: BehaviorSubject<AuthenticationError>;
	
	constructor(
		private eazl: EazlService)
	{
		super();

		// Null for now
		var user: User = null;
		var token: Token = null;
		var error: AuthenticationError = null;

		this.user = new BehaviorSubject(user);
		this.authToken = new BehaviorSubject(token);
		this.authError = new BehaviorSubject(error);
	}

	refresh() {
		this.eazl.get<User>(`${this.route}/authenticated-user`).subscribe(
			user => {
				this.user.next(user);
			},
			error => {
				this.clearAuthToken();
				console.log(JSON.parse(error));
			}
		);
	}
    
    add(): void {}
    delete(): void {}
    update(): void {}

	get hasAuthToken(): boolean {
		return this.authToken.getValue() != null;
	}

	clearAuthToken() {
		window.sessionStorage.removeItem('canvas-token');

		this.authToken.next(null);
	}

	authenticate(username: string, password: string): void {
		var error: Observable<AuthenticationError> = null;

		this.eazl.post<Token>('auth-token', {username: username, password: password}).subscribe(
		    authToken => {
		        window.sessionStorage.setItem('canvas-token', authToken.token);
		        
		        this.authToken.next(authToken);
		        this.eazl.setAuthToken(authToken.token);
		        
		        this.refresh();
		    },
		    error => {
		        this.clearAuthToken();
		        this.authError.next(JSON.parse(error));
		    }
		)
	}

}