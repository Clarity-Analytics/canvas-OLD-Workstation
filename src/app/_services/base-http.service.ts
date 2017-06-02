import { Injectable } from '@angular/core';
import { RequestOptions, Headers, Response } from '@angular/http';
import { Token } from '../_models/'
import { Observable } from 'rxjs/Observable';


@Injectable()
export class BaseHttpService {
  storage: Storage;
  baseUri: string = `${window.location.protocol}//${window.location.hostname}:8000/api/`
  
  constructor() {
  	this.storage = window.localStorage; // use local storage for testing so we don't have to login everytime
  }

  prepareRoute(route: string): string {
      if (route.slice(-1) !== '/') {
          route = `${route}/`;
      }

      if (route.slice(0) === '/') {
          route = route.slice(1);
      }

      return `${this.baseUri}${route}`;
  }

  parseResponse(response: Response) {
      return response.json() || {};
  }

  handleError(response: Response | any): Observable<Response> {
      return Observable.throw(response);
  }

  get options() {
  	let headers = new Headers(
	  	{
	  		"Authorization": `Token ${this.storage.getItem('canvas-token')}`
	  	}
  	);

  	return new RequestOptions({"headers": headers})
  }

}
