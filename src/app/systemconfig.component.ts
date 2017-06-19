// SystemConfig form
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

// Our Services
import { EazlService }                from './eazl.service';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { SystemConfiguration }        from './model.systemconfiguration';

@Component({
    selector:    'systemconfig',
    templateUrl: 'systemconfig.component.html',
    styleUrls:  ['systemconfig.component.css']
})
export class SystemConfigComponent implements OnInit {
    
    // Local properties
    configForm: FormGroup;
    errorMessageOnForm: string = '';
    formIsValid: boolean = false;
    numberErrors: number = 0;
    systemConfiguration: SystemConfiguration;       // System wide settings

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
        this.configForm = this.fb.group({
            'companyName':                  new FormControl('', Validators.required),
            'companyLogo':                  new FormControl(''),
            'backendUrl':                   new FormControl('', Validators.required),
            'defaultDaysToKeepResultSet':   new FormControl('', Validators.pattern('^[0-9]*$')),
            'averageWarningRuntime':        new FormControl('', Validators.pattern('^[0-9]*$')),
            'maxRowsDataReturned':          new FormControl('', Validators.pattern('^[0-9]*$')),
            'maxRowsPerWidgetGraph':        new FormControl('', Validators.pattern('^[0-9]*$')),
            'keepDevLoggedIn':              new FormControl(''),
            'frontendColorScheme':          new FormControl(''),
            'defaultWidgetConfiguration':   new FormControl(''),
            'defaultReportFilters':         new FormControl(''),
            'growlSticky':                  new FormControl(''),
            'growlLife':                    new FormControl('', Validators.pattern('^[0-9]*$')),
            'gridSize':                     new FormControl('', Validators.pattern('^[0-9]*$')),
            'snapToGrid':                   new FormControl('')
        });

        // Get the system wide settings
        this.systemConfiguration = this.eazlService.getSystemConfiguration();

