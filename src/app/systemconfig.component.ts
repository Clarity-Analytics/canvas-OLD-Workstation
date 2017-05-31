// SystemConfig form
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

@Component({
    selector:    'systemconfig',
    templateUrl: 'systemconfig.component.html',
    styleUrls:  ['systemconfig.component.html']
})
export class SystemConfigComponent implements OnInit {

    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() formSubmit: EventEmitter<boolean> = new EventEmitter();
    
    // Local properties
    configForm: FormGroup;

    constructor(
        private eazlService: EazlService,
        private fb: FormBuilder,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        ) {}
    
    ngOnInit() {
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // FormBuilder
        this.configForm = this.fb.group({
            'companyName':                  new FormControl('', Validators.required),
            'companyLogo':                  new FormControl(''),
            'backendUrl':                   new FormControl('', Validators.required),
            'defaultDaysToKeepResultSet':   new FormControl('', Validators.pattern('^[0-9]*$')),
            'averageWarningRuntime':        new FormControl('', Validators.pattern('^[0-9]*$')),
            'maxRowsDataReturned':          new FormControl('', Validators.pattern('^[0-9]*$')),
            'maxRowsPerWidgetGraph':        new FormControl('', Validators.pattern('^[0-9]*$')),
            'keepDevLoggedIn':              new FormControl(''),
            'frontendColorScheme':          new FormControl(''),
            'defaultWidgetConfiguration':   new FormControl(''),
            'defaultReportFilters':         new FormControl(''),
            'growlSticky':                  new FormControl(''),
            'growlLife':                    new FormControl('', Validators.pattern('^[0-9]*$')),
            'gridSize':                     new FormControl('', Validators.pattern('^[0-9]*$')),
            'snapToGrid':                   new FormControl('')
        });
    }
    
    onSubmit(value: string) {
        // User clicked submit button
        this.globalFunctionService.printToConsole(this.constructor.name,'onSubmit', '@Start');

        var username = this.configForm.get('username').value;

    }
} 