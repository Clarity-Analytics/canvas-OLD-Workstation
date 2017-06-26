// Create New Widget form (shortcut)
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { FormBuilder }                from '@angular/forms';
import { FormControl }                from '@angular/forms';
import { FormGroup }                  from '@angular/forms';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Validators }                 from '@angular/forms';
 
// PrimeNG
import { Message }                    from 'primeng/primeng';  
import { SelectItem }                 from 'primeng/primeng';

// Our Models
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

    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() formSubmit: EventEmitter<boolean> = new EventEmitter();
    
    // Local properties
    dashboardDropDown: SelectItem[] = [];     // Dashboards in DropDown
    dashboardTabsDropDown: SelectItem[] = []; // DashboardTab in DropDown
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
        
        // Adding new Widget
        let widgetNew = new Widget;
console.log('3', this.eazlService.widgets)
        

        this.eazlService.addWidget( 
            {
                container: {
                backgroundColor: '',
                border: '',
                boxShadow: '',
                color: '',
                fontSize: 0,
                height: 0,
                left: 0,
                widgetTitle: '',
                top: 0,
                width: 0,
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
        });
console.log('4',this.eazlService.widgets)

//         widgetNew.container.backgroundColor = '';
//         widgetNew.container.border = '';
//         widgetNew.container.boxShadow = '';
//         widgetNew.container.color = '';
//         widgetNew.container.fontSize = 0;
//         widgetNew.container.height = 0;
//         widgetNew.container.left = 0;
//         widgetNew.container.widgetTitle = '';
//         widgetNew.container.top = 0;
//         widgetNew.container.width = 0;
// console.log('4')
    
//         widgetNew.areas.showWidgetText = false;
//         widgetNew.areas.showWidgetGraph = true;
//         widgetNew.areas.showWidgetTable = false;
//         widgetNew.areas.showWidgetImage = false;
    
//         widgetNew.textual.textText = '';
//         widgetNew.textual.textBackgroundColor = '';
//         widgetNew.textual.textBorder = '';
//         widgetNew.textual.textColor = '';
//         widgetNew.textual.textFontSize = 0;
//         widgetNew.textual.textFontWeight = '';
//         widgetNew.textual.textHeight = 0;
//         widgetNew.textual.textLeft = 0;
//         widgetNew.textual.textMargin = '';
//         widgetNew.textual.textPadding = '';
//         widgetNew.textual.textPosition = '';
//         widgetNew.textual.textTextAlign = '';
//         widgetNew.textual.textTop = 0;
//         widgetNew.textual.textWidth = 0;
    
//         widgetNew.graph.graphID = 0;
//         widgetNew.graph.graphLeft = 0;
//         widgetNew.graph.graphTop = 0;
//         widgetNew.graph.vegaParameters.vegaGraphHeight = 0;
//         widgetNew.graph.vegaParameters.vegaGraphWidth = 0;
//         widgetNew.graph.vegaParameters.vegaGraphPadding = 0;
//         widgetNew.graph.vegaParameters.vegaHasSignals = false;
//         widgetNew.graph.vegaParameters.vegaXcolumn = '';
//         widgetNew.graph.vegaParameters.vegaYcolumn = '';
//         widgetNew.graph.vegaParameters.vegaFillColor = '';
//         widgetNew.graph.vegaParameters.vegaHoverColor = '';
//         widgetNew.graph.spec = '';

//         widgetNew.table.tableColor = '';
//         widgetNew.table.tableCols = 0;
//         widgetNew.table.tableHeight = 0;
//         widgetNew.table.tableHideHeader = false;
//         widgetNew.table.tableLeft = 0;
//         widgetNew.table.tableRows = 0;
//         widgetNew.table.tableTop = 0;
//         widgetNew.table.tableWidth = 0;
    
//         widgetNew.image.imageAlt = '';
//         widgetNew.image.imageHeigt = 0;
//         widgetNew.image.imageLeft = 0;
//         widgetNew.image.imageSource = '';
//         widgetNew.image.imageTop = 0;
//         widgetNew.image.imageWidth = 0;
    
//         widgetNew.properties.widgetID = this.eazlService.getWidgetLastWidgetID();
//         widgetNew.properties.dashboardID = 0;
//         widgetNew.properties.dashboardTabID = 0;
//         widgetNew.properties.dashboardTabName = '';
//         widgetNew.properties.widgetCode = '';
//         widgetNew.properties.widgetName = '';
//         widgetNew.properties.widgetDescription = '';
//         widgetNew.properties.widgetDefaultExportFileType = '';
//         widgetNew.properties.widgetHyperLinkTabNr = '';
//         widgetNew.properties.widgetHyperLinkWidgetID = '';
//         widgetNew.properties.widgetRefreshMode = '';
//         widgetNew.properties.widgetRefreshFrequency = 0;
//         widgetNew.properties.widgetPassword = '';
//         widgetNew.properties.widgetIsLiked = false;
//         widgetNew.properties.widgetLiked = null;
        
//         widgetNew.properties.widgetReportID = 0;
//         widgetNew.properties.widgetReportName = '';
//         widgetNew.properties.widgetReportParameters = '';
//         widgetNew.properties.widgetShowLimitedRows = 0;
//         widgetNew.properties.widgetAddRestRow = false;
//         widgetNew.properties.widgetType = '';
//         widgetNew.properties.widgetComments = '';
//         widgetNew.properties.widgetIndex = 0;
//         widgetNew.properties.widgetIsLocked = false;
//         widgetNew.properties.widgetSize = '';
//         widgetNew.properties.widgetSystemMessage = '';
//         widgetNew.properties.widgetTypeID = 0;
//         widgetNew.properties.widgetRefreshedDateTime = '';
//         widgetNew.properties.widgetRefreshedUserName = '';
//         widgetNew.properties.widgetCreatedDateTime = '';
//         widgetNew.properties.widgetCreatedUserName = '';
//         widgetNew.properties.widgetUpdatedDateTime = '';
//         widgetNew.properties.widgetUpdatedUserName = '';





console.log('call this.Eazl. AddWidget', widgetNew)        

    }
} 