import { Component, OnInit } from '@angular/core';

declare var window: Window;

@Component({
    moduleId: module.id,
    selector: 'refrence-doc',
    templateUrl: 'refrence.doc.html', 
    styleUrls: ['refrence.doc.css']
})
export class ReferenceDocComponent implements OnInit {

    constructor() { }

    ngOnInit() { 
        window.open('file:///home/jannie/Projects/canvas/src/documentation/references.html');

    }

}