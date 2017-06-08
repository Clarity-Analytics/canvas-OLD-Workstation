import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BaseHttpService } from './base-http.service';
import { Package, PackageRating } from '../_models';


@Injectable()
export class PackageService extends BaseHttpService {
    packages: ReplaySubject<Package[]> = new ReplaySubject(1);

    constructor(private http: Http) { 
        super();
        this.getAll().subscribe(
            (packages) => { this.packages.next(packages); }
        );
    }

    getAll(): Observable<Package[]> {
    	let route = this.prepareRoute('packages');

    	return this.http.get(route, this.options)
    		.map(this.parseResponse)
    		.catch(this.handleError);
    }

    getById(id: number): Observable<Package> {
    	let route = this.prepareRoute(`packages/${id}/`);

    	return this.http.get(route, this.options)
    		.map(this.parseResponse)
    		.catch(this.handleError);
    }

    execute(url: string) {
        var route = url.toString();
        
        return this.http.get(route, this.options)
            .map(this.parseResponse)
            .catch(this.handleError);

    }

    getMeanRating(): Observable<PackageRating[]> {
    	let route = this.prepareRoute('package-ratings/mean/');

    	return this.http.get(route, this.options)
    	    .map(this.parseResponse)
    	    .catch(this.handleError);
    }

    ratePackage(id: number, rating: number) {
    	let route = this.prepareRoute('package-ratings');
    	let data = {
    		package: id,
    		rating: rating
    	}

    	return this.http.post(route, JSON.stringify(data), this.options)
    	    .map(this.parseResponse)
    	    .catch(this.handleError);
    }
}
