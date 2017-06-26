// Create New Widget form (shortcut)
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

// Our Models
import { SelectedItem }               from './model.selectedItem';
import { Widget }                     from './model.widget';

// Our Services
import { EazlService }                from './eazl.service';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

@Component({
    selector:    'widget-new',
    templateUrl: 'widget.new.component.html',
    styleUrls:  ['widget.new.component.css']
})
export class WidgetNewComponent implements OnInit {

    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() formSubmit: EventEmitter<boolean> = new EventEmitter();
    
    // Local properties
    dashboardDropDown: SelectItem[] = [];     // Dashboards in DropDown
    dashboardTabsDropDown: SelectItem[] = []; // DashboardTab in DropDown
    errorMessageOnForm: string = '';
    formIsValid: boolean = false;
    isLoadingForm: boolean = false;
    numberErrors: number = 0;
    selectedDashboard: SelectedItem;            // Selected in DropDown
    selectedDashboardTab: SelectedItem;         // Selected in DropDown
    userform: FormGroup;
    
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
        this.userform = this.fb.group({
            'dashboardName':    new FormControl('', Validators.required),
            'dashboardTabName': new FormControl('', Validators.required)
        });

        // Fill the DropDowns
        this.dashboardDropDown = this.eazlService.getDashboardSelectionItems();
        
    }
    
    onChangeLoadDashboardTabDrowdown(event) {
        // User changed Dashboard dropdown, so now populate array of tabs
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeLoadDashboardTabDrowdown', '@Start');
        this.dashboardTabsDropDown = 
            this.eazlService.getDashboardTabsSelectItems(+event.value.id);
    }
    
    onSubmit(value: string) {
        // User clicked submit button
        this.globalFunctionService.printToConsole(this.constructor.name,'onSubmit', '@Start');

        if (this.userform.controls['dashboardName'].value == ''  || 
            this.userform.controls['dashboardName'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Dashboard Name is compulsory.';
        }
        if (this.userform.controls['widgetCode'].value == ''  || 
            this.userform.controls['widgetCode'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Dashboard Tab Name is compulsory.';
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
        let widgetNew = new Widget;
        widgetNew.properties.dashboardID = 0;
        widgetNew.properties.widgetID = 0; // Set in DB

console.log('call this.Eazl. AddWidget')        

    }
} 