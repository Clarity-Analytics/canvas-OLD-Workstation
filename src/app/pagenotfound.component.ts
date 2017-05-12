// Shows the startup page, and also when illegal route entered
import { Component }                from '@angular/core';
import { OnInit }                   from '@angular/core';

// Our Services
import { GlobalFunctionService }    from './global-function.service';

@Component({
    selector: 'pagenotfound-component',
    templateUrl: 'pagenotfound.component.html',
    styleUrls: ['pagenotfound.component.css'],
})
export class PageNotFoundComponent implements OnInit {

  constructor(
      private globalFunctionService: GlobalFunctionService,
      ) { }
      
    ngOnInit() {
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
     }
}