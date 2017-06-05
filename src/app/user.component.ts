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
import { DataSource }                 from './model.datasource';
import { DatasourcesPerUser }         from './model.datasourcesPerUser';
import { EazlUser }                   from './model.user';
import { Group }                      from './model.group';
import { User }                       from './model.user';
import { UserGroupMembership }        from './model.userGroupMembership';

@Component({
    selector:    'user',
    templateUrl: 'user.component.html',
    styleUrls:  ['user.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {
    
    // Local properties
    addEditMode: string;                                // Add/Edit to indicate mode
    availableUserGroupMembership: Group[] = [];         // List of Groups user does NOT belongs to
    belongstoUserGroupMembership: Group[] = [];         // List of Groups user already belongs to   
    availableUserDatasource: DataSource[] = [];         // List of DS to which user has access
    belongstoUserDatasource: DataSource[] = [];         // List of DS to which user has NO access
    datasourcesPerUser: DatasourcesPerUser[];           // List of Datasources per User
    deleteMode: boolean = false;                        // True while busy deleting
    displayUserDatasources: boolean;                    // True to display Datasource per user
    displayGroupMembership: boolean = false;            // True to display popup for GrpMbrship
    displayUserDatasource: boolean = false;             // True to display popup for Datasource access per user
    displayUserPopup: boolean = false;                  // True to display single User
    groups: Group[] = [];                               // List of Groups
    popupHeader: string = 'User Maintenance';           // Popup header
    popuMenuItems: MenuItem[];                          // Items in popup
    selectedUser: User;                                 // User that was clicked on
    users: User[];
    usergroupMembership: UserGroupMembership[] = [];    // List of User-Group   

    constructor(
        private confirmationService: ConfirmationService,
        private eazlService: EazlService,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        ) {
    }
    
    ngOnInit() {
        //   Form initialisation
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
 
        // Initialise variables
        this.eazlService.getUsers()
            .then(users => {this.users = users
                
            })
            .catch( err => {console.log(err)} );
        this.popuMenuItems = [
            {
                label: 'Add', 
                icon: 'fa-plus', 
                command: (event) => this.userMenuAdd(this.selectedUser)
            },
            {
                label: '______________________________', 
                icon: '',
                disabled: true 
            },
            {
                label: 'Edit', 
                icon: 'fa-pencil', 
                command: (event) => this.userMenuEdit(this.selectedUser)
            },
            {
                label: 'Delete', 
                icon: 'fa-minus', 
                command: (event) => this.userMenuDelete(this.selectedUser)
            },
            {
                label: 'Group Membership', 
                icon: 'fa-users', 
                command: (event) => this.userMenuGroupMembership(this.selectedUser)
            },
            {
                label: 'Datasources', 
                icon: 'fa-database', 
                command: (event) => this.userMenuAccessToDatasources(this.selectedUser)
            },
            {
                label: 'Show Datasources', 
                icon: 'fa-database', 
                command: (event) => this.userMenuShowDatasources(this.selectedUser)
            },
            {
                label: 'Related Dashboards', 
                icon: 'fa-list', 
                command: (event) => this.userMenuRelatedDashboards(this.selectedUser)
            },
            {
                label: 'Message History', 
                icon: 'fa-comments', 
                command: (event) => this.userMenuMessageHistory(this.selectedUser)
            },
            {
                label: 'Report History', 
                icon: 'fa-table', 
                command: (event) => this.userMenuReportHistory(this.selectedUser)
            },
            {
                label: 'Reset Password', 
                icon: 'fa-unlock', 
                command: (event) => this.userMenuResetPassword(this.selectedUser)
            },
            
        ];

    }

    userMenuAdd(user: User) {
        // Popup form to add a new user
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuAdd', '@Start');
        this.addEditMode = 'Add';
        this.displayUserPopup = true;
    }
    
    userMenuEdit(user: User) {
        // Edit selected user on a popup form
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuEdit', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'Selected user', 
            detail:   user.firstName + ' - ' + user.lastName
        });

        this.addEditMode = 'Edit';
        this.displayUserPopup = true;    
    }

    userMenuDelete(user: User) {
        // Delete the selected user, but first confirm
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuDelete', '@Start');

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
                for(let i = 0; i < this.users.length; i++) {
                    if(this.users[i].userName == user.firstName) {
                        index = i;
                        break;
                    }
                }
                this.users.splice(index, 1);
                this.deleteMode = false;

                this.globalVariableService.growlGlobalMessage.next({
                    severity: 'info', 
                    summary:  'User deleted', 
                    detail:   user.firstName + ' - ' + user.lastName
                });
            }
        })
    }

    onClickUserTable() {
        // User clicked on a row
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickUserTable', '@Start');

        // Update the user group membership if it is open
        if (this.displayGroupMembership) {
            this.userMenuGroupMembership(this.selectedUser) 
        }
        if (this.displayUserDatasource) {
            this.userMenuAccessToDatasources(this.selectedUser) 
        }

    }

    userMenuGroupMembership(user: User) {
        // Manage group membership for the selected user
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuGroupMembership', '@Start');

        // Get the current and available groups
        this.eazlService.getGroupsPerUser(this.selectedUser.userName, true)
            .then(inclgrp => {
                this.belongstoUserGroupMembership = inclgrp;
                this.eazlService.getGroupsPerUser(this.selectedUser.userName, false)
                    .then (exclgrp => {
                            this.availableUserGroupMembership  = exclgrp;
                            this.displayGroupMembership = true; 
                    })
                    .catch(error => console.log (error))
            })
            .catch(error => console.log (error) )
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
        for (var i = 0; i < event.items.length; i++) {
            this.eazlService.addUserGroupMembership(
                this.selectedUser.userName, 
                event.items[i].groupID
            );
        }
    }
    
    onMoveToSourceUserGroupMembership(event) {
        // User clicked onMoveToSource on Group Membership - remove grp membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveToSourceUserGroupMembership', '@Start');

        // Remove the makker(s)
        for (var i = 0; i < event.items.length; i++) {
            this.eazlService.deleteUserGroupMembership(
                this.selectedUser.userName, 
                event.items[i].groupID
            );
        }
    }

    onSourceReorderUserGroupMembership(event) {
        // User clicked onSourceReorder on Group Membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onSourceReorderUserGroupMembership', '@Start');
    }

    onTargetReorderUserGroupMembership(event) {
        // User clicked onTargetReorder on Group Membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onTargetReorderUserGroupMembership', '@Start');
    }

    userMenuAccessToDatasources(user: User) {
        // Access to Data Sources for the selected user
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuAccessToDatasources', '@Start');

        // Get the current and available users
        this.availableUserDatasource = this.eazlService.getDatasourceAccessedByUser(
            this.selectedUser.userName,
            '*',
            false
        );
        this.belongstoUserDatasource = this.eazlService.getDatasourceAccessedByUser(
            this.selectedUser.userName,
            '*',
            true
        );

        // Show popup
        this.displayUserDatasource = true;
    }

    onClickUserDatasourceCancel() {
        // User clicked onMoveToSource on Group Membership - remove grp membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickUserDatasourceCancel', '@Start');

        // Close popup
        this.displayUserDatasource = false;        
    }

