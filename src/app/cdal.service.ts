// Canvas Data Access Layer, Service that provides all data (from the DB)
import { Injectable }                 from '@angular/core';
import { Headers }                    from '@angular/http';
import { Http }                       from '@angular/http';
import { Observable }                 from 'rxjs/Observable';
import { OnInit }                     from '@angular/core';
import { Response }                   from '@angular/http';
import { RequestOptions }             from '@angular/http';

// Our Services
import { CanvasDate }                 from './date.services';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';
 
// Our models
import { CanvasUser }                 from './model.user';
import { Dashboard }                  from './model.dashboards';
import { DashboardGroup }             from './model.dashboardGroup';
import { DashboardGroupMembership }   from './model.dashboardGroupMembership';
import { DashboardGroupRelationship } from './model.dashboardGroupRelationship';
import { DashboardsPerUser }          from './model.dashboardsPerUser';
import { DashboardUserRelationship }  from './model.dashboardUserRelationship';
import { DashboardTab }               from './model.dashboardTabs';
import { DataSource }                 from './model.datasource';
import { DatasourcesPerUser }         from './model.datasourcesPerUser';
import { DataSourceUserAccess }       from './model.datasourceUserAccess';
import { EazlUser }                   from './model.user';
import { Group }                      from './model.group';
import { GroupDatasourceAccess }      from './model.groupDSaccess';
import { CanvasMessage }              from './model.canvasMessage';
import { Report }                     from './model.report';
import { ReportHistory }              from './model.reportHistory';
import { ReportWidgetSet }            from './model.report.widgetSets';
import { ReportUserRelationship }     from './model.reportUserRelationship';
import { SystemConfiguration }        from './model.systemconfiguration';
import { User }                       from './model.user';
import { UserGroupMembership }        from './model.userGroupMembership';
import { Widget }                     from './model.widget';
import { WidgetComment }              from './model.widget.comment';
import { WidgetTemplate }             from './model.widgetTemplates';

import { EazlService }                from './eazl.service';

var req = new XMLHttpRequest();

@Injectable()
export class CDAL implements OnInit {
    httpBaseUri: string;                                    // url for the RESTi
    httpHeaders: Headers;                                   // Header for http
    httpOptions: RequestOptions;                            // Options for http
    route: string = 'users';                                // Route to RESTi - users/authen...

    // Local Arrays to keep data for the rest of the Application
users: Observable<User[]>;                                     // List of Users
usersRaw: Observable<any>;                                     // List of Users

    constructor(
        private canvasDate: CanvasDate,
        private eazlService: EazlService,
        
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private http: Http,



        ) {
            this.httpBaseUri = `${window.location.protocol}//${window.location.hostname}:8000/api/`
            this.httpHeaders = new Headers({'Content-Type': 'application/json'});
            this.httpOptions = new RequestOptions({headers: this.httpHeaders});
console.log('cdal 1')
this.globalFunctionService.printToConsole(this.constructor.name,'constructor **', '@Start');
    }

    ngOnInit() {
        // Starters
console.log('cdal 2')
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit **', '@Start');

            this.get<EazlUser>(`${this.route}`)
                .subscribe(eazlUser => this.usersRaw);

 
            // this.get<EazlUser>(`${this.route}`)
            //         .map( eazlUser => {    
            //             this.users = [];

            //             for (var i = 0; i < eazlUser.length; i++) {
            //                 this.users.push({
            //                     username: eazlUser[i].username,
            //                     firstName: eazlUser[i].first_name,
            //                     lastName: eazlUser[i].last_name,
            //                     nickName: eazlUser[i].first_name,
            //                     photoPath: 'pic',
            //                     lastDatetimeLoggedIn: eazlUser[i].last_login,
            //                     lastDatetimeReportWasRun: '',
            //                     emailAddress: eazlUser[i].email,
            //                     cellNumber: '082-011-1234',
            //                     workTelephoneNumber: '011-222-3456',
            //                     activeFromDate: '2017/05/01',
            //                     inactiveDate: '',
            //                     dateCreated: eazlUser[i].date_joined,
            //                     userIDLastUpdated: '',
            //                     isStaff: eazlUser[i].is_staff,
            //                 });
            //             }

            //             // Not dirty any longer
            //             this.globalVariableService.isDirtyUsers.next(false);

            //             // Return the data
            //             return this.users;
            //         } )

    }



getUsers() {
console.log('cdal 3')
let usrRaw: EazlUser[];
    this.get<EazlUser>(`${this.route}`)
                .subscribe(
                    (eazlUser) => {
                        usrRaw = [];

                        for (var i = 0; i < eazlUser.length; i++) {
                            usrRaw.push(eazlUser[i])
                        }
                    })
                    return usrRaw
    
}

    get<T>(route: string, data?: Object): Observable<any> {
console.log('cdal 4', this.prepareRoute(route), this.httpOptions, this.httpOptions )
this.httpOptions = this.eazlService.httpOptions;
this.httpBaseUri = this.eazlService.httpBaseUri  
this.httpHeaders = this.eazlService.httpHeaders
this.httpOptions = this.eazlService.httpOptions
console.log('cdal 4', this.prepareRoute(route), this.httpOptions, this.httpOptions )
        // Get from http
        // this.globalFunctionService.printToConsole(this.constructor.name,'get', '@Start');

        return this.http.get(this.prepareRoute(route), this.httpOptions)
            .map(this.parseResponse)
            .catch(this.handleError);
    }
    prepareRoute(route: string): string {
        if (route.slice(-1) !== '/') {
            route = `${route}/`;
        }

        if (route.slice(0) === '/') {
            route = route.slice(1);
        }
        return `${this.httpBaseUri}${route}`;
    }

    parseResponse(response: Response) {
        return response.json() || {};
    }

    handleError(response: Response | any): Observable<Response> {
console.log('cdal 7')
        // Error for observable
        // this.globalFunctionService.printToConsole(this.constructor.name,'handleError', '@Start');

        var error: string = '';
         // Do some logging one day
        if (response instanceof Response) {
            var payload = response.json() || '';
             error = payload.body || JSON.stringify(payload);
        } else {
            error = response.message ? response.message : response.toString();
        }
         return Observable.throw(error);
    }

}
