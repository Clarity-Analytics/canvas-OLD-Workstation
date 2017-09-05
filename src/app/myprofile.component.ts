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
import { DataSource }                 from './model.datasource';
import { Dashboard }                  from './model.dashboards';
import { Group }                      from './model.group';
import { Report }                     from './model.report';
import { ReportHistory }              from './model.reportHistory';

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
    canvasUser: CanvasUser;                             // Current user
    configForm: FormGroup;
    dashboardsIown: Dashboard[];                        // List of Dashboards I own
    dashboardsSharedWithMe: Dashboard[];                // List of Dashboards
    datasources: DataSource[];                          // List of DataSources
    errorMessageOnForm: string = '';
    formIsValid: boolean = false;
    groups: Group[] = [];                               // List of Groups
    numberErrors: number = 0;
    reportHistory: ReportHistory[];                     // List of Report History (ran)
    reports: Report[];                                  // List of Reports
    selectedGroup: Group;                               // User that was clicked on

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
        this.configForm = this.fb.group({
            'username': new FormControl(''),
            'first_name': new FormControl(''),
            'last_name': new FormControl(''),
            'email': new FormControl(''),
        });

        // Current User
        this.canvasUser = this.globalVariableService.canvasUser.getValue();

        // Move values into form
        if (this.canvasUser != null) {
            this.configForm.controls['username'].setValue(this.canvasUser.username);
            this.configForm.controls['first_name'].setValue(this.canvasUser.first_name);
            this.configForm.controls['last_name'].setValue(this.canvasUser.last_name);
            this.configForm.controls['email'].setValue(this.canvasUser.email);
        }

        // My Groups
        if (this.canvasUser.groups != null) {
            this.groups = this.eazlService.getGroups(-1, this.canvasUser.groups);
        }

        // My Datasources
        this.datasources = this.eazlService.getDataSources();

        // My Reports
        this.reports = this.eazlService.getReports();

        // My Dashboards I own
        this.dashboardsIown = this.eazlService.getDashboards();

        // My Dashboards shared with me
        this.dashboardsSharedWithMe = this.eazlService.getDashboards();

        // Report History for me
        this.reportHistory = this.eazlService.getReportHistory(this.canvasUser.username)

    }

    onClickChangePassword() {
        //   Change password
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickChangePassword', '@Start');

    }
}