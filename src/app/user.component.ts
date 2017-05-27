// User form
import { Component }                  from '@angular/core';
import { FormBuilder }                from '@angular/forms';
import { FormControl }                from '@angular/forms';
import { FormGroup }                  from '@angular/forms';
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
import { User }                       from './model.user';
import { EazlUser }                       from './model.user';

@Component({
    selector:    'user',
    templateUrl: 'user.component.html',
    styleUrls:  ['user.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {
    
    // Local properties
    addEditMode: string;
    

displayGroupMembership: boolean = false;    
checkboxGroupMembership: boolean;            // ...
groupMembershipDropDown:any;
selectedGroupMembership:any;
groupMembershipForm: FormGroup;

    deleteMode: boolean = false;                // True while busy deleting
    displayUserPopup: boolean = false;
    popupHeader: string = 'User Maintenance';
    popuMenuItems: MenuItem[];
    selectedUser: User;
    users: User[];

    constructor(
        private confirmationService: ConfirmationService,
        private eazlService: EazlService,
        private fb: FormBuilder,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        ) {
    }
    
    ngOnInit() {
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
 


        // Define form group for first tab
        this.groupMembershipForm = this.fb.group(
            {
                'checkboxGroupMembership':             new FormControl(''),
                'dropdownGroupMembership':             new FormControl(''),
                'textGroupMembership':               new FormControl(''),
            });


 
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
                label: 'Access', 
                icon: 'fa-database', 
                command: (event) => this.userMenuAccess(this.selectedUser)
            },
            {
                label: 'Related Data Sources', 
                icon: 'fa-list', 
                command: (event) => this.userMenuRelatedDataSources(this.selectedUser)
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

    userMenuGroupMembership(user: User) {
        // Manage group membership for the selected user
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuGroupMembership', '@Start');


this.displayGroupMembership = true; 
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

    onClickGroupMembershipCancel(){
        // User clicked Cancel on Group Membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickGroupMembershipCancel', '@Start');

        // Remove popup form
        this.displayGroupMembership = false;
    }

    onClickGroupMembershipSubmit() {
        // User clicked Submit on Group Membership
        this.globalFunctionService.printToConsole(this.constructor.name,'onClickGroupMembershipSubmit', '@Start');

        // Remove popup form
        this.displayGroupMembership = false;
    
    }




    userMenuAccess(user: User) {
        // Access to Data Sources for the selected user
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuAccess', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'User Access', 
            detail:   user.firstName + ' - ' + user.lastName
        });
    }

    userMenuRelatedDataSources(user: User) {
        // Manage related Data Sources (owned, given rights and received rights)
        // - User: currently selected row
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuRelatedDataSources', '@Start');

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