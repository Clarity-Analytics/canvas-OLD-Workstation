// WhoAMI form
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

// Our Models
import { CanvasUser }                 from './model.user';

// Our Services
import { EazlService }                from './eazl.service';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';


@Component({
    selector:    'whoami',
    templateUrl: 'whoami.component.html',
    styleUrls:  ['whoami.component.css']
})
export class WhoAmIComponent implements OnInit {

    @Input() displayWhoAmIForm: boolean;
    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() handleWhoAmISubmit: EventEmitter<boolean> = new EventEmitter();
    
    // Local properties
    canvasUser: CanvasUser;                         // Current user
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
            'username':         new FormControl(''),
            'first_name':       new FormControl(''),
            'last_name':        new FormControl(''),
            'email':            new FormControl(''),
            'is_superuser':     new FormControl(''),
            'is_staff':         new FormControl(''),
            'is_active':        new FormControl(''),
            'date_joined':      new FormControl(''),
            'last_login':       new FormControl(''),
        });

    }

    ngOnChanges() {
        // Reacts to changes in selectedGroup
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges', '@Start');

        this.canvasUser = this.globalVariableService.canvasUser.getValue();

        // Move values into form
        if (this.canvasUser != null) {
            this.userform.controls['username'].setValue(this.canvasUser.username);
            this.userform.controls['first_name'].setValue(this.canvasUser.first_name);
            this.userform.controls['last_name'].setValue(this.canvasUser.last_name);
            this.userform.controls['email'].setValue(this.canvasUser.email);
            this.userform.controls['is_superuser'].setValue(this.canvasUser.is_superuser);
            this.userform.controls['is_staff'].setValue(this.canvasUser.is_staff);
            this.userform.controls['is_active'].setValue(this.canvasUser.is_active);
            this.userform.controls['date_joined'].setValue(this.canvasUser.date_joined);
            this.userform.controls['last_login'].setValue(this.canvasUser.last_login);
        }
    }
    
    onClickCancel(value: string) {
        // User clicked submit button
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickCancel', '@Start');

        // Trigger event emitter 'emit' method
        this.handleWhoAmISubmit.emit(true);
    }
} 