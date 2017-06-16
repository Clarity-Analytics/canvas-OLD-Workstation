// Canvas Data Access Layer
// - load: converts API data to Canvas data format
// - set: reverse of load

import { Injectable }                 from '@angular/core';

// Our Services
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { DashboardTab }               from './model.dashboardTabs';
import { EazlDashboardTab }           from './model.dashboardTabs';
import { EazlGroup }                  from './model.group';
import { EazlUser }                   from './model.user';
import { Group }                      from './model.group';
import { User }                       from './model.user';

@Injectable()
export class CDAL {

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ){ }

    loadUser(eazlUser: EazlUser): User {
        // Load User: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadUser', '@Start');
        let userWorking = new User();
        
        if (eazlUser.username != null) {
            userWorking.username = eazlUser.username;
        } else {
            userWorking.username = '';
        }

        if (eazlUser.first_name != null) {
            userWorking.firstName = eazlUser.first_name;
        } else {
            userWorking.firstName = '';
        }

        if (eazlUser.last_name != null) {
            userWorking.lastName = eazlUser.last_name;
        } else {
            userWorking.lastName = '';
        }

        if (eazlUser.last_login != null) {
            userWorking.lastDatetimeLoggedIn = eazlUser.last_login.toString();
        } else {
            userWorking.lastDatetimeLoggedIn = '';
        }

        userWorking.lastDatetimeReportWasRun = '';
        
        if (eazlUser.email != null) {
            userWorking.emailAddress = eazlUser.email;
        } else {
            userWorking.emailAddress = '';
        }
        
        if (eazlUser.date_joined != null) {
            userWorking.activeFromDate = eazlUser.date_joined.toString();
        } else {
            userWorking.activeFromDate = '';
        }
        
        if (eazlUser.is_active != null) {
            userWorking.inactiveDate = eazlUser.is_active? '2017/05/01' : '';
        } else {
            userWorking.inactiveDate  = '';
        }
        
        if (eazlUser.date_joined != null) {
            userWorking.dateCreated = eazlUser.date_joined.toString();
        } else {
            userWorking.dateCreated = '';
        }
        
        userWorking.userIDLastUpdated = '';
        
        if (eazlUser.is_staff != null) {
            userWorking.isStaff = eazlUser.is_staff;
        } else {
            userWorking.isStaff = false;
        }
        
        if (eazlUser.is_superuser != null) {
            userWorking.isSuperUser = eazlUser.is_superuser;
        } else {
            userWorking.isSuperUser = false;
        }

        if (eazlUser.profile != null) {
        
            if (eazlUser.profile.profile_picture != null) {
                userWorking.photoPath = eazlUser.profile.profile_picture;
            } else {
                userWorking.photoPath = '';
            }
        
            if (eazlUser.profile.nick_name != null) {
                userWorking.nickName = eazlUser.profile.nick_name;
            } else {
                userWorking.nickName = '';
            }
        
            if (eazlUser.profile.work_number != null) {
                userWorking.workTelephoneNumber = eazlUser.profile.work_number;
            } else {
                userWorking.workTelephoneNumber = '';
            }
        
            if (eazlUser.profile.cell_number != null) {
                userWorking.cellNumber = eazlUser.profile.cell_number;
            } else {
                userWorking.cellNumber = '';
            }
        }
        
        // Return the User
        return userWorking;
    }


    loadGroup(eazlGroup: EazlGroup): Group {
        // Load Group: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadGroup', '@Start');
        let groupWorking = new Group();
        
        groupWorking.groupID = eazlGroup.id;

        if (eazlGroup.name != null) {
            groupWorking.groupName = eazlGroup.name;
        } else {
            groupWorking.groupName = '';
        }

        if (eazlGroup.name != null) {
            groupWorking.groupDescription = eazlGroup.name;
        } else {
            groupWorking.groupDescription = '';
        }

        groupWorking.groupCreatedDateTime = '';
        groupWorking.groupCreatedUserID = '';
        groupWorking.groupUpdatedDateTime = '';
        groupWorking.groupUpdatedUserID = '';
        
        // Return the User
        return groupWorking;
    }             

    loadDashboardTab(eazlDashboardTab: EazlDashboardTab): DashboardTab {
        // Load DashboardTab: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadGroup', '@Start');
        let dashboardTabWorking = new DashboardTab();
        
        dashboardTabWorking.dashboardID = eazlDashboardTab.id;
        dashboardTabWorking.dashboardTabID = 0;

        if (eazlDashboardTab.name != null) {
            dashboardTabWorking.dashboardTabName = eazlDashboardTab.name;
        } else {
            dashboardTabWorking.dashboardTabName = '';
        }

        if (eazlDashboardTab.description != null) {
            dashboardTabWorking.dashboardTabDescription = eazlDashboardTab.description;
        } else {
            dashboardTabWorking.dashboardTabDescription = '';
        }

        if (eazlDashboardTab.createdDateTime != null) {
            dashboardTabWorking.dashboardTabCreatedDateTime = eazlDashboardTab.createdDateTime;
        } else {
            dashboardTabWorking.dashboardTabCreatedDateTime = '';
        }        

        if (eazlDashboardTab.createdUserID != null) {
            dashboardTabWorking.dashboardTabCreatedUserID = eazlDashboardTab.createdUserID;
        } else {
            dashboardTabWorking.dashboardTabCreatedUserID = '';
        }

        if (eazlDashboardTab.updatedDateTime != null) {
            dashboardTabWorking.dashboardTabUpdatedDateTime = eazlDashboardTab.updatedDateTime;
        } else {
            dashboardTabWorking.dashboardTabUpdatedDateTime = '';
        }

        if (eazlDashboardTab.updatedUserID != null) {
            dashboardTabWorking.dashboardTabUpdatedUserID = eazlDashboardTab.updatedUserID;
        } else {
            dashboardTabWorking.dashboardTabUpdatedUserID = '';
        }
        
        // Return the User
        return dashboardTabWorking;
    }            

}

