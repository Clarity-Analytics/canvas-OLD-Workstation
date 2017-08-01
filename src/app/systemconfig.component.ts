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
            'maxRowsDataReturned':          new FormControl('', Validators.pattern('^[0-9]*$')),
            'maxRowsPerWidgetGraph':        new FormControl('', Validators.pattern('^[0-9]*$')),
        });

        // Get the system wide settings
        this.systemConfiguration = this.eazlService.getSystemConfiguration();

        // Load the data into the form
        this.loadForm();
    }

    loadForm() {
        // Move the data into the form
        this.globalFunctionService.printToConsole(this.constructor.name,'loadForm', '@Start');

        this.configForm.controls['companyName'].setValue(
            this.systemConfiguration.companyName);
        this.configForm.controls['companyLogo'].setValue(
            this.systemConfiguration.companyLogo);
        this.configForm.controls['backendUrl'].setValue(
            this.systemConfiguration.backendUrl);
        this.configForm.controls['defaultDaysToKeepResultSet'].setValue(
            this.systemConfiguration.defaultDaysToKeepResultSet);
        this.configForm.controls['maxRowsDataReturned'].setValue(
            this.systemConfiguration.maxRowsDataReturned);
        this.configForm.controls['maxRowsPerWidgetGraph'].setValue(
            this.systemConfiguration.maxRowsPerWidgetGraph);
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
                systemConfigurationID: this.globalVariableService.systemConfigurationID,
                companyName: this.configForm.controls['companyName'].value,
                companyLogo: this.configForm.controls['companyLogo'].value,
                backendUrl: this.configForm.controls['backendUrl'].value,
                defaultDaysToKeepResultSet: this.configForm.controls['defaultDaysToKeepResultSet'].value,
                maxRowsDataReturned: this.configForm.controls['maxRowsDataReturned'].value,
                maxRowsPerWidgetGraph: this.configForm.controls['maxRowsPerWidgetGraph'].value,
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