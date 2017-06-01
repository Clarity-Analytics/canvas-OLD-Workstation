import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable }  from 'rxjs/Observable';
import { BehaviorSubject }  from 'rxjs/BehaviorSubject';
import { EazlService } from './eazl.service';


// Token came along for now.
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
	
	constructor(
		private eazl: EazlService)
	{
		super();

		this.user = new BehaviorSubject(null);
	}

	refresh() {
		this.eazl.get<User>(`${this.route}/authenticated-user`).subscribe(
			user => {
				this.user.next(user);
			},
			error => {
				this.eazl.clearAuthToken();
				console.log(JSON.parse(error));
			}
		);
	}
    
    add(): void {}
    delete(): void {}
    update(): void {}

}