        // Move the data into the form
        this.configForm.controls['companyName'].setValue(
            this.systemConfiguration.companyName);
        this.configForm.controls['companyLogo'].setValue(
            this.systemConfiguration.companyLogo);
        this.configForm.controls['backendUrl'].setValue(
            this.systemConfiguration.backendUrl);
        this.configForm.controls['defaultDaysToKeepResultSet'].setValue(
            this.systemConfiguration.defaultDaysToKeepResultSet);
        this.configForm.controls['averageWarningRuntime'].setValue(
            this.systemConfiguration.averageWarningRuntime);
        this.configForm.controls['maxRowsDataReturned'].setValue(
            this.systemConfiguration.maxRowsDataReturned);
        this.configForm.controls['maxRowsPerWidgetGraph'].setValue(
            this.systemConfiguration.maxRowsPerWidgetGraph);
        this.configForm.controls['keepDevLoggedIn'].setValue(
            this.systemConfiguration.keepDevLoggedIn);
        this.configForm.controls['frontendColorScheme'].setValue(
            this.systemConfiguration.frontendColorScheme);
        this.configForm.controls['defaultWidgetConfiguration'].setValue(
            this.systemConfiguration.defaultWidgetConfiguration);
        this.configForm.controls['defaultReportFilters'].setValue(
            this.systemConfiguration.defaultReportFilters);
        this.configForm.controls['growlSticky'].setValue(
            this.systemConfiguration.growlSticky);
        this.configForm.controls['growlLife'].setValue(
            this.systemConfiguration.growlLife);
        this.configForm.controls['gridSize'].setValue(
            this.systemConfiguration.gridSize);
        this.configForm.controls['snapToGrid'].setValue(
            this.systemConfiguration.snapToGrid);
    }

    onClickCancel() {
        // User clicked Cancel
        this.globalFunctionService.printToConsole(this.constructor.name, 'onClickCancel', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info',
            summary:  'Cancel',
            detail:   'No changes as requested'
        });
        
    }

    onSubmit(value: string) {
        // User clicked submit button
        this.globalFunctionService.printToConsole(this.constructor.name,'onSubmit', '@Start');

        this.formIsValid = false;
        this.numberErrors = 0;
        this.errorMessageOnForm = ''; 

        if (this.configForm.controls['companyName'].value == ''  || 
            this.configForm.controls['companyName'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 'The Company Name is compulsory.'
        }
        if (this.configForm.controls['backendUrl'].value == ''  || 
            this.configForm.controls['backendUrl'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 'The Backend Url (RESTi) is compulsory.'
        }
        if (this.configForm.controls['defaultDaysToKeepResultSet'].value == ''  || 
            this.configForm.controls['defaultDaysToKeepResultSet'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 'The days to keep resultsets is compulsory.'
        }
        if (this.configForm.controls['defaultDaysToKeepResultSet'].touched  && 
            !this.configForm.controls['defaultDaysToKeepResultSet'].valid) {
                if (this.configForm.controls['defaultDaysToKeepResultSet'].value != '0') {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The DaysToKeep (a ResultSet) must be numeric';
                }
        }                
        if (this.configForm.controls['averageWarningRuntime'].value == ''  || 
            this.configForm.controls['averageWarningRuntime'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 'The avg warning runtime is compulsory.'
        }
        if (this.configForm.controls['averageWarningRuntime'].touched  && 
            !this.configForm.controls['averageWarningRuntime'].valid) {
                if (this.configForm.controls['averageWarningRuntime'].value != '0') {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The average Warning Runtime must be numeric';
                }
        }
        if (this.configForm.controls['maxRowsDataReturned'].value == ''  || 
            this.configForm.controls['maxRowsDataReturned'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 'The max data rows returned is compulsory.'
        }
        if (this.configForm.controls['maxRowsDataReturned'].touched  && 
            !this.configForm.controls['maxRowsDataReturned'].valid) {
                if (this.configForm.controls['maxRowsDataReturned'].value != '0') {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The max Rows of Data to be Returned must be numeric';
                }
        }
        if (this.configForm.controls['maxRowsPerWidgetGraph'].value == ''  || 
            this.configForm.controls['maxRowsPerWidgetGraph'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 'The Max rows per WidgetGraph is compulsory.'
        }
        if (this.configForm.controls['maxRowsPerWidgetGraph'].touched  && 
            !this.configForm.controls['maxRowsPerWidgetGraph'].valid) {
                if (this.configForm.controls['maxRowsPerWidgetGraph'].value != '0') {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The max Rows Per WidgetGraph must be numeric';
                }
        }
        if (this.configForm.controls['growlLife'].value == ''  || 
            this.configForm.controls['growlLife'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 'The Growl Life is compulsory.'
        }
        if (this.configForm.controls['growlLife'].touched  && 
            !this.configForm.controls['growlLife'].valid) {
                if (this.configForm.controls['growlLife'].value != '0') {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The growl Life must be numeric';
                }
        }
        if (this.configForm.controls['gridSize'].value == ''  || 
            this.configForm.controls['gridSize'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 'The GridSize is compulsory.'
        }
        if (this.configForm.controls['gridSize'].touched  && 
            !this.configForm.controls['gridSize'].valid) {
                if (this.configForm.controls['gridSize'].value != '0') {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The Grid Size must be numeric';
                }
        }
        if (this.configForm.controls['snapToGrid'].value == ''  || 
            this.configForm.controls['snapToGrid'].value == null) {
            this.formIsValid = false;
            this.numberErrors = this.numberErrors + 1;
            this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 'The SnapToGrid is compulsory.'
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
        this.eazlService.updateSystemConfiguration(
            {
                systemConfigurationID: 0,
                companyName: this.configForm.controls['companyName'].value,
                companyLogo: this.configForm.controls['companyLogo'].value,
                backendUrl: this.configForm.controls['backendUrl'].value,
                defaultDaysToKeepResultSet: this.configForm.controls['defaultDaysToKeepResultSet'].value,
                averageWarningRuntime: this.configForm.controls['averageWarningRuntime'].value,
                maxRowsDataReturned: this.configForm.controls['maxRowsDataReturned'].value,
                maxRowsPerWidgetGraph: this.configForm.controls['maxRowsPerWidgetGraph'].value,
                keepDevLoggedIn: this.configForm.controls['keepDevLoggedIn'].value,
                frontendColorScheme: this.configForm.controls['frontendColorScheme'].value,
                defaultWidgetConfiguration: this.configForm.controls['defaultWidgetConfiguration'].value,
                defaultReportFilters: this.configForm.controls['defaultReportFilters'].value,
                growlSticky: this.configForm.controls['growlSticky'].value,
                growlLife: this.configForm.controls['growlLife'].value,
                gridSize: this.configForm.controls['gridSize'].value,
                snapToGrid: this.configForm.controls['snapToGrid'].value
            }
        )

        // Tell user
        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info',
            summary:  'Updated',
            detail:   'The information has been updated'
        });
    }
} 