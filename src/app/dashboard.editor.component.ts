// Login form
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
import { GlobalFunctionService }      from './global.function.service';
import { GlobalVariableService }      from './global.variable.service';

@Component({
    selector:    'dashboard-editor',
    templateUrl: 'dashboard.editor.component.html',
    styleUrls:  ['dashboard.editor.component.html']
})
export class DashboardEditorComponent implements OnInit {

    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() formSubmit: EventEmitter<boolean> = new EventEmitter();
    
    // Local properties
    dashboardForm: FormGroup;

    constructor(
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
    
    onSubmit(value: string) {
        // User clicked submit button
        this.globalFunctionService.printToConsole(this.constructor.name,'onSubmit', '@Start');

        // Super security, for now.  First reset
        this.globalVariableService.isCurrentUserAdmin.next(false);

         // Trigger event emitter 'emit' method
         this.formSubmit.emit(true);
    }
}