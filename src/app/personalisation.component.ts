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
import { CanvasColors }               from './chartcolors.data';
import { CanvasUser }                 from './model.user';
import { Personalisation }            from './model.personalisation';
import { SelectedItemColor }          from './model.selectedItemColor';
import { SelectedItem }               from './model.selectedItem';
import { User }                       from './model.user';

@Component({
    selector:    'personalisation',
    templateUrl: 'personalisation.component.html',
    styleUrls:  ['personalisation.component.css']
})
export class PersonalisationComponent implements OnInit {

    // Local properties
    canvasUser: CanvasUser = this.globalVariableService.canvasUser.getValue();
    users: User[];                              // Current users 
    chartColor: SelectItem[];                   // Options for Backgroun-dColor DropDown
    configForm: FormGroup;
    dashboardDropDown: SelectItem[];            // Drop Down options
    errorMessageOnForm: string = '';
    formIsValid: boolean = false;
    growlSticky: boolean = false;               // True if the Growl must be sticky
    numberErrors: number = 0;
    personalisation: Personalisation;           // System wide settings
    selectedItemColor: SelectedItemColor;       // Selected Object: note ANY to cater for ID number, string
    selectedFrontendColorScheme: SelectedItem;  // Selected option for Text Color
    selectedDashboard: SelectedItem;            // Selected in DropDown
    snapToGrid: boolean = false;                // True if widgets must snap to the grid

    constructor(
        private canvasColors: CanvasColors,
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
            'dashboardStartupName':         new FormControl(''),
            'environment':                  new FormControl(''),
            'frontendColorScheme':          new FormControl(''),
            'defaultReportFilters':         new FormControl(''),
            'defaultWidgetConfiguration':   new FormControl(''),
            'gridSize':                     new FormControl('', Validators.pattern('^[0-9]*$')),
            'growlSticky':                  new FormControl(''),
            'growlLife':                    new FormControl('', Validators.pattern('^[0-9]*$')),
            'snapToGrid':                   new FormControl('')
        });

        // Fill combos
        // this.dashboardDropDown = this.eazlService.getDashboardSelectionItems();
        this.dashboardDropDown = [{label: 'None', value: {id: -1, name: 'None'} }]
        this.dashboardDropDown = this.dashboardDropDown.concat(
            this.eazlService.getDashboardSelectionItems()
        );

        // Background Colors Options
        this.chartColor = [];
        this.chartColor = this.canvasColors.getColors();

        // Get the system wide settings
        this.personalisation = this.eazlService.getPersonalisation();

        // Get the users
        this.users = this.eazlService.getUsers();

        // Load the data into the form
        this.loadForm();
    }

    loadForm() {
        // Move the data into the form
        this.globalFunctionService.printToConsole(this.constructor.name,'loadForm', '@Start');
console.log('pers', this.canvasUser.id,  this.users)
console.log('pers', this.canvasUser,  this.personalisation)

let index: number = -1;
for (var i = 0; i < this.users.length; i++) {
    if (this.canvasUser.id == this.users[i].id) {
        index = i;
        break;
    }
}
if (index == -1) {
    alert ("Error - current user id in canvasUser not in users object !")
}
console.log ('index', index, this.users[index].profile.growlLife)

//  color_scheme = frontendColorScheme
// query_runtime_warning = averageWarningRuntime
// default_widget_configuration
// this.personalisation.dashboardIDStartup
        if (this.personalisation.dashboardIDStartup != -1) {
            let dashboardName: string = '';
            dashboardName = this.eazlService.getdashboardName(this.personalisation.dashboardIDStartup);
            if (dashboardName != null) {
                this.selectedDashboard = {
                    id: this.personalisation.dashboardIDStartup,
                    name: dashboardName
                };
            }
        }

        this.configForm.controls['environment'].setValue(
            this.personalisation.environment);
        this.configForm.controls['averageWarningRuntime'].setValue(
            this.personalisation.averageWarningRuntime);
        this.configForm.controls['frontendColorScheme'].setValue(
            this.personalisation.frontendColorScheme);

        this.selectedItemColor = {
            id: this.personalisation.frontendColorScheme,
            name: this.personalisation.frontendColorScheme,
            code: this.canvasColors.hexCodeOfColor(
                this.personalisation.frontendColorScheme
            )
        }
        this.configForm.controls['frontendColorScheme'].setValue(
            this.selectedItemColor
        );
        this.selectedFrontendColorScheme = this.selectedItemColor;
        this.configForm.controls['defaultWidgetConfiguration'].setValue(
            this.personalisation.defaultWidgetConfiguration);
        this.configForm.controls['defaultReportFilters'].setValue(
            this.personalisation.defaultReportFilters);
        this.configForm.controls['growlSticky'].setValue(
            this.personalisation.growlSticky);
        this.growlSticky = this.personalisation.growlSticky;
        this.configForm.controls['growlLife'].setValue(
            this.personalisation.growlLife);
        this.configForm.controls['gridSize'].setValue(
            this.personalisation.gridSize);
        this.snapToGrid = this.personalisation.snapToGrid;
        this.configForm.controls['snapToGrid'].setValue(
            this.personalisation.snapToGrid);
    }

    onSubmit(value: string) {
        // User clicked submit button
        this.globalFunctionService.printToConsole(this.constructor.name,'onSubmit', '@Start');

        this.formIsValid = false;
        this.numberErrors = 0;
        this.errorMessageOnForm = '';

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

        let dashboardIDWorking: number = -1;
        if (this.configForm.controls['dashboardStartupName'].value != undefined) {
            dashboardIDWorking = this.configForm.controls['dashboardStartupName'].value.id;
        }

        // Only the name is stored in the DB
        let textColorWorking: string = '';
        if (this.selectedFrontendColorScheme != undefined) {
            textColorWorking = this.selectedFrontendColorScheme.name;
        }

        this.eazlService.updatePersonalisation(
            {
                personalisationID: this.globalVariableService.personalisationID,
                personalisationRecordID: this.globalVariableService.personalisationRecordID,
                averageWarningRuntime: this.configForm.controls['averageWarningRuntime'].value,
                dashboardIDStartup: dashboardIDWorking,
                environment: this.configForm.controls['environment'].value,
                frontendColorScheme: textColorWorking,
                defaultReportFilters: this.configForm.controls['defaultReportFilters'].value,
                defaultWidgetConfiguration: this.configForm.controls['defaultWidgetConfiguration'].value,
                gridSize: this.configForm.controls['gridSize'].value,
                growlSticky: this.configForm.controls['growlSticky'].value,
                growlLife: this.configForm.controls['growlLife'].value,
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