// Create New Widget form (shortcut)
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

// Our Models
import { Report }                     from './model.report';
import { SelectedItem }               from './model.selectedItem';
import { Widget }                     from './model.widget';
import { WidgetTemplate }             from './model.widgetTemplates';

// Our Services
import { CanvasDate }                 from './date.services';
import { EazlService }                from './eazl.service';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

@Component({
    selector:    'widget-new',
    templateUrl: 'widget.new.component.html',
    styleUrls:  ['widget.new.component.css']
})
export class WidgetNewComponent implements OnInit {

    @Input() selectedReport: Report;
    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() formSubmit: EventEmitter<boolean> = new EventEmitter();
    
    // Local properties
    dashboardDropDown: SelectItem[] = [];       // Dashboards in DropDown
    dashboardTabsDropDown: SelectItem[] = [];   // DashboardTab in DropDown
    errorMessageOnForm: string = '';
    formIsValid: boolean = false;
    graphTypeDropDown: SelectItem[] = [];       // Types of Graphs in DropDown
    isLoadingForm: boolean = false;
    reportFieldsDropDown:  SelectItem[];        // Drop Down options
    numberErrors: number = 0;
    userform: FormGroup;
    widgetTemplate: WidgetTemplate              // Template for type of graph

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

        // FormBuilder
        this.userform = this.fb.group({
            'dashboardName':        new FormControl('', Validators.required),
            'dashboardTabName':     new FormControl('', Validators.required),
            'reportFieldsX':        new FormControl('', Validators.required),
            'reportFieldsY':        new FormControl('', Validators.required),
            'graphType':            new FormControl('', Validators.required)
        });

