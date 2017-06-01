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
import { CanvasDate }                 from './date.services';
import { EazlService }                from './eazl.service';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our models
import { CanvasColors }               from './chartcolors.data';
import { CanvasUser }                 from './model.user';
import { Dashboard }                  from './model.dashboards';
import { SelectedItemColor }          from './model.selectedItemColor';

@Component({
    selector:    'dashboard-editor',
    templateUrl: 'dashboard-editor.component.html',
    styleUrls:  ['dashboard-editor.component.css']
})
export class DashboardEditorComponent implements OnInit {

    @Input() addEditMode: string;
    @Input() displayDashboardPopup: boolean;
    @Input() selectedDashboardID: number;
    @Input() selectedDashboard: Dashboard;          // Dashboard selected on parent form
    @Input() dashboardToEdit:Dashboard;             // Dashboard that is editted
    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() formDashboardSubmit: EventEmitter<string> = new EventEmitter();
    
    // Local properties
    canvasUser: CanvasUser = this.globalVariableService.canvasUser.getValue();
    dashboardForm: FormGroup;                       // FormBuilder Group
    errorMessageOnForm: string = '';                // Error handling on form
    formIsValid: boolean = false;                   // Error handling on form
    numberErrors: number = 0;                       // Error handling on form
    selectedTextBackground: SelectedItemColor;      // Selected option for Text Background
    selectedItemColor: SelectedItemColor;           // Selected Object: note ANY to cater for ID number, string
    chartColor: SelectItem[];                       // Options for Backgroun-dColor DropDown

    constructor(
        private canvasColors: CanvasColors,
        private canvasDate: CanvasDate,
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

        // Background Colors Options
        this.chartColor = [];
        this.chartColor = this.canvasColors.getColors();
    }

    ngOnChanges() {

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
            // this.dashboardForm.controls['dashboardBackgroundColor'].setValue(
            //     this.selectedDashboard.dashboardBackgroundColor
            // );

            this.selectedItemColor = {
                id: this.selectedDashboard.dashboardBackgroundColor,             
                name: this.selectedDashboard.dashboardBackgroundColor,             
                code: this.canvasColors.hexCodeOfColor(
                    this.selectedDashboard.dashboardBackgroundColor
                )
            }
            this.dashboardForm.controls['dashboardBackgroundColor'].setValue(
                this.selectedItemColor
            );
            this.selectedTextBackground = this.selectedItemColor;



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
        // User clicked Submit button.
        // Note: it is assumed that 
        // - all the fields are tested to be valid and proper in the validation.
        //   If not, return right after validation.  
        // - all fields are loaded in dashboardToEdit which is shared with the calling routine
        //   It is assumes is that dashboardToEdit is 100% complete and accurate before return
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickDashboardSubmit', '@Start');

        // Validation: note that == null tests for undefined as well
        this.formIsValid = false;
        this.errorMessageOnForm = '';
        this.numberErrors = 0;

        // Validation
        if (this.dashboardForm.controls['dashboardCode'].value == ''  || 
            this.dashboardForm.controls['dashboardCode'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Dashboard Code is compulsory.';
        }
        if (this.dashboardForm.controls['dashboardName'].value == ''  || 
            this.dashboardForm.controls['dashboardName'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Dashboard Name is compulsory.';
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
        if (this.addEditMode == 'Add' && this.displayDashboardPopup) {
            // Space to worry about EDIT only mode - for future use
        }


        // Editing existing Dashboard
        if (this.addEditMode == 'Edit' && this.displayDashboardPopup) {
            // Space to worry about EDIT only mode - for future use
        }

        // Load fields from form - assume ALL good as Validation will stop bad stuff
        this.dashboardToEdit.dashboardID = 
            this.dashboardForm.controls['dashboardID'].value;
        this.dashboardToEdit.dashboardCode = 
            this.dashboardForm.controls['dashboardCode'].value;
        this.dashboardToEdit.dashboardName = 
            this.dashboardForm.controls['dashboardName'].value;
        this.dashboardToEdit.dashboardBackgroundImageSrc = 
            this.dashboardForm.controls['dashboardBackgroundImageSrc'].value;
        this.dashboardToEdit.dashboardComments = 
            this.dashboardForm.controls['dashboardComments'].value;
        this.dashboardToEdit.isContainerHeaderDark = 
            this.dashboardForm.controls['isContainerHeaderDark'].value;
        this.dashboardToEdit.showContainerHeader = 
            this.dashboardForm.controls['showContainerHeader'].value;
        // this.dashboardToEdit.dashboardBackgroundColor = 
        //     this.dashboardForm.controls['dashboardBackgroundColor'].value;

        this.dashboardToEdit.dashboardBackgroundColor = 
            this.selectedTextBackground.name;


        this.dashboardToEdit.dashboardNrGroups = 
            this.dashboardForm.controls['dashboardNrGroups'].value;
        this.dashboardToEdit.dashboardIsLiked = 
            this.dashboardForm.controls['dashboardIsLiked'].value;
        this.dashboardToEdit.dashboardNrSharedWith = 
            this.dashboardForm.controls['dashboardNrSharedWith'].value;
        this.dashboardToEdit.dashboardDefaultExportFileType = 
            this.dashboardForm.controls['dashboardDefaultExportFileType'].value;
        this.dashboardToEdit.dashboardDescription = 
            this.dashboardForm.controls['dashboardDescription'].value;
        this.dashboardToEdit.dashboardIsLocked = 
            this.dashboardForm.controls['dashboardIsLocked'].value;
        this.dashboardToEdit.dashboardOpenTabNr = 
            this.dashboardForm.controls['dashboardOpenTabNr'].value;
        this.dashboardToEdit.dashboardOwnerUserID = 
            this.dashboardForm.controls['dashboardOwnerUserID'].value;
        this.dashboardToEdit.dashboardPassword = 
            this.dashboardForm.controls['dashboardPassword'].value;
        this.dashboardToEdit.dashboardRefreshMode = 
            this.dashboardForm.controls['dashboardRefreshMode'].value;
        this.dashboardToEdit.dashboardSystemMessage = 
            this.dashboardForm.controls['dashboardSystemMessage'].value;
            this.canvasDate.now('standard');
        this.dashboardToEdit.dashboardUpdatedUserID = 
            this.canvasUser.username;


//         // Set last updated, created and refreshed properties
//         let d = new Date();
//         this.widgetToEdit.properties.widgetRefreshedDateTime =
//             this.canvasDate.today('standard') + ' ' + 
//             this.canvasDate.curHour(d).toString() + ':' + 
//             this.canvasDate.curMinute(d).toString();
//         this.widgetToEdit.properties.widgetRefreshedUserID = 
//             this.canvasUser.username;
//         this.widgetToEdit.properties.widgetUpdatedDateTime = 
//             this.canvasDate.today('standard') + ' ' + 
//             this.canvasDate.curHour(d).toString() + ':' + 
//             this.canvasDate.curMinute(d).toString();
//         this.widgetToEdit.properties.widgetUpdatedUserID = 
//             this.canvasUser.username;
console.log('@end', this.dashboardToEdit)

         // Trigger event emitter 'emit' method
         this.formDashboardSubmit.emit('Submit');
    }
}