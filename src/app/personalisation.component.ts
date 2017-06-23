// Personalisation form
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
import { Personalisation }           from './model.personalisation';

@Component({
    selector:    'personalisation',
    templateUrl: 'personalisation.component.html',
    styleUrls:  ['personalisation.component.css']
})
export class PersonalisationComponent implements OnInit {
    
    // Local properties
    configForm: FormGroup;
    errorMessageOnForm: string = '';
    formIsValid: boolean = false;
    numberErrors: number = 0;
    personalisation: Personalisation;       // System wide settings

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
            'averageWarningRuntime':        new FormControl('', Validators.pattern('^[0-9]*$')),
            'dashboardIDStartup':           new FormControl('', Validators.required),
            'environment':                  new FormControl(''),
            'frontendColorScheme':          new FormControl(''),
            'defaultReportFilters':         new FormControl(''),
            'defaultWidgetConfiguration':   new FormControl(''),
            'gridSize':                     new FormControl('', Validators.pattern('^[0-9]*$')),
            'growlSticky':                  new FormControl(''),
            'growlLife':                    new FormControl('', Validators.pattern('^[0-9]*$')),
            'keepDevLoggedIn':              new FormControl(''),
            'snapToGrid':                   new FormControl('')
        });

        // Get the system wide settings
        this.personalisation = this.eazlService.getPersonalisation();

        // Move the data into the form
        this.configForm.controls['dashboardIDStartup'].setValue(
            this.personalisation.dashboardIDStartup);
        this.configForm.controls['environment'].setValue(
            this.personalisation.environment);
        this.configForm.controls['averageWarningRuntime'].setValue(
            this.personalisation.averageWarningRuntime);
        this.configForm.controls['keepDevLoggedIn'].setValue(
            this.personalisation.keepDevLoggedIn);
        this.configForm.controls['frontendColorScheme'].setValue(
            this.personalisation.frontendColorScheme);
        this.configForm.controls['defaultWidgetConfiguration'].setValue(
            this.personalisation.defaultWidgetConfiguration);
        this.configForm.controls['defaultReportFilters'].setValue(
            this.personalisation.defaultReportFilters);
        this.configForm.controls['growlSticky'].setValue(
            this.personalisation.growlSticky);
        this.configForm.controls['growlLife'].setValue(
            this.personalisation.growlLife);
        this.configForm.controls['gridSize'].setValue(
            this.personalisation.gridSize);
        this.configForm.controls['snapToGrid'].setValue(
            this.personalisation.snapToGrid);
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

        if (this.configForm.controls['dashboardIDStartup'].touched  && 
            !this.configForm.controls['dashboardIDStartup'].valid) {
                if (this.configForm.controls['dashboardIDStartup'].value != '0') {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The dashboardID to show at Startup must be numeric';
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
        this.eazlService.updatePersonalisation(
            {
                personalisationID: 0,
                averageWarningRuntime: this.configForm.controls['averageWarningRuntime'].value,
                dashboardIDStartup: this.configForm.controls['dashboardIDStartup'].value,
                environment: this.configForm.controls['environment'].value,
                frontendColorScheme: this.configForm.controls['frontendColorScheme'].value,
                defaultReportFilters: this.configForm.controls['defaultReportFilters'].value,
                defaultWidgetConfiguration: this.configForm.controls['defaultWidgetConfiguration'].value,
                gridSize: this.configForm.controls['gridSize'].value,
                growlSticky: this.configForm.controls['growlSticky'].value,
                growlLife: this.configForm.controls['growlLife'].value,
                keepDevLoggedIn: this.configForm.controls['keepDevLoggedIn'].value,
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