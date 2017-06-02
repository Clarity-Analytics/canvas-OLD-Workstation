import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';
import { RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Token } from '../_models/'


export function PinkyPromise(target, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
  const originMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    const result = originMethod.apply(this, args);

    return result.toPromise();
  }

  return descriptor;
}


@Injectable()
export class BaseHttpService {
  baseUri: string = `${window.location.protocol}//${window.location.hostname}:8000/api/`
  storage: Storage = isDevMode() ? window.localStorage: window.sessionStorage;
  
  constructor() { }

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
      const error = response.json() || JSON.stringify(response.body);

      return Observable.throw(error);
  }

  get options() {
  	let headers = new Headers({"Content-Type": "application/json"});

    if (this.storage.getItem('canvas-token')) {
      headers.set('Authorization', `Token ${this.storage.getItem('canvas-token')}`)  
    }

  	return new RequestOptions({"headers": headers})
  }

}

