import { Component }                  from '@angular/core';
import { OnInit }                     from '@angular/core';

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
        // TODO - clear or make work as you cannot open local files
        // window.open('file:///home/jannie/Projects/canvas/src/documentation/references.html');
        // window.open('http://localhost:4200/documentation/references.html');

    }

}