import { Component, OnInit } from '@angular/core';
import { PackageTask } from '../models/model.package.task';
import { EazlPackageTaskService } from '../eazl-package-task.service';


@Component({
  selector: 'app-package-tasks',
  templateUrl: './package-tasks.component.html',
  styleUrls: ['./package-tasks.component.css']
})
export class PackageTasksComponent implements OnInit {
  packageTasks: PackageTask[];
  columns: string[];

  constructor(
  	private eazlTasks: EazlPackageTaskService) 
  {
  	this.eazlTasks.packageTasks.model.subscribe(
  		packageTasks => {
  			if (packageTasks == null) {
  				return;
  			}

  			if (packageTasks.length !== 0) {
  				this.packageTasks = packageTasks;
  				this.columns = Object.keys(this.packageTasks[0]);
  			}
  		}
  	);
  }

  ngOnInit() { }

  getAsyncResult(packageTask: PackageTask) {
  	this.eazlTasks.getAsyncResult(packageTask.get_async_result.toString());
  }
}
