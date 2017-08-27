// DataSources form
import { Component }                  from '@angular/core';
import { OnInit }                     from '@angular/core';
import { ViewEncapsulation }          from '@angular/core';

// PrimeNG
import { ConfirmationService }        from 'primeng/primeng';
import { MenuItem }                   from 'primeng/primeng';
import { Message }                    from 'primeng/primeng';

// Our Components

// Our Services
import { EazlService }                from './eazl.service';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our models
import { CanvasDate }                 from './date.services';
import { CanvasUser }                 from './model.user';
import { DataSource}                  from './model.datasource';
import { DataSourceGroupPermissions}  from './model.datasource';
import { DataSourceUserPermissions}   from './model.datasource';
import { EazlUser }                   from './model.user';
import { Group }                      from './model.group';
import { Report }                     from './model.report';
import { ReportHistory }              from './model.reportHistory';
import { User }                       from './model.user';

@Component({
    selector:    'report',
    templateUrl: 'report.component.html',
    styleUrls:  ['report.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ReportComponent implements OnInit {

    // Local properties
    canvasUser: CanvasUser = this.globalVariableService.canvasUser.getValue();
    datasourceGroupPermissions: DataSourceGroupPermissions[];   // User permissions
    datasourceUserPermissions: DataSourceUserPermissions[];     // User permissions
    displayGroupPermissions: boolean = false;           // True to show permissions panel
    displayUserPermissions: boolean = false;            // True to show permissions panel
    displayReportHistory: boolean;                      // True to display Report History
    groups: Group[];                                    // List of Groups
    displayNewWidgetForm: boolean = false;              // True to show popup for New Widget
    displayReportBuilderForm: boolean = false;          // True to show popup for Report Builder
    popuMenuItems: MenuItem[];                          // Items in popup
    reportHistory: ReportHistory[];                     // List of Report History (ran)
    reports: Report[];                                  // List of Reports
    selectedGroupPermission: DataSourceGroupPermissions;// Selected in table
    selectedUserPermission: DataSourceUserPermissions;  // Selected in table
    selectedReport: Report;                             // Selected one
    users: User[];                                      // List of Users with Access

    constructor(
        private confirmationService: ConfirmationService,
        private canvasDate: CanvasDate,
        private eazlService: EazlService,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        ) {
    }

    ngOnInit() {
        //   Form initialisation
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.reports = this.eazlService.getReports();

        this.popuMenuItems = [
            {
                label: 'Shared Users',
                icon: 'fa-users',
                command: (event) => this.datasourceMenuUserPermissions(this.selectedReport)
            },
            {
                label: 'Shared Groups',
                icon: 'fa-users',
                command: (event) => this.datasourceMenuGroupPermissions(this.selectedReport)
            },
            {
                label: 'Report History',
                icon: 'fa-table',
                command: (event) => this.reportMenuReportHistory(this.selectedReport)
            },
            {
                label: 'Create Widget',
                icon: 'fa-bar-chart-o',
                command: (event) => this.reportMenuCreateWidget(this.selectedReport)
            },
            {
                label: 'Report Builder',
                icon: 'fa-cubes',
                command: (event) => this.reportMenuReportBuilder(this.selectedReport)
            },

        ];
    }

    onClickReportTable() {
        // Dashboard clicked on a row
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickReportTable', '@Start');

        // For later ...
    }

    datasourceMenuUserPermissions(selectedReport: Report) {
        // Users with their permissions for the Datasource of the selected Report
        // - selectedReport: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'datasourceMenuUserPermissions', '@Start');

        // Get the current and available user shared with; as a Promise to cater for Async
        this.eazlService.getdatasourceUserPermissions(
            selectedReport.dataSourceID
        )
            .then(dashUsrPer => {
                this.datasourceUserPermissions = dashUsrPer;
                if (this.datasourceUserPermissions.length > 0) {
                    this.selectedUserPermission = this.datasourceUserPermissions[0];
                };

                this.displayUserPermissions = true;
            })
            .catch(err => {
                this.globalVariableService.growlGlobalMessage.next({
                    severity: 'warn',
                    summary:  'User permissions',
                    detail:   'Getting user permissions failed'
                });
            });

    }

    datasourceMenuGroupPermissions(selectedReport: Report) {
        // Groups with their permissions for the Datasource of the selected Report
        // - selectedReport: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'datasourceMenuGroupPermissions', '@Start');

        // Get the current and available user shared with; as a Promise to cater for Async
        this.eazlService.getdatasourceGroupPermissions(
            selectedReport.dataSourceID
        )
            .then(dashGrpPer => {
                this.datasourceGroupPermissions = dashGrpPer;
                if (this.datasourceGroupPermissions.length > 0) {
                    this.selectedGroupPermission = this.datasourceGroupPermissions[0];
                };

                this.displayGroupPermissions = true;
            })
            .catch(err => {
                this.globalVariableService.growlGlobalMessage.next({
                    severity: 'warn',
                    summary:  'Group permissions',
                    detail:   'Getting user permissions failed'
                });
            });

    }

    onClickUserPermissionCancel() {
        // Close Group Permissions panel
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickUserPermissionCancel', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'warn',
            summary:  'Cancel',
            detail:   'As requested, no changes were applied'
        });

        // Close popup
        this.displayUserPermissions = false;
    }

    onClickGroupPermissionCancel() {
        // Close Group Permissions panel
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickGroupPermissionCancel', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'warn',
            summary:  'Cancel',
            detail:   'As requested, no changes were applied'
        });

        // Close popup
        this.displayGroupPermissions = false;
    }

    onClickUserDatasource() {
        // User clicked on a row
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickUserDatasource', '@Start');

        // For future use ...
    }

    reportMenuReportHistory(selectedReport: Report) {
        // Show history of reports ran for the selected Dashboard
        // - selectedReport: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'reportMenuReportHistory', '@Start');

        // Report History for me
        this.reportHistory = this.eazlService.getReportHistory(
            '*',
            -1,
            selectedReport.dataSourceID
        )

        // Show the popup
        this.displayReportHistory = true;
    }

    reportMenuCreateWidget(selectedReport: Report) {
        // Show popup to create a widget, with basic info
        // - selectedReport: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'reportMenuCreateWidget', '@Start');

        this.displayNewWidgetForm = true;
    }

    reportMenuReportBuilder(selectedReport: Report) {
        // Show popup to build a report = query
        // - selectedReport: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'reportMenuReportBuilder', '@Start');

        this.displayReportBuilderForm = true;
    }
}
// Notes for newbees:
//  Filtering is enabled by setting the filter property as true in column object.
//  Default match mode is "startsWith" and this can be configured
//  using filterMatchMode property of column object that also accepts "contains", "endsWith",
//  "equals" and "in". An optional global filter feature is available to search all fields with a keyword.
//  By default input fields are generated as filter elements and using templating any component
//  can be used as a filter.