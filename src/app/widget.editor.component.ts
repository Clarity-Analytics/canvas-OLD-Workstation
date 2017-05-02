// Widget Builder - Popup form to Add / Edit Widget
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { FormBuilder }                from '@angular/forms';
import { FormControl }                from '@angular/forms';
import { FormGroup }                  from '@angular/forms';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Validators }                 from '@angular/forms';

//  PrimeNG stuffies
import { SelectItem }                 from 'primeng/primeng';

// Our Services
import { EazlService }                from './eazl.service';
import { GlobalFunctionService }      from './global.function.service';
import { GlobalVariableService }      from './global.variable.service';

// Our models
import { DashboardTab }               from './model.dashboardTabs';
import { Report }                     from './model.report';
import { ReportWidgetSet }            from './model.report.widgetSets';
import { Widget }                     from './model.widget';
import { WidgetComment }              from './model.widget.comment';
import { WidgetTemplate }             from './model.widgetTemplates';

@Component({
    selector:    'widget-editor',
    templateUrl: 'widget.editor.component.html',
    styleUrls:  ['widget.editor.component.css']
})
export class WidgetBuilderComponent implements OnInit {

    @Input() selectedDashboardID: number;
    @Input() selectedDashboardTabName: string;
    @Input() widgetToEdit: Widget;
    @Input() addEditMode: string;
    @Input() displayEditWidget: boolean;
    @Input() widgetIDtoEdit: number;
    @Input() widgetToEditX: number;
    @Input() widgetToEditY: number;

    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() formSubmit: EventEmitter<string> = new EventEmitter();

    submitted: boolean;                         // True if form submitted
    selectedTabName: any;                       // Current selected Tab
    selectedReportID: number;                   // Selected in DropDown
    selectedDashboardTab: any;                  // Selected in DropDown
    selectedTabDescription: string;             // Description of the selected Tab
    selectedWidgetSetDescription: string;       // Description of the selected WidgetSet
    
    reports: Report[];                          // List of Reports
    reportsDropDown:  SelectItem[];             // Drop Down options
    widgetTemplates: WidgetTemplate;            // List of Widget Templates
    reportWidgetSets: ReportWidgetSet[];        // List of Report WidgetSets
    reportWidgetSetsDropDown:  SelectItem[];    // Drop Down options
    widget
    dashboardTabs: DashboardTab[];              // List of Dashboard Tabs
    dashboardTabsDropDown: SelectItem[];        // Drop Down options
    widgetCreationDropDown: SelectItem[];       // Drop Down options
    selectedWidgetCreation: SelectItem;         // Selected option to create Widget

    // Form Controls, validation and loading stuffies
    identificationForm: FormGroup;
    behaviourForm: FormGroup;
    dataAndGraphForm: FormGroup;
    isLoadingForm: boolean = false;
    errorMessageOnForm: string = '';
    formIsValid: boolean = false;
    numberErrors: number = 0;

    // ToolTippies stays after popup form closes, so setting in vars works for now ...
    // TODO - find BUG, our side or PrimeNG side
    dashboardsTabsTooltip: string = ""   //'Selected Tab where Widget will live';
    reportsDropDownTooltip: string = ""; //'Selected Report (query) with data';
    reportWidgetSetDropToolTip: string = "" //'Widget Set for the selected Report';
            
    constructor(
        private eazlService: EazlService,
        private fb: FormBuilder,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {
    }

    ngOnInit() {
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnInit', '@Start');

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
                'widgetHyperLinkWidgetID': new FormControl('', Validators.pattern('^[0-9]*$')),
                'widgetRefreshMode':       new FormControl(''),
                'widgetRefreshFrequency':  new FormControl('', Validators.pattern('^[0-9]*$')),
                'widgetPassword':          new FormControl(''),
                'NrwidgetLiked':           new FormControl('')
            }
        );

