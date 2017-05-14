import { Injectable } from '@angular/core';
import { EazlService } from './eazl.service';
import { PackageTask } from './models/model.package.task';
import { Model, ModelFactory } from './models/generic.model';


@Injectable()
export class EazlPackageTaskService {
  packageTasks: Model<PackageTask[]>;

  constructor(
  	private eazl: EazlService,
  	private taskFactory: ModelFactory<PackageTask[]>)
  { 
  	this.packageTasks = this.taskFactory.create([]);
    this.setPackageTasks();
  }

  setPackageTasks() {
  	this.eazl.get<PackageTask[]>('package-tasks').subscribe(
  		packageTasks => {
			this.packageTasks.setValue(packageTasks);
  		}
  	);
  }

  getAsyncResult(url: string) {
    var route = url.slice(this.eazl.baseUri.length);
    
    this.eazl.get(route).subscribe(response => {
      console.log(response);
    }); 
  }
}