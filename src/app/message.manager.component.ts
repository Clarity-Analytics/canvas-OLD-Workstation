// Message Manager form
import { Component }                  from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Router }                     from '@angular/router';
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
    availableUsers: string[] = [];                  // List of UserNames available to share with
    canvasUser: CanvasUser = this.globalVariableService.canvasUser.getValue();
    canvasMessages: CanvasMessage[] = [];           // List of Canvas Messages
    displayNewMessage: boolean = false;             // True to display new message form
    nrUnReadMessagesForMe: number = 0;              // Nr of unread messages
    selectedCanvasMessage: CanvasMessage;           // Message that was clicked on
    sendToTheseUsers: string[] = [];                // List of UserNames to whom message is sent
    popuMenuItems: MenuItem[];                      // Items in popup

    constructor(
        private confirmationService: ConfirmationService,
        private canvasDate: CanvasDate,
        private eazlService: EazlService,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private router: Router,
        ) {
        }

    ngOnInit() {
        //   Form initialisation
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.canvasMessages = this.eazlService.getCanvasMessages(-1, -1, -1);
console.log('Msg M this.canvasMessages', this.canvasMessages)
        this.popuMenuItems = [
            {
                label: 'Read/UnRead',
                icon: 'fa-thumbs-o-up',
                command: (event) => this.toggleMessageReadUnRead(this.selectedCanvasMessage)
            },
            {
                label: 'Reply',
                icon: 'fa-pencil-square-o',
                command: (event) => this.menuActionReplyMessage(this.selectedCanvasMessage)
            },

            {
                label: 'Go Dashboard',
                icon: 'fa-arrow-circle-o-right',
                command: (event) => this.menuActionJumpToDashboard(this.selectedCanvasMessage)
            }
        ];

    }

    ngOnChanges() {
        // Reacts to changes in selectedGroup
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges', '@Start');

        // Refresh to get latest messages
        if (this.globalVariableService.dirtyDataCanvasMessage) {
            this.eazlService.cacheCanvasData('CanvasMessage', 'reset');
            this.canvasMessages = this.eazlService.getCanvasMessages()
            this.globalVariableService.dirtyDataCanvasMessage = false;
        }
    }

    toggleMessageReadUnRead(canvasMessage: CanvasMessage) {
        // Toggle the message between Read and UnRead
        // - canvasMessage: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'toggleMessageReadUnRead', '@Start');

        this.globalVariableService.dirtyDataCanvasMessage = true;

        // Local vars to make things more readable, methinks
        let recordStatus: string = '';

        // Loop on recipients: if currentUser is a recipient, then toggle status
        // If changes were made, note that recordSet is dirty
        for (var i = 0; i < canvasMessage.canvasMessageRecipients.length; i++) {

            if (canvasMessage.canvasMessageRecipients[i].canvasMessageRecipientUsername ==
                this.globalVariableService.canvasUser.getValue().username) {

                if (canvasMessage.canvasMessageRecipients[i].canvasMessageRecipientStatus
                    .toLowerCase() == 'read') {
                        recordStatus = 'UnRead';
                } else {
                        recordStatus = 'Read';
                }

                canvasMessage.canvasMessageRecipients[i].canvasMessageRecipientStatus =
                    recordStatus;
            }
        }

        if (recordStatus != '') {
            // Update local variabl
            canvasMessage.canvasMessageMyStatus = recordStatus;

            // Update DB
            this.eazlService.updateCanvasMessage(canvasMessage);

        } else {
        this.globalVariableService.growlGlobalMessage.next({
            severity: 'warn',
            summary:  'Not mine',
            detail:   'This message was not sent to you, and thus cannot be marked Read/UnRead'
        });
        }
    }

    menuActionReplyMessage(canvasMessage: CanvasMessage) {
        // Pops up for new message
        this.globalFunctionService.printToConsole(this.constructor.name,'menuActionNewMessage', '@Start');

        // Get the current and available user shared with
        this.availableUsers = [];
        this.sendToTheseUsers = [];

        this.eazlService.getUsers().forEach(sglusr => {
            this.availableUsers.push(sglusr.username)
        })

        // Count Nr of unread messages for me
        this.nrUnReadMessagesForMe = this.eazlService.getCanvasMessages(-1, -1, -1).filter(
            cm => (cm.canvasMessageSentToMe == true  &&  cm.canvasMessageMyStatus == 'UnRead')).length;

        // Show the related popup form
        this.displayNewMessage = true;
    }

    menuActionJumpToDashboard(canvasMessage: CanvasMessage) {
        // Jumps to the designated Dashboard
        this.globalFunctionService.printToConsole(this.constructor.name,'menuActionNewMessage', '@Start');

        if (canvasMessage.canvasMessageDashboardID < 0  ||
            canvasMessage.canvasMessageDashboardID == null) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'No link',
                detail:   'No Dashboard has been linked to this message'
            });
            return;
        }

        // Load DashboardID & Navigate
        this.globalVariableService.sessionLoadOnOpenDashboardID =
            canvasMessage.canvasMessageDashboardID;
        this.router.navigate(['dashboard']);
    }

    onClickMessageTable() {
        // User clicked on a row - toggle Read / UnRead status for me
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickMessageTable', '@Start');

        // Left for later ...
    }

    handleCanvasMessageFormSubmit(event) {
        // Is triggered after the new Message form is submitted
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCanvasMessageFormSubmit', '@Start');

        // Rip away popup
        this.displayNewMessage = false;
    }

}
