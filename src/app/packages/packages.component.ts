import { Component, OnInit } from '@angular/core';
import { Package } from '../_models/model.package';
import { Field } from '../_models/model.package';

import { DataService, PackageService } from '../_services';


class ComponentPackage extends Package {
	selected: boolean;

	static fromPackage(_package: Package, selected: boolean) {
		let componentPackage = new ComponentPackage();

		for (let key in _package) {
			componentPackage[key] = _package[key];
		}

		componentPackage.selected = selected;
		return componentPackage;
	}
}


@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit {
	packageList: ComponentPackage[] = [];
	selectedPackage: ComponentPackage;
	packageRating: number = null;
	suggestions: string[] = ['testing', 'anarchy'];
	search: string = '';

	constructor(
		private dataService: DataService,
		private packageService: PackageService)
	{	
		this.selectedPackage = new ComponentPackage();
	}

	completeMethod(event) {
		let results = ['testing', 'anarchy'].filter(
			(item) => {
				 return item.indexOf(event.query) != -1
			}
		)

		this.suggestions = results;
	}

	selectPackage(selectedPackage: ComponentPackage){
		this.packageList.forEach(item => {
			item.selected = false;
		});

		this.selectedPackage = selectedPackage;
		this.selectedPackage.selected = true;
	}

	executePackage(selectedPackage: ComponentPackage) {
		let url = selectedPackage.execute.toString();
		
		this.packageService.execute(url)
		    .subscribe(
		    	(packageTask) => { console.log('Should see a websocket message after this console log if you are logged in.') }
		    )
	}

	ngOnInit() {
		this.dataService.packages.forEach( (item: Package, index: number) => {
			let componentPackage = ComponentPackage.fromPackage(item, index===0)
			if (index === 0) {
				this.selectedPackage = componentPackage;
			}

			this.packageList.push(componentPackage);
		});
	}

}
