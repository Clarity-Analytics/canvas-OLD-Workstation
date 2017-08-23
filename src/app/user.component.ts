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
import { CanvasMessage }              from './model.canvasMessage';
import { CanvasUser }                 from './model.user';
import { DataSource }                 from './model.datasource';
import { DatasourcesPerUser }         from './model.datasourcesPerUser';
import { Dashboard } from './model.dashboards';
import { DashboardsPerUser }          from './model.dashboardsPerUser';
import { EazlUser }                   from './model.user';
import { Group }                      from './model.group';
import { ReportHistory }              from './model.reportHistory';
import { User }                       from './model.user';
import { UserModelPermissionFlat }    from './model.userModelPermissions';


@Component({
    selector:    'user',
    templateUrl: 'user.component.html',
    styleUrls:  ['user.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {

    // Local properties
    addEditMode: string;                                // Add/Edit to indicate mode

    availableUserGroupMembership: string[] = [];        // List of Groups user does NOT belongs to
    belongstoUserGroupMembership: string[] = [];        // List of Groups user already belongs to
    availableUserDatasource: DataSource[] = [];         // List of DS to which user has access
    belongstoUserDatasource: DataSource[] = [];         // List of DS to which user has NO access
    canvasUser: CanvasUser;                             // Current user
    canvasMessages: CanvasMessage[];                    // List of Canvas Messages
    datasourcesPerUser: DatasourcesPerUser[];           // @Runtime List of Datasources per User
    userModelPermissionFlat: UserModelPermissionFlat[]; // @Runtime List of Model Permissions per User
    deleteMode: boolean = false;                        // True while busy deleting
    displayUserDatasources: boolean;                    // True to display Datasource per user
    displayGroupMembership: boolean = false;            // True to display popup for Datasources
    displayUserModelPermissions: boolean = false;       // True to display popup for Model Permissions
    displayMessages: boolean = false;                   // True to display popup for Messages
    displayReports: boolean = false;                    // True to display popup for Reports
    displayResetPassword: boolean = false;              // True to display popup for Reset Password
    displayUserDatasource: boolean = false;             // True to display popup for Datasource access per user
    displayUserPopup: boolean = false;                  // True to display single User
    groups: Group[] = [];                               // List of Groups
    popupHeader: string = 'User Maintenance';           // Popup header
    popuMenuItems: MenuItem[];                          // Items in popup
    reportHistory: ReportHistory[];                     // List of Report History (ran)
    selectedUser: User;                                 // User that was clicked on
    users: User[];

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

        // Current User
        this.canvasUser = this.globalVariableService.canvasUser.getValue();

        // Initialise variables
        this.users = this.eazlService.getUsers();

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
                command: (event) => this.userMenuModelPermissions(
                    this.selectedUser, 'dashboard'
                )
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
        // - user: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuAdd', '@Start');
        this.addEditMode = 'Add';
        this.displayUserPopup = true;
    }

    userMenuEdit(user: User) {
        // Edit selected user on a popup form
        // - user: currently selected row
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
        // - user: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuDelete', '@Start');

        this.deleteMode = true;
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this record?',
            reject: () => {
                this.deleteMode = false;
                return;
            },
            accept: () => {

                // // - User: currently selected row
                // let index = -1;
                // for(let i = 0; i < this.users.length; i++) {
                //     if(this.users[i].username == user.firstName) {
                //         index = i;
                //         break;
                //     }
                // }
                // this.users.splice(index, 1);
                this.deleteMode = false;

                // Update DB
                this.eazlService.deleteUser(this.selectedUser);

                // Refresh local variable
                this.users = this.eazlService.getUsers();

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
        // - user: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuGroupMembership', '@Start');

        this.belongstoUserGroupMembership = this.selectedUser.groups;
        this.availableUserGroupMembership = this.eazlService.getGroupsListComplement(
            this.selectedUser.groups
        );

        // Show popup
        this.displayGroupMembership = true;
    }

    onClickGroupMembershipCancel() {
        // User clicked onMoveToSource on Group Membership - remove grp membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickGroupMembershipCancel', '@Start');

        // Close popup
        this.displayGroupMembership = false;
    }

    onMoveUpdateUserGroupMembership(event) {
        // User clicked onMoveToTarget on Group Membership: add grp membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveUpdateUserGroupMembership', '@Start');

        this.selectedUser.groups = this.belongstoUserGroupMembership;
        this.eazlService.updateUser(this.selectedUser)
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
        // - user: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuAccessToDatasources', '@Start');

        // Get the current and available users
        this.availableUserDatasource = this.eazlService.getDatasourceAccessedByUser(
            this.selectedUser.username,
            '*',
            false
        );
        this.belongstoUserDatasource = this.eazlService.getDatasourceAccessedByUser(
            this.selectedUser.username,
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

    onMoveToTargetUserDatasource(event) {
        // User clicked onMoveToTarget on Group Membership: add grp membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveToTargetUserDatasource', '@Start');

        // Add this / these makker(s) - array if multi select
        for (var i = 0; i < event.items.length; i++) {
            this.eazlService.addDatasourceUserAccess(
                event.items[i].datasourceID,
                this.selectedUser.username
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
                this.selectedUser.username
            );
        }
    }

    userMenuShowDatasources(user: User) {
        // Show all the Datasources that the user has access to, and via username or groups
        // - user: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuShowDatasources', '@Start');

        this.datasourcesPerUser = this.eazlService.getDatasourcesPerUser(user);

        // Show the popup
        this.displayUserDatasources = true;
    }

    userMenuModelPermissions(user: User, model: string) {
        // Show Model Permissions (dashboard, dastasources) to which the given user has access
        // - user: currently selected row
        // - model to filter on, ie 'dashboard'
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuModelPermissions', '@Start');
        
        this.eazlService.getUserModelPermissions(
            user.id,
            model
        )
            .then(usrMdlPerm => {
                this.userModelPermissionFlat = [];
                for (var i = 0; i < usrMdlPerm.length; i++) {
                    for (var j = 0; j < usrMdlPerm[i].objectPermissions.length; j++){
                        for (var k = 0; k < usrMdlPerm[i].objectPermissions[j].objectID.length; k++){
                            
                            let name: string = '';
                            if (model == 'dashboard') {
                                let lookupDashboard: Dashboard[] = 
                                    this.eazlService.getDashboards(
                                        usrMdlPerm[i].objectPermissions[j].objectID[k]
                                    );
                                if (lookupDashboard.length > 0) {
                                    name = lookupDashboard[0].dashboardName;
                                };
                            }

                            this.userModelPermissionFlat.push(
                                {
                                    modelID: usrMdlPerm[i].objectPermissions[j].objectID[k],
                                    modelName: name,
                                    username: this.globalVariableService.canvasUser.getValue().username,
                                    modelPermissionsAccessVia: '',
                                    objectPermission: usrMdlPerm[i].objectPermissions[j].permission
                                }
                            );
                        }
                    }
                }

                // Show the popup
                this.displayUserModelPermissions = true;
            })
            .catch(error => {
                this.globalVariableService.growlGlobalMessage.next({
                    severity: 'warn',
                    summary:  'Related Model Permissions',
                    detail:   'Unsuccessful in reading related model permissions from the database'
                });
                error.message || error
            })        
    }

    userMenuMessageHistory(user: User) {
        // Show history of messages for the selected user
        // - user: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuMessageHistory', '@Start');

        // TODO -decide whether to show all, sent by me, received by me, unread, top 10, etc
        this.canvasMessages = this.eazlService.getCanvasMessages(-1, -1, -1);

        // Show the popup
        this.displayMessages = true;
    }

    userMenuReportHistory(user: User) {
        // Show history of reports ran for the selected user
        // - user: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuReportHistory', '@Start');

        this.reportHistory = this.eazlService.getReportHistory(user.username)

        // Show popup
        this.displayReports = true;
    }

    userMenuResetPassword(user: User) {
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuResetPassword', '@Start');

        // Show popup
        this.displayResetPassword = true;
    }

    handleFormChangePasswordSubmit(howClosed: string) {
        // Handle the event: howClosed = Cancel / Submit
        this.globalFunctionService.printToConsole(this.constructor.name,'handleFormChangePasswordSubmit', '@Start');

        this.displayResetPassword = false;
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