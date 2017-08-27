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
import { DataSource }                 from './model.datasource';
import { DataSourceGroupPermissions}  from './model.datasource';
import { DataSourceUserPermissions}   from './model.datasource';
import { EazlUser }                   from './model.user';
import { Group }                      from './model.group';
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
    availableDatasourceGroupMembership: Group[] = [];   // List of Groups user does NOT belongs to
    belongstoDatasourceGroupMembership: Group[] = [];   // List of Groups user already belongs to
    availableUserDatasource: User[] = [];               // List of Users that cannot access this DS
    belongstoUserDatasource: User[] = [];               // List of Users that can access this DS
    canvasUser: CanvasUser = this.globalVariableService.canvasUser.getValue();
    datasources: DataSource[];                          // List of DataSources
    datasourceGroupPermissions: DataSourceGroupPermissions[];   // User permissions
    datasourceUserPermissions: DataSourceUserPermissions[];     // User permissions
    displayGroupPermissions: boolean = false;           // True to show permissions panel
    displayUserAccess: boolean;                         // True to display User access
    displayUserPermissions: boolean = false;            // True to show permissions panel
    displayGroupAccess: boolean;                        // True to display Group Access
    displayGroupMembership: boolean = false;            // True to display popup for Datasources
    displayReports: boolean;                            // True to display Reports
    displayUserDatasourceAccess: boolean = false;       // True to display popup for User access per Datasource
    groups: Group[];                                    // List of Groups
    popuMenuItems: MenuItem[];                          // Items in popup
    reports: Report[];                                  // List of Reports
    selectedDatasource: DataSource;                     // Selected one
    selectedGroupPermission: DataSourceGroupPermissions;// Selected in table
    selectedUserPermission: DataSourceUserPermissions;  // Selected in table
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

        this.datasources = this.eazlService.getDataSources();

        this.popuMenuItems = [
            {
                label: 'Shared Users',
                icon: 'fa-users',
                command: (event) => this.datasourceMenuUserPermissions(this.selectedDatasource)
            },
            {
                label: 'Shared Groups',
                icon: 'fa-users',
                command: (event) => this.datasourceMenuGroupPermissions(this.selectedDatasource)
            },
            {
                label: 'User Access',
                icon: 'fa-database',
                command: (event) => this.datasourceMenuUserMembership(this.selectedDatasource)
            },            {
                label: 'List User Access',
                icon: 'fa-database',
                command: (event) => this.datasourceMenuListUserAccess(this.selectedDatasource)
            },
            {
                label: 'Group Membership',
                icon: 'fa-users',
                command: (event) => this.datasourceMenuGroupMembership(this.selectedDatasource)
            },            {
                label: 'List Group Access',
                icon: 'fa-list',
                command: (event) => this.datasourceMenuListGroupAccess(this.selectedDatasource)
            },
            {
                label: 'Related Reports',
                icon: 'fa-table',
                command: (event) => this.datasourceMenuReports(this.selectedDatasource)
            },

        ];

    }

    datasourceMenuReports(selectedDatasource: DataSource) {
        // Show Reports based on the selected Datasource
        // - selectedDatasource: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'datasourceMenuReports', '@Start');

        this.reports = this.eazlService.getReports(
            -1,
            '*',
            '*',
            selectedDatasource.datasourceID
        );

        // Show popup
        this.displayReports = true;

    }

    datasourceMenuListUserAccess(selectedDatasource: DataSource) {
        // Show all the Users with Access to the selected Datasource
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'datasourceMenuListUserAccess', '@Start');

        this.users = this.eazlService.getUsersWhoCanAccessDatasource(
            selectedDatasource.datasourceID
        );

        // Show the popup
        this.displayUserAccess = true;
    }

    datasourceMenuListGroupAccess(selectedDatasource: DataSource) {
        // Show all the Groups with access to the selected Datasource
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'datasourceMenuListGroupAccess', '@Start');

        this.groups = this.eazlService.getGroupsPerDatasource(
            selectedDatasource.datasourceID,
            true
        );

        // Show the popup
        this.displayGroupAccess = true;
    }

    onClickDatasourceTable() {
        // User clicked on a row
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickDatasourceTable', '@Start');

        // Refresh records in popup
        if (this.displayUserPermissions) {
            this.datasourceMenuUserPermissions(this.selectedDatasource)
        };
        if (this.displayGroupPermissions) {
            this.datasourceMenuGroupPermissions(this.selectedDatasource)
        };

        // Update the user group membership if it is open
        if (this.displayGroupMembership) {
            this.datasourceMenuGroupMembership(this.selectedDatasource)
        }
        if (this.displayUserDatasourceAccess) {
            this.datasourceMenuUserMembership(this.selectedDatasource)
        }
    }

    datasourceMenuGroupMembership(selectedDatasource: DataSource) {
        // Manage group membership for the selected user
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuGroupMembership', '@Start');

        // Get the current and available groups
        this.belongstoDatasourceGroupMembership =
            this.eazlService.getGroupsPerDatasource(selectedDatasource.datasourceID,true);
        this.availableDatasourceGroupMembership  =
            this.eazlService.getGroupsPerDatasource(selectedDatasource.datasourceID,false);

        // Show popup
        this.displayGroupMembership = true;
    }

    onClickGroupMembershipCancel() {
        // User clicked Cancel
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickGroupMembershipCancel', '@Start');

        // Close popup
        this.displayGroupMembership = false;
    }

    onMoveToSourceDatasourceGroupMembership(event) {
        // User clicked onMoveToSource on Group Membership: add grp membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveToSourceDatasourceGroupMembership', '@Start');

        // Add this / these makker(s) - array if multi select
        for (var i = 0; i < event.items.length; i++) {
            this.eazlService.deleteGroupDatasourceAccess(
                this.selectedDatasource.datasourceID,
                event.items[i].groupID
            );
        }
    }

    onMoveToTargetDatasourceGroupMembership(event) {
        // User clicked onMoveToTarget on Group Membership: add grp membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveToTargetDatasourceGroupMembership', '@Start');

        // Add this / these makker(s) - array if multi select
        for (var i = 0; i < event.items.length; i++) {
            this.eazlService.addGroupDatasourceAccess(
                this.selectedDatasource.datasourceID,
                event.items[i].groupID
            );
        }
    }

    datasourceMenuUserPermissions(datasource: DataSource) {
        // Users with their permissions for the selected Datasource
        // - dashboard: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'datasourceMenuUserPermissions', '@Start');

        // Get the current and available user shared with; as a Promise to cater for Async
        this.eazlService.getdatasourceUserPermissions(
            datasource.datasourceID
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

    onClickUserPermissionCancel() {
        // Close User Permissions panel
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickUserPermissionCancel', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'warn',
            summary:  'Cancel',
            detail:   'As requested, no changes were applied'
        });

        // Close popup
        this.displayUserPermissions = false;
    }

    onChangeAddUserPermission(event) {
        // User changed  user permission
        // - event is the new value of the checkbox
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeAddUserPermission', '@Start');

        if (this.selectedUserPermission == null) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'No selection',
                detail:   'Select a user by clicking the username'
            });

            return;
        }

        let assignPermissions: string[] = [];
        let removePermissions: string[] = [];
        if (event) {
            assignPermissions.push('add_package');
        } else {
            removePermissions.push('add_package');
        }

        this.eazlService.updateModelPermissions(
            'packages',
            this.selectedDatasource.datasourceID,
            this.selectedUserPermission.username,
            'user',
            assignPermissions,
            removePermissions
        );
    }

    onChangeAssignUserPermission(event) {
        // User changed  user permission
        // - event is the new value of the checkbox
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeAssignUserPermission', '@Start');

        if (this.selectedUserPermission == null) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'No selection',
                detail:   'Select a user by clicking the username'
            });

            return;
        }

        let assignPermissions: string[] = [];
        let removePermissions: string[] = [];
        if (event) {
            assignPermissions.push('assign_permission_package');
        } else {
            removePermissions.push('assign_permission_package');
        }

        this.eazlService.updateModelPermissions(
            'packages',
            this.selectedDatasource.datasourceID,
            this.selectedUserPermission.username,
            'user',
            assignPermissions,
            removePermissions
        );
    }

    onChangeChangeUserPermission(event) {
        // User changed  user permission
        // - event is the new value of the checkbox
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeChangeUserPermission', '@Start');

        if (this.selectedUserPermission == null) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'No selection',
                detail:   'Select a user by clicking the username'
            });

            return;
        }

        let assignPermissions: string[] = [];
        let removePermissions: string[] = [];
        if (event) {
            assignPermissions.push('change_package');
        } else {
            removePermissions.push('change_package');
        }

        this.eazlService.updateModelPermissions(
            'packages',
            this.selectedDatasource.datasourceID,
            this.selectedUserPermission.username,
            'user',
            assignPermissions,
            removePermissions
        );
    }

    onChangeDeleteUserPermission(event) {
        // User changed  user permission
        // - event is the new value of the checkbox
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeDeleteUserPermission', '@Start');

        if (this.selectedUserPermission == null) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'No selection',
                detail:   'Select a user by clicking the username'
            });

            return;
        }

        let assignPermissions: string[] = [];
        let removePermissions: string[] = [];
        if (event) {
            assignPermissions.push('delete_package');
        } else {
            removePermissions.push('delete_package');
        }

        this.eazlService.updateModelPermissions(
            'packages',
            this.selectedDatasource.datasourceID,
            this.selectedUserPermission.username,
            'user',
            assignPermissions,
            removePermissions
        );
    }

    onChangeExecuteUserPermission(event) {
        // User changed  user permission
        // - event is the new value of the checkbox
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeExecuteUserPermission', '@Start');

        if (this.selectedUserPermission == null) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'No selection',
                detail:   'Select a user by clicking the username'
            });

            return;
        }

        let assignPermissions: string[] = [];
        let removePermissions: string[] = [];
        if (event) {
            assignPermissions.push('execute_package');
        } else {
            removePermissions.push('execute_package');
        }

        this.eazlService.updateModelPermissions(
            'packages',
            this.selectedDatasource.datasourceID,
            this.selectedUserPermission.username,
            'user',
            assignPermissions,
            removePermissions
        );
    }

    onChangeOwnedUserPermission(event) {
        // User changed  user permission
        // - event is the new value of the checkbox
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeOwnedUserPermission', '@Start');

        if (this.selectedUserPermission == null) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'No selection',
                detail:   'Select a user by clicking the username'
            });

            return;
        }

        let assignPermissions: string[] = [];
        let removePermissions: string[] = [];
        if (event) {
            assignPermissions.push('package_owned_access');
        } else {
            removePermissions.push('package_owned_access');
        }

        this.eazlService.updateModelPermissions(
            'packages',
            this.selectedDatasource.datasourceID,
            this.selectedUserPermission.username,
            'user',
            assignPermissions,
            removePermissions
        );
    }

    onChangeSharedUserPermission(event) {
        // User changed  user permission
        // - event is the new value of the checkbox
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeSharedUserPermission', '@Start');

        if (this.selectedUserPermission == null) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'No selection',
                detail:   'Select a user by clicking the username'
            });

            return;
        }

        let assignPermissions: string[] = [];
        let removePermissions: string[] = [];
        if (event) {
            assignPermissions.push('package_shared_access');
        } else {
            removePermissions.push('package_shared_access');
        }

        this.eazlService.updateModelPermissions(
            'packages',
            this.selectedDatasource.datasourceID,
            this.selectedUserPermission.username,
            'user',
            assignPermissions,
            removePermissions
        );
    }

    onChangeRemoveUserPermission(event) {
        // User changed  user permission
        // - event is the new value of the checkbox
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeRemoveUserPermission', '@Start');

        if (this.selectedUserPermission == null) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'No selection',
                detail:   'Select a user by clicking the username'
            });

            return;
        }

        let assignPermissions: string[] = [];
        let removePermissions: string[] = [];
        if (event) {
            assignPermissions.push('remove_permission_package');
        } else {
            removePermissions.push('remove_permission_package');
        }

        this.eazlService.updateModelPermissions(
            'packages',
            this.selectedDatasource.datasourceID,
            this.selectedUserPermission.username,
            'user',
            assignPermissions,
            removePermissions
        );
    }

    onChangeViewUserPermission(event) {
        // User changed  user permission
        // - event is the new value of the checkbox
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeViewUserPermission', '@Start');

        if (this.selectedUserPermission == null) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'No selection',
                detail:   'Select a user by clicking the username'
            });

            return;
        }

        let assignPermissions: string[] = [];
        let removePermissions: string[] = [];
        if (event) {
            assignPermissions.push('view_package');
        } else {
            removePermissions.push('view_package');
        }

        this.eazlService.updateModelPermissions(
            'packages',
            this.selectedDatasource.datasourceID,
            this.selectedUserPermission.username,
            'user',
            assignPermissions,
            removePermissions
        );
    }

    datasourceMenuGroupPermissions(datasource: DataSource) {
        // Groups with their permissions for the selected Datasource
        // - dashboard: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'datasourceMenuGroupPermissions', '@Start');

        // Get the current and available groups shared with; as a Promise to cater for Async
        this.eazlService.getdatasourceGroupPermissions(
            datasource.datasourceID
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
                    detail:   'Getting Group permissions failed'
                });
            });

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

    onChangeAddGroupPermission(event) {
        // Group changed group permission
        // - event is the new value of the checkbox
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeAddGroupPermission', '@Start');

        if (this.selectedGroupPermission == null) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'No selection',
                detail:   'Select a group by clicking the groupName'
            });

            return;
        }

        let assignPermissions: string[] = [];
        let removePermissions: string[] = [];
        if (event) {
            assignPermissions.push('add_package');
        } else {
            removePermissions.push('add_package');
        }

        this.eazlService.updateModelPermissions(
            'packages',
            this.selectedDatasource.datasourceID,
            this.selectedGroupPermission.groupName,
            'group',
            assignPermissions,
            removePermissions
        );
    }

    onChangeAssignGroupPermission(event) {
        // Group changed group permission
        // - event is the new value of the checkbox
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeAssignGroupPermission', '@Start');

        if (this.selectedGroupPermission == null) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'No selection',
                detail:   'Select a group by clicking the groupName'
            });

            return;
        }

        let assignPermissions: string[] = [];
        let removePermissions: string[] = [];
        if (event) {
            assignPermissions.push('assign_permission_package');
        } else {
            removePermissions.push('assign_permission_package');
        }

        this.eazlService.updateModelPermissions(
            'packages',
            this.selectedDatasource.datasourceID,
            this.selectedGroupPermission.groupName,
            'group',
            assignPermissions,
            removePermissions
        );
    }

    onChangeChangeGroupPermission(event) {
        // Group changed gropu permission
        // - event is the new value of the checkbox
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeChangeGroupPermission', '@Start');

        if (this.selectedGroupPermission == null) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'No selection',
                detail:   'Select a group by clicking the groupName'
            });

            return;
        }

        let assignPermissions: string[] = [];
        let removePermissions: string[] = [];
        if (event) {
            assignPermissions.push('change_package');
        } else {
            removePermissions.push('change_package');
        }

        this.eazlService.updateModelPermissions(
            'packages',
            this.selectedDatasource.datasourceID,
            this.selectedGroupPermission.groupName,
            'group',
            assignPermissions,
            removePermissions
        );
    }

    onChangeDeleteGroupPermission(event) {
        // Group changed group permission
        // - event is the new value of the checkbox
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeDeleteGroupPermission', '@Start');

        if (this.selectedGroupPermission == null) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'No selection',
                detail:   'Select a group by clicking the groupName'
            });

            return;
        }

        let assignPermissions: string[] = [];
        let removePermissions: string[] = [];
        if (event) {
            assignPermissions.push('delete_package');
        } else {
            removePermissions.push('delete_package');
        }

        this.eazlService.updateModelPermissions(
            'packages',
            this.selectedDatasource.datasourceID,
            this.selectedGroupPermission.groupName,
            'group',
            assignPermissions,
            removePermissions
        );
    }

    onChangeExecuteGroupPermission(event) {
        // Group changed group permission
        // - event is the new value of the checkbox
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeExecuteGroupPermission', '@Start');

        if (this.selectedGroupPermission == null) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'No selection',
                detail:   'Select a group by clicking the groupName'
            });

            return;
        }

        let assignPermissions: string[] = [];
        let removePermissions: string[] = [];
        if (event) {
            assignPermissions.push('execute_package');
        } else {
            removePermissions.push('execute_package');
        }

        this.eazlService.updateModelPermissions(
            'packages',
            this.selectedDatasource.datasourceID,
            this.selectedGroupPermission.groupName,
            'group',
            assignPermissions,
            removePermissions
        );
    }

    onChangeOwnedGroupPermission(event) {
        // Group changed group permission
        // - event is the new value of the checkbox
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeOwnedGroupPermission', '@Start');

        if (this.selectedGroupPermission == null) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'No selection',
                detail:   'Select a group by clicking the groupName'
            });

            return;
        }

        let assignPermissions: string[] = [];
        let removePermissions: string[] = [];
        if (event) {
            assignPermissions.push('package_owned_access');
        } else {
            removePermissions.push('package_owned_access');
        }

        this.eazlService.updateModelPermissions(
            'packages',
            this.selectedDatasource.datasourceID,
            this.selectedGroupPermission.groupName,
            'group',
            assignPermissions,
            removePermissions
        );
    }

    onChangeSharedGroupPermission(event) {
        // Group changed group permission
        // - event is the new value of the checkbox
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeSharedGroupPermission', '@Start');

        if (this.selectedGroupPermission == null) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'No selection',
                detail:   'Select a group by clicking the groupName'
            });

            return;
        }

        let assignPermissions: string[] = [];
        let removePermissions: string[] = [];
        if (event) {
            assignPermissions.push('package_shared_access');
        } else {
            removePermissions.push('package_shared_access');
        }

        this.eazlService.updateModelPermissions(
            'packages',
            this.selectedDatasource.datasourceID,
            this.selectedGroupPermission.groupName,
            'group',
            assignPermissions,
            removePermissions
        );
    }

    onChangeRemoveGroupPermission(event) {
        // Group changed group permission
        // - event is the new value of the checkbox
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeRemoveGroupPermission', '@Start');

        if (this.selectedGroupPermission == null) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'No selection',
                detail:   'Select a group by clicking the groupName'
            });

            return;
        }

        let assignPermissions: string[] = [];
        let removePermissions: string[] = [];
        if (event) {
            assignPermissions.push('remove_permission_package');
        } else {
            removePermissions.push('remove_permission_package');
        }

        this.eazlService.updateModelPermissions(
            'packages',
            this.selectedDatasource.datasourceID,
            this.selectedGroupPermission.groupName,
            'group',
            assignPermissions,
            removePermissions
        );
    }

    onChangeViewGroupPermission(event) {
        // Group changed group permission
        // - event is the new value of the checkbox
        this.globalFunctionService.printToConsole(this.constructor.name,'onChangeViewGroupPermission', '@Start');

        if (this.selectedGroupPermission == null) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'No selection',
                detail:   'Select a group by clicking the groupName'
            });

            return;
        }

        let assignPermissions: string[] = [];
        let removePermissions: string[] = [];
        if (event) {
            assignPermissions.push('view_package');
        } else {
            removePermissions.push('view_package');
        }

        this.eazlService.updateModelPermissions(
            'packages',
            this.selectedDatasource.datasourceID,
            this.selectedGroupPermission.groupName,
            'group',
            assignPermissions,
            removePermissions
        );
    }

    datasourceMenuUserMembership(selectedDatasource: DataSource) {
        // Manage group membership for the selected user
        // - selectedDatasource: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'datasourceMenuUserMembership', '@Start');

        // Get the current and available users
        this.belongstoUserDatasource = this.eazlService.getUsersWhoCanAccessDatasource(
            selectedDatasource.datasourceID,
            true
        );
        this.availableUserDatasource = this.eazlService.getUsersWhoCanAccessDatasource(
            selectedDatasource.datasourceID,
            false
        );

        // Show the popup
        this.displayUserDatasourceAccess = true;
    }

    onClickUserMembershipCancel() {
        // User clicked Cancel
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickUserMembershipCancel', '@Start');

        // Close popup
        this.displayUserDatasourceAccess = false;
    }

    onMoveToSourceDatasourceUserMembership(event) {
        // User clicked onMoveToSource on User Membership: add grp membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveToSourceDatasourceUserMembership', '@Start');

        // Add this / these makker(s) - array if multi select
        for (var i = 0; i < event.items.length; i++) {
            this.eazlService.deleteDatasourceUserAccess(
                this.selectedDatasource.datasourceID,
                event.items[i].username
            );
        }
    }

    onMoveToTargetDatasourceUserMembership(event) {
        // User clicked onMoveToTarget on User Membership: add grp membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveToTargetDatasourceUserMembership', '@Start');

        // Add this / these makker(s) - array if multi select
        for (var i = 0; i < event.items.length; i++) {
            this.eazlService.addDatasourceUserAccess(
                this.selectedDatasource.datasourceID,
                event.items[i].username
            );
        }
    }


}

// Notes for newbees:
//  Filtering is enabled by setting the filter property as true in column object.
//  Default match mode is "startsWith" and this can be configured
//  using filterMatchMode property of column object that also accepts "contains", "endsWith",
//  "equals" and "in". An optional global filter feature is available to search all fields with a keyword.
//  By default input fields are generated as filter elements and using templating any component
//  can be used as a filter.