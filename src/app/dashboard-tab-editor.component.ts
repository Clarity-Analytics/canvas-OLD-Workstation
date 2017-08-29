// Dashboard Tab Editor
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

// Our Services
import { EazlService }                from './eazl.service';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our models
import { DashboardTab }               from './model.dashboardTabs';
import { SelectedItem }               from './model.selectedItem';


@Component({
    selector:    'dashboard-tab-editor',
    templateUrl: 'dashboard-tab-editor.component.html',
    styleUrls:  ['dashboard-tab-editor.component.css']
})
export class DashboardTabEditorComponent implements OnInit {

    @Input() selectedDashboardID: number;
    @Input() selectedDashboardTab: SelectedItem;
    // @Input() displayTabDetails: boolean;

    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() formDashboarTabSubmit: EventEmitter<boolean> = new EventEmitter();

    // Local properties
    currentDashboardTab: DashboardTab;                  // Dashboard Tab selected on parent form
    dashboardTabForm: FormGroup;                        // FormBuilder Group
    errorMessageOnForm: string = '';                    // Accum errors found in validation
    formIsValid: boolean = false;                       // True to be okay
    numberErrors: number = 0;                           // Nr of errors found in Validation

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
        this.dashboardTabForm = this.fb.group({
            'dashboardID':                      new FormControl(''),
            'dashboardTabID':                   new FormControl(''),
            'dashboardTabName':                 new FormControl(''),
            'dashboardTabDescription':          new FormControl(''),
            'dashboardTabCreatedDateTime':      new FormControl(''),
            'dashboardTabCreatedUserName':      new FormControl(''),
            'dashboardTabUpdatedDateTime':      new FormControl(''),
            'dashboardTabUpdatedUserName':      new FormControl(''),
        });

            this.refreshForm()
    }

    refreshForm() {
        // Reacts to changes in selectedWidget
        this.globalFunctionService.printToConsole(this.constructor.name, 'refreshForm', '@Start');

        // Get the selected Dashboard
        this.currentDashboardTab = this.eazlService.getDashboardTabs(
            this.selectedDashboardID, this.selectedDashboardTab.id)[0];

        // First ngOnChanges runs before the OnInit
        if (this.dashboardTabForm != undefined) {

            // Clear the form
            this.dashboardTabForm.reset();

            // Populate
            this.dashboardTabForm.controls['dashboardID'].setValue(
                this.currentDashboardTab.dashboardID
            );
            this.dashboardTabForm.controls['dashboardTabID'].setValue(
                this.currentDashboardTab.dashboardTabID
            );
            this.dashboardTabForm.controls['dashboardTabName'].setValue(
                this.currentDashboardTab.dashboardTabName
            );
            this.dashboardTabForm.controls['dashboardTabDescription'].setValue(
                this.currentDashboardTab.dashboardTabDescription
            );
            this.dashboardTabForm.controls['dashboardTabCreatedDateTime'].setValue(
                this.currentDashboardTab.dashboardTabCreatedDateTime
            );
            this.dashboardTabForm.controls['dashboardTabCreatedUserName'].setValue(
                this.currentDashboardTab.dashboardTabCreatedUserName
            );
            this.dashboardTabForm.controls['dashboardTabUpdatedDateTime'].setValue(
                this.currentDashboardTab.dashboardTabUpdatedDateTime
            );
            this.dashboardTabForm.controls['dashboardTabUpdatedUserName'].setValue(
                this.currentDashboardTab.dashboardTabUpdatedUserName
            );
        }

    }

    onClickCancel (){
        // User clicked cancel button
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickCancel', '@Start');
        this.formDashboarTabSubmit.emit(false);
        this.globalVariableService.growlGlobalMessage.next({
            severity: 'warn',
            summary:  'Cancel',
            detail:   'No changes as requested'
        });
    }

    onClickSubmit(value: string) {
        // User clicked submit button
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickSubmit', '@Start');

        // Validation: note that == null tests for undefined as well
        this.formIsValid = false;
        this.errorMessageOnForm = '';
        this.numberErrors = 0;

        if (this.dashboardTabForm.controls['dashboardTabName'].value == ''  ||
            this.dashboardTabForm.controls['dashboardTabName'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                    'The Tab Name is compulsory.';
        }
        if (this.dashboardTabForm.controls['dashboardTabDescription'].value == ''  ||
            this.dashboardTabForm.controls['dashboardTabDescription'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                    'The Tab Description is compulsory.';
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

        // Update DB
        this.eazlService.updateDashboardTab(
            this.currentDashboardTab.dashboardID,
            this.currentDashboardTab.dashboardTabID,
            this.dashboardTabForm.controls['dashboardTabDescription'].value
        );

        // Trigger event emitter 'emit' method
        this.formDashboarTabSubmit.emit(true);
    }
}