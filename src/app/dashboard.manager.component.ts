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
import { CanvasDate }                 from './date.services';
import { CanvasMessage }              from './model.canvasMessage';
import { CanvasUser }                 from './model.user';
import { Dashboard }                  from './model.dashboards';
import { DashboardUserPermissions }   from './model.dashboards';
import { DataSource }                 from './model.datasource';
import { DashboardTagMembership }     from './model.dashboardTagMembership';
import { EazlUser }                   from './model.user';
import { Group }                      from './model.group';
import { Report }                     from './model.report';
import { User }                       from './model.user';


@Component({
    selector:    'dashboardManager',
    templateUrl: 'dashboard.manager.component.html',
    styleUrls:  ['dashboard.manager.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DashboardManagerComponent implements OnInit {

    // Local properties
    addEditMode: string;                                        // Add/Edit to indicate mode
    availableSharedWith: string[] = [];                         // List of UserNames available to share with
    belongstoSharedWith: string[] = [];                         // List of UserName with whom this Dashboard has been shared
    canvasMessages: CanvasMessage[];                            // List of Canvas Messages
    canvasUser: CanvasUser = this.globalVariableService.canvasUser.getValue();
    dashboardTagMembership: DashboardTagMembership[] = [];      // List of Dashboard-Group
    dashboards: Dashboard[];                                    // List of Dashboards
    dashboardTags: string[];                                    // DataList of tags
    dashboardToEdit: Dashboard;                                 // Dashboard to edit in popup
    dashboardUserPermissions: DashboardUserPermissions[];       // User of permissions
    datasources: DataSource[];                                  // List of DataSources
    deleteMode: boolean = false;                                // True while busy deleting
    displayTagMembership: boolean = false;                      // True to display popup for GrpMbrship
    displayDashboardPopup: boolean = false;                     // True to display single Dashboard
    displayDataSource: boolean = false;                         // True to display table for DataSources
    displayGroupsPermissions: boolean = false;                  // True to display popup for Groups Shared With (Dashboards)
    displayMessages: boolean = false;                           // True to display table for Messages
    displayReports: boolean = false;                            // True to display table for Reports
    displayUserPermissions: boolean = false;                    // True to show permissions panel
    popupHeader: string = 'Dashboard Editor';                   // Popup header
    popuMenuItems: MenuItem[];                                  // Items in popup
    reports: Report[];                                          // List of Reports
    selectedDashboard: Dashboard;                               // Dashboard that was clicked on
    selectedMembershipTag: DashboardTagMembership;              // Item clicked on in table
    selectedUserPermission: DashboardUserPermissions;           // Selected in table
    tagname: string;                                            // Input tag name on form

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

        this.dashboards = this.eazlService.getDashboards();
        this.dashboardTagMembership = this.eazlService.getDashboardTagMembership();
        this.datasources = this.eazlService.getDataSources(-1);
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
                label: 'Tag Membership',
                icon: 'fa-tags',
                command: (event) => this.dashboardMenuTagMembership(this.selectedDashboard)
            },
            {
                label: 'Shared Users',
                icon: 'fa-users',
                command: (event) => this.dashboardMenuUserPermissions(this.selectedDashboard)
            },
            {
                label: 'Shared Groups',
                icon: 'fa-database',
                command: (event) => this.dashboardMenuGroupsSharedWith(this.selectedDashboard)
            },
            {
                label: 'Related Datasources',
                icon: 'fa-list',
                command: (event) => this.dashboardMenuRelatedDataSources(this.selectedDashboard)
            },
            {
                label: 'Message History',
                icon: 'fa-comments',
                command: (event) => this.dashboardMenuMessageHistory(this.selectedDashboard)
            },
            {
                label: 'Related Reports',
                icon: 'fa-table',
                command: (event) => this.dashboardMenuReportHistory(this.selectedDashboard)
            },
            {
                label: 'Like',
                icon: 'fa-heart',
                command: (event) => this.dashboardMenuToggleLike(this.selectedDashboard)
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
        this.dashboardToEdit = new Dashboard;
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

        this.addEditMode = 'Edit';
        this.dashboardToEdit = this.selectedDashboard;
        this.displayDashboardPopup = true;
    }

    dashboardMenuDelete(dashboard: Dashboard) {
        // Delete the selected Dashboard, but first confirm
        // - dashboard: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuDelete', '@Start');

        this.deleteMode = true;
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this record?',
            reject: () => {
                this.deleteMode = false;
                return;
            },
            accept: () => {

                // - Dashboard: currently selected row
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
        // User clicked on a row
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickDashboardTable', '@Start');

        // Update the Dashboard group membership if it is open
        if (this.displayTagMembership) {
            this.dashboardMenuTagMembership(this.selectedDashboard)
        }

        // Update the Dashboard Shared With if it is open
        if (this.displayUserPermissions) {
            this.dashboardMenuUserPermissions(this.selectedDashboard)
        }
        if (this.displayGroupsPermissions) {
            this.dashboardMenuGroupsSharedWith(this.selectedDashboard)
        }

    }

    dashboardMenuTagMembership(dashboard: Dashboard) {
        // Manage group membership for the selected Dashboard
        // - dashboard: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuTagMembership', '@Start');

        // Get the current tags
        this.dashboardTagMembership = this.eazlService.getDashboardTagMembership(
            this.selectedDashboard.dashboardID
        );

        // Show popup
        this.displayTagMembership = true;
    }

    onClickTagMembershipCancel() {
        // User clicked onMoveToSource on Group Membership - remove grp membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickTagMembershipCancel', '@Start');

        // Close popup
        this.displayTagMembership = false;
    }

    onClickAddDashboardTagMembership(event) {
        // Add tag membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickAddDashboardTagMembership', '@Start');

        // Add this / these makker(s) - array if multi select
        this.eazlService.addDashboardTagMembership(
            this.selectedDashboard.dashboardID,
            this.tagname
        );
    }

    onClickDeleteDashboardTagMembership(event) {
        // Delete tag membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickDeleteDashboardTagMembership', '@Start');

        // Remove the makker(s)
        this.eazlService.deleteDashboardTagMembership(
            this.selectedMembershipTag.dashboardTagID
        );
    }

    dashboardMenuUserPermissions(dashboard: Dashboard) {
        // Users with their permissions for the selected Dashboard
        // - dashboard: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuUserPermissions', '@Start');

        // Get the current and available user shared with; as a Promise to cater for Async
        this.eazlService.getdashboardUserPermissionsX(
            dashboard.dashboardID
        )
            .then(dashUsrPer => {
                this.dashboardUserPermissions = dashUsrPer;
                if (this.dashboardUserPermissions.length > 0) {
                    this.selectedUserPermission = this.dashboardUserPermissions[0];
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
            assignPermissions.push('add_dashboard');
        } else {
            removePermissions.push('add_dashboard');
        }

        this.eazlService.updateDashboardModelPermissions(
            'dashboards',
            this.selectedDashboard.dashboardID,
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
            assignPermissions.push('assign_permission_dashboard');
        } else {
            removePermissions.push('assign_permission_dashboard');
        }

        this.eazlService.updateDashboardModelPermissions(
            'dashboards',
            this.selectedDashboard.dashboardID,
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
            assignPermissions.push('change_dashboard');
        } else {
            removePermissions.push('change_dashboard');
        }

        this.eazlService.updateDashboardModelPermissions(
            'dashboards',
            this.selectedDashboard.dashboardID,
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
            assignPermissions.push('delete_dashboard');
        } else {
            removePermissions.push('delete_dashboard');
        }

        this.eazlService.updateDashboardModelPermissions(
            'dashboards',
            this.selectedDashboard.dashboardID,
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
            assignPermissions.push('remove_permission_dashboard');
        } else {
            removePermissions.push('remove_permission_dashboard');
        }

        this.eazlService.updateDashboardModelPermissions(
            'dashboards',
            this.selectedDashboard.dashboardID,
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
            assignPermissions.push('view_dashboard');
        } else {
            removePermissions.push('view_dashboard');
        }

        this.eazlService.updateDashboardModelPermissions(
            'dashboards',
            this.selectedDashboard.dashboardID,
            this.selectedUserPermission.username,
            'user',
            assignPermissions,
            removePermissions
        );
    }

    onClickUserPermissionCancel() {
        // Close User Permissions panel, and update DB
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickUserPermissionCancel', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'warn',
            summary:  'Cancel',
            detail:   'As requested, no changes were applied'
        });

        // Close popup
        this.displayUserPermissions = false;
    }

    dashboardMenuGroupsSharedWith(dashboard: Dashboard) {
        // Groups with which the selected Dashboard is shared
        // - dashboard: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuGroupsSharedWith', '@Start');

        // Get the related Groups

        this.eazlService.getGroupsRelatedToDashboard(
            this.selectedDashboard.dashboardID,
            'SharedWith'
        ).forEach( g => this.belongstoGroupsSharedWith.push(g));

        this.eazlService.getGroupsRelatedToDashboard(
            this.selectedDashboard.dashboardID,
            'SharedWith',
            false
        ).forEach( g => this.availableGroupSharedWith.push(g));;

        // Show popup
        this.displayGroupsPermissions = true;
    }

    onMoveToTargetDashboardGroupSharedWith(event) {
        // User clicked onMoveToTarget - add to SharedWith
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveToTargetDashboardGroupSharedWith', '@Start');

        // Add this / these makker(s) - array if multi select
        for (var i = 0; i < event.items.length; i++) {
            this.eazlService.addDashboardGroupRelationship(
                this.selectedDashboard.dashboardID,
                event.items[i].groupID,
                'SharedWith'
            );
        }
    }

    onMoveToSourceDashboardGroupSharedWith(event) {
        // User clicked onMoveToSource - remove from SharedWith
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveToSourceDashboardGroupSharedWith', '@Start');

        // Remove the makker(s)
        for (var i = 0; i < event.items.length; i++) {
            this.eazlService.deleteDashboardGroupRelationship(
                this.selectedDashboard.dashboardID,
                event.items[i].groupID,
                'SharedWith'
            );
        }
    }

    dashboardMenuRelatedDataSources(dashboard: Dashboard) {
        // Manage related Data Sources (owned, given rights and received rights)
        // - dashboard: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuRelatedDataSources', '@Start');

        this.datasources = this.eazlService.getDataSources(dashboard.dashboardID);
        this.displayDataSource = true;
    }


    dashboardMenuMessageHistory(dashboard: Dashboard) {
        // Show history of messages for the selected Dashboard
        // - dashboard: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuMessageHistory', '@Start');

        this.canvasMessages = this.eazlService.getCanvasMessages(dashboard.dashboardID,-1,-1);
        this.displayMessages = true;
    }

    dashboardMenuReportHistory(dashboard: Dashboard) {
        // Show history of reports ran for the selected Dashboard
        // - dashboard: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuReportHistory', '@Start');

        this.reports = this.eazlService.getReports(dashboard.dashboardID);
        this.displayReports = true;

    }

    dashboardMenuToggleLike(dashboard: Dashboard) {
        // Click Like popup menu option: toggle liked/not for current user on this Dashboard
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuToggleLike', '@Start');

        this.eazlService.toggleDashboardIsLiked(
            dashboard.dashboardID,
            this.canvasUser.username,
            !dashboard.dashboardIsLiked
        );
    }

    dashboardMenuResetLock(dashboard: Dashboard) {
        // Click Lock popup menu option: toggle the lock for this user on this Dashboard
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuResetLock', '@Start');

        for (var i = 0; i < this.dashboards.length; i++) {
            if (this.dashboards[i].dashboardID == dashboard.dashboardID) {
                this.dashboards[i].dashboardIsLocked = !this.dashboards[i].dashboardIsLocked;
            }
        }
    }

    handleFormDashboardSubmit(returnCode: string) {
        // Handle the event: howClosed = Cancel / Submit
        this.globalFunctionService.printToConsole(this.constructor.name,'handleFormDashboardSubmit()', '@Start');

        // Bail if Popup was Cancelled
        if (returnCode == "Cancel") {

            // Close the popup form for the Widget Builder
            this.displayDashboardPopup = false;

            return;
        }

        // Add new Dashboard to Array
        if (this.addEditMode == "Add") {

            // Add the new guy to the Array, if it belongs to current Dashboar
            // TODO - this is crude & error prone: eventually autoIndex in DB
            let lastDashboardID =
                this.dashboards.length;

            // Set the Widget ID & Add to Array
            // TODO - do via Eazl into DB
            this.dashboardToEdit.dashboardID = lastDashboardID;
            this.dashboardToEdit.dashboardCreatedDateTime = this.canvasDate.now('standard');
            this.dashboardToEdit.dashboardCreatedUserName = this.canvasUser.username;
            this.dashboards.push(this.dashboardToEdit);

            // Inform the user
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'info',
                summary:  'Success',
                detail:   'New Dashboard added'
            });

            // // Close the popup form for the Widget Builder
            // this.displayEditWidget = false;
        }

        // Save the editted Dashboard back to the Array
        if (this.addEditMode == "Edit") {

            // Loop on the Array, find the editted one and update
            for (var i = 0; i < this.dashboards.length; i++) {

                if (this.dashboards[i].dashboardID ===
                    this.dashboardToEdit.dashboardID) {

                        // Update individual fields: if you replace the whole Array
                        // entry, everything dies.  Including position, svg rendered, etc
                        this.dashboards[i].dashboardID =
                            this.dashboardToEdit.dashboardID;
                        this.dashboards[i].dashboardCode =
                            this.dashboardToEdit.dashboardCode;
                        this.dashboards[i].dashboardName =
                            this.dashboardToEdit.dashboardName;
                        this.dashboards[i].dashboardBackgroundImageSrc =
                            this.dashboardToEdit.dashboardBackgroundImageSrc;
                        this.dashboards[i].dashboardComments =
                            this.dashboardToEdit.dashboardComments;
                        this.dashboards[i].isContainerHeaderDark =
                            this.dashboardToEdit.isContainerHeaderDark;
                        this.dashboards[i].showContainerHeader =
                            this.dashboardToEdit.showContainerHeader;
                        this.dashboards[i].dashboardBackgroundColor =
                            this.dashboardToEdit.dashboardBackgroundColor;
                        this.dashboards[i].dashboardNrGroups =
                            this.dashboardToEdit.dashboardNrGroups;
                        this.dashboards[i].dashboardIsLiked =
                            this.dashboardToEdit.dashboardIsLiked;
                        this.dashboards[i].dashboardNrUsersSharedWith =
                            this.dashboardToEdit.dashboardNrUsersSharedWith;
                        this.dashboards[i].dashboardNrGroupsSharedWith =
                            this.dashboardToEdit.dashboardNrGroupsSharedWith;
                        this.dashboards[i].dashboardDefaultExportFileType =
                            this.dashboardToEdit.dashboardDefaultExportFileType;
                        this.dashboards[i].dashboardDescription =
                            this.dashboardToEdit.dashboardDescription;
                        this.dashboards[i].dashboardIsLocked =
                            this.dashboardToEdit.dashboardIsLocked;
                        this.dashboards[i].dashboardOpenTabNr =
                            this.dashboardToEdit.dashboardOpenTabNr;
                        this.dashboards[i].dashboardOwners =
                            this.dashboardToEdit.dashboardOwners;
                        this.dashboards[i].dashboardPassword =
                            this.dashboardToEdit.dashboardPassword;
                        this.dashboards[i].dashboardRefreshMode =
                            this.dashboardToEdit.dashboardRefreshMode;
                        this.dashboards[i].dashboardRefreshFrequency =
                            this.dashboardToEdit.dashboardRefreshFrequency;
                        this.dashboards[i].dashboardSystemMessage =
                            this.dashboardToEdit.dashboardSystemMessage;
                        this.dashboards[i].dashboardUpdatedDateTime =
                            this.canvasDate.now('standard');
                        this.dashboards[i].dashboardUpdatedUserName =
                             this.canvasUser.username;
                }
            }

            this.globalVariableService.growlGlobalMessage.next({
                severity: 'info',
                summary:  'Success',
                detail:   'Dashboard updated'
            });
        }

        // Close the popup form
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