        this.dataAndGraphForm = this.fb.group(
            {
                'widgetReportName':       new FormControl(''),
                'widgetReportParameters': new FormControl(''),
                'widgetShowLimitedRows':  new FormControl('', Validators.pattern('^[0-9]*$')),
                'widgetAddRestRow':       new FormControl(''),
                'newExisting':            new FormControl('new'),
                'widgetType':             new FormControl(''),
                'widgetReportWidgetSet':  new FormControl(''),
                'encodingNew':            new FormControl(''),
                'existingList':           new FormControl('')
            }
        );
    }

    ngOnChanges() {
        // Reacts to changes in selectedWidget
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges', '@Start');

        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges',
            'Mode (Add / Edit) is: ' + this.addEditMode);
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges',
            'Edit Widget Form is open: ' + this.displayEditWidget.toString());

        // Load the Reports, and Dashboard Tabs
        this.loadReports();
        this.loadDashboardTabs();

        // Clear the form for new one
        if (this.addEditMode == 'Add' && this.displayEditWidget) {

            this.identificationForm.reset();
            this.behaviourForm.reset();
            this.dataAndGraphForm.reset();
        }

        // Populate the popup form when it is opened, and in Edit mode only
        if (this.addEditMode == 'Edit' && this.displayEditWidget) {

            // Indicate we loading form -> valueChange routine dont fire
            this.isLoadingForm = true;

            if (this.widgetToEdit.properties.widgetID == this.widgetIDtoEdit) {

                if (this.widgetToEdit.properties.widgetTabName) {
                    this.identificationForm.controls['widgetTabName']
                        .setValue(this.widgetToEdit.properties.widgetTabName);
                }
                if (this.widgetToEdit.container.widgetTitle) {
                    this.identificationForm.controls['widgetTitle']
                        .setValue(this.widgetToEdit.container.widgetTitle);
                }
                if (this.widgetToEdit.properties.widgetCode) {
                    this.identificationForm.controls['widgetCode']
                        .setValue(this.widgetToEdit.properties.widgetCode);
                }
                if (this.widgetToEdit.properties.widgetName) {
                    this.identificationForm.controls['widgetName']
                        .setValue(this.widgetToEdit.properties.widgetName);
                }
                if (this.widgetToEdit.properties.widgetDescription) {
                    this.identificationForm.controls['widgetDescription']
                        .setValue(this.widgetToEdit.properties.widgetDescription);
                }
                if (this.widgetToEdit.properties.widgetDefaultExportFileType) {
                    this.behaviourForm.controls['widgetDefaultExportFileType']
                        .setValue(this.widgetToEdit.properties.widgetDefaultExportFileType);
                }
                if (this.widgetToEdit.properties.widgetHyperLinkTabNr) {
                    this.behaviourForm.controls['widgetHyperLinkTabNr']
                        .setValue(this.widgetToEdit.properties.widgetHyperLinkTabNr);
                }
                if (this.widgetToEdit.properties.widgetHyperLinkWidgetID) {
                    this.behaviourForm.controls['widgetHyperLinkWidgetID']
                        .setValue(this.widgetToEdit.properties.widgetHyperLinkWidgetID);
                }
                if (this.widgetToEdit.properties.widgetPassword) {
                    this.behaviourForm.controls['widgetPassword']
                        .setValue(this.widgetToEdit.properties.widgetPassword);
                }
                if (this.widgetToEdit.properties.widgetRefreshFrequency) {
                    this.behaviourForm.controls['widgetRefreshFrequency']
                        .setValue(this.widgetToEdit.properties.widgetRefreshFrequency);
                }
                if (this.widgetToEdit.properties.widgetRefreshMode) {
                    this.behaviourForm.controls['widgetRefreshMode']
                        .setValue(this.widgetToEdit.properties.widgetRefreshMode);
                }

                let LikedUsers: any = this.widgetToEdit.properties.widgetLiked.filter (
                    user => user.widgetLikedUserID != '')
                this.behaviourForm.controls['NrwidgetLiked'].setValue(LikedUsers.length);
                
                this.widgetToEdit.properties.widgetRefreshMode = 
                    this.behaviourForm.controls['widgetRefreshMode'].value;


                if (this.widgetToEdit.properties.widgetReportName) {
                    this.dataAndGraphForm.controls['widgetReportName']
                        .setValue(this.widgetToEdit.properties.widgetReportName);
                }
                if (this.widgetToEdit.properties.widgetReportParameters) {
                    this.dataAndGraphForm.controls['widgetReportParameters']
                        .setValue(this.widgetToEdit.properties.widgetReportParameters);
                }
                if (this.widgetToEdit.properties.widgetShowLimitedRows) {
                    this.dataAndGraphForm.controls['widgetShowLimitedRows']
                        .setValue(this.widgetToEdit.properties.widgetShowLimitedRows);
                }
                if (this.widgetToEdit.properties.widgetAddRestRow) {
                    this.dataAndGraphForm.controls['widgetAddRestRow']
                        .setValue(this.widgetToEdit.properties.widgetAddRestRow);
                }
                if (this.widgetToEdit.properties.widgetType) {
                    this.dataAndGraphForm.controls['widgetType']
                        .setValue(this.widgetToEdit.properties.widgetType);
                }

                // Indicate we are done loading form
                this.isLoadingForm = false;
            }
        }

        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges', '@End');
    }

    onCancel() {
        this.globalVariableService.growlGlobalMessage.next({
            severity: 'warn',
            summary:  'Cancel',
            detail:   'No changes as requested'
        });
        
        this.formSubmit.emit('Cancel');
    }

    onSubmit() {
        // User clicked submit button
        this.globalFunctionService.printToConsole(this.constructor.name, 'onSubmit', '@Start');

        // Validation: note that == null tests for undefined as well
        this.formIsValid = false;
        this.errorMessageOnForm = '';
        this.numberErrors = 0;

        // First, validate the compulsory fields
        if (this.identificationForm.controls['widgetTabName'].value == ''  || 
            this.identificationForm.controls['widgetTabName'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Widget Tab Name is compulsory.';
        }
        if (this.identificationForm.controls['widgetTitle'].value == ''  || 
            this.identificationForm.controls['widgetTitle'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Widget Title is compulsory.';
        }
        if (this.identificationForm.controls['widgetCode'].value == ''  || 
            this.identificationForm.controls['widgetCode'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Widget Code is compulsory.';
        }
        if (this.identificationForm.controls['widgetName'].value == ''  || 
            this.identificationForm.controls['widgetName'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Widget Name is compulsory.';
        }
        if (this.identificationForm.controls['widgetDescription'].value == ''  || 
            this.identificationForm.controls['widgetDescription'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Widget Description is compulsory.';
        }
        if (this.dataAndGraphForm.controls['widgetReportName'].value == ''  || 
            this.dataAndGraphForm.controls['widgetReportName'].value == null) {
                if (this.addEditMode == 'Add') {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The Widget Report Name (data source) is compulsory when Adding.';
                }
        }
        if (this.dataAndGraphForm.controls['widgetType'].value == ''  || 
            this.dataAndGraphForm.controls['widgetType'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Widget Type is compulsory.';
        }

        // Tricksy bit: validate per Widget Type.  I know its a lot of work, but 
        // its the only solution for now

        // Widget Set field validation
        if (this.dataAndGraphForm.controls['widgetType'].value['name'] == 'WidgetSet') {

            if (this.dataAndGraphForm.controls['widgetReportWidgetSet'].value == ''  || 
                this.dataAndGraphForm.controls['widgetReportWidgetSet'].value == null) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The Report Widget Set is compulsory.';
            }
        }

        // BarChart field validation
        if (this.dataAndGraphForm.controls['widgetType'].value['name'] == 'BarChart') {

            if (this.dataAndGraphForm.controls['newExisting'].value == ''  || 
                this.dataAndGraphForm.controls['newExisting'].value == null) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The New / Existing selection is compulsory.';
            }
            if (this.behaviourForm.controls['widgetHyperLinkWidgetID'].touched  && 
                !this.behaviourForm.controls['widgetHyperLinkWidgetID'].valid) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The Hyperlinked Widget ID must be numberic';
            }
            if (this.behaviourForm.controls['widgetRefreshFrequency'].touched  && 
                !this.behaviourForm.controls['widgetRefreshFrequency'].valid) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The Refresh Frequency must be numberic';
            }
            if (this.dataAndGraphForm.controls['widgetShowLimitedRows'].touched  && 
                !this.dataAndGraphForm.controls['widgetShowLimitedRows'].valid) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The number of limited rows to show must be numberic';
            }        
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

            // First, load from form what wass indeed provided on the form
            this.widgetToEdit.container.widgetTitle = 
                this.identificationForm.controls['widgetTitle'].value;
            this.widgetToEdit.properties.widgetTabName = 
                this.identificationForm.controls['widgetTabName'].value;
            this.widgetToEdit.properties.widgetCode = 
                this.identificationForm.controls['widgetCode'].value;
            this.widgetToEdit.properties.widgetName = 
                this.identificationForm.controls['widgetName'].value;
            this.widgetToEdit.properties.widgetAddRestRow = 
                this.dataAndGraphForm.controls['widgetAddRestRow'].value;
            this.widgetToEdit.properties.widgetDefaultExportFileType = 
                this.behaviourForm.controls['widgetDefaultExportFileType'].value;
            this.widgetToEdit.properties.widgetDescription = 
                this.identificationForm.controls['widgetDescription'].value;
            this.widgetToEdit.properties.widgetHyperLinkTabNr = 
                this.behaviourForm.controls['widgetHyperLinkTabNr'].value;
            this.widgetToEdit.properties.widgetHyperLinkWidgetID = 
                this.behaviourForm.controls['widgetHyperLinkWidgetID'].value;
            this.widgetToEdit.properties.widgetPassword = 
                this.behaviourForm.controls['widgetPassword'].value;
            this.widgetToEdit.properties.widgetRefreshFrequency = 
                this.behaviourForm.controls['widgetRefreshFrequency'].value;
            this.widgetToEdit.properties.widgetRefreshMode = 
                this.behaviourForm.controls['widgetRefreshMode'].value;
            this.widgetToEdit.properties.widgetReportName = 
                this.dataAndGraphForm.controls['widgetReportName'].value;
            this.widgetToEdit.properties.widgetReportParameters = 
                this.dataAndGraphForm.controls['widgetReportParameters'].value;
            this.widgetToEdit.properties.widgetShowLimitedRows = 
                this.dataAndGraphForm.controls['widgetShowLimitedRows'].value;
            this.widgetToEdit.properties.widgetType = 
                this.dataAndGraphForm.controls['widgetType'].value;

            // Add x,y from where Icon was dropped
            this.widgetToEdit.container.left = this.widgetToEditX;
            this.widgetToEdit.container.top = this.widgetToEditY;
        }

        // Editing existing Widget
        if (this.addEditMode == 'Edit' && this.displayEditWidget &&
            this.widgetToEdit.properties.widgetID == this.widgetIDtoEdit) {

            // Only worry about changes when we are not loading
            if (!this.isLoadingForm) {
                this.widgetToEdit.properties.widgetTabName = 
                    this.identificationForm.controls['widgetTabName'].value;
                this.widgetToEdit.container.widgetTitle = 
                    this.identificationForm.controls['widgetTitle'].value;
                this.widgetToEdit.properties.widgetCode = 
                    this.identificationForm.controls['widgetCode'].value;
                this.widgetToEdit.properties.widgetName = 
                    this.identificationForm.controls['widgetName'].value;
                this.widgetToEdit.properties.widgetDescription = 
                    this.identificationForm.controls['widgetDescription'].value;
            }

            if (!this.isLoadingForm) {
                this.widgetToEdit.properties.widgetDefaultExportFileType = 
                    this.behaviourForm.controls['widgetDefaultExportFileType'].value;
                this.widgetToEdit.properties.widgetHyperLinkTabNr = 
                    this.behaviourForm.controls['widgetHyperLinkTabNr'].value;
                this.widgetToEdit.properties.widgetHyperLinkWidgetID = 
                    this.behaviourForm.controls['widgetHyperLinkWidgetID'].value;
                this.widgetToEdit.properties.widgetPassword = 
                    this.behaviourForm.controls['widgetPassword'].value;
                this.widgetToEdit.properties.widgetRefreshFrequency = 
                    this.behaviourForm.controls['widgetRefreshFrequency'].value;
                this.widgetToEdit.properties.widgetRefreshMode = 
                    this.behaviourForm.controls['widgetRefreshMode'].value;
                    
            }

            if (!this.isLoadingForm) {
                this.widgetToEdit.properties.widgetReportName = 
                    this.dataAndGraphForm.controls['widgetReportName'].value;
                this.widgetToEdit.properties.widgetReportParameters = 
                    this.dataAndGraphForm.controls['widgetReportParameters'].value;
                this.widgetToEdit.properties.widgetShowLimitedRows = 
                    this.dataAndGraphForm.controls['widgetShowLimitedRows'].value;
                this.widgetToEdit.properties.widgetAddRestRow = 
                    this.dataAndGraphForm.controls['widgetAddRestRow'].value;
                this.widgetToEdit.properties.widgetType = 
                    this.dataAndGraphForm.controls['widgetType'].value;
            }

            this.globalVariableService.growlGlobalMessage.next({
                severity: 'info',
                summary:  'Success',
                detail:   'Widget updated'
            });
        }

        // Amend the specs IF given, according to the Widget Sets
        if (this.dataAndGraphForm.controls['widgetType'].value['name'] == 'WidgetSet') {
            for (var i = 0; i < this.reportWidgetSets.length; i++) {
                if (this.reportWidgetSets[i].widgetSetID == 
                    this.dataAndGraphForm.controls['widgetReportWidgetSet'].value.id) {
                        this.widgetToEdit.graph.spec = this.reportWidgetSets[i].vegaSpec;
                }
            }

            // Then wack in the data from the Report
            if (this.dataAndGraphForm.controls['widgetReportName'].value != '' &&
                this.dataAndGraphForm.controls['widgetReportName'].value != undefined) {
                for (var i = 0; i < this.reports.length; i++) {
                    if (this.reports[i].repordID == 
                        this.dataAndGraphForm.controls['widgetReportName'].value.id) {
                            this.widgetToEdit.graph.spec.data[0].values = 
                                this.reports[i].reportData;
                    }
                }
            }
        }
 
        if (this.dataAndGraphForm.controls['widgetType'].value['name'] == 'BarChart') {
            // Get the corresponding widget template
            this.widgetTemplates = this.eazlService.getWidgetTemplates (
                this.dataAndGraphForm.controls['widgetType'].value['name']
            );

            // Wack this spec into our working Widget
            this.widgetToEdit.graph.spec = this.widgetTemplates.vegaSpec;

            // Then wack in the data from the Report
            if (this.dataAndGraphForm.controls['widgetReportName'].value != '' &&
                this.dataAndGraphForm.controls['widgetReportName'].value != undefined) {
                for (var i = 0; i < this.reports.length; i++) {
                    if (this.reports[i].repordID == 
                        this.dataAndGraphForm.controls['widgetReportName'].value.id) {
                            this.widgetToEdit.graph.spec.data[0].values = 
                                this.reports[i].reportData;
                    }
                }
            }
        }

        // Trigger event emitter 'emit' method
        this.formSubmit.emit('Submit');

        //  Note: Do NOT set 'this.displayEditWidget = false' here - it has to change in the parent
        //        componenent to take effect (and thus close Dialogue)
    }

    loadReportWidgetSets(event) {
        // Load the WidgetSets for the selected Report
        this.globalFunctionService.printToConsole(this.constructor.name, 'loadReportWidgetSets', '@Start');

        // Show description details
        this.globalFunctionService.printToConsole(this.constructor.name, 'changeTabDropDown', '@Start');

        // Get its WidgetSets in this Dashboard
        this.reportWidgetSetsDropDown = [];
        this.selectedReportID = event.value.id;
        this.reportWidgetSets = this.eazlService.getReportWidgetSets(this.selectedReportID);

        // Fill the dropdown on the form
        for (var i = 0; i < this.reportWidgetSets.length; i++) {
            this.reportWidgetSetsDropDown.push({
                label: this.reportWidgetSets[i].widgetSetName,
                value: {
                    id: this.reportWidgetSets[i].widgetSetID,
                    name: this.reportWidgetSets[i].widgetSetName
                }
            });
        }

    }
    
    loadReports() {

        // Load the Report, etc DropDowns
        this.reports = this.eazlService.getReports();
        
        // Fill its dropdown
        this.reportsDropDown = [];
        for (var i = 0; i < this.reports.length; i++) {
            this.reportsDropDown.push({
                label: this.reports[i].reportName,
                value: {
                    id: this.reports[i].repordID,
                    name: this.reports[i].reportName
                }
            });
        }

        // Fill the options on how to create Widgets
        this.widgetCreationDropDown = [];
        this.widgetCreationDropDown.push({
            label: 'WidgetSet',
            value: {
                id: 0,
                name: 'WidgetSet'
            }
        });
        this.widgetCreationDropDown.push({
            label: 'BarChart',
            value: {
                id: 1,
                name: 'BarChart'
            }
        });
        this.widgetCreationDropDown.push({
            label: 'PieChart',
            value: {
                id: 2,
                name: 'PieChart'
            }
        });
        this.widgetCreationDropDown.push({
            label: 'LineChart',
            value: {
                id: 3,
                name: 'LineChart'
            }
        });

    }

    changeTabDropDown(event) {
        // Sets the description as the user selects a new Tab in the DropDown
        this.globalFunctionService.printToConsole(this.constructor.name, 'changeTabDropDown', '@Start');

        if (this.dashboardTabs.length > 0) {
            this.selectedTabDescription = this.dashboardTabs.filter( 
                t => t.widgetTabName == event.value.name)[0].widgetTabDescription;
        } else {
            this.selectedTabDescription = '';
        }
    }

    changeWidgetSet(event) {
        // Sets the description as the user selects a new WidgetSet in the DropDown
        this.globalFunctionService.printToConsole(this.constructor.name, 'changeWidgetSet', '@Start');

        if (this.reportWidgetSets.length > 0) {
            this.selectedWidgetSetDescription = this.reportWidgetSets.filter( 
                w => w.widgetSetID == event.value.id)[0].widgetSetDescription;
        } else {
            this.selectedWidgetSetDescription = '';
        }
    }

    loadDashboardTabs() {
        // Load the Tabs for the selected Dashboard
        this.globalFunctionService.printToConsole(this.constructor.name, 'loadDashboardTabs', '@Start');

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