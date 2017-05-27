import { Component, OnInit } from '@angular/core';
import { EazlPackageService } from '../eazl-package.service';
import { Package, Field } from '../models/model.package';


interface IComponentPackage extends Package {
	selected: boolean;
}


@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit {
	packageList: IComponentPackage[] = [];
	selectedPackage: IComponentPackage;
	selectedFields: Field[];

	constructor(
		private eazlPackages: EazlPackageService)

	{}

	selectPackage(_package: IComponentPackage){
		this.packageList.forEach(item => {
			item.selected = false;
		});

		_package.selected = true;
		this.selectedPackage = _package;
		this.selectedFields = this.selectedPackage.fields;
	}

	ngOnInit() {
		this.eazlPackages.packageList.model.subscribe(
			packages => {
				if (packages == null) {
					return;
				}

				if (packages.length !== 0) {
					packages.forEach( (item: Package, index: number) => {

						let componentPackage: IComponentPackage = {
							pk: item.pk,
							name: item.name,
							repository: item.repository,
							parameters: item.parameters,
							fields: item.fields,
							queries: item.queries,
							date_last_synced: item.date_last_synced,
							last_runtime_error: item.last_runtime_error,
							last_sync_successful: item.last_sync_successful,
							last_sync_error: item.last_sync_error,
							compiled: item.compiled,
							execute: item.execute,
							url: item.url,
							selected: index === 0
						}
						
						if (index === 0) {
							this.selectedPackage = componentPackage;
							this.selectedFields = this.selectedPackage.fields;
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
