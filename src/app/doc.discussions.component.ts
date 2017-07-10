import { Component }                  from '@angular/core';
import { OnInit }                     from '@angular/core';

declare var window: Window;

@Component({
    moduleId: module.id,
    selector:    'doc-discussions',
    templateUrl: 'doc.discussions.component.html', 
    styleUrls:  ['doc.discussions.component.css']
})
export class DocDiscussionsComponent implements OnInit {

    constructor() { }

    ngOnInit() { 
        // window.open('file:///home/jannie/Projects/canvas/src/documentation/discussions.html');

    }

}