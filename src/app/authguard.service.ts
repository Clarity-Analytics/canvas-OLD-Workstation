// Guards the routes - returns True / False if user can proceed with route
import { ActivatedRouteSnapshot }     from '@angular/router';
import { CanActivate }                from '@angular/router';
import { DOCUMENT }                   from '@angular/platform-browser';
import { Inject }                     from "@angular/core";
import { Injectable }                 from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Router }                     from '@angular/router';
import { Routes }                     from '@angular/router';
import { RouterStateSnapshot }        from '@angular/router';

// Our Services
import { GlobalVariableService }      from './global-variable.service';
import { GlobalFunctionService }      from './global-function.service';

@Injectable()
export class AuthGuard implements OnInit, CanActivate {
    currentUserName: string = '';

    constructor(
        // private alertService: AlertService,
        private globalVariableService: GlobalVariableService,
        private globalFunctionService: GlobalFunctionService,
        private router: Router,
        @Inject(DOCUMENT) private document: Document,

        ) { }

    ngOnInit() {
        //   Form initialisation
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // Obtain the username from the global variables
        this.globalFunctionService.printToConsole(this.constructor.name,'canActivate', '@Start');

        // If not logged in, bail
        if (this.globalVariableService.canvasUser.getValue() == null) {
            return false;
        }

        this.currentUserName = this.globalVariableService.canvasUser.getValue().username;
        this.globalFunctionService.printToConsole(
            this.constructor.name,'canActivate', 'Found user: '
                + this.currentUserName
        );

        if (this.currentUserName != "") {
            return true;
        }

        // Sorry, not logged in
        this.globalFunctionService.printToConsole(
            this.constructor.name,'canActivate',
                'Registration NOT successful for ' + this.currentUserName + ' ...'
        );

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'warn',
            summary:  'Not Logged in',
            detail:   'User ' + this.currentUserName + ' not logged in'
        });

        // this.router.navigate(['pagenotfound']);
        return false;
   }

    canDeactivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, router: Router, routes: Routes) {
        // Run deactivation in AuthGuard
        this.globalFunctionService.printToConsole(this.constructor.name,'canDeactivate', '@Start');

        let oldRouterPath: string = state.url[0]['path'];

        if (oldRouterPath == 'users') {
            return window.confirm('Demo to prevent leaving Canvas.  Do you really want to go to ' + routes['url'] + ' ?');
        }
        if (oldRouterPath == 'dashboard') {

            // Set the document / body background color
            let frontendColorScheme = this.globalVariableService.frontendColorScheme;
            this.document.body.style.backgroundColor =  frontendColorScheme;
            this.document.body.style.backgroundImage = '';
        }

        // Return
        return true;
    }
}
