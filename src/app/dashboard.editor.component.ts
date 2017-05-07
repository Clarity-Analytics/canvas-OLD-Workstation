// Login form
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
import { GlobalFunctionService }      from './global.function.service';
import { GlobalVariableService }      from './global.variable.service';

@Component({
    selector:    'dashboard-editor',
    templateUrl: 'dashboard.editor.component.html',
    styleUrls:  ['dashboard.editor.component.html']
})
export class DashboardEditorComponent implements OnInit {

    @Input() selectedDashboardID: number;

    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() formSubmit: EventEmitter<boolean> = new EventEmitter();
    
    // Local properties
    dashboardForm: FormGroup;

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
            'dashboardID': new FormControl(''),
            'dashboardCode': new FormControl('', Validators.required),
            'dashboardName': new FormControl('', Validators.required),
            'dashboardBackgroundPicturePath': new FormControl(''),
            'dashboardComments': new FormControl(''),
            'dashboardCreatedDateTime': new FormControl(''),
            'dashboardCreatedUserID': new FormControl(''),
            'dashboardDefaultExportFileType': new FormControl(''),
            'dashboardDescription': new FormControl(''),
            'dashboardIsLocked': new FormControl(''),
            'dashboardOpenTabNr': new FormControl(''),
            'dashboardOwnerUserID': new FormControl(''),
            'dashboardPassword': new FormControl(''),
            'dashboardRefreshedDateTime': new FormControl(''),
            'dashboardRefreshMode': new FormControl(''),
            'dashboardSystemMessage': new FormControl(''),
            'dashboardUpdatedDateTime': new FormControl(''),
            'dashboardUpdatedUserID': new FormControl(''),
        });
    }


    ngOnChanges() {
        // Reacts to changes in selectedWidget
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges', '@Start');

console.log (this.selectedDashboardID,this.eazlService.getDashboards(this.selectedDashboardID))


// selectedDashboardID
//         // Load the form
//         let selectedDashboard = this.eazlService.getDashboards()

//         // Clear the form for new one
//         if (this.addEditMode == 'Add' && this.displayEditWidget) {

//             this.identificationForm.reset();
//             this.identificationForm.reset();
//             this.identificationForm.reset();
//         }

//         // Populate the popup form when it is opened, and in Edit mode only
//         if (this.addEditMode == 'Edit' && this.displayEditWidget) {

//             // Indicate we loading form -> valueChange routine dont fire
//             this.isLoadingForm = true;
// //widgetReportName                        
// console.log("{id: 0, name: '" + this.widgetToEdit.properties.widgetTabName + "'}")
//             if (this.widgetToEdit.properties.widgetID == this.widgetIDtoEdit) {

//                 if (this.widgetToEdit.properties.widgetTabName) {
//                     this.identificationForm.controls['widgetTabName']
//                         .setValue("{id: 0, name: 'Value'}");
//                         // .setValue("{id: 0, name: '" + this.widgetToEdit.properties.widgetTabName + "'}");
//                 }
//                 if (this.widgetToEdit.container.widgetTitle) {
//                     this.identificationForm.controls['widgetTitle']
    }
         
    onSubmit(value: string) {
        // User clicked submit button
        this.globalFunctionService.printToConsole(this.constructor.name,'onSubmit', '@Start');

console.log (this.selectedDashboardID,this.eazlService.getDashboards(this.selectedDashboardID))

         // Trigger event emitter 'emit' method
         this.formSubmit.emit(true);
    }
}