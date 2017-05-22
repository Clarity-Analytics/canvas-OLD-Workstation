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

export class SelectedItem {
    id: any;
    name: string;
}

@Component({
    selector:    'dashboard-tab-editor',
    templateUrl: 'dashboard-tab-editor.component.html',
    styleUrls:  ['dashboard-tab-editor.component.html']
})
export class DashboardTabEditorComponent implements OnInit {
 
    @Input() selectedDashboardID: number;
    @Input() selectedDashboardTab: SelectedItem; 
    @Input() displayTabDetails: boolean;

    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() formSubmit: EventEmitter<boolean> = new EventEmitter();
    
    // Local properties
    dashboardTabForm: FormGroup;                        // FormBuilder Group
    currentDashboardTab: DashboardTab;                  // Dashboard Tab selected on parent form
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
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // FormBuilder
        this.dashboardTabForm = this.fb.group({
            'dashboardID':                      new FormControl(''),
            'dashboardTabID':                   new FormControl(''),
            'dashboardTabName':                 new FormControl(''),
            'dashboardTabDescription':          new FormControl(''),
            'dashboardCreatedDateTime':         new FormControl(''),
            'dashboardCreatedUserID':           new FormControl(''),
            'dashboardTabUpdatedDateTime':      new FormControl(''),
            'dashboardTabUpdatedUserID':        new FormControl(''),
        });
    }

    ngOnChanges() {
        // Reacts to changes in selectedWidget
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChange', '@Start');

        // Refresh the form
        if (this.displayTabDetails) {
            this.refreshForm()
        }
    }

    refreshForm() {
        // Reacts to changes in selectedWidget
        this.globalFunctionService.printToConsole(this.constructor.name, 'refreshForm', '@Start');

        // Get the selected Dashboard
        this.currentDashboardTab = this.eazlService.getDashboardTabs(
            this.selectedDashboardID, this.selectedDashboardTab.id)[0];
// console.log('refreshForm 0 selectedDashboardID=', this.selectedDashboardID)
// console.log('refreshForm 1 selectedDashboardTab.id', this.selectedDashboardTab.id)
// console.log('refreshForm 2 selectedDashboardTab', this.selectedDashboardTab)
console.log('refreshForm 3 currentDashboardTab' , this.currentDashboardTab)

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
            this.dashboardTabForm.controls['dashboardCreatedDateTime'].setValue(
                this.currentDashboardTab.dashboardCreatedDateTime
            );
            this.dashboardTabForm.controls['dashboardCreatedUserID'].setValue(
                this.currentDashboardTab.dashboardCreatedUserID
            );
            this.dashboardTabForm.controls['dashboardTabUpdatedDateTime'].setValue(
                this.currentDashboardTab.dashboardTabUpdatedDateTime
            );
            this.dashboardTabForm.controls['dashboardTabUpdatedUserID'].setValue(
                this.currentDashboardTab.dashboardTabUpdatedUserID
            );

    console.log ('refreshForm @End', this.selectedDashboardID,this.dashboardTabForm.controls['dashboardName'].value)
        }

    }
         
    onSubmit(value: string) {
        // User clicked submit button
        this.globalFunctionService.printToConsole(this.constructor.name,'onSubmit', '@Start');

console.log ('subm', this.selectedDashboardID,this.dashboardTabForm.controls['dashboardName'].value)

        // Validation
        // if (this.identificationForm.controls['widgetType'].value == ''  || 
        //     this.identificationForm.controls['widgetType'].value == null) {
        //         this.formIsValid = false;
        //         this.numberErrors = this.numberErrors + 1;
        //         this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
        //             'The Widget Type is compulsory.';
        // }


        // Oi, something is not right
        // if (this.errorMessageOnForm != '') {
        //     this.formIsValid = true;
        //     this.globalVariableService.growlGlobalMessage.next({
        //         severity: 'error',
        //         summary: 'Error',
        //         detail: this.numberErrors.toString() + ' error(s) encountered'
        //     });
        //     return;
        // }

        // Update DB
                //     this.widgetToEdit.container.widgetTitle = 
                // this.identificationForm.controls['widgetTitle'].value;

         // Trigger event emitter 'emit' method
         this.formSubmit.emit(true);
    }
}