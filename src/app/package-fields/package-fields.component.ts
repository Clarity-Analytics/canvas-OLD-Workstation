import { Component, OnInit } from '@angular/core';
import { Field } from '../_models/model.package';

@Component({
  selector: 'app-package-fields',
  templateUrl: './package-fields.component.html',
  styleUrls: ['./package-fields.component.css'],
  inputs: ['fields'],
})
export class PackageFieldsComponent implements OnInit {
  fields: Field[] = [];

  constructor() { }

  ngOnInit() {
  	
  }

}
