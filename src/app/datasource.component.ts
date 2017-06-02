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
import { CanvasMessage }              from './model.canvasMessage';
import { CanvasUser }                 from './model.user';
import { Dashboard }                  from './model.dashboards';
import { DashboardGroup }             from './model.dashboardGroup';
import { DataSource }                 from './model.datasource';
import { DashboardGroupMembership }   from './model.dashboardGroupMembership';
import { EazlUser }                   from './model.user';
import { Report }                     from './model.report';
import { User }                       from './model.user';

@Component({
    selector:    'dataSource',
    templateUrl: 'datasource.component.html',
    styleUrls:  ['datasource.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DataSourceComponent implements OnInit {
    
    // Local properties
    canvasUser: CanvasUser = this.globalVariableService.canvasUser.getValue();
    datasources: DataSource[];                                  // List of DataSources
    popuMenuItems: MenuItem[];                                  // Items in popup

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

        this.datasources = this.eazlService.getDataSources();

        this.popuMenuItems = [
            {
                label: 'Related Reports', 
                icon: 'fa-table', 
                command: (event) => this.dashboardMenuReportHistory()
            },
        ];

    }

    onClickDashboardTable() {
        // Dashboard clicked on a row
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickDashboardTable', '@Start');

        // For later ...
    }

    dashboardMenuReportHistory() {
        // Show history of reports ran for the selected Dashboard
        // - dashboard: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuReportHistory', '@Start');

        // For future use ...

    }
    
}

// Notes for newbees:
//  Filtering is enabled by setting the filter property as true in column object. 
//  Default match mode is "startsWith" and this can be configured
//  using filterMatchMode property of column object that also accepts "contains", "endsWith", 
//  "equals" and "in". An optional global filter feature is available to search all fields with a keyword.
//  By default input fields are generated as filter elements and using templating any component 
//  can be used as a filter.