import { Component, OnInit } from '@angular/core';

declare var window: Window;

@Component({
    moduleId: module.id,
    selector:    'doc-reference',
    templateUrl: 'doc.reference.component.html', 
    styleUrls:  ['doc.reference.component.css']
})
export class DocReferenceComponent implements OnInit {

    constructor() { }

    ngOnInit() { 
        window.open('file:///home/jannie/Projects/canvas/src/documentation/reference.html');

    }

}