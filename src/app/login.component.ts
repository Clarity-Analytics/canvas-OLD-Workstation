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
        private fb: FormBuilder,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        ) {}
    
    ngOnInit() {
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // FormBuilder
        this.userform = this.fb.group({
            'firstname': new FormControl('', Validators.required),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
        });
    }
    
    onSubmit(value: string) {
        // User clicked submit button
        this.globalFunctionService.printToConsole(this.constructor.name,'onSubmit', '@Start');

        // Super security, for now.  First reset
        this.globalVariableService.isCurrentUserAdmin.next(false);

        if (this.userform.get('firstname').value == 'Jannie'
         && this.userform.get('password').value == 'jjjjjj') {
             this.currentUser = this.userform.get('firstname').value;
             this.globalVariableService.isCurrentUserAdmin.next(true);
             this.globalVariableService.currentUserUserName.next(this.currentUser);
         };
        if (this.userform.get('firstname').value == 'Bradley'
         && this.userform.get('password').value == 'bbbbbb') {
             this.currentUser = this.userform.get('firstname').value;
             this.globalVariableService.isCurrentUserAdmin.next(true);
             this.globalVariableService.currentUserUserName.next(this.currentUser);
         };
        if (this.userform.get('firstname').value == 'Anne'
         && this.userform.get('password').value == 'aaaaaa') {
             this.currentUser = this.userform.get('firstname').value;
             this.globalVariableService.isCurrentUserAdmin.next(false);
             this.globalVariableService.currentUserUserName.next(this.currentUser);
         };

         if (this.currentUser == '') {
            this.submitted = false;
         } else {
            this.submitted = true;
         }

         // Clear the password, dont want it hanging around
         this.userform.controls['password'].setValue('');

         // Trigger event emitter 'emit' method
         this.formSubmit.emit(true);
    }
}