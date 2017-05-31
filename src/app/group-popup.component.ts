// Group popup form
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { FormGroup }                  from '@angular/forms';
import { FormBuilder }                from '@angular/forms';
import { FormControl }                from '@angular/forms';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Validators }                 from '@angular/forms';

// PrimeNG
import { Message }                    from 'primeng/primeng';
import { SelectItem }                 from 'primeng/primeng';

// Our Componenets

// Our Services
import { EazlService }                from './eazl.service';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our models
import { Group }                      from './model.group';

@Component({
    selector:    'group-popup',
    templateUrl: 'group-popup.component.html',
    styleUrls:  ['group-popup.component.css']
})

export class GroupPopupComponent implements OnInit {

    // Variables received from the parent HTML tag
    @Input() addEditMode: string;
    @Input() displayGroupPopup: boolean;
    @Input() selectedGroup: Group;

    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() userPopupFormClosed: EventEmitter<string> = new EventEmitter();

    // Local properties
    errorMessageOnForm: string = '';
    formIsValid: boolean = false;
    isLoadingForm: boolean = false;
    numberErrors: number = 0;
    groupForm: any;

    constructor(
        private eazlService: EazlService,
        private fb: FormBuilder,
        private globalVariableService: GlobalVariableService,
        private globalFunctionService: GlobalFunctionService, 
        ) {

        // FormBuilder - must be before subscribeToValue ...
        this.groupForm = this.fb.group({
            'groupID':              new FormControl('', Validators.required),
            'groupName':            new FormControl('', Validators.required),
            'groupDescription':     new FormControl('', Validators.required),
        }
        );

        this.subscribeToValue();
    }

    ngOnInit() {
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnInit', '@Start');
    }

    subscribeToValue() {
        // Listens to changes in the form - ie when the user types
        this.globalFunctionService.printToConsole(this.constructor.name, 'subscribeToValue', '@Start');

        this.groupForm.valueChanges.subscribe((formContent: FormGroup) => {

            // // Only worry about changes when we are not loading
            // if (!this.isLoadingForm) {
            //     this.globalFunctionService.printToConsole(this.constructor.name,'subscribeToValue', '@userformID.valueChanges');

            //     this.selectedGroup.userID = formContent['userID'];
            //     this.selectedGroup.firstName = formContent['firstName'];
            //     this.selectedGroup.lastName = formContent['lastName'];
            //     this.selectedGroup.nickName = formContent['nickName'];
            //     this.selectedGroup.photoPath = formContent['photoPath'];
            //     this.selectedGroup.emailAddress = formContent['emailAddress'];
            //     this.selectedGroup.cellNumber = formContent['cellNumber'];
            //     this.selectedGroup.workTelephoneNumber = formContent['workTelephoneNumber'];
            //     this.selectedGroup.workExtension = formContent['workExtension'];
            //     this.selectedGroup.isStaff = formContent['isStaff'];
            // }
        });

        this.groupForm.valueChanges.subscribe((formContent) => {

            // Only worry about changes when we are not loading
            // if (!this.isLoadingForm) {
            //     this.globalFunctionService.printToConsole(this.constructor.name,'subscribeToValue', '@userformActivity.valueChanges');

            //     this.selectedGroup.lastDatetimeLoggedIn = formContent['lastDatetimeLoggedIn'];
            //     this.selectedGroup.lastDatetimeReportWasRun = formContent['lastDatetimeReportWasRun'];
            //     this.selectedGroup.activeFromDate = formContent['activeFromDate'];
            //     this.selectedGroup.inactiveDate = formContent['inactiveDate'];
            //     this.selectedGroup.dateCreated = formContent['dateCreated'];
            //     this.selectedGroup.userIDLastUpdated = formContent['userIDLastUpdated'];
            // }    
        });
    }

    ngOnChanges() {
        // Reacts to changes in selectedGroup
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges', '@Start');

        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges',
            'Mode (Add / Edit) is: ' + this.addEditMode);
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges',
            'Popup User Form is open: ' + this.displayGroupPopup.toString());

        // Clear the form for new one
        if (this.addEditMode == 'Add' && this.displayGroupPopup) {

            this.groupForm.reset();
        }

        // Populate the popup form when it is opened, and in Edit mode only
        if (this.addEditMode == 'Edit' && this.displayGroupPopup) {

            // Indicate we loading form -> valueChange routine dont fire
            this.isLoadingForm = true;
            if (this.selectedGroup) {

                if (this.selectedGroup.groupID) {
                    this.groupForm.controls['groupID'].setValue(this.selectedGroup.groupID);
                }
                if (this.selectedGroup.groupName) {
                    this.groupForm.controls['groupName'].setValue(this.selectedGroup.groupName);
                }
                if (this.selectedGroup.groupDescription) {
                    this.groupForm.controls['groupDescription'].setValue(this.selectedGroup.groupDescription);
                }

                // Indicate we are done loading form
                this.isLoadingForm = false;
            }
        }

        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges', '@End');
    }

    onClickCancel() {
        // User clicked Cancel
        this.globalFunctionService.printToConsole(this.constructor.name, 'onClickCancel', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info',
            summary:  'Cancel',
            detail:   'No changes as requested'
        });
        
        this.userPopupFormClosed.emit('Cancel');
    }

    onSubmit() {
        // User clicked submit button
        this.globalFunctionService.printToConsole(this.constructor.name, 'onSubmit', '@Start');

        // Validation: note that == null tests for undefined as well
        this.formIsValid = false;
        this.errorMessageOnForm = '';
        this.numberErrors = 0;
        if (this.groupForm.controls['groupName'].value == ''  || 
            this.groupForm.controls['groupName'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 'The Group Name is compulsory.'
        }
        if (this.groupForm.controls['groupDescription'].value == null ||
            this.groupForm.controls['groupDescription'].value == '') {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 'The Group Description is compulsory.'
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
        if (this.addEditMode == 'Add' && this.displayGroupPopup) {
            this.eazlService.addGroup(
                this.groupForm.controls['groupName'].value,
                this.groupForm.controls['groupDescription'].value
            );

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info',
            summary:  'Success',
            detail:   'Group added'
        });
        }

        // Editing existing user
        if (this.addEditMode == 'Edit' && this.displayGroupPopup) {

            // Only worry about changes when we are not loading
            this.eazlService.updateGroup(
                this.selectedGroup.groupID,
                this.selectedGroup.groupName,
                this.selectedGroup.groupDescription
            );
            if (!this.isLoadingForm) {
                this.selectedGroup.groupName = this.groupForm.controls['groupName'].value;
                this.selectedGroup.groupDescription = this.groupForm.controls['groupDescription'].value;
            }

            this.globalVariableService.growlGlobalMessage.next({
                severity: 'info',
                summary:  'Success',
                detail:   'Group updated'
            });
        }

        // Trigger event emitter 'emit' method
        this.userPopupFormClosed.emit('Submit');

        //  Note: Do NOT set 'this.displayGroupPopup = false' here - it has to change in the parent
        //        componenent to take effect (and thus close Dialogue)
    }
}