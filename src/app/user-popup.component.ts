// User popup form
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
import { User }                       from './model.user';

@Component({
    selector:    'user-popup',
    templateUrl: 'user-popup.component.html',
    styleUrls:  ['user-popup.component.css']
})
export class UserPopupComponent implements OnInit {

    // Variables received from the parent HTML tag
    @Input() addEditMode: string;
    @Input() displayUserPopup: boolean;
    @Input() selectedUser: User;

    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() userPopupFormClosed: EventEmitter<string> = new EventEmitter();

    // Local properties
    errorMessageOnForm: string = '';
    formIsValid: boolean = false;
    isLoadingForm: boolean = false;
    isStaffDropdown: SelectItem[];
    isSuperuserOptions: SelectItem[];
    numberErrors: number = 0;
    userformID: any;
    userformActivity: FormGroup;

    constructor(
        private eazlService: EazlService,
        private fb: FormBuilder,
        private globalVariableService: GlobalVariableService,
        private globalFunctionService: GlobalFunctionService,
        ) {

        // FormBuilder - must be before subscribeToValue ...
        this.userformID = this.fb.group({
            'username':             new FormControl('', Validators.required),
            'firstName':            new FormControl('', Validators.required),
            'lastName':             new FormControl('', Validators.required),
            'nickName':             new FormControl(''),
            'photoPath':            new FormControl(''),
            'emailAddress':         new FormControl('', Validators.required),
            'cellNumber':           new FormControl(''),
            'workTelephoneNumber':  new FormControl(''),
            'isStaff':              new FormControl(''),
            'isSuperUser':          new FormControl('')
        }
        );

        this.userformActivity = this.fb.group({
            'lastDatetimeLoggedIn':     new FormControl(''),
            'lastDatetimeReportWasRun': new FormControl(''),
            'activeFromDate':           new FormControl(''),
            'inactiveDate':             new FormControl(''),
            'dateCreated':              new FormControl(''),
            'userNameLastUpdated':      new FormControl('')
        }
        );

        this.subscribeToValue();
    }

    ngOnInit() {
        //   Form initialisation
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnInit', '@Start');

        this.isStaffDropdown = this.eazlService.getIsStaffDropdowns();
        // this.isStaffOptions.push({ label: 'Select option', value: '' });
        // this.isStaffOptions.push({ label: 'Is Staff Member', value: 'True' });
        // this.isStaffOptions.push({ label: 'Non-staff', value: 'False' });

        this.isSuperuserOptions = [];
        this.isSuperuserOptions.push({ label: 'Select option', value: '' });
        this.isSuperuserOptions.push({ label: 'Is Superuser', value: 'True' });
        this.isSuperuserOptions.push({ label: 'Normal staff', value: 'False' });

    }

    subscribeToValue() {
        // Listens to changes in the form - ie when the user types
        this.globalFunctionService.printToConsole(this.constructor.name, 'subscribeToValue', '@Start');

        this.userformID.valueChanges.subscribe((formContent: FormGroup) => {

            // // Only worry about changes when we are not loading
            // if (!this.isLoadingForm) {
            //     this.globalFunctionService.printToConsole(this.constructor.name,'subscribeToValue', '@userformID.valueChanges');

            //     this.selectedUser.UserName = formContent['UserName'];
            //     this.selectedUser.firstName = formContent['firstName'];
            //     this.selectedUser.lastName = formContent['lastName'];
            //     this.selectedUser.nickName = formContent['nickName'];
            //     this.selectedUser.photoPath = formContent['photoPath'];
            //     this.selectedUser.emailAddress = formContent['emailAddress'];
            //     this.selectedUser.cellNumber = formContent['cellNumber'];
            //     this.selectedUser.workTelephoneNumber = formContent['workTelephoneNumber'];
            //     this.selectedUser.workExtension = formContent['workExtension'];
            //     this.selectedUser.isStaff = formContent['isStaff'];
            // }
        });

        this.userformActivity.valueChanges.subscribe((formContent) => {

            // Only worry about changes when we are not loading
            // if (!this.isLoadingForm) {
            //     this.globalFunctionService.printToConsole(this.constructor.name,'subscribeToValue', '@userformActivity.valueChanges');

            //     this.selectedUser.lastDatetimeLoggedIn = formContent['lastDatetimeLoggedIn'];
            //     this.selectedUser.lastDatetimeReportWasRun = formContent['lastDatetimeReportWasRun'];
            //     this.selectedUser.activeFromDate = formContent['activeFromDate'];
            //     this.selectedUser.inactiveDate = formContent['inactiveDate'];
            //     this.selectedUser.dateCreated = formContent['dateCreated'];
            //     this.selectedUser.userNameLastUpdated = formContent['userNameLastUpdated'];
            // }
        });
    }

