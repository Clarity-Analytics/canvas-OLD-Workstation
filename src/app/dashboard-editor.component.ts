// Dashboard Editor
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
import { Dashboard }                  from './model.dashboards';

@Component({
    selector:    'dashboard-editor',
    templateUrl: 'dashboard-editor.component.html',
    styleUrls:  ['dashboard-editor.component.html']
})
export class DashboardEditorComponent implements OnInit {

    @Input() addEditMode: string;
    @Input() displayDashboardPopup: boolean;
    @Input() selectedDashboardID: number;
    @Input() selectedDashboard: Dashboard;          // Dashboard selected on parent form
    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() formDashboardSubmit: EventEmitter<string> = new EventEmitter();
    
    // Local properties
    dashboardForm: FormGroup;                           // FormBuilder Group
    errorMessageOnForm: string = '';
    formIsValid: boolean = false;
    numberErrors: number = 0;

    constructor(
        private eazlService: EazlService,
        private fb: FormBuilder,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        ) {}
     
    ngOnInit() {
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // FormBuilder
        this.dashboardForm = this.fb.group({
            'dashboardID':                      new FormControl(''),
            'dashboardCode':                    new FormControl('', Validators.required),
            'dashboardName':                    new FormControl('', Validators.required),
            'dashboardBackgroundImageSrc':      new FormControl(''),
            'dashboardComments':                new FormControl(''),
            'isContainerHeaderDark':            new FormControl(''),
            'showContainerHeader':              new FormControl(''),
            'dashboardBackgroundColor':         new FormControl(''),
            'dashboardNrGroups':                new FormControl(''),
            'dashboardIsLiked':                 new FormControl(''),
            'dashboardNrSharedWith':            new FormControl(''),
            'dashboardDefaultExportFileType':   new FormControl(''),
            'dashboardDescription':             new FormControl(''),
            'dashboardIsLocked':                new FormControl(''),
            'dashboardOpenTabNr':               new FormControl(''),
            'dashboardOwnerUserID':             new FormControl(''),
            'dashboardPassword':                new FormControl(''),
            'dashboardRefreshMode':             new FormControl(''),
            'dashboardSystemMessage':           new FormControl(''),
            'dashboardRefreshedDateTime':       new FormControl(''),
            'dashboardRefreshedUserID':         new FormControl(''),
            'dashboardUpdatedDateTime':         new FormControl(''),
            'dashboardUpdatedUserID':           new FormControl(''),
            'dashboardCreatedDateTime':         new FormControl(''),
            'dashboardCreatedUserID':           new FormControl('')
        });
 
console.log('@end ngOnInit')
    }

    ngOnChanges() {
console.log('ngOnChanges',this.addEditMode, this.displayDashboardPopup, this.selectedDashboard)

        // Clear the form for new one
        if (this.addEditMode == 'Add' && this.displayDashboardPopup) {

            this.dashboardForm.reset();
        }

        // Populate the popup form when it is opened, and in Edit mode only
        if (this.addEditMode == 'Edit' && this.displayDashboardPopup) {

            // Populate
            this.dashboardForm.controls['dashboardID'].setValue(
                this.selectedDashboard.dashboardID
            );
            this.dashboardForm.controls['dashboardCode'].setValue(
                this.selectedDashboard.dashboardCode
            );
            this.dashboardForm.controls['dashboardName'].setValue(
                this.selectedDashboard.dashboardName
            );
            this.dashboardForm.controls['dashboardBackgroundImageSrc'].setValue(
                this.selectedDashboard.dashboardBackgroundImageSrc
            );
            this.dashboardForm.controls['dashboardComments'].setValue(
                this.selectedDashboard.dashboardComments
            );
            this.dashboardForm.controls['dashboardCreatedDateTime'].setValue(
                this.selectedDashboard.dashboardCreatedDateTime
            );
            this.dashboardForm.controls['dashboardCreatedUserID'].setValue(
                this.selectedDashboard.dashboardCreatedUserID
            );
            this.dashboardForm.controls['dashboardDefaultExportFileType'].setValue(
                this.selectedDashboard.dashboardDefaultExportFileType
            );
            this.dashboardForm.controls['dashboardDescription'].setValue(
                this.selectedDashboard.dashboardDescription
            );
            this.dashboardForm.controls['dashboardIsLocked'].setValue(
                this.selectedDashboard.dashboardIsLocked
            );
            this.dashboardForm.controls['dashboardOpenTabNr'].setValue(
                this.selectedDashboard.dashboardOpenTabNr
            );
            this.dashboardForm.controls['dashboardOwnerUserID'].setValue(
                this.selectedDashboard.dashboardOwnerUserID
            );
            this.dashboardForm.controls['dashboardPassword'].setValue(
                this.selectedDashboard.dashboardPassword
            );
            this.dashboardForm.controls['dashboardRefreshedDateTime'].setValue(
                this.selectedDashboard.dashboardRefreshedDateTime
            );
            this.dashboardForm.controls['dashboardRefreshMode'].setValue(
                this.selectedDashboard.dashboardRefreshMode
            );
            this.dashboardForm.controls['dashboardSystemMessage'].setValue(
                this.selectedDashboard.dashboardSystemMessage
            );
            this.dashboardForm.controls['dashboardUpdatedDateTime'].setValue(
                this.selectedDashboard.dashboardUpdatedDateTime
            );
            this.dashboardForm.controls['dashboardUpdatedUserID'].setValue(
                this.selectedDashboard.dashboardUpdatedUserID
            );
            this.dashboardForm.controls['isContainerHeaderDark'].setValue(
                this.selectedDashboard.isContainerHeaderDark
            );
            this.dashboardForm.controls['showContainerHeader'].setValue(
                this.selectedDashboard.showContainerHeader
            );
            this.dashboardForm.controls['dashboardBackgroundColor'].setValue(
                this.selectedDashboard.dashboardBackgroundColor
            );
            this.dashboardForm.controls['dashboardNrGroups'].setValue(
                this.selectedDashboard.dashboardNrGroups
            );
            this.dashboardForm.controls['dashboardIsLiked'].setValue(
                this.selectedDashboard.dashboardIsLiked
            );
            this.dashboardForm.controls['dashboardNrSharedWith'].setValue(
                this.selectedDashboard.dashboardNrSharedWith
            );
            this.dashboardForm.controls['dashboardRefreshedUserID'].setValue(
                this.selectedDashboard.dashboardRefreshedUserID
            );
        }

    }
    
    onClickDashboardCancel() {
        // User clicked Cancel button
        this.globalFunctionService.printToConsole(this.constructor.name,'onSubmit', '@Start');

        // Return to calling routine
        this.formDashboardSubmit.emit('Cancel');

    }

    onClickDashboardSubmit() {
        // User clicked Submit button
        this.globalFunctionService.printToConsole(this.constructor.name,'onSubmit', '@Start');

console.log ('subm', this.selectedDashboardID,this.dashboardForm.controls['dashboardName'].value)

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
         this.formDashboardSubmit.emit('Submit');
    }
}