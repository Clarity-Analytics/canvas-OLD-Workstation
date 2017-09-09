// Create Report Builder form
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
    selector:    'report-builder',
    templateUrl: 'report.builder.component.html',
    styleUrls:  ['report.builder.component.css']
})
export class ReportBuilderComponent implements OnInit {

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
            'hostName':         new FormControl('', Validators.required),
            'port':             new FormControl('', Validators.required),
            'database':         new FormControl('', Validators.required),
            'userName':         new FormControl('', Validators.required),
            'password':         new FormControl('', Validators.required),
            'tableName':        new FormControl('', Validators.required)
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

        if (this.userform.controls['hostName'].value.name == ''  ||
            this.userform.controls['hostName'].value.name == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                    'The hostName is compulsory.';
        }
        if (this.userform.controls['database'].value.name == ''  ||
            this.userform.controls['database'].value.name == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                    'The database Name is compulsory.';
        }
        if (this.userform.controls['userName'].value.name == ''  ||
            this.userform.controls['userName'].value.name == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                    'The userName is compulsory.';
        }
        if (this.userform.controls['tableName'].value.name == ''  ||
            this.userform.controls['tableName'].value.name == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                    'The tableName is compulsory.';
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

console.log('ReportBuilder ...')        

    }
}