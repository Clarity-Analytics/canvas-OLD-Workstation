import { Component, OnInit } from '@angular/core';
import { Field } from '../models/model.package';

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
