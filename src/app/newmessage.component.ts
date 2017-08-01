// Login form
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { FormBuilder }                from '@angular/forms';
import { FormControl }                from '@angular/forms';
import { FormGroup }                  from '@angular/forms';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Validators }                 from '@angular/forms';

// PrimeNG
import { Message }                    from 'primeng/primeng';
import { SelectItem }                 from 'primeng/primeng';

// Our Services
import { CanvasDate }                 from './date.services';
import { CanvasMessage }              from './model.canvasMessage';
import { EazlService }                from './eazl.service';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

@Component({
    selector:    'newmessage',
    templateUrl: 'newmessage.component.html',
    styleUrls:  ['newmessage.component.css']
})
export class NewMessageComponent implements OnInit {

    // Event emitter sends event back to parent component once Submit button was clicked
    @Input() availableUsers: string[];          // List of UserNames available to share with
    @Input() sendToTheseUsers: string[];        // List of UserNames to whom message is sent
    @Input() nrUnReadMessagesForMe:number;      // Nr of UnRead messages for me
    @Input() previousMessage: CanvasMessage;    // Message to pass to new message form

    @Output() formNewMessageSubmit: EventEmitter<string> = new EventEmitter();

    // Local properties
    displayPreviousMessage: boolean = false;    // True to display previous message info
    errorMessageOnForm: string = '';            // Accum error message
    formIsValid: boolean = false;               // True form passed validation
    numberErrors: number = 0;                   // Number of errors during validation
    previousMessageRecipients: string = '';     // Csv list of recipients for previous message
    dashboardDropDown: SelectItem[] = [];       // Dropdown options
    userformNewMessage: FormGroup;              // Form Group object
    userformPreviousMessage: FormGroup;         // Form Group object

    constructor(
        private canvasDate: CanvasDate,
        private eazlService: EazlService,
        private fb: FormBuilder,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        ) {}

    ngOnInit() {
        //   Form initialisation
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Previous message form
        this.userformPreviousMessage = this.fb.group({
            'previousMessageSender': new FormControl(''),
            'previousMessageSubject': new FormControl(''),
            'previousMessageBody': new FormControl(''),
            'previousMessageRecipients': new FormControl('')
        });

        // New message form
        this.userformNewMessage = this.fb.group({
            'messageDashboardID': new FormControl(''),
            'messageReportID': new FormControl(''),
            'messageWidgetID': new FormControl(''),
            'messageSubject': new FormControl('', Validators.required),
            'messageBody': new FormControl('', Validators.required)
        });

        // Load the startup form defaults
        this.userformNewMessage.controls['messageSubject'].setValue('');
        this.userformNewMessage.controls['messageBody'].setValue('');
        this.userformNewMessage.controls['messageDashboardID'].setValue('');

        // TODO this line cause an Angular ERROR - changed value after set.  FIX IT !!!
        // Fill combos
        this.dashboardDropDown = this.eazlService.getDashboardSelectionItems();
    }

    ngOnChanges() {
        // Reacts to changes in selectedGroup
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges', '@Start');

        // Refresh the data from the DB
        this.globalVariableService.dirtyDataCanvasMessage = true;

        // Clear old recipients and load new ones, if there are any
        this.previousMessageRecipients = '';
        if (this.previousMessage != null) {

            // Show previous message section
            this.displayPreviousMessage = true;

            // Load any recipients
            if (this.previousMessage.canvasMessageRecipients != null) {
                for (var i = 0; i < this.previousMessage.canvasMessageRecipients.length; i++) {
                    this.previousMessageRecipients = this.previousMessageRecipients + ' ' +
                        this.previousMessage.canvasMessageRecipients[i].
                            canvasMessageRecipientUsername;
                }
            } else {
                this.previousMessageRecipients = '';
            }

            // Load info
            this.userformPreviousMessage.controls['previousMessageSender'].setValue(
                this.previousMessage.canvasMessageSenderUserName);
            this.userformPreviousMessage.controls['previousMessageSubject'].setValue(
                this.previousMessage.canvasMessageSubject);
            this.userformPreviousMessage.controls['previousMessageBody'].setValue(
                this.previousMessage.canvasMessageBody);
            this.userformPreviousMessage.controls['previousMessageRecipients'].setValue(
                this.previousMessageRecipients.trim());
console.log('this.previousMessageRecipients', this.previousMessageRecipients)
        } else {
            this.displayPreviousMessage = false;
        }
    }

    onMoveToTargetDashboardSendTo(event) {
        //   Add to list of Senders
        this.globalFunctionService.printToConsole(this.constructor.name, 'onMoveToTargetDashboardSendTo', '@Start');

        for (var i = 0; i < event.items.length; i++) {
            this.availableUsers = this.availableUsers.filter( au =>
                au != event.items[i])

            if (this.sendToTheseUsers.indexOf(event.items[i]) < 0) {
                this.sendToTheseUsers.push(event.items[i]);
            }
        }
    }

    onMoveToSourceDashboardSendTo() {
        //   Remove from list of Senders
        this.globalFunctionService.printToConsole(this.constructor.name, 'onMoveToSourceDashboardSendTo', '@Start');

    }

