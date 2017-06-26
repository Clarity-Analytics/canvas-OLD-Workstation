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

// Our Services
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
    isLoadingForm: boolean = false;
    reportFieldsDropDown:  SelectItem[];        // Drop Down options
    numberErrors: number = 0;
    userform: FormGroup;
    
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
            'dashboardName':    new FormControl('', Validators.required),
            'dashboardTabName': new FormControl('', Validators.required)
        });

        // Fill the DropDowns
        this.dashboardDropDown = this.eazlService.getDashboardSelectionItems();
        
    }
    
    onChangeLoadDashboardTabDrowdown(event) {
        // User changed Dashboard dropdown, so now populate array of tabs
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeLoadDashboardTabDrowdown', '@Start');
        
        // this.reportFieldsDropDown = this.eazlService.getReportFields(this.selectedReport.reportID))
// reportFieldsDropDown

        // Load its tabs
        this.dashboardTabsDropDown = 
            this.eazlService.getDashboardTabsSelectItems(+event.value.id);
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

        // Adding new Widget, using defaults all the way
        this.eazlService.addWidget( 
            {
                container: {
                    backgroundColor: this.globalVariableService.lastBackgroundColor.getValue().name,
                    border: this.globalVariableService.lastBorder.getValue().name,
                    boxShadow: this.globalVariableService.lastBoxShadow.getValue().name,
                    color: this.globalVariableService.lastColor.getValue().name,
                    fontSize: +this.globalVariableService.lastContainerFontSize.getValue().name,
                    height: this.globalVariableService.lastWidgetHeight.getValue(),
                    left: 80,
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
                        graphLeft: 0,
                        graphTop: 0,
                        vegaParameters: 
                            {
                                vegaGraphHeight: 0,
                                vegaGraphWidth: 0,
                                vegaGraphPadding: 0,
                                vegaHasSignals: false,
                                vegaXcolumn: '',
                                vegaYcolumn: '',
                                vegaFillColor: '',
                                vegaHoverColor: '',
                            },
                        spec: '',
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
                        imageHeigt: 0,
                        imageLeft: 0,
                        imageSource: '',
                        imageTop: 0,
                        imageWidth: 0,
                    },
                properties: 
                    {
                        widgetID: this.eazlService.getWidgetLastWidgetID(),
                        dashboardID: 0,
                        dashboardTabID: 0,
                        dashboardTabName: '',
                        widgetCode: '',
                        widgetName: '',
                        widgetDescription: '',
                        widgetDefaultExportFileType: '',
                        widgetHyperLinkTabNr: '',
                        widgetHyperLinkWidgetID: '',
                        widgetRefreshMode: '',
                        widgetRefreshFrequency: 0,
                        widgetPassword: '',
                        widgetIsLiked: false,
                        widgetLiked: null,
                
                        widgetReportID: 0,
                        widgetReportName: '',
                        widgetReportParameters: '',
                        widgetShowLimitedRows: 0,
                        widgetAddRestRow: false,
                        widgetType: '',
                        widgetComments: '',
                        widgetIndex: 0,
                        widgetIsLocked: false,
                        widgetSize: '',
                        widgetSystemMessage: '',
                        widgetTypeID: 0,
                        widgetRefreshedDateTime: '',
                        widgetRefreshedUserName: '',
                        widgetCreatedDateTime: '',
                        widgetCreatedUserName: '',
                        widgetUpdatedDateTime: '',
                        widgetUpdatedUserName: '',
                    }
            }
        );
console.log('4',this.eazlService.widgets)


    }
} 