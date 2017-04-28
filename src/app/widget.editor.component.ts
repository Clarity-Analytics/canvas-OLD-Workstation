// Widget Builder - Popup form to Add / Edit Widget
import { Component } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { Validators } from '@angular/forms';

//  PrimeNG stuffies
import { SelectItem }                 from 'primeng/primeng';

// Our Services
import { EazlService } from './eazl.service';
import { GlobalFunctionService }      from './global.function.service';
import { GlobalVariableService }      from './global.variable.service';

// Our models
import { DashboardTab }               from './model.dashboardTabs';
import { WidgetComment }              from './model.widget.comment';

@Component({
    selector:    'widget-editor',
    templateUrl: 'widget.editor.component.html',
    styleUrls:  ['widget.editor.component.css']
})
export class WidgetBuilderComponent implements OnInit {

    @Input() selectedDashboardID: number;
    @Input() addEditMode: string;
    @Input() displayEditWidget: boolean;
    
    @Output() formSubmit: EventEmitter<boolean> = new EventEmitter();

    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() userPopupFormClosed: EventEmitter<string> = new EventEmitter();



    addingNew: boolean = true;                  // True if adding a new Comment, used in *ngIf
    addToSameThread: boolean = false;           // True if adding to same Thread
    submitted: boolean;                         // True if form submitted
    userform: FormGroup;                        // user form object for FBuilder
    selectedTabName: any;
    dashboardTabsDropDown:  SelectItem[];
    dashboardTabs: DashboardTab[];
    identificationForm: FormGroup;
    behaviourForm: FormGroup;
    dataAndGraphForm: FormGroup;
    isLoadingForm: boolean = false;
    errorMessageOnForm: string = '';
    formIsValid: boolean = false;
    numberErrors: number = 0;
        
    constructor(
        private eazlService: EazlService,
        private fb: FormBuilder,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {

    }

    ngOnInit() {
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnInit', '@Start');

// Questions:
    // widgetIndex necessary?  To show sequence, can be used to re-arrange??
    // Need a z-Index to indicate depth, or NOT ?
    // How a Default Layout?  Need a RESET button?
    // Create from - copy/clone or just pointer to object?

// Not filled in / AUTO
    //     widgetIsLocked: boolean;                // Protected against changes
    //     widgetID: number;                       // Unique ID from DB
    //     dashboardID: number;                    // FK to DashboardID to which widget belongs
    //     widgetCreatedDateTime: string;          // Created on
    //     widgetCreatedUserID: string;            // Created by
    //     widgetUpdatedDateTime: string;          // Updated on
    //     widgetUpdatedUserID: string;            // Updated by
    //     widgetRefreshedDateTime: string;        // Data Refreshed on
    //     widgetRefreshedUserID: string;          // Date Refreshed by
    //     widgetSystemMessage: string;            // Optional for Canvas to say something to user
    //     widgetComments: string;                 // Optional comments
    //     widgetSize: string;                     // Small, Medium, Large
// background, color, boxshadow, border, font-size, etc => defaults

// TODO - store defaults in DB !!!

        this.identificationForm = this.fb.group(
            {
                'widgetTabName':     new FormControl(''),
                'widgetTitle':       new FormControl(''),
                'widgetCode':        new FormControl(''),
                'widgetName':        new FormControl(''),
                'widgetDescription': new FormControl('')
            }
        );

        this.behaviourForm = this.fb.group(
            {
                'widgetDefaultExportFileType': new FormControl(''),
                'widgetHyperLinkTabNr':    new FormControl(''),
                'widgetHyperLinkWidgetID': new FormControl(''),
                'widgetRefreshMode':       new FormControl(''),
                'widgetRefreshFrequency':  new FormControl(''),
                'widgetPassword':          new FormControl(''),
                'NrwidgetLiked':           new FormControl('')
            }
        );

        this.dataAndGraphForm = this.fb.group(
            {
                'widgetReportName':       new FormControl(''),
                'widgetReportParameters': new FormControl(''),
                'widgetShowLimitedRows':  new FormControl(''),
                'widgetAddRestRow':       new FormControl(''),
                'newExisting':            new FormControl(''),
                'widgetType':             new FormControl(''),
                'encodingNew':            new FormControl(''),
                'existingList':           new FormControl('')
            }
        );
    }

    ngOnChanges() {
        // Reacts to changes in selectedUser
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges', '@Start');

        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges',
            'Mode (Add / Edit) is: ' + this.addEditMode);
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges',
            'Popup User Form is open: ' + this.displayEditWidget.toString());