    onClickCancel() {
        //   User clicked Cancel
        this.globalFunctionService.printToConsole(this.constructor.name, 'onClickCancel', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'warn',
            summary:  'Cancel',
            detail:   'No message sent as requested'
        });

        this.formNewMessageSubmit.emit('Cancel');
    }

    onClickSubmit() {
        // User clicked submit button.
        // Note: it is assumed that
        // - all the fields are tested to be valid and proper in the validation.
        //   If not, return right after validation.
        // - all fields are loaded in widgetToEdit which is shared with the calling routine
        //   It is assumes is that widgetToEdit is 100% complete and accurate before return
        this.globalFunctionService.printToConsole(this.constructor.name, 'onClickSubmit', '@Start');

        // Validation: note that == null tests for undefined as well
        this.formIsValid = false;
        this.errorMessageOnForm = '';
        this.numberErrors = 0;

        // Validation
        if (this.userformNewMessage.controls['messageSubject'].value == ''  ||
            this.userformNewMessage.controls['messageSubject'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                    'The Message Subject is compulsory.';
        }
        if (this.userformNewMessage.controls['messageBody'].value == ''  ||
            this.userformNewMessage.controls['messageBody'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                    'The Message Body is compulsory.';
        }

        if (this.sendToTheseUsers.length == 0) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                    'Add at least one recipient';
        }

        // Oi, something is not right
        if (this.errorMessageOnForm != '') {
            this.formIsValid = true;
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'error',
                summary: 'Error',
                detail: this.numberErrors.toString() + ' error(s) encountered'
            });
            return;
        }

        // Create a Message object, and then add it
        let canvasMessageWorking = new CanvasMessage();
        // TODO - fix the conversation ID properly in time
        canvasMessageWorking.canvasMessageID = 0;
        canvasMessageWorking.canvasMessageConversationID = null; //'00000000-0000-0000-0000-000000000000';
        canvasMessageWorking.canvasMessageSenderUserName = this.globalVariableService.canvasUser.getValue().username;
        canvasMessageWorking.canvasMessageSentDateTime = this.canvasDate.now('standard');
        canvasMessageWorking.canvasMessageSubject = this.userformNewMessage.controls['messageSubject'].value
        canvasMessageWorking.canvasMessageBody = this.userformNewMessage.controls['messageBody'].value;

        if (this.userformNewMessage.controls['messageDashboardID'].value != ''){
            canvasMessageWorking.canvasMessageDashboardID =
                this.userformNewMessage.controls['messageDashboardID'].value.id;
        } else {
            canvasMessageWorking.canvasMessageDashboardID = null;
        }
        canvasMessageWorking.canvasMessageReportID = null; //this.userformNewMessage.controls['messageReportID'].value;
        canvasMessageWorking.canvasMessageWidgetID = null; //this.userformNewMessage.controls['messageWidgetID'].value;
        canvasMessageWorking.canvasMessageIsSystemGenerated = false;
        canvasMessageWorking.canvasMessageSentToMe = false;
        canvasMessageWorking.canvasMessageMyStatus = 'Read';
        // TODO - add ReadDateTime field for all recipients

        // Get current user
        let currentUser: string = this.globalFunctionService.currentUser();

        canvasMessageWorking.canvasMessageSentDateTime = null;

        canvasMessageWorking.canvasMessageRecipients = [
            {
            canvasMessageRecipientID: 0,
            // canvasMessageRecipientUserID:  this.eazlService.userIDfromUserName(
            //         this.sendToTheseUsers[0]),
            canvasMessageRecipientUsername:  this.sendToTheseUsers[0],
            canvasMessageRecipientIsSender: false,
            canvasMessageRecipientStatus: 'unread',
        }];

        if (this.sendToTheseUsers[0] == currentUser) {
            canvasMessageWorking.canvasMessageSentToMe = true;
            canvasMessageWorking.canvasMessageMyStatus = 'Read';
            canvasMessageWorking.canvasMessageRecipients[0].canvasMessageRecipientIsSender
                = true;
        };

        for (var i = 1; i < this.sendToTheseUsers.length; i++) {

            canvasMessageWorking.canvasMessageSentDateTime = null;
            if (this.sendToTheseUsers[i] == currentUser) {
                canvasMessageWorking.canvasMessageSentToMe = true;
                canvasMessageWorking.canvasMessageMyStatus = 'Read';
                canvasMessageWorking.canvasMessageRecipients[i].canvasMessageRecipientIsSender
                    = true;
            };
            canvasMessageWorking.canvasMessageRecipients.push(
               {
                canvasMessageRecipientID: 14 + i,
                // canvasMessageRecipientUserID:
                //     this.eazlService.userIDfromUserName(this.sendToTheseUsers[i]),
                canvasMessageRecipientUsername: this.sendToTheseUsers[i],
                canvasMessageRecipientIsSender:  false,
                canvasMessageRecipientStatus:  'unread',
            });
            canvasMessageWorking.canvasMessageSentToMe = false;
            canvasMessageWorking.canvasMessageMyStatus = '';
        }

        this.eazlService.addCanvasMessage(canvasMessageWorking)

        // Trigger event emitter 'emit' method
        this.formNewMessageSubmit.emit('Submit');

        //  Note: Do NOT set 'this.displayEditWidget = false' here - it has to change in the parent
        //        componenent to take effect (and thus close Dialogue)
    }

}


