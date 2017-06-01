import { Injectable } from '@angular/core';
import { EazlService } from './eazl.service';
import { EazlUserService } from './eazl.user.service';
import { Model, ModelFactory } from './models/generic.model';
import { Package } from './models/model.package';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class EazlPackageService {
	packageList: BehaviorSubject<Package[]> = new BehaviorSubject([]);

	constructor(
		private eazl: EazlService) 
	{
		this.eazl.get<Package[]>('packages').subscribe(
			(packages) => {
				this.packageList.next(packages);
			}
		)	
	}

	refresh(): void {
		console.log('Here is the refresh in the service.');
		this.eazl.get<Package[]>('packages');
	}

	getPackageRating(pk: number){

	}

	execute(url: string) {
		var route = url.slice(this.eazl.baseUri.length);
		
		this.eazl.get(route).subscribe(response => {
			console.log(response);
		}); 
	}
}
