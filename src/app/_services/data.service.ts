import { Injectable, isDevMode } from '@angular/core';
import { PackageService, UserService } from './'
import { Package, User, Token } from '../_models';


@Injectable()
export class DataService {
	storage: Storage = isDevMode() ? window.localStorage: window.sessionStorage;
	
	users: User[] = [];
	packages: Package[] = [];
	
	constructor(
		private userService: UserService,
		private packageService: PackageService) { }

	refreshAll() {
		this.userService.getAll().subscribe(
			(users) => { this.users = users }
		)

		this.packageService.getAll().subscribe(
			(packages) => { this.packages = packages }
		)
	}

}