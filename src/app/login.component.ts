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


// For the resti
import { UserService, DataService, AuthenticationService, ReconnectingWebSocket } from './_services';
import { User, Token } from './_models';
import { Observable } from 'rxjs';


@Component({
    selector:    'login',
    templateUrl: 'login.component.html',
    styleUrls:  ['login.component.html'],
    inputs: ['usernameElement', ]
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
      private authService: AuthenticationService,
      private userService: UserService,
      private dataService: DataService,
      private channel: ReconnectingWebSocket,
      ) {}
  
  ngOnInit() {
      this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

      // FormBuilder
      this.userform = this.fb.group({
          'username': new FormControl('', Validators.required),
          'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      });
  }
  
  setCurrentUser(user: User) {
    this.submitted = true;
    this.userform.controls['password'].setValue('');
    this.globalVariableService.isCurrentUserAdmin.next(user.is_superuser);
    this.globalVariableService.currentUserUserName.next(user.username);
    this.globalVariableService.currentUserFirstName.next(user.first_name);
    this.globalVariableService.currentUserLastName.next(user.last_name);

    // Trigger event emitter 'emit' method
    this.formSubmit.emit(true);
  }

  onSubmit(value: string) {
    // User clicked submit button
    this.globalFunctionService.printToConsole(this.constructor.name,'onSubmit', '@Start');

    var username = this.userform.get('username').value;
    var password = this.userform.get('password').value;

    this.authService.login(username, password)
      .flatMap( 
        (authToken: Token, index: number) => {
          this.channel.connect(authToken);
          this.dataService.refreshAll();
          
          return this.userService.getCurrentUser()
      }).subscribe(
        (currentUser: User) => { this.setCurrentUser(currentUser) },
        (error) => { 
          this.globalVariableService.growlGlobalMessage.next(
            {
              severity: 'error', 
              summary: 'Error', 
              detail: `${JSON.stringify(error)}`
            }
          ) 
        },
        () => console.log('Complete')
      )
  }
}