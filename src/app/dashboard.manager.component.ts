// User form
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
    displayDashboardPopup: boolean = false;             // True to display single User
    groups: Group[] = [];                               // List of Groups
    popupHeader: string = 'User Maintenance';           // Popup header
    popuMenuItems: MenuItem[];                          // Items in popup
    selectedDashboard: Dashboard;                       // User that was clicked on
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
                command: (event) => this.userMenuAdd(this.selectedDashboard)
            },
            {
                label: '______________________________', 
                icon: '',
                disabled: true 
            },
            {
                label: 'Edit', 
                icon: 'fa-pencil', 
                command: (event) => this.userMenuEdit(this.selectedDashboard)
            },
            {
                label: 'Delete', 
                icon: 'fa-minus', 
                command: (event) => this.userMenuDelete(this.selectedDashboard)
            },
            {
                label: 'Group Membership', 
                icon: 'fa-users', 
                command: (event) => this.userMenuGroupMembership(this.selectedDashboard)
            },
            {
                label: 'Access', 
                icon: 'fa-database', 
                command: (event) => this.userMenuAccess(this.selectedDashboard)
            },
            {
                label: 'Related Data Sources', 
                icon: 'fa-list', 
                command: (event) => this.userMenuRelatedDataSources(this.selectedDashboard)
            },
            {
                label: 'Message History', 
                icon: 'fa-comments', 
                command: (event) => this.userMenuMessageHistory(this.selectedDashboard)
            },
            {
                label: 'Report History', 
                icon: 'fa-table', 
                command: (event) => this.userMenuReportHistory(this.selectedDashboard)
            },
            {
                label: 'Reset Password', 
                icon: 'fa-unlock', 
                command: (event) => this.userMenuResetPassword(this.selectedDashboard)
            },
            
        ];

    }

    userMenuAdd(dashboard: Dashboard) {
        // Popup form to add a new user
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuAdd', '@Start');
        this.addEditMode = 'Add';
        this.displayDashboardPopup = true;
    }
    
    userMenuEdit(dashboard: Dashboard) {
        // Edit selected user on a popup form
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuEdit', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'Selected user', 
            detail:   dashboard.dashboardName
        });

        this.addEditMode = 'Edit';
        this.displayDashboardPopup = true;    
    }

    userMenuDelete(dashboard: Dashboard) {
        // Delete the selected user, but first confirm

        this.deleteMode = true;
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this record?',
            reject: () => { 
                this.deleteMode = false;
                return;
            },
            accept: () => {

                // - User: currently selected row
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
                    summary:  'User deleted', 
                    detail:   dashboard.dashboardName
                });
            }
        })
    }

    onClickDashboardTable() {
        // User clicked on a row
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickDashboardTable', '@Start');

        // Update the user group membership if it is open
        if (this.displayGroupMembership) {
            this.userMenuGroupMembership(this.selectedDashboard) 
        }
    }

    userMenuGroupMembership(dashboard: Dashboard) {
        // Manage group membership for the selected user
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuGroupMembership', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveToSourceUserGroupMembership', '@Start');

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

    userMenuAccess(dashboard: Dashboard) {
        // Access to Data Sources for the selected user
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuAccess', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'User Access', 
            detail:   dashboard.dashboardName
        });
    }

    userMenuRelatedDataSources(dashboard: Dashboard) {
        // Manage related Data Sources (owned, given rights and received rights)
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuRelatedDataSources', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'Related Data Sources', 
            detail:   dashboard.dashboardName
        });
    }

    userMenuMessageHistory(dashboard: Dashboard) {
        // Show history of messages for the selected user
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuMessageHistory', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'User Message History', 
            detail:   dashboard.dashboardName
        });
    }

    userMenuReportHistory(dashboard: Dashboard) {
        // Show history of reports ran for the selected user
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuReportHistory', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'User Report History', 
            detail:   dashboard.dashboardName
        });
    }
    
    userMenuResetPassword(dashboard: Dashboard) {
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuResetPassword', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'User Password Reset', 
            detail:   dashboard.dashboardName
        });
    }

    handleUserPopupFormClosed(howClosed: string) {
        // Handle the event: howClosed = Cancel / Submit
        this.globalFunctionService.printToConsole(this.constructor.name,'handleUserPopupFormClosed', '@Start');

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