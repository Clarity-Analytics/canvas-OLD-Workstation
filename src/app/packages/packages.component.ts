import { Component, OnInit } from '@angular/core';
import { EazlPackageService } from '../eazl-package.service';
import { Package } from '../models/model.package';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit {
	columns: string[];
	packageList: Package[];

	constructor(
		private eazlPackages: EazlPackageService,
	) 
	{
		this.eazlPackages.packageList.model.subscribe(
			packages => {
				if (packages) { 			
					this.packageList = packages;
					this.columns = Object.keys(this.packageList[0]);
				}
			}, 
			error => {
				console.log(JSON.parse(error));
			}
		);
	}

	ngOnInit() {}

}
