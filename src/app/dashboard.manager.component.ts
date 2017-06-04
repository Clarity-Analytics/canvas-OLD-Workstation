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
import { DashboardGroup }             from './model.dashboardGroup';
import { DataSource }                 from './model.datasource';
import { DashboardGroupMembership }   from './model.dashboardGroupMembership';
import { EazlUser }                   from './model.user';
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
    availableDashboardGroup: DashboardGroup[] = [];             // List of Groups Dashboard does NOT belongs to
    availableSharedWith: string[] = [];                         // List of UserIDs available to share with
    belongstoDashboardGroup: DashboardGroup[] = [];             // List of Groups Dashboard already belongs to   
    belongstoSharedWith: string[] = [];                         // List of UserID with whom this Dashboard has been shared
    canvasMessages: CanvasMessage[];                            // List of Canvas Messages
    canvasUser: CanvasUser = this.globalVariableService.canvasUser.getValue();
    dashboardGroupMembership: DashboardGroupMembership[] = [];  // List of Dashboard-Group   
    dashboards: Dashboard[];                                    // List of Dashboards
    dashboardToEdit: Dashboard;                                 // Dashboard to edit in popup
    datasources: DataSource[];                                  // List of DataSources
    deleteMode: boolean = false;                                // True while busy deleting
    displayGroupMembership: boolean = false;                    // True to display popup for GrpMbrship
    displaySharedWith: boolean = false;                         // True to display popup for Shared With (Dashboards)
    displayDashboardPopup: boolean = false;                     // True to display single Dashboard
    displayDataSource: boolean = false;                         // True to display table for DataSources
    displayReports: boolean = false;                            // True to display table for Reports
    displayMessages: boolean = false;                           // True to display table for Messages
    groups: DashboardGroup[] = [];                              // List of Groups
    popupHeader: string = 'Dashboard Editor';                   // Popup header
    popuMenuItems: MenuItem[];                                  // Items in popup
    reports: Report[];                                          // List of Reports
    selectedDashboard: Dashboard;                               // Dashboard that was clicked on

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

        // Update the Dashboard Shared With if it is open
        if (this.displaySharedWith) {
            this.dashboardMenuSharedWith(this.selectedDashboard) 
        }
    }

    dashboardMenuGroupMembership(dashboard: Dashboard) {
        // Manage group membership for the selected Dashboard
        // - dashboard: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuGroupMembership', '@Start');

        // Get the current and available groups
        this.eazlService.getDashboardGroupMembership(
            this.selectedDashboard.dashboardID, true
        )
            .then(inclgrp => {
                this.belongstoDashboardGroup = inclgrp;
        
                this.eazlService.getDashboardGroupMembership(
                    this.selectedDashboard.dashboardID, false
                )
                    .then (exclgrp => {
                            this.availableDashboardGroup  = exclgrp;
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

    onMoveToTargetDashboardGroupMembership(event) {
        // User clicked onMoveToTarget on Group Membership: add grp membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveToTargetDashboardGroupMembership', '@Start');

        // Add this / these makker(s) - array if multi select
        for (var i = 0; i < event.items.length; i++) {
            this.eazlService.addDashboardGroupMembership(
                this.selectedDashboard.dashboardID, 
                event.items[i].dashboardGroupID
            );
        }
    }
    
    onMoveToSourceDashboardGroupMembership(event) {
        // User clicked onMoveToSource on Group Membership - remove grp membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveToSourceDashboardGroupMembership', '@Start');

        // Remove the makker(s)
        for (var i = 0; i < event.items.length; i++) {
            this.eazlService.deleteDashboardGroupMembership(
                this.selectedDashboard.dashboardID, 
                event.items[i].dashboardGroupID
            );
        }
    }

    onSourceReorderDashboardGroupMembership(event) {
        // User clicked onSourceReorder on Group Membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onSourceReorderDashboardGroupMembership', '@Start');
    }

    onTargetReorderDashboardGroupMembership(event) {
        // User clicked onTargetReorder on Group Membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onTargetReorderDashboardGroupMembership', '@Start');
    }

    dashboardMenuSharedWith(dashboard: Dashboard) {
        // Groups with which the selected Dashboard is shared
        // - dashboard: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardMenuSharedWith', '@Start');

        // Get the current and available user shared with
        this.belongstoSharedWith = [];
        this.availableSharedWith = [];

//         this.selectedDashboard.dashboardSharedWith.forEach(
//             sw => this.belongstoSharedWith.push(sw.dashboardSharedWithUserID)
//         )
// console.log('1',this.belongstoSharedWith)

        // Get the related Users
        this.eazlService.getUsersRelatedToDashboard
            (this.selectedDashboard.dashboardID,
             'SharedWith'
             )
             .then( u => {
                u.forEach(sglusr => {
                    this.belongstoSharedWith.push(sglusr.userName); 
                })

                // Get the complement (NOT related Users)
                this.eazlService.getUsersRelatedToDashboard
                    (this.selectedDashboard.dashboardID,
                    'SharedWith',
                    false
                    )
                    .then( u => {
                        u.forEach(sglusr => {
                            this.availableSharedWith.push(sglusr.userName);
                        })
                        this.displaySharedWith = true;               
                    })
                    .catch(error => console.log (error) )


                this.displaySharedWith = true;               
             })
             .catch(error => console.log (error) )
    }

    onClickSharedWithCancel() {
        // User clicked onMoveToSource on Group Membership - remove grp membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickGroupMembershipCancel', '@Start');

        // Close popup
        this.displaySharedWith = false;        
    }

    onMoveToTargetDashboardSharedWith(event) {
        // User clicked onMoveToTarget - add to SharedWith
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveToTargetDashboardSharedWith', '@Start');

        // Add this / these makker(s) - array if multi select
        for (var i = 0; i < event.items.length; i++) {
            this.eazlService.addDashboardSharedWith(
                this.selectedDashboard.dashboardID, 
                event.items[i]
            );
        }
    }
    
    onMoveToSourceDashboardSharedWith(event) {
        // User clicked onMoveToSource - remove from SharedWith
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveToSourceDashboardSharedWith', '@Start');

        // Remove the makker(s)
        for (var i = 0; i < event.items.length; i++) {
            this.eazlService.deleteDashboardSharedWith(
                this.selectedDashboard.dashboardID, 
                event.items[i]
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

        this.eazlService.updateDashboardIsLiked(
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
            this.dashboardToEdit.dashboardCreatedDateTime = this.canvasDate.now('standard')
            this.dashboardToEdit.dashboardCreatedUserID = this.canvasUser.username;
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
                        this.dashboards[i].dashboardNrSharedWith = 
                            this.dashboardToEdit.dashboardNrSharedWith;
                        this.dashboards[i].dashboardDefaultExportFileType = 
                            this.dashboardToEdit.dashboardDefaultExportFileType;
                        this.dashboards[i].dashboardDescription = 
                            this.dashboardToEdit.dashboardDescription;
                        this.dashboards[i].dashboardIsLocked = 
                            this.dashboardToEdit.dashboardIsLocked;
                        this.dashboards[i].dashboardOpenTabNr = 
                            this.dashboardToEdit.dashboardOpenTabNr;
                        this.dashboards[i].dashboardOwnerUserID = 
                            this.dashboardToEdit.dashboardOwnerUserID;
                        this.dashboards[i].dashboardPassword = 
                            this.dashboardToEdit.dashboardPassword;
                        this.dashboards[i].dashboardRefreshMode = 
                            this.dashboardToEdit.dashboardRefreshMode;
                        this.dashboards[i].dashboardSystemMessage = 
                            this.dashboardToEdit.dashboardSystemMessage;
                        this.dashboards[i].dashboardUpdatedDateTime = 
                            this.canvasDate.now('standard');
                        this.dashboards[i].dashboardUpdatedUserID = 
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