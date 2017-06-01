import { Component, OnInit } from '@angular/core';
import { EazlPackageService } from '../eazl-package.service';
import { Package } from '../models/model.package';
import { Field } from '../models/model.package';


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

	constructor(
		private eazlPackage: EazlPackageService)

	{
		this.selectedPackage = new ComponentPackage();
	}

	refresh() {
		console.log("Refreshing, isn't it")
		this.eazlPackage.refresh();
	}

	selectPackage(selectedPackage: ComponentPackage){
		this.packageList.forEach(item => {
			item.selected = false;
		});

		this.selectedPackage = selectedPackage;
		this.selectedPackage.selected = true;
	}

	executePackage(selectedPackage: ComponentPackage) {
		this.eazlPackage.execute(
			selectedPackage.execute.toString()
		);
	}

	ngOnInit() {
		this.eazlPackage.packageList.subscribe(
			(packages) => {
				console.log("packages subscription")
				if (packages == null) {
					return;
				}

				if (packages.length !== 0) {
					packages.forEach( (item: Package, index: number) => {
						let componentPackage = ComponentPackage.fromPackage(item, index===0)
						if (index === 0) {
							this.selectedPackage = componentPackage;
						}

						this.packageList.push(componentPackage);
					});
				}
			}, 
			error => {
				console.log(JSON.parse(error));
			}
		);
	}

}