        // Clear the form for new one
        if (this.addEditMode == 'Add' && this.displayEditWidget) {
            // this.userformID.reset({
            //     userID: '',
            //     firstName: '',
            //     lastName: '',
            //     nickName: '',
            //     photoPath: '',
            //     lastDatetimeLoggedIn: '',
            //     lastDatetimeReportWasRun: '',
            //     emailAddress: '',
            //     cellNumber: '',
            //     workTelephoneNumber: '',
            //     workExtension: '',
            //     activeFromDate: '',
            //     inactiveDate: '',
            //     dateCreated: '',
            //     userIDLastUpdated: '',
            //     isStaff: false,
            //     extraString1: '',
            //     extraString10: '',
            //     extraDate1: '',
            //     extraDate10: '',
            //     extraBoolean1: false,
            //     extraBoolean10: false,
            // });

            // this.identificationForm.reset();
            // this.behaviourForm.reset()
            // this.dataAndGraphForm.reset()
        }

        // Populate the popup form when it is opened, and in Edit mode only
        if (this.addEditMode == 'Edit' && this.displayEditWidget) {

            // Indicate we loading form -> valueChange routine dont fire
            this.isLoadingForm = true;

            // TODO - for ALL fields
            // if (this.selectedUser) {

            //     if (this.selectedUser.userID) {
            //         this.userformID.controls['userID'].setValue(this.selectedUser.userID);
            //     }

                // Indicate we are done loading form
                this.isLoadingForm = false;
            // }
        }

        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges', '@End');
    }

    onCancel() {
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

        // TODO - for ALL Required fields
        if (this.identificationForm.controls['widgetTabName'].value == ''  || 
            this.identificationForm.controls['widgetTabName'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 'The widgetTabName is compulsory.'
        }

        if (this.errorMessageOnForm != '') {
            this.formIsValid = true;
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'error',
                summary: 'Error',
                detail: this.numberErrors.toString() + ' error(s) encountered'
            });
            return;
        }

        // TODO - sort all fields, also auto ones + Nr liked
        // Adding new Widget
        if (this.addEditMode == 'Add' && this.displayEditWidget) {

            // this.eazlService.addWidget({
            //     userID:                     this.userformID.controls['userID'].value,
            //     extraString1: '',
            //     extraBoolean10: false,
            // });

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info',
            summary:  'Success',
            detail:   'User added'
        });
        }

        //     this.selectedUser.userIDLastUpdated = this.userformActivity.controls[''].value;
        // } 

        // Editing existing user
        if (this.addEditMode == 'Edit' && this.displayEditWidget) {

            // TODO - load into 3 DIFF forms
            // Only worry about changes when we are not loading
            if (!this.isLoadingForm) {
                // this.selectedUser.userID = this.userformID.controls['userID'].value;
            }

            if (!this.isLoadingForm) {
                // this.selectedUser.lastDatetimeLoggedIn = this.userformActivity.controls['lastDatetimeLoggedIn'].value;
            }

            this.globalVariableService.growlGlobalMessage.next({
                severity: 'info',
                summary:  'Success',
                detail:   'User updated'
            });
        }

        // Trigger event emitter 'emit' method
        this.userPopupFormClosed.emit('Submit');

        //  Note: Do NOT set 'this.displayEditWidget = false' here - it has to change in the parent
        //        componenent to take effect (and thus close Dialogue)
    }
    
    loadDashboardTabs() {
        // Load the Tabs for the selected Dashboard
        this.globalFunctionService.printToConsole(this.constructor.name, 'loadDashboard', '@Start');

        // Get its Tabs in this Dashboard
        this.dashboardTabsDropDown = [];
        this.dashboardTabs = this.eazlService.getDashboardTabs(this.selectedDashboardID);

        // Fill the dropdown on the form
        for (var i = 0; i < this.dashboardTabs.length; i++) {
                this.dashboardTabsDropDown.push({
                    label: this.dashboardTabs[i].widgetTabName,
                    value: {
                        id: this.dashboardTabs[i].dashboardID,
                        name: this.dashboardTabs[i].widgetTabName
                    }
                });
        }
    }

}