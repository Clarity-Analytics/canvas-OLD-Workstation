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
import { CanvasUser }                 from './model.user';
import { Dashboard }                  from './model.dashboards';
import { EazlUser }                   from './model.user';
import { DashboardGroup }             from './model.dashboardGroup';
import { DashboardGroupMembership }   from './model.dashboardGroupMembership';

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
    belongstoDashboarGroup: DashboardGroup[] = [];              // List of Groups Dashboard already belongs to   
    canvasUser: CanvasUser = this.globalVariableService.canvasUser.getValue();
    dashboards: Dashboard[];                                    // List of Dashboards
    dashboardToEdit: Dashboard;                                 // Dashboard to edit in popup
    deleteMode: boolean = false;                                // True while busy deleting
    displayGroupMembership: boolean = false;                    // True to display popup for GrpMbrship
    displayDashboardPopup: boolean = false;                     // True to display single Dashboard
    groups: DashboardGroup[] = [];                              // List of Groups
    popupHeader: string = 'Dashboard Editor';                   // Popup header
    popuMenuItems: MenuItem[];                                  // Items in popup
    selectedDashboard: Dashboard;                               // Dashboard that was clicked on
    dashboardGroupMembership: DashboardGroupMembership[] = [];  // List of Dashboard-Group   

    constructor(
        private confirmationService: ConfirmationService,
        private canvasDate: CanvasDate,
        private eazlService: EazlService,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        ) {
    }
    
    ngOnInit() {
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
                this.belongstoDashboarGroup = inclgrp;
        
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
        // for (var i = 0; i < event.items.length; i++) {
        //     this.eazlService.deleteDashboardGroupMembership(
        //         this.selectedDashboard.dashboardID, 
        //         event.items[i].groupID
        //     );
        // }
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