// addGroupDatasourceAccess
// deleteGroupDatasourceAccess
// getGroupDatasourceAccess
// getDatasourceAccessedByUser

    onMoveToTargetUserDatasource(event) {
        // User clicked onMoveToTarget on Group Membership: add grp membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveToTargetUserGroupMembership', '@Start');

        // Add this / these makker(s) - array if multi select
        for (var i = 0; i < event.items.length; i++) {
            this.eazlService.addDatasourceUserAccess(
                event.items[i].datasourceID,
                this.selectedUser.userName
            );
        }
    }
    
    onMoveToSourceUserDatasource(event) {
        // User clicked onMoveToSource on Group Membership - remove grp membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveToSourceUserGroupMembership', '@Start');

        // Remove the makker(s)
        for (var i = 0; i < event.items.length; i++) {
            this.eazlService.deleteDatasourceUserAccess(
                event.items[i].datasourceID,
                this.selectedUser.userName
            );
        }
    }

    userMenuShowDatasources(user: User) {
        // Show all the Datasources that the user has access to, and via username or groups
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuShowDatasources', '@Start');

        this.datasourcesPerUser = this.eazlService.getDatasourcesPerUser(user.userName); 

        // Show the popup
        this.displayUserDatasources = true;
    }

    userMenuRelatedDashboards(user: User) {
        // Manage related Data Sources (owned, given rights and received rights)
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuRelatedDashboards', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'Related Data Sources', 
            detail:   user.firstName + ' - ' + user.lastName
        });
    }

    userMenuMessageHistory(user: User) {
        // Show history of messages for the selected user
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuMessageHistory', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'User Message History', 
            detail:   user.firstName + ' - ' + user.lastName
        });
    }

    userMenuReportHistory(user: User) {
        // Show history of reports ran for the selected user
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuReportHistory', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'User Report History', 
            detail:   user.firstName + ' - ' + user.lastName
        });
    }
    
    userMenuResetPassword(user: User) {
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuResetPassword', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'User Password Reset', 
            detail:   user.firstName + ' - ' + user.lastName
        });
    }

    handleUserPopupFormClosed(howClosed: string) {
        // Handle the event: howClosed = Cancel / Submit
        this.globalFunctionService.printToConsole(this.constructor.name,'handleUserPopupFormClosed', '@Start');

        this.displayUserPopup = false;
  }
}

// Notes for newbees:
//  Filtering is enabled by setting the filter property as true in column object. 
//  Default match mode is "startsWith" and this can be configured
//  using filterMatchMode property of column object that also accepts "contains", "endsWith", 
//  "equals" and "in". An optional global filter feature is available to search all fields with a keyword.
//  By default input fields are generated as filter elements and using templating any component 
//  can be used as a filter.