        // Fill the DropDowns
        this.dashboardDropDown = this.eazlService.getDashboardSelectionItems();
        this.graphTypeDropDown = this.eazlService.getGraphTypes();
    }
    
    onChangeDashboardDrowdown(event) {
        // User changed Dashboard dropdown, so now populate array of tabs
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeDashboardDrowdown', '@Start');

        // Load its tabs, etc
        this.dashboardTabsDropDown = 
            this.eazlService.getDashboardTabsSelectItems(+event.value.id);
        this.reportFieldsDropDown = 
            this.eazlService.getReportFieldSelectedItems(this.selectedReport.reportID);
    }

    onSubmit(value: string) {
        // User clicked submit button
        this.globalFunctionService.printToConsole(this.constructor.name,'onSubmit', '@Start');

        this.formIsValid = false;
        this.errorMessageOnForm = '';
        this.numberErrors = 0;

        if (this.userform.controls['dashboardName'].value.name == ''  || 
            this.userform.controls['dashboardName'].value.name == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Dashboard Name is compulsory.';
        }
        if (this.userform.controls['dashboardTabName'].value.name == ''  || 
            this.userform.controls['dashboardTabName'].value.name == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Dashboard Tab Name is compulsory.';
        }    
        if (this.userform.controls['reportFieldsX'].value.name == ''  || 
            this.userform.controls['reportFieldsX'].value.name == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The X Axis is compulsory.';
        }        
        if (this.userform.controls['reportFieldsY'].value.name == ''  || 
            this.userform.controls['reportFieldsY'].value.name == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Y Axis is compulsory.';
        }
        if (this.userform.controls['graphType'].value.name == ''  || 
            this.userform.controls['graphType'].value.name == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Graph Type is compulsory.';
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

        // Prep: get template for this graph type, then insert the report data, then axes
        let currentUser: string = this.globalFunctionService.currentUser();
        this.widgetTemplate = this.eazlService.getWidgetTemplates (
            this.userform.controls['graphType'].value.name
        );
        this.widgetTemplate.vegaSpec.data[0].values = this.selectedReport.reportData;
        this.widgetTemplate.vegaSpec.scales[0].domain.field =  
            this.userform.controls['reportFieldsX'].value.name;
        this.widgetTemplate.vegaSpec.marks[0].encode.enter.x.field =
            this.userform.controls['reportFieldsX'].value.name;
        this.widgetTemplate.vegaSpec.marks[1].encode.update.x.signal =
            'tooltip.' + this.userform.controls['reportFieldsX'].value.name;
        this.widgetTemplate.vegaSpec.scales[1].domain.field =  
            this.userform.controls['reportFieldsY'].value.name;
        this.widgetTemplate.vegaSpec.marks[0].encode.enter.y.field =
            this.userform.controls['reportFieldsY'].value.name;
        this.widgetTemplate.vegaSpec.marks[1].encode.update.y.signal =
            'tooltip.' + this.userform.controls['reportFieldsY'].value.name;

        // Get Max z-Index
        let maxZindex: number = 0;
        maxZindex = this.eazlService.maxZindex(this.userform.controls['dashboardName'].value.id);

        // Increment Max z-Index
        maxZindex = maxZindex + 1;

                // // Estimate height and width for NEW container, based on graph dimensions
                // if (this.addEditMode == 'Add') {
                //     this.widgetToEdit.container.height = this.globalFunctionService.alignToGripPoint(
                //         +this.widgetToEdit.graph.spec.height + 
                //             (+this.widgetToEdit.graph.spec.padding * 2) + 40);
                //     this.widgetToEdit.container.width = this.globalFunctionService.alignToGripPoint(
                //         +this.widgetToEdit.graph.spec.width + 
                //             (+this.widgetToEdit.graph.spec.padding * 2) + 40);
                // }

        // Adding new Widget, using defaults as far as possible
        this.eazlService.addWidget( 
            {
                container: {
                    backgroundColor: this.globalVariableService.lastBackgroundColor.getValue().name,
                    border: this.globalVariableService.lastBorder.getValue().name,
                    boxShadow: this.globalVariableService.lastBoxShadow.getValue().name,
                    color: this.globalVariableService.lastColor.getValue().name,
                    fontSize: +this.globalVariableService.lastContainerFontSize.getValue().name,
                    height: this.globalVariableService.lastWidgetHeight.getValue(),
                    left: 240,
                    widgetTitle: this.selectedReport.reportName,
                    top: 80,
                    width: this.globalVariableService.lastWidgetWidth.getValue(),
                },
                areas: 
                    {
                        showWidgetText: false,
                        showWidgetGraph: true,
                        showWidgetTable: false,
                        showWidgetImage: false,
                    },
                textual: 
                    {
                        textText: '',
                        textBackgroundColor: '',
                        textBorder: '',
                        textColor: '',
                        textFontSize: 0,
                        textFontWeight: '',
                        textHeight: 0,
                        textLeft: 0,
                        textMargin: '',
                        textPadding: '',
                        textPosition: '',
                        textTextAlign: '',
                        textTop: 0,
                        textWidth: 0,
                },
                graph: 
                    {
                        graphID: 0,
                        graphLeft: 5,
                        graphTop: 25,   // NB 0 meanse the top buttons are dead (unclickable)
                        vegaParameters: 
                            {
                                vegaGraphHeight: 200,
                                vegaGraphWidth: 200,
                                vegaGraphPadding: 0,
                                vegaHasSignals: false,
                                vegaXcolumn: this.userform.controls['reportFieldsX'].value.name,
                                vegaYcolumn: this.userform.controls['reportFieldsY'].value.name,
                                vegaFillColor: 'black',
                                vegaHoverColor: 'pink',
                            },
                        spec: this.widgetTemplate.vegaSpec,
                    },
                table: 
                    {
                        tableColor: '',
                        tableCols: 0,
                        tableHeight: 0,
                        tableHideHeader: false,
                        tableLeft: 0,
                        tableRows: 0,
                        tableTop: 0,
                        tableWidth: 0,
                    },
                image: 
                    {
                        imageAlt: '',
                        imageHeigt: 10,
                        imageLeft: 0,
                        imageSource: '',
                        imageTop: 0,
                        imageWidth: 10,
                    },
                properties: 
                    {
                        widgetID: this.eazlService.getWidgetLastWidgetID(),
                        dashboardID: this.userform.controls['dashboardName'].value.id,
                        dashboardTabID: this.userform.controls['dashboardTabName'].value.id,
                        dashboardTabName: this.userform.controls['dashboardTabName'].value.name,
                        widgetCode: this.selectedReport.reportCode,
                        widgetName: this.selectedReport.reportName,
                        widgetDescription: 'Added for report ' + this.selectedReport.reportName,
                        widgetDefaultExportFileType: '',
                        widgetHyperLinkTabNr: '',
                        widgetHyperLinkWidgetID: '',
                        widgetRefreshMode: '',
                        widgetRefreshFrequency: 0,
                        widgetPassword: '',
                        widgetIsLiked: false,
                        widgetLiked: null,
                        widgetReportID: this.selectedReport.reportID,
                        widgetReportName: this.selectedReport.reportName,
                        widgetReportParameters: '',
                        widgetShowLimitedRows: 0,
                        widgetAddRestRow: false,
                        widgetType: this.userform.controls['graphType'].value.name,
                        widgetComments: '',
                        widgetIndex: maxZindex,
                        widgetIsLocked: false,
                        widgetSize: '',
                        widgetSystemMessage: '',
                        widgetTypeID: this.userform.controls['graphType'].value.id,
                        widgetRefreshedDateTime: '',
                        widgetRefreshedUserName: '',
                        widgetCreatedDateTime: this.canvasDate.now('standard'),
                        widgetCreatedUserName: currentUser,
                        widgetUpdatedDateTime: '',
                        widgetUpdatedUserName: '',
                    }
            }
        );
console.log('4',this.eazlService.widgets)


    }
} 