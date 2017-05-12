// Guards the routes - returns True / False if user can proceed with route
import { ActivatedRouteSnapshot }     from '@angular/router';
import { CanActivate }                from '@angular/router';
import { OnInit }                     from '@angular/core';
import { Injectable }                 from '@angular/core';
import { Router }                     from '@angular/router';
import { RouterStateSnapshot }        from '@angular/router';
 
// Our Services
import { GlobalVariableService }      from './global-variable.service';
import { GlobalFunctionService }      from './global-function.service';

@Injectable()
export class AuthGuard implements OnInit, CanActivate {
    currentUserUserName: string = '';
    
    constructor(
        // private alertService: AlertService,
        private globalVariableService: GlobalVariableService,
        private globalFunctionService: GlobalFunctionService,
        private router: Router,  

        ) { }

    ngOnInit() {
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // Obtain the username from the global variables
        this.globalFunctionService.printToConsole(this.constructor.name,'canActivate', '@Start');
        this.currentUserUserName = this.globalVariableService.currentUserUserName.getValue();
        this.globalFunctionService.printToConsole(
            this.constructor.name,'canActivate', 'Found user: ' 
                + this.currentUserUserName
        );

        if (this.currentUserUserName != "") {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'info', 
                summary:  'Registration', 
                detail:   'User registration successful'
            });

            return true;
        }
 
        // Sorry, not logged in
        this.globalFunctionService.printToConsole(
            this.constructor.name,'canActivate', 
                'Registration NOT successful for ' + this.currentUserUserName + ' ...'
        );

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'warn', 
            summary:  'Not Logged in', 
            detail:   'User ' + this.currentUserUserName + ' not logged in'
        });
        
        // this.router.navigate(['pagenotfound']);
        return false;
   }
}
