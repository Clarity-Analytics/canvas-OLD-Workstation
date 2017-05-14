import { Injectable } from '@angular/core';
import { EazlService } from './eazl.service';
import { Model, ModelFactory } from './models/generic.model';
import { Package } from './models/model.package';


@Injectable()
export class EazlPackageService {
	packageList: Model<Package[]>;

	constructor(
		private packageFactory: ModelFactory<Package[]>,
		private eazl: EazlService) 
	{
		this.packageList = this.packageFactory.create([]);
		this.getPackageList();
	}

	getPackageList() {
		this.eazl.get<Package[]>('packages').subscribe(
			packages => {
				this.packageList.setValue(packages);
			},
			error => {
				console.log(error);
			}
		);
	}

	execute(url: string) {
		var route = url.slice(this.eazl.baseUri.length);
		
		this.eazl.get(route).subscribe(response => {
			console.log(response);
		}); 
	}
}
