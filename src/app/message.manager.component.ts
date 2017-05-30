// Message Manager form
import { Component }                  from '@angular/core';
import { OnInit }                     from '@angular/core';
import { ViewEncapsulation }          from '@angular/core';

// PrimeNG
import { ConfirmationService }        from 'primeng/primeng';  
import { MenuItem }                   from 'primeng/primeng';  
import { Message }                    from 'primeng/primeng';  

// Our Components

// Our Services
import { EazlService }                from './eazl.service';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our models
import { CanvasDate }                 from './date.services';
import { CanvasMessage }              from './model.canvasMessage';
import { CanvasUser }                 from './model.user';
import { EazlUser }                   from './model.user';
import { User }                       from './model.user';

@Component({
    selector:    'messageManager',
    templateUrl: 'message.manager.component.html',
    styleUrls:  ['message.manager.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class MessageManagerComponent implements OnInit {
    
    // Local properties
    canvasUser: CanvasUser = this.globalVariableService.canvasUser.getValue();
    canvasMessages: CanvasMessage[];                            // List of Canvas Messages
    selectedCanvasMessage: CanvasMessage;                       // Message that was clicked on
    popuMenuItems: MenuItem[];                                  // Items in popup

    constructor(
        private confirmationService: ConfirmationService,
        private canvasDate: CanvasDate,
        private eazlService: EazlService,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        ) {
    }
    
    ngOnInit() {
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.canvasMessages = this.eazlService.getCanvasMessages(-1, -1, -1);
        this.popuMenuItems = [
            {
                label: 'Read/UnRead', 
                icon: 'fa-thumbs-o-up', 
                command: (event) => this.toggleMessageReadUnRead(this.selectedCanvasMessage)
            }
            
        ];

    }

    toggleMessageReadUnRead(canvasMessage: CanvasMessage) {
        // Toggle the message between Read and UnRead
        // - canvasMessage: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'toggleMessageReadUnRead', '@Start');
    }

    onClickMessageTable() {
        // User clicked on a row
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickMessageTable', '@Start');


    }

}
