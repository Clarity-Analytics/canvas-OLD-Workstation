// Login form
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { FormBuilder }                from '@angular/forms';
import { FormControl }                from '@angular/forms';
import { FormGroup }                  from '@angular/forms';
import { OnInit }                     from '@angular/core';
import { Input }                      from '@angular/core';
import { Output }                     from '@angular/core';
import { Validators }                 from '@angular/forms';
 
// PrimeNG
import { Message }                    from 'primeng/primeng';  
import { SelectItem }                 from 'primeng/primeng';

// Our Services
import { EazlService }                from './eazl.service';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { User }                       from './model.user';

@Component({
    selector:    'change-password',
    templateUrl: 'change.password.component.html',
    styleUrls:  ['change.password.component.css']
})
export class ChangePasswordComponent implements OnInit {

    @Input() selectedUser: User;                            // User that was clicked on

    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() formChangePasswordSubmit: EventEmitter<string> = new EventEmitter();
    
    // Local properties
    errorMessageOnForm: string = '';
    formIsValid: boolean = false;
    isLoadingForm: boolean = false;
    numberErrors: number = 0;
    userform: FormGroup;

    constructor(
        private eazlService: EazlService,
        private fb: FormBuilder,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        ) {

        // FormBuilder
        this.userform = this.fb.group({
            'username': new FormControl('', Validators.required),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
            'passwordRetyped': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
            
        });            
    }
    
    ngOnInit() {
        //   Form initialisation
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

    }

    ngOnChanges() {
        // Reacts to changes in selectedGroup
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges', '@Start');

        if (this.selectedUser != undefined) {
            this.userform.controls['username'].setValue(this.selectedUser.username);
        }
    }

    onClickCancel() {
        // User clicked Cancel
        this.globalFunctionService.printToConsole(this.constructor.name, 'onClickCancel', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info',
            summary:  'Cancel',
            detail:   'No changes as requested'
        });
        
        this.formChangePasswordSubmit.emit('Cancel');
    }

    onSubmit() {
        // User clicked submit button
        this.globalFunctionService.printToConsole(this.constructor.name, 'onSubmit', '@Start');

        // Validation: note that == null tests for undefined as well
        this.formIsValid = false;
        this.errorMessageOnForm = '';
        this.numberErrors = 0;
        if (this.userform.controls['password'].value == ''  || 
            this.userform.controls['password'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 'The Password is compulsory.'
        }
        if (this.userform.controls['password'].value != 
            this.userform.controls['passwordRetyped'].value) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 'The two passwords differ.'
        }

        // Error(s) encountered
        if (this.errorMessageOnForm != '') {
            this.formIsValid = true;
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'error',
                summary: 'Error',
                detail: this.numberErrors.toString() + ' error(s) encountered'
            });
            return;
        }
 
        // Adding new user
        let result = this.eazlService.changePassword(
            this.selectedUser.username,
            this.userform.controls['password'].value
            );
        if (result == '') {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'info',
                summary:  'Success',
                detail:   'Password changed'
            });
        }
        else {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Failed',
                detail:   'Password changed attempted but failed with: ' + result
            });
        }

        // Trigger event emitter 'emit' method
        this.formChangePasswordSubmit.emit('Submit');

        //  Note: Do NOT set 'this.displayUserPopup = false' here - it has to change in the parent
        //        componenent to take effect (and thus close Dialogue)
    }



} 