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
import { EazlService }                from './eazl.service';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

@Component({
    selector:    'login',
    templateUrl: 'login.component.html',
    styleUrls:  ['login.component.html']
})
export class LoginComponent implements OnInit {

    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() formSubmit: EventEmitter<boolean> = new EventEmitter();
    
    // Local properties
    currentUser: string = '';
    submitted: boolean;
    userform: FormGroup;

    constructor(
        private eazlService: EazlService,
        private fb: FormBuilder,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        ) {}
    
    ngOnInit() {
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // FormBuilder
        this.userform = this.fb.group({
            'username': new FormControl('', Validators.required),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
        });
    }
    
    onSubmit(value: string) {
        // User clicked submit button
        this.globalFunctionService.printToConsole(this.constructor.name,'onSubmit', '@Start');

        var username = this.userform.get('username').value;
        var password = this.userform.get('password').value;
  
        // Login, and set currentUser if successful
        this.eazlService.login(username, password)
            .then(user => {
                this.submitted = true;
                this.userform.controls['password'].setValue('');
                this.globalVariableService.currentUserUserName.next(user.first_name || user.username);
                  
                // Trigger event emitter 'emit' method
                this.formSubmit.emit(true);
            }
        )
            .catch(err => console.log('login error',err))
    }
}