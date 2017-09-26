// Group form
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
import { EazlUser }                   from './model.user';
import { Group }                      from './model.group';
import { User }                       from './model.user';

@Component({
    selector:    'group',
    templateUrl: 'group.component.html',
    styleUrls:  ['group.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class GroupComponent implements OnInit {

    // Local properties
    addEditMode: string;                                // Add/Edit to indicate mode
    availableUserGroupMembership: string[] = [];          // List of Users NOT belonging to Group
    belongstoUserGroupMembership: string[] = [];          // List of Users already in Group
    displayGroupMembership: boolean = false;            // True to display popup for GrpMbrship
    displayGroupPopup: boolean = false;                 // True to display single User
    groups: Group[] = [];                               // List of Groups
    popupHeader: string = 'Group Maintenance';          // Popup header
    popuMenuItems: MenuItem[];                          // Items in popup
    selectedGroup: Group;                               // User that was clicked on

    constructor(
        private confirmationService: ConfirmationService,
        private eazlService: EazlService,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        ) {
    }

    ngOnInit() {
        // Form initialisation
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Initialise variables
        this.groups = this.eazlService.getGroups();

        this.popuMenuItems = [
            {
                label: 'Add',
                icon: 'fa-plus',
                command: (event) => this.groupMenuAdd(this.selectedGroup)
            },
            {
                label: '______________________',
                icon: '',
                disabled: true
            },
            {
                label: 'Edit',
                icon: 'fa-pencil',
                command: (event) => this.groupMenuEdit(this.selectedGroup)
            },
            {
                label: 'Delete',
                icon: 'fa-minus',
                command: (event) => this.groupMenuDelete(this.selectedGroup)
            },
            {
                label: 'Users in Group',
                icon: 'fa-users',
                command: (event) => this.groupMenuGroupMembership(this.selectedGroup)
            },

            // {
            //     label: 'Related Dashboards',
            //     icon: 'fa-list',
            //     command: (event) => this.groupMenuModelPermissions(
            //         this.selectedGroup, 'dashboard'
            //     )
            // },
        ];

    }

    groupMenuAdd(group: Group) {
        // Popup form to add a new gUserGroupMembershiproup
        // - group: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'groupMenuAdd', '@Start');
        this.addEditMode = 'Add';
        this.displayGroupPopup = true;
    }

    groupMenuEdit(group: Group) {
        // Edit selected group on a popup form
        // - group: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'groupMenuEdit', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info',
            summary:  'Selected group',
            detail:   group.groupName
        });

        this.addEditMode = 'Edit';
        this.displayGroupPopup = true;
    }

    groupMenuDelete(group: Group) {
        // Delete the selected group, but first confirm
        // - group: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'groupMenuDelete', '@Start');

        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this record?',
            reject: () => {
                return;
            },
            accept: () => {

                this.eazlService.deleteGroup(this.selectedGroup);
            }
        })
    }

    onClickGroupTable() {
        // User clicked on a row
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickGroupTable', '@Start');

        // Update the group group membership if it is open
        if (this.displayGroupMembership) {
            this.groupMenuGroupMembership(this.selectedGroup)
        }

    }

    groupMenuGroupMembership(group: Group) {
        // Manage users that belong to this group
        // - group: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'groupMenuGroupMembership', '@Start');

        this.belongstoUserGroupMembership = this.selectedGroup.users;
        this.availableUserGroupMembership = this.eazlService.getUsersListComplement(
            this.selectedGroup.users
        );

        // Show popup
        this.displayGroupMembership = true;
    }

    onMoveUpdateUserGroupMembership(event) {
        // User clicked onMoveToTarget on Group Membership: add grp membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveUpdateUserGroupMembership', '@Start');

        this.selectedGroup.users = this.belongstoUserGroupMembership;
        this.eazlService.updateGroup(this.selectedGroup)
    }

    onClickGroupMembershipCancel() {
        // User clicked Cancel button on Group Membership panel
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickGroupMembershipCancel', '@Start');

        // Close popup
        this.displayGroupMembership = false;
    }

    onClickDataSourceCancel() {
        // User clicked Cancel button for DS access panel
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickDataSourceCancel', '@Start');

        // Close popup
    }

    onMoveToTargetDatasourceGroup(event) {
        // User clicked onMoveToTarget: add Datasource access
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveToTargetDatasourceGroup', '@Start');

        // Add this / these makker(s) - array if multi select
        for (var i = 0; i < event.items.length; i++) {
            this.eazlService.addGroupDatasourceAccess(
                event.items[i].datasourceID,
                this.selectedGroup.groupID
            );
        }
    }

    onMoveToSourceDatasourceGroup(event) {
        // User clicked onMoveToSource: remove Datasource access
        this.globalFunctionService.printToConsole(this.constructor.name,'onMoveToSourceDatasourceGroup', '@Start');

        // Remove the makker(s)
        for (var i = 0; i < event.items.length; i++) {
            this.eazlService.deleteGroupDatasourceAccess(
                event.items[i].datasourceID,
                this.selectedGroup.groupID
            );
        }
    }

    handleGroupPopupFormClosed(howClosed: string) {
        // Handle the event: howClosed = Cancel / Submit
        this.globalFunctionService.printToConsole(this.constructor.name,'handleGroupPopupFormClosed', '@Start');

        this.displayGroupPopup = false;
    }
}

// Notes for PrimeNG p-table newbees:
//  Filtering is enabled by setting the filter property as true in column object.
//  Default match mode is "startsWith" and this can be configured
//  using filterMatchMode property of column object that also accepts "contains", "endsWith",
//  "equals" and "in". An optional global filter feature is available to search all fields with a keyword.
//  By default input fields are generated as filter elements and using templating any component
//  can be used as a filter.