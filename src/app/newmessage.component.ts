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
    
    @Output() formNewMessageSubmit: EventEmitter<string> = new EventEmitter();
    
    // Local properties
    errorMessageOnForm: string = '';            // Accum error message             
    formIsValid: boolean = false;               // True form passed validation
    numberErrors: number = 0;                   // Number of errors during validation
    userform: FormGroup;                        // Form Group object

    constructor(
        private eazlService: EazlService,
        private fb: FormBuilder,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        ) {}
    
    ngOnInit() {
        //   Form initialisation
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // FormBuilder
        this.userform = this.fb.group({
            'messageDashboardID': new FormControl(''),
            'messageReportID': new FormControl(''),
            'messageWidgetID': new FormControl(''),
            'messageSubject': new FormControl('', Validators.required),
            'messageBody': new FormControl('', Validators.required)
        });
      

        // Load the startup form defaults
        this.userform.controls['messageSubject'].setValue('');
        this.userform.controls['messageBody'].setValue('');
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
        if (this.userform.controls['messageSubject'].value == ''  || 
            this.userform.controls['messageSubject'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Message Subject is compulsory.';
        }
        if (this.userform.controls['messageBody'].value == ''  || 
            this.userform.controls['messageBody'].value == null) {
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

        // Trigger event emitter 'emit' method
        this.formNewMessageSubmit.emit('Submit');

        //  Note: Do NOT set 'this.displayEditWidget = false' here - it has to change in the parent
        //        componenent to take effect (and thus close Dialogue)
    }

} 