    ngOnChanges() {
        // Reacts to changes in selectedUser
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges', '@Start');

        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges',
            'Mode (Add / Edit) is: ' + this.addEditMode);
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges',
            'Popup User Form is open: ' + this.displayUserPopup.toString());

        // Clear the form for new one
        if (this.addEditMode == 'Add' && this.displayUserPopup) {

            this.userformID.reset();
            this.userformActivity.reset()
        }

        // Populate the popup form when it is opened, and in Edit mode only
        if (this.addEditMode == 'Edit' && this.displayUserPopup) {

            // Indicate we loading form -> valueChange routine dont fire
            this.isLoadingForm = true;
            if (this.selectedUser) {

                if (this.selectedUser.username) {
                    this.userformID.controls['username'].setValue(this.selectedUser.username);
                }
                if (this.selectedUser.firstName) {
                    this.userformID.controls['firstName'].setValue(this.selectedUser.firstName);
                }
                if (this.selectedUser.lastName) {
                    this.userformID.controls['lastName'].setValue(this.selectedUser.lastName);
                }
                if (this.selectedUser.nickName) {
                    this.userformID.controls['nickName'].setValue(this.selectedUser.nickName);
                }
                if (this.selectedUser.photoPath) {
                    this.userformID.controls['photoPath'].setValue(this.selectedUser.photoPath);
                }
                if (this.selectedUser.lastDatetimeLoggedIn) {
                    this.userformActivity.controls['lastDatetimeLoggedIn'].setValue(this.selectedUser.lastDatetimeLoggedIn);
                }
                if (this.selectedUser.lastDatetimeReportWasRun) {
                    this.userformActivity.controls['lastDatetimeReportWasRun'].setValue(this.selectedUser.lastDatetimeReportWasRun);
                }
                if (this.selectedUser.emailAddress) {
                    this.userformID.controls['emailAddress'].setValue(this.selectedUser.emailAddress);
                }
                if (this.selectedUser.cellNumber) {
                    this.userformID.controls['cellNumber'].setValue(this.selectedUser.cellNumber);
                }
                if (this.selectedUser.workTelephoneNumber) {
                    this.userformID.controls['workTelephoneNumber'].setValue(this.selectedUser.workTelephoneNumber);
                }
                if (this.selectedUser.activeFromDate) {
                    this.userformActivity.controls['activeFromDate'].setValue(this.selectedUser.activeFromDate);
                }
                if (this.selectedUser.inactiveDate) {
                    this.userformActivity.controls['inactiveDate'].setValue(this.selectedUser.inactiveDate);
                }
                if (this.selectedUser.dateCreated) {
                    this.userformActivity.controls['dateCreated'].setValue(this.selectedUser.dateCreated);
                }
                if (this.selectedUser.userNameLastUpdated) {
                    this.userformActivity.controls['userNameLastUpdated'].setValue(this.selectedUser.userNameLastUpdated);
                }
                if (this.selectedUser.isStaff) {
                    this.userformID.controls['isStaff'].setValue(this.selectedUser.isStaff);
                }
                if (this.selectedUser.isSuperUser) {
                    this.userformID.controls['isSuperUser'].setValue(this.selectedUser.isSuperUser);
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

        if (this.userformID.controls['username'].value == ''  ||
            this.userformID.controls['username'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 'The UserName is compulsory.'
        }
        if (this.userformID.controls['firstName'].value == null ||
            this.userformID.controls['firstName'].value == '') {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 'The First Name is compulsory.'
        }
        if (this.userformID.controls['lastName'].value == null ||
            this.userformID.controls['lastName'].value == '') {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 'The Last Name is compulsory.'
        }
        if (this.userformID.controls['emailAddress'].value == null ||
            this.userformID.controls['emailAddress'].value == '') {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 'The Email Address is compulsory.'
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
        if (this.addEditMode == 'Add' && this.displayUserPopup) {
            this.eazlService.addUser({
                username:                   this.userformID.controls['username'].value,
                firstName:                  this.userformID.controls['firstName'].value,
                lastName:                   this.userformID.controls['lastName'].value,
                nickName:                   this.userformID.controls['nickName'].value,
                photoPath:                  this.userformID.controls['photoPath'].value,
                lastDatetimeLoggedIn:       this.userformActivity.controls['lastDatetimeLoggedIn'].value,
                lastDatetimeReportWasRun:   this.userformActivity.controls['lastDatetimeReportWasRun'].value,
                emailAddress:               this.userformID.controls['emailAddress'].value,
                cellNumber:                 this.userformID.controls['cellNumber'].value,
                workTelephoneNumber:        this.userformID.controls['workTelephoneNumber'].value,
                activeFromDate:             this.userformActivity.controls['activeFromDate'].value,
                inactiveDate:               this.userformActivity.controls['inactiveDate'].value,
                dateCreated:                this.userformActivity.controls['dateCreated'].value,
                userNameLastUpdated:        this.userformActivity.controls['userNameLastUpdated'].value,
                isStaff:                    this.userformID.controls['isStaff'].valuel,
                isSuperUser:                this.userformID.controls['isSuperUser'].valuel,
            });

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info',
            summary:  'Success',
            detail:   'User added'
        });
        }

        // Editing existing user
        if (this.addEditMode == 'Edit' && this.displayUserPopup) {

            // Only worry about changes when we are not loading
            if (!this.isLoadingForm) {
                this.selectedUser.username = this.userformID.controls['username'].value;
                this.selectedUser.firstName = this.userformID.controls['firstName'].value;
                this.selectedUser.lastName = this.userformID.controls['lastName'].value;
                this.selectedUser.nickName = this.userformID.controls['nickName'].value;
                this.selectedUser.photoPath = this.userformID.controls['photoPath'].value;
                this.selectedUser.emailAddress = this.userformID.controls['emailAddress'].value;
                this.selectedUser.cellNumber = this.userformID.controls['cellNumber'].value;
                this.selectedUser.workTelephoneNumber = this.userformID.controls['workTelephoneNumber'].value;
                this.selectedUser.isStaff = this.userformID.controls['isStaff'].value;
                this.selectedUser.isSuperUser = this.userformID.controls['isSuperUser'].value;
            }

            if (!this.isLoadingForm) {
                this.selectedUser.lastDatetimeLoggedIn = this.userformActivity.controls['lastDatetimeLoggedIn'].value;
                this.selectedUser.lastDatetimeReportWasRun = this.userformActivity.controls['lastDatetimeReportWasRun'].value;
                this.selectedUser.activeFromDate = this.userformActivity.controls['activeFromDate'].value;
                this.selectedUser.inactiveDate = this.userformActivity.controls['inactiveDate'].value;
                this.selectedUser.dateCreated = this.userformActivity.controls['dateCreated'].value;
                this.selectedUser.userNameLastUpdated = this.userformActivity.controls['userNameLastUpdated'].value;
            }

            this.globalVariableService.growlGlobalMessage.next({
                severity: 'info',
                summary:  'Success',
                detail:   'User updated'
            });
        }

        // Trigger event emitter 'emit' method
        this.userPopupFormClosed.emit('Submit');

        //  Note: Do NOT set 'this.displayUserPopup = false' here - it has to change in the parent
        //        componenent to take effect (and thus close Dialogue)
    }
}