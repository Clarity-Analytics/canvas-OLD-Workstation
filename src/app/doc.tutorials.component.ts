import { Component }                  from '@angular/core';
import { OnInit }                     from '@angular/core';

declare var window: Window;

@Component({
    moduleId: module.id,
    selector:    'doc-tutorials',
    templateUrl: 'doc.tutorials.component.html', 
    styleUrls:  ['doc.tutorials.component.css']
})
export class DocTutorialsComponent implements OnInit {

    constructor() { }

    ngOnInit() { 
        // window.open('file:///home/jannie/Projects/canvas/src/documentation/tutorials.html');

    }

}