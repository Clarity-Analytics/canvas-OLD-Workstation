import { Injectable } from '@angular/core';
import { EazlService } from './eazl.service';
import { Model, ModelFactory } from './models/generic.model';
import { Package } from './models/model.package';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
}
