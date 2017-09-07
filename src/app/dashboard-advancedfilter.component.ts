// Advanced Filter on Dashboards
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
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our models
import { Filter }                     from './model.filter';

@Component({
    selector:    'dashboardadvancedfilter',
    templateUrl: 'dashboard-advancedfilter.component.html',
    styleUrls:  ['dashboard-advancedfilter.component.css']
})
export class DashboardAdvFilterComponent implements OnInit {

    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() formAdvancedFilterSubmit: EventEmitter<Filter> = new EventEmitter();

    // Local properties
    filterDescription: string = ''
    submitted: boolean;
    userform: FormGroup;

    constructor(
        private fb: FormBuilder,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        ) {}

    ngOnInit() {
        //   Form initialisation
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // FormBuilder
        this.userform = this.fb.group({
            'description': new FormControl(''),
        });
    }

    onClickClearForm() {
        // Clear the whole damn form
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickClearForm', '@Start');
         this.userform.controls['description'].setValue('');
    }

    onSubmit(formValues: string) {
        // User clicked submit button
        this.globalFunctionService.printToConsole(this.constructor.name,'onSubmit', '@Start');

        this.filterDescription = this.userform.get('description').value;
console.log('formValues',formValues)
        // Set hasAtLeastOneFilter = true if anything was entered.
        // TODO - make this a loop on formValues or this.userform
        let totalFilters: string  = this.filterDescription;
        let hasAtLeastOneFilter: boolean = false;
        if ( totalFilters != '') {
            hasAtLeastOneFilter = true;
        }

        // Trigger event emitter 'emit' method
        this.formAdvancedFilterSubmit.emit(
            {
                filterID: 0,
                hasAtLeastOneFilter: hasAtLeastOneFilter,
                description: this.filterDescription
            }
        );
    }
}