import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'primeng/primeng';

import { GlobalVariableService } from '../global.variable.service';
import { EazlPackageService } from '../eazl-package.service';

import { 
	Package, 
	Field, 
	Parameter
} from '../models/model.package';


@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css'],
  inputs: ['url', 'legend', 'package']
})
export class PackageComponent implements OnInit {
  url: string;
  legend: string;
  parameters: Parameter[];
  fields: Field[];
  
  _package: Package;

  constructor(
  	private globalVariableService: GlobalVariableService,
  	private eazlPackage: EazlPackageService) { }

  ngOnInit() { }

  set package(value: Package) {
  	this._package = value;
  	this.fields = this._package.fields;
  	this.parameters = this._package.parameters;
  }
  get package(): Package {
  	return this._package;
  }

  execute() {
  	var growl: Message = {
	    severity: 'info',
	    summary: 'Test',
	    detail: this.package.execute.toString(),
  	}
  	
  	this.eazlPackage.execute(
  		this.package.execute.toString()
  	);
  	
  	this.globalVariableService.growlGlobalMessage.next(growl);
  }
}
