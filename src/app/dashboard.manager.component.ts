// Dashboard Manager form
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
import { EazlUser }                   from './model.user';
import { Group }                      from './model.group';
import { Dashboard }                  from './model.dashboards';
import { UserGroupMembership }        from './model.userGroupMembership';

@Component({
    selector:    'dashboardManager',
    templateUrl: 'dashboard.manager.component.html',
    styleUrls:  ['dashboard.manager.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DashboardManagerComponent implements OnInit {
    
    // Local properties
    addEditMode: string;                                // Add/Edit to indicate mode
    availableUserGroupMembership: Group[] = [];         // List of Groups user does NOT belongs to
    belongstoUserGroupMembership: Group[] = [];         // List of Groups user already belongs to   
    deleteMode: boolean = false;                        // True while busy deleting
    displayGroupMembership: boolean = false;            // True to display popup for GrpMbrship
    displayDashboardPopup: boolean = false;             // True to display single Dashboard
    groups: Group[] = [];                               // List of Groups
    popupHeader: string = 'Dashboard Editor';               // Popup header
    popuMenuItems: MenuItem[];                          // Items in popup
    selectedDashboard: Dashboard;                       // Dashboard that was clicked on
    dashboards: Dashboard[];                            // List of Dashboards
    usergroupMembership: UserGroupMembership[] = [];    // List of User-Group   

    constructor(
        private confirmationService: ConfirmationService,
        private eazlService: EazlService,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        ) {
    }
    
    ngOnInit() {
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
 
        // Initialise variables
        // this.eazlService.getUsers()
        //     .then(users => {this.getDashboards = users
                
        //     })
        //     .catch( err => {console.log(err)} );
        this.dashboards = this.eazlService.getDashboards();

        this.popuMenuItems = [
            {
                label: 'Add', 
                icon: 'fa-plus', 
                command: (event) => this.dashboardMenuAdd(this.selectedDashboard)
            },
            {
                label: '______________________________', 
                icon: '',
                disabled: true 
            },
            {
                label: 'Edit', 
                icon: 'fa-pencil', 
                command: (event) => this.dashboardMenuEdit(this.selectedDashboard)
            },
            {
                label: 'Delete', 
                icon: 'fa-minus', 
                command: (event) => this.dashboardMenuDelete(this.selectedDashboard)
            },
            {
                label: 'Group Membership', 
                icon: 'fa-users', 
                command: (event) => this.dashboardMenuGroupMembership(this.selectedDashboard)
            },
            {
                label: 'Shared With', 
                icon: 'fa-database', 
                command: (event) => this.dashboardMenuSharedWith(this.selectedDashboard)
            },
            {
                label: 'Related Data Sources', 
                icon: 'fa-list', 
                command: (event) => this.dashboardMenuRelatedDataSources(this.selectedDashboard)
            },
            {
                label: 'Message History', 
                icon: 'fa-comments', 
                command: (event) => this.dashboardMenuMessageHistory(this.selectedDashboard)
            },
            {
                label: 'Report History', 
                icon: 'fa-table', 
                command: (event) => this.dashboardMenuReportHistory(this.selectedDashboard)
            },
            {
                label: 'Like', 
                icon: 'fa-heart', 
                command: (event) => this.dashboardMenuResetLike(this.selectedDashboard)
            },
            {
                label: 'Lock', 
                icon: 'fa-lock', 
                command: (event) => this.dashboardMenuResetLock(this.selectedDashboard)
            },
            
        ];

    }

    dashboardMenuAdd(dashboard: Dashboard) {
        // Popup form to add a new Dashboard
        // - dashboard: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuAdd', '@Start');
        this.addEditMode = 'Add';
        this.displayDashboardPopup = true;
    }
    
    dashboardMenuEdit(dashboard: Dashboard) {
        // Edit selected Dashboard on a popup form
        // - dashboard: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuEdit', '@Start');

        if (this.selectedDashboard != undefined) {

            // Refresh the data on the form, and then show it
            this.displayDashboardPopup = true;
            // this.dashboardEditor.refreshForm();
        } else {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn', 
                summary:  'No Dashboard', 
                detail:   'Please select a Dashboard in the table and try again'
            });
            
        }

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'Selected Dashboard', 
            detail:   dashboard.dashboardName
        });

        this.addEditMode = 'Edit';
        this.displayDashboardPopup = true;    
    }

    dashboardMenuDelete(dashboard: Dashboard) {
        // Delete the selected Dashboard, but first confirm

        this.deleteMode = true;
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this record?',
            reject: () => { 
                this.deleteMode = false;
                return;
            },
            accept: () => {

                // - Dashboard: currently selected row
                this.globalFunctionService.printToConsole(this.constructor.name,'onSubmit', '@Start');
                let index = -1;
                for(let i = 0; i < this.dashboards.length; i++) {
                    if(this.dashboards[i].dashboardID == dashboard.dashboardID) {
                        index = i;
                        break;
                    }
                }
                this.dashboards.splice(index, 1);
                this.deleteMode = false;

                this.globalVariableService.growlGlobalMessage.next({
                    severity: 'info', 
                    summary:  'Dashboard deleted', 
                    detail:   dashboard.dashboardName
                });
            }
        })
    }

    onClickDashboardTable() {
        // Dashboard clicked on a row
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickDashboardTable', '@Start');

        // Update the Dashboard group membership if it is open
        if (this.displayGroupMembership) {
            this.dashboardMenuGroupMembership(this.selectedDashboard) 
        }
    }

    dashboardMenuGroupMembership(dashboard: Dashboard) {
        // Manage group membership for the selected Dashboard
        // - dashboard: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuGroupMembership', '@Start');

        // Get the current and available groups
        // this.eazlService.getUserGroupMembership(this.selectedDashboard.dashboardID, true)
        //     .then(inclgrp => {
        //         this.belongstoUserGroupMembership = inclgrp;
        //         this.eazlService.getUserGroupMembership(this.selectedDashboard.dashboardID, false)
        //             .then (exclgrp => {
        //                     this.availableUserGroupMembership  = exclgrp;
        //                     this.displayGroupMembership = true; 
        //             })
        //             .catch(error => console.log (error))
        //     })
        //     .catch(error => console.log (error) )

// this.eazlService.getUsersResti()
//     .then(eazlUser => {
//         this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '  Setted fake username janniei & preferences for Testing');

//         // Show
// console.log('gotit')    
//     })
//     .catch(err => {
//         this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '  Fake login failed!!');
//         }
    // ) 




        // Tell user ...
        // this.globalVariableService.growlGlobalMessage.next({
        //     severity: 'info', 
        //     summary:  'User group membership', 
        //     detail:   user.firstName + ' - ' + user.lastName
        // });
    }

    onClickGroupMembershipCancel() {
        // User clicked onMoveToSource on Group Membership - remove grp membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickGroupMembershipCancel', '@Start');

        // Close popup
        this.displayGroupMembership = false;        
    }

    onMoveToTargetUserGroupMembership(event) {
        // User clicked onMoveToTarget on Group Membership: add grp membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveToTargetUserGroupMembership', '@Start');

        // Add this / these makker(s) - array if multi select
        // for (var i = 0; i < event.items.length; i++) {
        //     this.eazlService.addUserGroupMembership(
        //         this.selectedDashboard.dashboardID, 
        //         event.items[i].groupID
        //     );
        // }
    }
    
    onMoveToSourceUserGroupMembership(event) {
        // User clicked onMoveToSource on Group Membership - remove grp membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveToSourceUserGroupMembership', '@Start');

        // Remove the makker(s)
        // for (var i = 0; i < event.items.length; i++) {
        //     this.eazlService.deleteUserGroupMembership(
        //         this.selectedDashboard.dashboardID, 
        //         event.items[i].groupID
        //     );
        // }
    }

    onSourceReorderUserGroupMembership(event) {
        // User clicked onSourceReorder on Group Membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onSourceReorderUserGroupMembership', '@Start');
    }

    onTargetReorderUserGroupMembership(event) {
        // User clicked onTargetReorder on Group Membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onTargetReorderUserGroupMembership', '@Start');
    }

    dashboardMenuSharedWith(dashboard: Dashboard) {
        // Access to Data Sources for the selected Dashboard
        // - dashboard: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuSharedWith', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'Dashboard Access', 
            detail:   dashboard.dashboardName
        });
    }

    dashboardMenuRelatedDataSources(dashboard: Dashboard) {
        // Manage related Data Sources (owned, given rights and received rights)
        // - dashboard: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuRelatedDataSources', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'Related Data Sources', 
            detail:   dashboard.dashboardName
        });
    }

    dashboardMenuMessageHistory(dashboard: Dashboard) {
        // Show history of messages for the selected Dashboard
        // - dashboard: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuMessageHistory', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'Dashboard Message History', 
            detail:   dashboard.dashboardName
        });
    }

    dashboardMenuReportHistory(dashboard: Dashboard) {
        // Show history of reports ran for the selected Dashboard
        // - dashboard: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuReportHistory', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'Dashboard Report History', 
            detail:   dashboard.dashboardName
        });
    }
    
    dashboardMenuResetLike(dashboard: Dashboard) {
        // Click Like popup menu option: toggle liked/not for current user on this Dashboard
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuResetLike', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'Toggle Dashboard liked/not', 
            detail:   dashboard.dashboardName
        });
    }

    dashboardMenuResetLock(dashboard: Dashboard) {
        // Click Lock popup menu option: toggle the lock for this user on this Dashboard
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuResetLock', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'Toggle Dashboard locked/not', 
            detail:   dashboard.dashboardName
        });
    }

    handleFormDashboardSubmit(howClosed: string) {
        // Handle the event: howClosed = Cancel / Submit
        this.globalFunctionService.printToConsole(this.constructor.name,'handleFormDashboardSubmit()', '@Start');

        this.displayDashboardPopup = false;
  }
}

// Notes for newbees:
//  Filtering is enabled by setting the filter property as true in column object. 
//  Default match mode is "startsWith" and this can be configured
//  using filterMatchMode property of column object that also accepts "contains", "endsWith", 
//  "equals" and "in". An optional global filter feature is available to search all fields with a keyword.
//  By default input fields are generated as filter elements and using templating any component 
//  can be used as a filter.