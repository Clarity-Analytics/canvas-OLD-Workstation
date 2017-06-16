// Canvas Data Access Layer
// - load: converts API data to Canvas data format
// - set: reverse of load

import { Injectable }                 from '@angular/core';

// Our Services
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { EazlUser }                   from './model.user';
import { User }                       from './model.user';

@Injectable()
export class CDAL {

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ){ }

    loadUser(eazlUser: EazlUser) {
        // Load User: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadUser', '@Start');
        let userWorking = new User();
            
        userWorking.username = eazlUser.username;
        userWorking.firstName = eazlUser.first_name;
        userWorking.lastName = eazlUser.last_name;
        userWorking.nickName = eazlUser.profile.nick_name;
        userWorking.photoPath = eazlUser.profile.profile_picture;
        userWorking.lastDatetimeLoggedIn = eazlUser.last_login.toString();
        userWorking.lastDatetimeReportWasRun = '';
        userWorking.emailAddress = eazlUser.email;
        userWorking.cellNumber = eazlUser.profile.cell_number;
        userWorking.workTelephoneNumber = eazlUser.profile.work_number;
        userWorking.activeFromDate = eazlUser.date_joined.toString();
        userWorking.inactiveDate = eazlUser.is_active? '2017/05/01' : '';
        userWorking.dateCreated = eazlUser.date_joined.toString()
        userWorking.userIDLastUpdated = '';
        userWorking.isStaff = eazlUser.is_staff;
// is_superuser
//         is_superuser: boolean;

        // Return the User
        return userWorking;

    }
}

