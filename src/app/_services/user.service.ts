import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseHttpService } from './base-http.service';
import { Observable } from 'rxjs/Observable';

import { User } from '../_models';


@Injectable()
export class UserService extends BaseHttpService {

  constructor(private http: Http) { super() }

  getCurrentUser(): Observable<User> {
  	let route = this.prepareRoute('users/authenticated-user/');

  	return this.http.get(route, this.options)
  	    .map(this.parseResponse)
  	    .catch(this.handleError);
  }

  getAll(): Observable<User[]> {
  	let route = this.prepareRoute('users');

  	return this.http.get(route, this.options)
  	    .map(this.parseResponse)
  	    .catch(this.handleError)
  }

  getById(id: number): Observable<User> {
  	let route = this.prepareRoute(`users/${id}/`);

  	return this.http.get(route, this.options)
  	    .map(this.parseResponse)
  	    .catch(this.handleError)
  }

  create(user: User): Observable<User> {
  	let route = this.prepareRoute(`users`);

  	return this.http.post(route, JSON.stringify(user), this.options)
  	    .map(this.parseResponse)
  	    .catch(this.handleError)
  }

  update(user: User): Observable<User> {
  	let route = this.prepareRoute(`users/${user.pk}/`);

  	return this.http.put(route, JSON.stringify(user), this.options)
  	    .map(this.parseResponse)
  	    .catch(this.handleError)
  }

  delete(user: User) {
  	let route = this.prepareRoute(`users/${user.pk}/`);

  	return this.http.delete(route, this.options)
  	    .map(this.parseResponse)
  	    .catch(this.handleError)
  }

}
