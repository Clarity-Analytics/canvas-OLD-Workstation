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
import { Widget }                     from './model.widget';

@Component({
    selector:    'widget-editor',
    templateUrl: 'widget.editor.component.html',
    styleUrls:  ['widget.editor.component.css']
})
export class WidgetBuilderComponent implements OnInit {

    @Input() selectedDashboardID: number;
    @Input() selectedWidget: Widget;
    @Input() addEditMode: string;
    @Input() displayEditWidget: boolean;
    
    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() formSubmit: EventEmitter<string> = new EventEmitter();

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

            this.identificationForm.reset();
            this.behaviourForm.reset()
            this.dataAndGraphForm.reset()
        }

        // Populate the popup form when it is opened, and in Edit mode only
        if (this.addEditMode == 'Edit' && this.displayEditWidget) {

            // Indicate we loading form -> valueChange routine dont fire
            this.isLoadingForm = true;

            if (this.selectedWidget) {

                if (this.selectedWidget.properties.widgetTabName) {
                    this.identificationForm.controls['widgetTabName']
                        .setValue(this.selectedWidget.properties.widgetTabName);
                }
                if (this.selectedWidget.container.widgetTitle) {
                    this.identificationForm.controls['widgetTitle']
                        .setValue(this.selectedWidget.container.widgetTitle);
                }
                if (this.selectedWidget.properties.widgetCode) {
                    this.identificationForm.controls['widgetCode']
                        .setValue(this.selectedWidget.properties.widgetCode);
                }
                if (this.selectedWidget.properties.widgetName) {
                    this.identificationForm.controls['widgetName']
                        .setValue(this.selectedWidget.properties.widgetName);
                }
                if (this.selectedWidget.properties.widgetDescription) {
                    this.identificationForm.controls['widgetDescription']
                        .setValue(this.selectedWidget.properties.widgetDescription);
                }
                if (this.selectedWidget.properties.widgetDefaultExportFileType) {
                    this.behaviourForm.controls['widgetDefaultExportFileType']
                        .setValue(this.selectedWidget.properties.widgetDefaultExportFileType);
                }
                if (this.selectedWidget.properties.widgetHyperLinkTabNr) {
                    this.behaviourForm.controls['widgetHyperLinkTabNr']
                        .setValue(this.selectedWidget.properties.widgetHyperLinkTabNr);
                }
                if (this.selectedWidget.properties.widgetHyperLinkWidgetID) {
                    this.behaviourForm.controls['widgetHyperLinkWidgetID']
                        .setValue(this.selectedWidget.properties.widgetHyperLinkWidgetID);
                }
                if (this.selectedWidget.properties.widgetPassword) {
                    this.behaviourForm.controls['widgetPassword']
                        .setValue(this.selectedWidget.properties.widgetPassword);
                }
                if (this.selectedWidget.properties.widgetRefreshFrequency) {
                    this.behaviourForm.controls['widgetRefreshFrequency']
                        .setValue(this.selectedWidget.properties.widgetRefreshFrequency);
                }
                if (this.selectedWidget.properties.widgetRefreshMode) {
                    this.behaviourForm.controls['widgetRefreshMode']
                        .setValue(this.selectedWidget.properties.widgetRefreshMode);
                }
                if (this.selectedWidget.properties.widgetReportName) {
                    this.dataAndGraphForm.controls['widgetReportName']
                        .setValue(this.selectedWidget.properties.widgetReportName);
                }
                if (this.selectedWidget.properties.widgetReportParameters) {
                    this.dataAndGraphForm.controls['widgetReportParameters']
                        .setValue(this.selectedWidget.properties.widgetReportParameters);
                }
                if (this.selectedWidget.properties.widgetShowLimitedRows) {
                    this.dataAndGraphForm.controls['widgetShowLimitedRows']
                        .setValue(this.selectedWidget.properties.widgetShowLimitedRows);
                }
                if (this.selectedWidget.properties.widgetAddRestRow) {
                    this.dataAndGraphForm.controls['widgetAddRestRow']
                        .setValue(this.selectedWidget.properties.widgetAddRestRow);
                }
                if (this.selectedWidget.properties.widgetType) {
                    this.dataAndGraphForm.controls['widgetType']
                        .setValue(this.selectedWidget.properties.widgetType);
                }

                // Indicate we are done loading form
                this.isLoadingForm = false;
            }
        }

        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges', '@End');
    }

    onCancel() {
        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info',
            summary:  'Cancel',
            detail:   'No changes as requested'
        });
        
        this.formSubmit.emit('Cancel');
    }

    onSubmit() {
        // User clicked submit button
        this.globalFunctionService.printToConsole(this.constructor.name, 'onSubmit', '@Start');
console.log('mode',this.addEditMode)
        // Validation: note that == null tests for undefined as well
        this.formIsValid = false;
        this.errorMessageOnForm = '';
        this.numberErrors = 0;

        if (this.identificationForm.controls['widgetTabName'].value == ''  || 
            this.identificationForm.controls['widgetTabName'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                'The Widget Tab Name is compulsory.'
        }
        if (this.identificationForm.controls['widgetTitle'].value == ''  || 
            this.identificationForm.controls['widgetTitle'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                'The Widget Title is compulsory.'
        }
        if (this.identificationForm.controls['widgetCode'].value == ''  || 
            this.identificationForm.controls['widgetCode'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                'The Widget Code is compulsory.'
        }
        if (this.identificationForm.controls['widgetName'].value == ''  || 
            this.identificationForm.controls['widgetName'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                'The Widget Name is compulsory.'
        }
        if (this.identificationForm.controls['widgetDescription'].value == ''  || 
            this.identificationForm.controls['widgetDescription'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                'The Widget Description is compulsory.'
        }
        if (this.dataAndGraphForm.controls['widgetReportName'].value == ''  || 
            this.dataAndGraphForm.controls['widgetReportName'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                'The Widget Report Name (data source) is compulsory.'
        }
        if (this.dataAndGraphForm.controls['newExisting'].value == ''  || 
            this.dataAndGraphForm.controls['newExisting'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                'The New / Existing selection is compulsory.'
        }
        if (this.dataAndGraphForm.controls['widgetType'].value == ''  || 
            this.dataAndGraphForm.controls['widgetType'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                'The Widget Type is compulsory.'
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

        // Adding new Widget
        if (this.addEditMode == 'Add' && this.displayEditWidget) {

            this.eazlService.addWidget(
                {
                    container: {
                        backgroundColor: 'white',
                        border: '1px solid black',
                        boxShadow: 'none',
                        color: 'xxx',
                        fontSize: 1,
                        height: 280,
                        left: 220,
                        widgetTitle: this.identificationForm.controls['widgetTitle'].value,
                        top: 80,
                        width: 300
                    },
                    graph: {
                        graphID: 0,
                        spec: '',
                    },
                    properties: {
                        widgetID: 9,
                        dashboardID: 1,
                        widgetTabName: this.identificationForm.controls['widgetTabName'].value,
                        widgetCode: this.identificationForm.controls['widgetCode'].value,
                        widgetName: this.identificationForm.controls['widgetName'].value,
                        widgetAddRestRow: this.dataAndGraphForm.controls['widgetAddRestRow'].value,
                        widgetCreatedDateTime: '2017/04/04 12:57',
                        widgetCreatedUserID: 'JohnD',
                        widgetComments: '',
                        widgetDefaultExportFileType: this.behaviourForm.controls['widgetDefaultExportFileType'].value,
                        widgetDescription: this.identificationForm.controls['widgetDescription'].value,
                        widgetIndex: 0,
                        widgetIsLocked: false,
                        widgetHyperLinkTabNr: this.behaviourForm.controls['widgetHyperLinkTabNr'].value,
                        widgetHyperLinkWidgetID: this.behaviourForm.controls['widgetHyperLinkWidgetID'].value,
                        widgetIsLiked: false,
                        widgetLiked: [       
                            {
                                widgetLikedUserID: '',
                            }
                        ],
                        widgetPassword: this.behaviourForm.controls['widgetPassword'].value,
                        widgetRefreshedDateTime: '',
                        widgetRefreshedUserID: '',
                        widgetRefreshFrequency: this.behaviourForm.controls['widgetRefreshFrequency'].value,
                        widgetRefreshMode: this.behaviourForm.controls['widgetRefreshMode'].value,
                        widgetReportName: this.dataAndGraphForm.controls['widgetReportName'].value,
                        widgetReportParameters: this.dataAndGraphForm.controls['widgetReportParameters'].value,
                        widgetShowLimitedRows: this.dataAndGraphForm.controls['widgetShowLimitedRows'].value,
                        widgetSize: '',
                        widgetSystemMessage: '',
                        widgetType: this.dataAndGraphForm.controls['widgetType'].value,
                        widgetUpdatedDateTime: '',
                        widgetUpdatedUserID: ''
                    }
                }
            );

            this.globalVariableService.growlGlobalMessage.next({
                severity: 'info',
                summary:  'Success',
                detail:   'User added'
            });
        }

        // Editing existing user
        if (this.addEditMode == 'Edit' && this.displayEditWidget) {

            // Only worry about changes when we are not loading
            if (!this.isLoadingForm) {
                this.selectedWidget.properties.widgetTabName = 
                    this.identificationForm.controls['widgetTabName'].value,
                this.selectedWidget.container.widgetTitle = 
                    this.identificationForm.controls['widgetTitle'].value,
                this.selectedWidget.properties.widgetCode = 
                    this.identificationForm.controls['widgetCode'].value,
                this.selectedWidget.properties.widgetName = 
                    this.identificationForm.controls['widgetName'].value,
                this.selectedWidget.properties.widgetDescription = 
                    this.identificationForm.controls['widgetDescription'].value
            }

            if (!this.isLoadingForm) {
                this.selectedWidget.properties.widgetDefaultExportFileType = 
                    this.behaviourForm.controls['widgetDefaultExportFileType'].value,
                this.selectedWidget.properties.widgetHyperLinkTabNr = 
                    this.behaviourForm.controls['widgetHyperLinkTabNr'].value,
                this.selectedWidget.properties.widgetHyperLinkWidgetID = 
                    this.behaviourForm.controls['widgetHyperLinkWidgetID'].value,
                this.selectedWidget.properties.widgetPassword = 
                    this.behaviourForm.controls['widgetPassword'].value,
                this.selectedWidget.properties.widgetRefreshFrequency = 
                    this.behaviourForm.controls['widgetRefreshFrequency'].value,
                this.selectedWidget.properties.widgetRefreshMode = 
                    this.behaviourForm.controls['widgetRefreshMode'].value
            }

            if (!this.isLoadingForm) {
                this.selectedWidget.properties.widgetReportName = 
                    this.dataAndGraphForm.controls['widgetReportName'].value,
                this.selectedWidget.properties.widgetReportParameters = 
                    this.dataAndGraphForm.controls['widgetReportParameters'].value,
                this.selectedWidget.properties.widgetShowLimitedRows = 
                    this.dataAndGraphForm.controls['widgetShowLimitedRows'].value,
                this.selectedWidget.properties.widgetAddRestRow = 
                    this.dataAndGraphForm.controls['widgetAddRestRow'].value,
                this.selectedWidget.properties.widgetType = 
                    this.dataAndGraphForm.controls['widgetType'].value
            }

            this.globalVariableService.growlGlobalMessage.next({
                severity: 'info',
                summary:  'Success',
                detail:   'User updated'
            });
        }

        // Trigger event emitter 'emit' method
        this.formSubmit.emit('Submit');

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