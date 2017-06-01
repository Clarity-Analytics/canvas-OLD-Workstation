// My Profile form
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
import { CanvasUser }                 from './model.user';

// Our Services
import { EazlService }                from './eazl.service';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { SystemConfiguration }        from './model.systemconfiguration';

@Component({
    selector:    'myprofile',
    templateUrl: 'myprofile.component.html',
    styleUrls:  ['myprofile.component.css']
})
export class MyProfileComponent implements OnInit {
    
    // Local properties
    configForm: FormGroup;
    errorMessageOnForm: string = '';
    formIsValid: boolean = false;
    numberErrors: number = 0;
    canvasUser: CanvasUser;                         // Current user

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
            'username': new FormControl(''),
            'first_name': new FormControl(''),
            'last_name': new FormControl(''),
            'email': new FormControl(''),
        });

        this.canvasUser = this.globalVariableService.canvasUser.getValue();

        // Move values into form
        if (this.canvasUser != null) {
            this.configForm.controls['username'].setValue(this.canvasUser.username);
            this.configForm.controls['first_name'].setValue(this.canvasUser.first_name);
            this.configForm.controls['last_name'].setValue(this.canvasUser.last_name);
            this.configForm.controls['email'].setValue(this.canvasUser.email);
        }

    }
} 