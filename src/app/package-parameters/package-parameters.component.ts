import { Component, OnInit } from '@angular/core';
import { Parameter } from '../_models/model.package';


@Component({
  selector: 'app-package-parameters',
  templateUrl: './package-parameters.component.html',
  styleUrls: ['./package-parameters.component.css'],
  inputs: ['parameters'],
})
export class PackageParametersComponent implements OnInit {
  parameters: Parameter[] = [];

  constructor() { }

  ngOnInit() { }

}
