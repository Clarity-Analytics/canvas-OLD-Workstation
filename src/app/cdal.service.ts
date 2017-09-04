// Canvas Data Access Layer
// It should only be called from Eazl.
// Only have these two functions; it does not update global variables, etc.
// - load: converts API data to Canvas data format.  It does CALCULATE extra data needed.
// - save: reverse of load.  It does ADD data useful to DB.

// Note: this is done for a SINGLE record - Eazl will add the loop

import { Injectable }                 from '@angular/core';

//  PrimeNG stuffies
import { SelectItem }                 from 'primeng/primeng';

// Our Services
// import { EazlService }                from './eazl.service';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { CanvasDate }                 from './date.services';
import { CanvasMessage }              from './model.canvasMessage';
import { CanvasMessageRecipient }     from './model.canvasMessageRecipient';
import { Dashboard }                  from './model.dashboards';
import { DashboardGroupPermissions }   from './model.dashboards';
import { DashboardTag }               from './model.dashboardTag';
import { DashboardTab }               from './model.dashboardTabs';
import { DashboardTagMembership }     from './model.dashboardTagMembership';
import { DashboardUserPermissions }   from './model.dashboards';
import { DataSource }                 from './model.datasource';
import { DataSourceGroupPermissions}  from './model.datasource';
import { DataSourceUserPermissions}   from './model.datasource';
import { EazlAppData }                from './model.appdata';
import { EazlCanvasMessage }          from './model.canvasMessage';
import { EazlCanvasMessageRecipient } from './model.canvasMessageRecipient';
import { EazlDashboard }              from './model.dashboards';
import { EazlDashboardGroupPermissions }    from './model.dashboards';
import { EazlDashboardTab }           from './model.dashboardTabs';
import { EazlDashboardTag }           from './model.dashboardTag';
import { EazlDashboardTagMembership }       from './model.dashboardTagMembership';
import { EazlDashboardUserPermissions }     from './model.dashboards';
import { EazlDataSource }             from './model.datasource';
import { EazlDataSourceGroupPermissions}    from './model.datasource';
import { EazlDataSourceUserPermissions}     from './model.datasource';
import { EazlFilter }                 from './model.filter';
import { EazlGroup }                  from './model.group';
import { EazlGroupDatasourceAccess }  from './model.groupDSaccess';
import { EazlPackageTask }            from './model.package.task';
import { EazlReport }                 from './model.report';
import { EazlReportHistory }          from './model.reportHistory';
import { EazlReportUserRelationship } from './model.reportUserRelationship';
import { EazlReportWidgetSet }        from './model.report.widgetSets';
import { EazlSystemConfiguration }    from './model.systemconfiguration';
import { EazlUser }                   from './model.user';
import { EazlUserModelPermission }    from './model.userModelPermissions';
import { EazlWidget }                 from './model.widget';
import { EazlWidgetTemplate }         from './model.widgetTemplates';
import { GraphType }                  from './model.graph.type';
import { Group }                      from './model.group';
import { GroupDatasourceAccess }      from './model.groupDSaccess';
import { PackageTask }                from './model.package.task';
import { Report }                     from './model.report';
import { ReportHistory }              from './model.reportHistory';
import { ReportUserRelationship }     from './model.reportUserRelationship';
import { ReportWidgetSet }            from './model.report.widgetSets';
import { SystemConfiguration }        from './model.systemconfiguration';
import { User }                       from './model.user';
import { UserModelPermission }        from './model.userModelPermissions';
import { Widget }                     from './model.widget';
import { WidgetTemplate }             from './model.widgetTemplates';
import { WidgetType }                 from './model.widget.type';


@Injectable()
export class CDAL {

    constructor(
        private canvasDate: CanvasDate,
        // private eazlService: EazlService,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ){ }

    loadUser(eazlUser: EazlUser): User {
        // Load User: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadUser', '@Start');

        let userWorking = new User();
        userWorking.id = eazlUser.id;

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

        if (eazlUser.groups.length > 0) {
            userWorking.groups = [ eazlUser.groups[0] ]
            for (var i = 1; i < eazlUser.groups.length; i++) {
                userWorking.groups.push(eazlUser.groups[i]);
            }
        } else {
            userWorking.groups = [];
        }

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
            userWorking.inactiveDate = eazlUser.is_active? this.canvasDate.now('standard') : '';
        } else {
            userWorking.inactiveDate  = '';
        }

        if (eazlUser.date_joined != null) {
            userWorking.dateCreated = eazlUser.date_joined.toString();
        } else {
            userWorking.dateCreated = '';
        }

        userWorking.userNameLastUpdated = '';

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

        userWorking.profile =
            {
                nickName: '',
                cellNumber: '',
                workTelephoneNumber: '',
                photoPath: '',
                averageWarningRuntime: 3,
                dashboardIDStartup: -1,
                dashboardTabIDStartup: -1,
                environment: '',
                frontendColorScheme: '',
                defaultReportFilters: '',
                defaultWidgetConfiguration: '',
                gridSize: 3,
                growlLife: 3,
                growlSticky: false,
                snapToGrid: false,
            }

        if (eazlUser.profile != null) {

            if (eazlUser.profile.profile_picture != null) {
                userWorking.profile.photoPath = eazlUser.profile.profile_picture;
            } else {
                userWorking.profile.photoPath = '';
            }

            if (eazlUser.profile.nick_name != null) {
                userWorking.profile.nickName = eazlUser.profile.nick_name;
            } else {
                userWorking.profile.nickName = '';
            }

            if (eazlUser.profile.work_number != null) {
                userWorking.profile.workTelephoneNumber = eazlUser.profile.work_number;
            } else {
                userWorking.profile.workTelephoneNumber = '';
            }

            if (eazlUser.profile.cell_number != null) {
                userWorking.profile.cellNumber = eazlUser.profile.cell_number;
            } else {
                userWorking.profile.cellNumber = '';
            }

            if (eazlUser.profile.query_runtime_warning != null) {
                userWorking.profile.averageWarningRuntime = eazlUser.profile.query_runtime_warning;
            } else {
                userWorking.profile.averageWarningRuntime = 3;
            }

            if (eazlUser.profile.startup_dashboard_id != null) {
                userWorking.profile.dashboardIDStartup = eazlUser.profile.startup_dashboard_id;
            } else {
                userWorking.profile.dashboardIDStartup = -1;
            }

            if (eazlUser.profile.startup_dashboard_tab_id != null) {
                userWorking.profile.dashboardTabIDStartup = eazlUser.profile.startup_dashboard_tab_id;
            } else {
                userWorking.profile.dashboardTabIDStartup = -1;
            }

            if (eazlUser.profile.environment != null) {
                userWorking.profile.environment = eazlUser.profile.environment;
            } else {
                userWorking.profile.environment = '';
            }

            if (eazlUser.profile.color_scheme != null) {
                userWorking.profile.frontendColorScheme = eazlUser.profile.color_scheme;
            } else {
                userWorking.profile.frontendColorScheme = '';
            }

            if (eazlUser.profile.default_report_filters != null) {
                userWorking.profile.defaultReportFilters = eazlUser.profile.default_report_filters;
            } else {
                userWorking.profile.defaultReportFilters = '';
            }

            if (eazlUser.profile.default_widget_configuration != null) {
                userWorking.profile.defaultWidgetConfiguration = eazlUser.profile.default_widget_configuration;
            } else {
                userWorking.profile.defaultWidgetConfiguration = '';
            }

            if (eazlUser.profile.grid_size != null) {
                userWorking.profile.gridSize = eazlUser.profile.grid_size;
            } else {
                userWorking.profile.gridSize = 3;
            }

            if (eazlUser.profile.growl_life != null) {
                userWorking.profile.growlLife = eazlUser.profile.growl_life;
            } else {
                userWorking.profile.growlLife = 3;
            }

            if (eazlUser.profile.growl_sticky != null) {
                userWorking.profile.growlSticky = eazlUser.profile.growl_sticky;
            } else {
                userWorking.profile.growlSticky = false;
            }

            if (eazlUser.profile.snap_to_grid != null) {
                userWorking.profile.snapToGrid = eazlUser.profile.snap_to_grid;
            } else {
                userWorking.profile.snapToGrid = false;
            }
        }

        // Return the User
        return userWorking;
    }

    saveUser(user: User): EazlUser {
        // Load User: move data Canvas -> Eazl
        this.globalFunctionService.printToConsole(this.constructor.name,'saveUser', '@Start');

        let eazlUserWorking = new EazlUser();
        eazlUserWorking.id = user.id;

        if (user.username != null) {
            eazlUserWorking.username = user.username;
        } else {
            eazlUserWorking.username = '';
        }

        if (user.firstName != null) {
            eazlUserWorking.first_name = user.firstName;
        } else {
            eazlUserWorking.first_name = '';
        }

        if (user.lastName != null) {
            eazlUserWorking.last_name = user.lastName;
        } else {
            eazlUserWorking.last_name = '';
        }

        if (user.lastDatetimeLoggedIn != null) {
            eazlUserWorking.last_login = new Date(user.lastDatetimeLoggedIn);
        } else {
            eazlUserWorking.last_login = null;
        }

        // user.lastDatetimeReportWasRun = '';

        if (user.groups.length > 0) {
            eazlUserWorking.groups = [ user.groups[0] ]
            for (var i = 1; i < user.groups.length; i++) {
                eazlUserWorking.groups.push(user.groups[i]);
            }
        } else {
            eazlUserWorking.groups = [];
        }

        if (user.emailAddress != null) {
            eazlUserWorking.email = user.emailAddress;
        } else {
            eazlUserWorking.email = '';
        }

        if (user.activeFromDate != null) {
            eazlUserWorking.date_joined = new Date(user.activeFromDate);
        } else {
            eazlUserWorking.date_joined = null;
        }

        if (user.inactiveDate != null) {
            eazlUserWorking.is_active = true;
        } else {
            eazlUserWorking.is_active  = false;
        }

        if (user.dateCreated != null) {
            eazlUserWorking.date_joined = new Date(user.dateCreated);
        } else {
            eazlUserWorking.date_joined = null;
        }

        // user.userNameLastUpdated = '';

        if (user.isStaff != null) {
            eazlUserWorking.is_staff = user.isStaff;
        } else {
            eazlUserWorking.is_staff = false;
        }

        if (user.isSuperUser != null) {
            eazlUserWorking.is_superuser = user.isSuperUser;
        } else {
            eazlUserWorking.is_superuser = false;
        }

        eazlUserWorking.profile =
            {
                nick_name: '',
                cell_number: '',
                work_number: '',
                profile_picture: '',
                query_runtime_warning: 0,
                startup_dashboard_id: -1,
                startup_dashboard_tab_id: -1,
                environment: '',
                color_scheme: '',
                default_report_filters: '',
                default_widget_configuration: '',
                grid_size: 0,
                growl_life: 0,
                growl_sticky: false,
                snap_to_grid: false
            }

        if (user.profile != null) {

            if (user.profile.photoPath != null) {
                if (user.profile.photoPath == '') {
                    eazlUserWorking.profile.profile_picture = null;
                } else {
                    eazlUserWorking.profile.profile_picture = user.profile.photoPath;
                }
            } else {
                eazlUserWorking.profile.profile_picture = null;
            }

            if (user.profile.nickName != null) {
                eazlUserWorking.profile.nick_name = user.profile.nickName;
            } else {
                eazlUserWorking.profile.nick_name = '';
            }

            if (user.profile.workTelephoneNumber != null) {
                eazlUserWorking.profile.work_number = user.profile.workTelephoneNumber;
            } else {
                eazlUserWorking.profile.work_number = '';
            }

            if (user.profile.cellNumber != null) {
                eazlUserWorking.profile.cell_number = user.profile.cellNumber;
            } else {
                eazlUserWorking.profile.cell_number = '';
            }

            if (user.profile.averageWarningRuntime != null) {
                eazlUserWorking.profile.query_runtime_warning = user.profile.averageWarningRuntime;
            } else {
                eazlUserWorking.profile.query_runtime_warning = 3;
            }

            if (user.profile.dashboardIDStartup != null) {
                eazlUserWorking.profile.startup_dashboard_id = user.profile.dashboardIDStartup;
            } else {
                eazlUserWorking.profile.startup_dashboard_id = -1;
            }

            if (user.profile.dashboardTabIDStartup != null) {
                eazlUserWorking.profile.startup_dashboard_tab_id = user.profile.dashboardTabIDStartup;
            } else {
                eazlUserWorking.profile.startup_dashboard_tab_id = -1;
            }

            if (user.profile.environment != null) {
                eazlUserWorking.profile.environment = user.profile.environment;
            } else {
                eazlUserWorking.profile.environment = '';
            }

            if (user.profile.frontendColorScheme != null) {
                eazlUserWorking.profile.color_scheme = user.profile.frontendColorScheme;
            } else {
                eazlUserWorking.profile.color_scheme = '';
            }

            if (user.profile.defaultReportFilters != null) {
                eazlUserWorking.profile.default_report_filters = user.profile.defaultReportFilters;
            } else {
                eazlUserWorking.profile.default_report_filters = '';
            }

            if (user.profile.defaultWidgetConfiguration != null) {
                eazlUserWorking.profile.default_widget_configuration = user.profile.defaultWidgetConfiguration;
            } else {
                eazlUserWorking.profile.default_widget_configuration = '';
            }

            if (user.profile.gridSize != null) {
                eazlUserWorking.profile.grid_size = user.profile.gridSize;
            } else {
                eazlUserWorking.profile.grid_size = 3;
            }

            if (user.profile.growlLife != null) {
                eazlUserWorking.profile.growl_life = user.profile.growlLife;
            } else {
                eazlUserWorking.profile.growl_life = 3;
            }

            if (user.profile.growlSticky != null) {
                eazlUserWorking.profile.growl_sticky = user.profile.growlSticky;
            } else {
                eazlUserWorking.profile.growl_sticky = false;
            }

            if (user.profile.snapToGrid != null) {
                eazlUserWorking.profile.snap_to_grid = user.profile.snapToGrid;
            } else {
                eazlUserWorking.profile.snap_to_grid = false;
            }
        }

        // Return the User
        return eazlUserWorking;
    }

    loadGroup(eazlGroup: EazlGroup): Group {
        // Load Group: move data Eazl -> Canvas
        // TODO - add more fields in time
        this.globalFunctionService.printToConsole(this.constructor.name,'loadGroup', '@Start');

        let groupWorking = new Group();

        groupWorking.groupID = eazlGroup.id;

        if (eazlGroup.name != null) {
            groupWorking.groupName = eazlGroup.name;
        } else {
            groupWorking.groupName = '';
        }

        if (eazlGroup.profile != null) {
            if (eazlGroup.profile.description != null) {
                groupWorking.groupDescription = eazlGroup.profile.description;
            } else {
                groupWorking.groupDescription = '';
            }
            if (eazlGroup.profile.date_created != null) {
                groupWorking.groupCreatedDateTime = eazlGroup.profile.date_created.toString();
            } else {
                groupWorking.groupCreatedDateTime = '';
            }
            groupWorking.groupCreatedUserName = '';
            groupWorking.groupUpdatedDateTime = '';
            groupWorking.groupUpdatedUserName = '';
        } else {
            groupWorking.groupDescription = '';
            groupWorking.groupCreatedDateTime = '';
            groupWorking.groupCreatedUserName = '';
            groupWorking.groupUpdatedDateTime = '';
            groupWorking.groupUpdatedUserName = '';
        }

        if (eazlGroup.users.length > 0) {
            groupWorking.users = [ eazlGroup.users[0] ]
            for (var i = 1; i < eazlGroup.users.length; i++) {
                groupWorking.users.push(eazlGroup.users[i]);
            }
        } else {
            groupWorking.users = [];
        }

        if (eazlGroup.url != null) {
            groupWorking.url = eazlGroup.url;
        } else {
            groupWorking.url = '';
        }

        // Return the result
        return groupWorking;
    }

    saveGroup(group: Group): EazlGroup {
        // Save Group: move data Canvas -> Eazl
        this.globalFunctionService.printToConsole(this.constructor.name,'saveGroup', '@Start');

        let eazlGroupWorking = new EazlGroup();

        eazlGroupWorking.id = group.groupID;

        if (group.groupName != null) {
            eazlGroupWorking.name = group.groupName;
        } else {
            eazlGroupWorking.name = '';
        }

        eazlGroupWorking.profile = {
            description: '',
            date_created: null
        };

        if (group.groupDescription != null) {
            eazlGroupWorking.profile.description = group.groupDescription;
        } else {
            eazlGroupWorking.profile.description = '';
        }

        if (group.groupCreatedDateTime != null) {
            eazlGroupWorking.profile.date_created = new Date(group.groupCreatedDateTime);
        } else {
            eazlGroupWorking.profile.date_created = null;
        }

        if (group.users.length > 0) {
            eazlGroupWorking.users = [ group.users[0] ]
            for (var i = 1; i < group.users.length; i++) {
                eazlGroupWorking.users.push(group.users[i]);
            }
        } else {
            eazlGroupWorking.users = [];
        }

        if (group.url != null) {
            eazlGroupWorking.url = group.url;
        } else {
            eazlGroupWorking.url = '';
        }

        // Return the result
        return eazlGroupWorking;
    }

    loadDashboardTab(eazlDashboardTab: EazlDashboardTab): DashboardTab {
        // Load DashboardTab: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadDashboardTab', '@Start');

        let dashboardTabWorking = new DashboardTab();

        dashboardTabWorking.dashboardTabID = eazlDashboardTab.id;
        dashboardTabWorking.dashboardID = eazlDashboardTab.dashboard_id;

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

        if (eazlDashboardTab.createdUserName != null) {
            dashboardTabWorking.dashboardTabCreatedUserName = eazlDashboardTab.createdUserName;
        } else {
            dashboardTabWorking.dashboardTabCreatedUserName = '';
        }

        if (eazlDashboardTab.updatedDateTime != null) {
            dashboardTabWorking.dashboardTabUpdatedDateTime = eazlDashboardTab.updatedDateTime;
        } else {
            dashboardTabWorking.dashboardTabUpdatedDateTime = '';
        }

        if (eazlDashboardTab.updatedUserName != null) {
            dashboardTabWorking.dashboardTabUpdatedUserName = eazlDashboardTab.updatedUserName;
        } else {
            dashboardTabWorking.dashboardTabUpdatedUserName = '';
        }

        // Return the result
        return dashboardTabWorking;
    }

    saveDashboardTab(dashboardTab: DashboardTab): EazlDashboardTab {
        // Save DashboardTab: move data Canvas -> Eazl
        this.globalFunctionService.printToConsole(this.constructor.name,'saveDashboardTab', '@Start');

        let eazlDashboardTabWorking = new EazlDashboardTab();

        eazlDashboardTabWorking.id = dashboardTab.dashboardTabID;
        eazlDashboardTabWorking.dashboard_id = dashboardTab.dashboardID;

        if (dashboardTab.dashboardTabName != null) {
            eazlDashboardTabWorking.name = dashboardTab.dashboardTabName;
        } else {
            eazlDashboardTabWorking.name = '';
        }

        if (dashboardTab.dashboardTabDescription != null) {
            eazlDashboardTabWorking.description = dashboardTab.dashboardTabDescription;
        } else {
            eazlDashboardTabWorking.description = '';
        }

        if (dashboardTab.dashboardTabCreatedDateTime != null) {
            eazlDashboardTabWorking.createdDateTime = dashboardTab.dashboardTabCreatedDateTime;
        } else {
            eazlDashboardTabWorking.createdDateTime = '';
        }

        if (dashboardTab.dashboardTabCreatedUserName != null) {
            eazlDashboardTabWorking.createdUserName = dashboardTab.dashboardTabCreatedUserName;
        } else {
            eazlDashboardTabWorking.createdUserName = '';
        }

        if (dashboardTab.dashboardTabUpdatedDateTime != null) {
            eazlDashboardTabWorking.updatedDateTime = dashboardTab.dashboardTabUpdatedDateTime;
        } else {
            eazlDashboardTabWorking.updatedDateTime = '';
        }

        if (dashboardTab.dashboardTabUpdatedUserName != null) {
            eazlDashboardTabWorking.updatedUserName = dashboardTab.dashboardTabUpdatedUserName;
        } else {
            eazlDashboardTabWorking.updatedUserName = '';
        }

        // Return the result
        return eazlDashboardTabWorking;
    }

    loadCanvasMessage(eazlCanvasMessage: EazlCanvasMessage): CanvasMessage {
        // Load Message: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadCanvasMessage', '@Start');

        let canvasMessageWorking = new CanvasMessage();

        canvasMessageWorking.canvasMessageID = eazlCanvasMessage.id;

        if (eazlCanvasMessage.conversation != null) {
            canvasMessageWorking.canvasMessageConversationID = eazlCanvasMessage.conversation;
        } else {
            canvasMessageWorking.canvasMessageConversationID = '';
        }

        if (eazlCanvasMessage.subject != null) {
            canvasMessageWorking.canvasMessageSubject = eazlCanvasMessage.subject;
        } else {
            canvasMessageWorking.canvasMessageSubject = '';
        }

        if (eazlCanvasMessage.body != null) {
            canvasMessageWorking.canvasMessageBody = eazlCanvasMessage.body;
        } else {
            canvasMessageWorking.canvasMessageBody = '';
        }

        if (eazlCanvasMessage.dashboard_id != null) {
            canvasMessageWorking.canvasMessageDashboardID = eazlCanvasMessage.dashboard_id;
        } else {
            canvasMessageWorking.canvasMessageDashboardID = null;
        }

        if (eazlCanvasMessage.package_id != null) {
            canvasMessageWorking.canvasMessageReportID = eazlCanvasMessage.package_id;
        } else {
            canvasMessageWorking.canvasMessageReportID = null;
        }

        if (eazlCanvasMessage.widget_id != null) {
            canvasMessageWorking.canvasMessageWidgetID = eazlCanvasMessage.widget_id;
        } else {
            canvasMessageWorking.canvasMessageWidgetID = null;
        }

        if (eazlCanvasMessage.is_system_generated != null) {
            canvasMessageWorking.canvasMessageIsSystemGenerated = eazlCanvasMessage.is_system_generated;
        } else {
            canvasMessageWorking.canvasMessageIsSystemGenerated = false;
        }

        if (eazlCanvasMessage.date_created != null) {
            canvasMessageWorking.canvasMessageSentDateTime = eazlCanvasMessage.date_created.toString();
        } else {
            canvasMessageWorking.canvasMessageSentDateTime = '';
        }

        // TODO - add ReadDateTime field for all recipients
        // Defaults
        canvasMessageWorking.canvasMessageSenderUserName = '';
        canvasMessageWorking.canvasMessageSentToMe = false;
        canvasMessageWorking.canvasMessageMyStatus = '';

        // Get current user
        let currentUser: string = this.globalFunctionService.currentUser();

        // Load calculated Fields
        for (var i = 0; i < eazlCanvasMessage.recipients.length; i++) {


            if (eazlCanvasMessage.recipients[i].username ==
                    this.globalVariableService.canvasUser.getValue().username) {
                    canvasMessageWorking.canvasMessageSentToMe = true;

                    canvasMessageWorking.canvasMessageMyStatus =
                    eazlCanvasMessage.recipients[i].status;

                };
            if (eazlCanvasMessage.recipients[i].is_sender == true) {
                canvasMessageWorking.canvasMessageSenderUserName =
                    eazlCanvasMessage.recipients[i].username.toString();

            };
        }

        // TODO - there must be a cleaner way to add an array of recipients !
        // Do the first one - NOTE 1 in for loop
        if (eazlCanvasMessage.recipients[0] == undefined) {
            canvasMessageWorking.canvasMessageRecipients = [
                {
                    canvasMessageRecipientID: -1,
                    canvasMessageRecipientUsername: '',
                    canvasMessageRecipientIsSender: false,
                    canvasMessageRecipientStatus: '',
            }];
        } else {
            canvasMessageWorking.canvasMessageRecipients = [
                {
                    canvasMessageRecipientID: eazlCanvasMessage.recipients[0].id,
                    canvasMessageRecipientUsername: eazlCanvasMessage.recipients[0].username,
                    canvasMessageRecipientIsSender: eazlCanvasMessage.recipients[0].is_sender,
                    canvasMessageRecipientStatus: eazlCanvasMessage.recipients[0].status,
            }];
        }

        for (var i = 1; i < eazlCanvasMessage.recipients.length; i++) {

            canvasMessageWorking.canvasMessageRecipients.push(
               {
                canvasMessageRecipientID: eazlCanvasMessage.recipients[i].id,
                canvasMessageRecipientUsername: eazlCanvasMessage.recipients[i].username,
                canvasMessageRecipientIsSender: eazlCanvasMessage.recipients[i].is_sender,
                canvasMessageRecipientStatus: eazlCanvasMessage.recipients[i].status,
            }
            );
            canvasMessageWorking.canvasMessageSentToMe = false;
            canvasMessageWorking.canvasMessageMyStatus = '';
        }

        // Return the result
        return canvasMessageWorking;
    }

    saveCanvasMessage(canvasMessage: CanvasMessage): EazlCanvasMessage {
        // Save Message: move data Canvas -> Eazl
        this.globalFunctionService.printToConsole(this.constructor.name,'saveCanvasMessage', '@Start');

        let eazlCanvasMessageWorking = new EazlCanvasMessage();

        eazlCanvasMessageWorking.id = null;
        eazlCanvasMessageWorking.conversation = canvasMessage.canvasMessageConversationID;

        if (canvasMessage.canvasMessageSubject != null) {
            eazlCanvasMessageWorking.subject = canvasMessage.canvasMessageSubject;
        } else {
            eazlCanvasMessageWorking.subject = '';
        }

        if (canvasMessage.canvasMessageBody != null) {
            eazlCanvasMessageWorking.body = canvasMessage.canvasMessageBody;
        } else {
            eazlCanvasMessageWorking.body = '';
        }

        if (canvasMessage.canvasMessageDashboardID != null) {
            eazlCanvasMessageWorking.dashboard_id = canvasMessage.canvasMessageDashboardID;
        } else {
            eazlCanvasMessageWorking.dashboard_id = null;
        }

        if (canvasMessage.canvasMessageReportID != null) {
            eazlCanvasMessageWorking.package_id = canvasMessage.canvasMessageReportID;
        } else {
            eazlCanvasMessageWorking.package_id = null;
        }

        if (canvasMessage.canvasMessageWidgetID != null) {
            eazlCanvasMessageWorking.widget_id = canvasMessage.canvasMessageWidgetID;
        } else {
            eazlCanvasMessageWorking.widget_id = null;
        }

        // Get current user
        let currentUser: string = this.globalFunctionService.currentUser();

        // Add the first recipient - NOTE 1 in for loop
        eazlCanvasMessageWorking.recipients = [
            {
                id: canvasMessage.canvasMessageRecipients[0].canvasMessageRecipientID,
                username: canvasMessage.canvasMessageRecipients[0].canvasMessageRecipientUsername,
                is_sender: canvasMessage.canvasMessageRecipients[0].canvasMessageRecipientIsSender,
                status: canvasMessage.canvasMessageRecipients[0].canvasMessageRecipientStatus,
                url: null
            }
        ];

        for (var i = 1; i < canvasMessage.canvasMessageRecipients.length; i++) {
            eazlCanvasMessageWorking.recipients.push(
               {
                    id: canvasMessage.canvasMessageRecipients[i].canvasMessageRecipientID,
                    username: canvasMessage.canvasMessageRecipients[i].canvasMessageRecipientUsername,
                    is_sender: canvasMessage.canvasMessageRecipients[i].canvasMessageRecipientIsSender,
                    status: canvasMessage.canvasMessageRecipients[i].canvasMessageRecipientStatus,
                    url: null
                }
            );
        }

        // Return the result
        return eazlCanvasMessageWorking;
    }

    loadCanvasMessageRecipient(eazlCanvasMessageRecipient: EazlCanvasMessageRecipient): CanvasMessageRecipient {
        // Load MessageRecipient: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadCanvasMessageRecipient', '@Start');

        let canvasMessageRecipientWorking = new CanvasMessageRecipient();

        canvasMessageRecipientWorking.canvasMessageRecipientID = eazlCanvasMessageRecipient.id;

        // if (eazlCanvasMessageRecipient.message_id != null) {
        //     canvasMessageRecipientWorking.canvasMessageID = eazlCanvasMessageRecipient.message_id;
        // } else {
        //     canvasMessageRecipientWorking.canvasMessageID = -1;
        // }

        if (eazlCanvasMessageRecipient.username != null) {
            canvasMessageRecipientWorking.userName = eazlCanvasMessageRecipient.username;
        } else {
            canvasMessageRecipientWorking.userName = '';
        }

        if (eazlCanvasMessageRecipient.is_sender != null) {
            canvasMessageRecipientWorking.canvasMessageRecipientIsSender =
                eazlCanvasMessageRecipient.is_sender;
        } else {
            canvasMessageRecipientWorking.canvasMessageRecipientIsSender = false;
        }

        if (eazlCanvasMessageRecipient.status != null) {
            canvasMessageRecipientWorking.canvasMessageRecipientStatus =
                eazlCanvasMessageRecipient.status;
        } else {
            canvasMessageRecipientWorking.canvasMessageRecipientStatus = '';
        }

        // Return the result
        return canvasMessageRecipientWorking;
    }

    loadDashboardTag(eazlDashboardTag: EazlDashboardTag): DashboardTag {
        // Load DashboardTag: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadDashboardTag', '@Start');

        let dashboardTagWorking = new DashboardTag();

        dashboardTagWorking.dashboardTagID = eazlDashboardTag.id;

        if (eazlDashboardTag.tag != null) {
            dashboardTagWorking.dashboardTagName = eazlDashboardTag.tag;
        } else {
            dashboardTagWorking.dashboardTagName = '';
        }

        if (eazlDashboardTag.description != null) {
            dashboardTagWorking.dashboardTagDescription = eazlDashboardTag.description;
        } else {
            dashboardTagWorking.dashboardTagDescription = '';
        }

        if (eazlDashboardTag.url != null) {
            dashboardTagWorking.dasbhoardURL = eazlDashboardTag.url;
        } else {
            dashboardTagWorking.dasbhoardURL = '';
        }

        dashboardTagWorking.dashboardTagCreatedDateTime = '';
        dashboardTagWorking.dashboardTagCreatedUserName = '';
        dashboardTagWorking.dashboardTagUpdatedDateTime = '';
        dashboardTagWorking.dashboardTagUpdatedUserName = '';

        // Return the result
        return dashboardTagWorking;
    }

    saveDashboardTag(dashboardTag: DashboardTag): EazlDashboardTag {
        // Save DashboardTag: move data Canvas -> Eazl
        this.globalFunctionService.printToConsole(this.constructor.name,'saveDashboardTag', '@Start');

        let eazlDashboardTagWorking = new EazlDashboardTag();

        eazlDashboardTagWorking.id = dashboardTag.dashboardTagID;

        if (dashboardTag.dashboardTagName != null) {
            eazlDashboardTagWorking.tag = dashboardTag.dashboardTagName;
        } else {
            eazlDashboardTagWorking.tag = '';
        }

        if (dashboardTag.dashboardTagDescription != null) {
            eazlDashboardTagWorking.description = dashboardTag.dashboardTagDescription;
        } else {
            eazlDashboardTagWorking.description = '';
        }

        if (dashboardTag.dasbhoardURL != null) {
            eazlDashboardTagWorking.url = dashboardTag.dasbhoardURL;
        } else {
            eazlDashboardTagWorking.url = '';
        }

        // Return the result
        return eazlDashboardTagWorking;
    }

    loadDashboardTagMembership(
        eazlDashboardTagMembership: EazlDashboardTagMembership
        ): DashboardTagMembership {
        // Load DashboardTagMembership: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadDashboardTagMembership', '@Start');

        let dashboardTagMembershipWorking = new DashboardTagMembership();

        dashboardTagMembershipWorking.dashboardTagID = eazlDashboardTagMembership.id;

        if (eazlDashboardTagMembership.dashboard_id != null) {
            dashboardTagMembershipWorking.dashboardID =
                eazlDashboardTagMembership.dashboard_id;
        } else {
            dashboardTagMembershipWorking.dashboardID = -1;
        }

        if (eazlDashboardTagMembership.tag != null) {
            dashboardTagMembershipWorking.dashboardTagName =
                eazlDashboardTagMembership.tag;
        } else {
            dashboardTagMembershipWorking.dashboardTagName = '';
        }

        if (eazlDashboardTagMembership.updated_on != null) {
            dashboardTagMembershipWorking.dashboardTagMembershipCreatedDateTime =
                eazlDashboardTagMembership.updated_on;
        } else {
            dashboardTagMembershipWorking.dashboardTagMembershipCreatedDateTime = '';
        }

        if (eazlDashboardTagMembership.updated_by != null) {
            dashboardTagMembershipWorking.dashboardTagMembershipCreatedUserName =
                eazlDashboardTagMembership.updated_by;
        } else {
            dashboardTagMembershipWorking.dashboardTagMembershipCreatedUserName = '';
        }

        if (eazlDashboardTagMembership.created_on != null) {
            dashboardTagMembershipWorking.dashboardTagMembershipUpdatedDateTime =
                eazlDashboardTagMembership.created_on;
        } else {
            dashboardTagMembershipWorking.dashboardTagMembershipUpdatedDateTime = '';
        }

        if (eazlDashboardTagMembership.created_by != null) {
            dashboardTagMembershipWorking.dashboardTagMembershipUpdatedUserName =
                eazlDashboardTagMembership.created_by;
        } else {
            dashboardTagMembershipWorking.dashboardTagMembershipUpdatedUserName = '';
        }

        // Return the result
        return dashboardTagMembershipWorking;
    }

    saveDashboardTagMembership(
        dashboardTagMembership: DashboardTagMembership
        ): EazlDashboardTagMembership {
        // Save DashboardTagMembership: move data Canvas -> Eazl
        this.globalFunctionService.printToConsole(this.constructor.name,'saveDashboardTagMembership', '@Start');

        let eazlDashboardTagMembershipWorking = new EazlDashboardTagMembership();

        eazlDashboardTagMembershipWorking.id = dashboardTagMembership.dashboardTagID;

        if (dashboardTagMembership.dashboardID != null) {
            eazlDashboardTagMembershipWorking.dashboard_id =
                dashboardTagMembership.dashboardID;
        } else {
            eazlDashboardTagMembershipWorking.dashboard_id = -1;
        }

        if (dashboardTagMembership.dashboardTagName != null) {
             eazlDashboardTagMembershipWorking.tag = dashboardTagMembership.dashboardTagName;
        } else {
            eazlDashboardTagMembershipWorking.tag = '';
        }

        if (dashboardTagMembership.dashboardTagMembershipCreatedDateTime != null) {
            eazlDashboardTagMembershipWorking.updated_on =
                dashboardTagMembership.dashboardTagMembershipCreatedDateTime;
        } else {
            eazlDashboardTagMembershipWorking.updated_on = '';
        }

        if (dashboardTagMembership.dashboardTagMembershipCreatedUserName != null) {
            eazlDashboardTagMembershipWorking.updated_by =
                dashboardTagMembership.dashboardTagMembershipCreatedUserName;
        } else {
            eazlDashboardTagMembershipWorking.updated_by = '';
        }

        if (dashboardTagMembership.dashboardTagMembershipUpdatedDateTime != null) {
            eazlDashboardTagMembershipWorking.created_on =
                dashboardTagMembership.dashboardTagMembershipUpdatedDateTime;
        } else {
            eazlDashboardTagMembershipWorking.created_on = '';
        }

        if (dashboardTagMembership.dashboardTagMembershipUpdatedUserName != null) {
            eazlDashboardTagMembershipWorking.created_by =
                dashboardTagMembership.dashboardTagMembershipUpdatedUserName;
        } else {
            eazlDashboardTagMembershipWorking.created_by = '';
        }

        // Return the result
        return eazlDashboardTagMembershipWorking;
    }

    loadDashboard(eazlDashboard: EazlDashboard): Dashboard {
        // Load dDashboard: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadDashboard', '@Start');

        let dashboardWorking = new Dashboard();

        dashboardWorking.dashboardID = eazlDashboard.id;

        if (eazlDashboard.code != null) {
            dashboardWorking.dashboardCode = eazlDashboard.code;
        } else {
            dashboardWorking.dashboardCode = '';
        }

        if (eazlDashboard.name != null) {
            dashboardWorking.dashboardName = eazlDashboard.name;
        } else {
            dashboardWorking.dashboardName = '';
        }

        if (eazlDashboard.description != null) {
            dashboardWorking.dashboardDescription = eazlDashboard.description;
        } else {
            dashboardWorking.dashboardDescription = '';
        }

        if (eazlDashboard.refresh_mode != null) {
            dashboardWorking.dashboardRefreshMode = eazlDashboard.refresh_mode;
        } else {
            dashboardWorking.dashboardRefreshMode = '';
        }

        if (eazlDashboard.refresh_timer != null) {
            dashboardWorking.dashboardRefreshFrequency = eazlDashboard.refresh_timer;
        } else {
            dashboardWorking.dashboardRefreshFrequency = 0;
        }

        // if (eazlDashboard.refresh_timer != null) {
        //     dashboardWorking.dashboardRefreshFrequency = eazlDashboard.refresh_timer;
        // } else {
        //     dashboardWorking.dashboardRefreshFrequency = 0;
        // }

        // if (eazlDashboard.refresh_timer != null) {
        //     dashboardWorking.dashboardRefreshFrequency = eazlDashboard.refresh_timer;
        // } else {
        //     dashboardWorking.dashboardRefreshFrequency = 0;
        // }




        if (eazlDashboard.is_container_header_dark != null) {
            dashboardWorking.isContainerHeaderDark = eazlDashboard.is_container_header_dark;
        } else {
            dashboardWorking.isContainerHeaderDark = false;
        }

        if (eazlDashboard.show_container_header != null) {
            dashboardWorking.showContainerHeader = eazlDashboard.show_container_header;
        } else {
            dashboardWorking.showContainerHeader = false;
        }

        if (eazlDashboard.background_color != null) {
            dashboardWorking.dashboardBackgroundColor = eazlDashboard.background_color;
        } else {
            dashboardWorking.dashboardBackgroundColor = '';
        }

        if (eazlDashboard.background_image != null) {
            dashboardWorking.dashboardBackgroundImageSrc = eazlDashboard.background_image;
        } else {
            dashboardWorking.dashboardBackgroundImageSrc = '';
        }

        if (eazlDashboard.comments != null) {
            dashboardWorking.dashboardComments = eazlDashboard.comments;
        } else {
            dashboardWorking.dashboardComments = '';
        }

        if (eazlDashboard.default_export_file_type != null) {
            dashboardWorking.dashboardDefaultExportFileType = eazlDashboard.default_export_file_type;
        } else {
            dashboardWorking.dashboardDefaultExportFileType = '';
        }

        if (eazlDashboard.is_locked != null) {
            dashboardWorking.dashboardIsLocked = eazlDashboard.is_locked;
        } else {
            dashboardWorking.dashboardIsLocked = false;
        }

        if (eazlDashboard.default_tab_id != null) {
            dashboardWorking.dashboardOpenTabNr = eazlDashboard.default_tab_id;
        } else {
            dashboardWorking.dashboardOpenTabNr = 0;
        }

        if (eazlDashboard.password != null) {
            dashboardWorking.dashboardPassword = eazlDashboard.password;
        } else {
            dashboardWorking.dashboardPassword = '';
        }

        if (eazlDashboard.system_message != null) {
            dashboardWorking.dashboardSystemMessage = eazlDashboard.system_message;
        } else {
            dashboardWorking.dashboardSystemMessage = '';
        }

        if (eazlDashboard.date_refreshed != null) {
            dashboardWorking.dashboardRefreshedDateTime = eazlDashboard.date_refreshed;
        } else {
            dashboardWorking.dashboardRefreshedDateTime = '';
        }

        if (eazlDashboard.refresher != null) {
            dashboardWorking.dashboardRefreshedUserName = eazlDashboard.refresher;
        } else {
            dashboardWorking.dashboardRefreshedUserName = '';
        }

        if (eazlDashboard.date_edited != null) {
            dashboardWorking.dashboardUpdatedDateTime = eazlDashboard.date_edited;
        } else {
            dashboardWorking.dashboardUpdatedDateTime = '';
        }

        if (eazlDashboard.editor != null) {
            dashboardWorking.dashboardUpdatedUserName = eazlDashboard.editor;
        } else {
            dashboardWorking.dashboardUpdatedUserName = '';
        }

        if (eazlDashboard.date_created != null) {
            dashboardWorking.dashboardCreatedDateTime = eazlDashboard.date_created;
        } else {
            dashboardWorking.dashboardCreatedDateTime = '';
        }

        if (eazlDashboard.creator != null) {
            dashboardWorking.dashboardCreatedUserName = eazlDashboard.creator;
        } else {
            dashboardWorking.dashboardCreatedUserName = '';
        }

        // TODO - fix these up
        // Calculated fields
        // -----------------

        //     dashboardWorking.dashboardIsLiked = false;

console.log('CDAL dashboardWorking',dashboardWorking)
        // Return the result
        return dashboardWorking;
    }

    saveDashboard(dashboard: Dashboard): EazlDashboard {
        // Load dashboard: move data Canvas -> Eazl
        this.globalFunctionService.printToConsole(this.constructor.name,'saveDashboard', '@Start');

        let eazlDashboardWorking = new EazlDashboard();

        eazlDashboardWorking.id = dashboard.dashboardID;

        if (dashboard.dashboardCode != null) {
            eazlDashboardWorking.code = dashboard.dashboardCode;
        } else {
            eazlDashboardWorking.code = '';
        }

        if (dashboard.dashboardName != null) {
            eazlDashboardWorking.name = dashboard.dashboardName;
        } else {
            eazlDashboardWorking.name = '';
        }

        if (dashboard.dashboardDescription != null) {
            eazlDashboardWorking.description = dashboard.dashboardDescription;
        } else {
            eazlDashboardWorking.description = ' ';
        }

        if (dashboard.dashboardRefreshMode != null) {
            eazlDashboardWorking.refresh_mode = dashboard.dashboardRefreshMode;
        } else {
            eazlDashboardWorking.refresh_mode = 'manual';  // Cannot be blank
        }

        if (dashboard.dashboardRefreshFrequency != null) {
            eazlDashboardWorking.refresh_timer = dashboard.dashboardRefreshFrequency;
        } else {
            eazlDashboardWorking.refresh_timer = 0;
        }

        if (dashboard.isContainerHeaderDark != null) {
            eazlDashboardWorking.is_container_header_dark = dashboard.isContainerHeaderDark;
        } else {
            eazlDashboardWorking.is_container_header_dark = false;
        }

        if (dashboard.showContainerHeader != null) {
            eazlDashboardWorking.show_container_header = dashboard.showContainerHeader;
        } else {
            eazlDashboardWorking.show_container_header = false;
        }

        if (dashboard.dashboardBackgroundColor != null) {
            eazlDashboardWorking.background_color = dashboard.dashboardBackgroundColor;
        } else {
            eazlDashboardWorking.background_color = '';
        }

        if (dashboard.dashboardBackgroundImageSrc != null) {
            eazlDashboardWorking.background_image = dashboard.dashboardBackgroundImageSrc;
        } else {
            eazlDashboardWorking.background_image = null;
        }

        if (dashboard.dashboardComments != null) {
            eazlDashboardWorking.comments = dashboard.dashboardComments;
        } else {
            eazlDashboardWorking.comments = '';
        }

        if (dashboard.dashboardDefaultExportFileType != null) {
            eazlDashboardWorking.default_export_file_type = dashboard.dashboardDefaultExportFileType;
        } else {
            eazlDashboardWorking.default_export_file_type = '';
        }

        if (dashboard.dashboardIsLocked != null) {
            eazlDashboardWorking.is_locked = dashboard.dashboardIsLocked;
        } else {
            eazlDashboardWorking.is_locked = false;
        }

        if (dashboard.dashboardOpenTabNr != null) {
            eazlDashboardWorking.default_tab_id = dashboard.dashboardOpenTabNr;
        } else {
            eazlDashboardWorking.default_tab_id = 0;
        }

        if (dashboard.dashboardPassword != null) {
            eazlDashboardWorking.password = dashboard.dashboardPassword;
        } else {
            eazlDashboardWorking.password = '';
        }

        if (dashboard.dashboardSystemMessage != null) {
            eazlDashboardWorking.system_message = dashboard.dashboardSystemMessage;
        } else {
            eazlDashboardWorking.system_message = '';
        }

        if (dashboard.dashboardRefreshedDateTime != null) {
            eazlDashboardWorking.date_refreshed = dashboard.dashboardRefreshedDateTime;
        } else {
            eazlDashboardWorking.date_refreshed = '';
        }

        if (dashboard.dashboardRefreshedUserName != null) {
            eazlDashboardWorking.refresher = dashboard.dashboardRefreshedUserName;
        } else {
            eazlDashboardWorking.refresher = '';
        }

        if (dashboard.dashboardUpdatedDateTime != null) {
            eazlDashboardWorking.date_edited = dashboard.dashboardUpdatedDateTime;
        } else {
            eazlDashboardWorking.date_edited = '';
        }

        if (dashboard.dashboardUpdatedUserName != null) {
            eazlDashboardWorking.editor = dashboard.dashboardUpdatedUserName;
        } else {
            eazlDashboardWorking.editor = '';
        }

        if (dashboard.dashboardCreatedDateTime != null) {
            eazlDashboardWorking.date_created = dashboard.dashboardCreatedDateTime;
        } else {
            eazlDashboardWorking.date_created = '';
        }

        if (dashboard.dashboardCreatedUserName != null) {
            eazlDashboardWorking.creator = dashboard.dashboardCreatedUserName;
        } else {
            eazlDashboardWorking.creator = '';
        }

console.log('CDAL eazlDashboardWorking',eazlDashboardWorking)
        // Return the result
        return eazlDashboardWorking;
    }

    loadUserModelPermission(eazlUserModelPermission): UserModelPermission {
        // Load User Permissions for a given Dashboard: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadDashboardUserPermissions', '@Start');

        let userModelPermissionWorking = new UserModelPermission();

        if (eazlUserModelPermission.model != null) {
            userModelPermissionWorking.model = eazlUserModelPermission.model;
        } else {
            userModelPermissionWorking.model = '';
        };

        if (eazlUserModelPermission.model_permissions != null) {
            userModelPermissionWorking.modelPermissions = eazlUserModelPermission.model_permissions;
        } else {
            userModelPermissionWorking.modelPermissions = [];
        };

        // Add an empty one - then we can push any one afterwards
        userModelPermissionWorking.objectPermissions = [{
            permission: '',
            objectID: []
        }]

        if (eazlUserModelPermission.object_permissions.assign_permission_query != null) {
            userModelPermissionWorking.objectPermissions.push(
                {
                    permission: 'assign_permission_query',
                    objectID: eazlUserModelPermission.object_permissions.assign_permission_query
                });
        };
        if (eazlUserModelPermission.object_permissions.change_query != null) {
            userModelPermissionWorking.objectPermissions.push(
                {
                    permission: 'change_query',
                    objectID: eazlUserModelPermission.object_permissions.change_query
                });
        };
        if (eazlUserModelPermission.object_permissions.delete_query != null) {
            userModelPermissionWorking.objectPermissions.push(
                {
                    permission: 'delete_query',
                    objectID: eazlUserModelPermission.object_permissions.delete_query
                });
        };
        if (eazlUserModelPermission.object_permissions.remove_permission_query != null) {
            userModelPermissionWorking.objectPermissions.push(
                {
                    permission: 'remove_permission_query',
                    objectID: eazlUserModelPermission.object_permissions.remove_permission_query
                });
        };
        if (eazlUserModelPermission.object_permissions.view_query != null) {
            userModelPermissionWorking.objectPermissions.push(
                {
                    permission: 'view_query',
                    objectID: eazlUserModelPermission.object_permissions.view_query
                });
        };
        if (eazlUserModelPermission.object_permissions.assign_permission_dashboard != null) {
            userModelPermissionWorking.objectPermissions.push(
                {
                    permission: 'assign_permission_dashboard',
                    objectID: eazlUserModelPermission.object_permissions.assign_permission_dashboard
                });
        };
        if (eazlUserModelPermission.object_permissions.change_dashboard != null) {
            userModelPermissionWorking.objectPermissions.push(
                {
                    permission: 'change_dashboard',
                    objectID: eazlUserModelPermission.object_permissions.change_dashboard
                });
        };
        if (eazlUserModelPermission.object_permissions.delete_dashboard != null) {
            userModelPermissionWorking.objectPermissions.push(
                {
                    permission: 'delete_dashboard',
                    objectID: eazlUserModelPermission.object_permissions.delete_dashboard
                });
        };
        if (eazlUserModelPermission.object_permissions.remove_permission_dashboard != null) {
            userModelPermissionWorking.objectPermissions.push(
                {
                    permission: 'remove_permission_dashboard',
                    objectID: eazlUserModelPermission.object_permissions.remove_permission_dashboard
                });
        };
        if (eazlUserModelPermission.object_permissions.view_dashboard != null) {
            userModelPermissionWorking.objectPermissions.push(
                {
                    permission: 'view_dashboard',
                    objectID: eazlUserModelPermission.object_permissions.view_dashboard
                });
        };
        if (eazlUserModelPermission.object_permissions.add_package != null) {
            userModelPermissionWorking.objectPermissions.push(
                {
                    permission: 'add_package',
                    objectID: eazlUserModelPermission.object_permissions.add_package
                });
        };
        if (eazlUserModelPermission.object_permissions.assign_permission_package != null) {
            userModelPermissionWorking.objectPermissions.push(
                {
                    permission: 'assign_permission_package',
                    objectID: eazlUserModelPermission.object_permissions.assign_permission_package
                });
        };
        if (eazlUserModelPermission.object_permissions.change_package != null) {
            userModelPermissionWorking.objectPermissions.push(
                {
                    permission: 'change_package',
                    objectID: eazlUserModelPermission.object_permissions.change_package
                });
        };
        if (eazlUserModelPermission.object_permissions.delete_package != null) {
            userModelPermissionWorking.objectPermissions.push(
                {
                    permission: 'delete_package',
                    objectID: eazlUserModelPermission.object_permissions.delete_package
                });
        };
        if (eazlUserModelPermission.object_permissions.remove_permission_package != null) {
            userModelPermissionWorking.objectPermissions.push(
                {
                    permission: 'remove_permission_package',
                    objectID: eazlUserModelPermission.object_permissions.remove_permission_package
                });
        };
        if (eazlUserModelPermission.object_permissions.view_package != null) {
            userModelPermissionWorking.objectPermissions.push(
                {
                    permission: 'view_package',
                    objectID: eazlUserModelPermission.object_permissions.view_package
                });
        };
        if (eazlUserModelPermission.object_permissions.execute_package != null) {
            userModelPermissionWorking.objectPermissions.push(
                {
                    permission: 'execute_package',
                    objectID: eazlUserModelPermission.object_permissions.execute_package
                });
        };
        if (eazlUserModelPermission.object_permissions.package_owned_access != null) {
            userModelPermissionWorking.objectPermissions.push(
                {
                    permission: 'package_owned_access',
                    objectID: eazlUserModelPermission.object_permissions.package_owned_access
                });
        };
        if (eazlUserModelPermission.object_permissions.package_shared_access != null) {
            userModelPermissionWorking.objectPermissions.push(
                {
                    permission: 'package_shared_access',
                    objectID: eazlUserModelPermission.object_permissions.package_shared_access
                });
        };

        // Remove the first dummy one
        userModelPermissionWorking.objectPermissions.splice(0,1);

        // Return result
        return userModelPermissionWorking;
    }

    loadDatasourceUserPermissions(eazlDatasourceUserPermissions): DataSourceUserPermissions {
        // Load User Permissions for a given Datasource: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadDatasourceUserPermissions', '@Start');

        let datasourceUserPermissionsWorking = new DataSourceUserPermissions();

        if (eazlDatasourceUserPermissions.username != null) {
            datasourceUserPermissionsWorking.username = eazlDatasourceUserPermissions.username;
        } else {
            datasourceUserPermissionsWorking.username = '';
        }

        // Set default to false
        datasourceUserPermissionsWorking.canAddPackage = false;
        datasourceUserPermissionsWorking.canAssignPermissionPackage = false;
        datasourceUserPermissionsWorking.canChangePackage = false;
        datasourceUserPermissionsWorking.canDeletePackage = false;
        datasourceUserPermissionsWorking.canExecutePackage = false;
        datasourceUserPermissionsWorking.canPackageOwnedAccess = false;
        datasourceUserPermissionsWorking.canPackageSharedAccess = false;
        datasourceUserPermissionsWorking.canRemovePermissionPackage = false;
        datasourceUserPermissionsWorking.canViewPackage = false;

        if (eazlDatasourceUserPermissions.permissions != null) {

            // Loop on those assigned
            for (var i = 0; i < eazlDatasourceUserPermissions.permissions.length; i++) {

                if (eazlDatasourceUserPermissions.permissions[i] == 'add_package') {
                    datasourceUserPermissionsWorking.canAddPackage = true;
                }
                if (eazlDatasourceUserPermissions.permissions[i] == 'assign_permission_package') {
                    datasourceUserPermissionsWorking.canAssignPermissionPackage = true;
                }
                if (eazlDatasourceUserPermissions.permissions[i] == 'change_package') {
                    datasourceUserPermissionsWorking.canChangePackage = true;
                }
                if (eazlDatasourceUserPermissions.permissions[i] == 'delete_package') {
                    datasourceUserPermissionsWorking.canDeletePackage = true;
                }
                if (eazlDatasourceUserPermissions.permissions[i] == 'execute_package') {
                    datasourceUserPermissionsWorking.canExecutePackage = true;
                }
                if (eazlDatasourceUserPermissions.permissions[i] == 'package_owned_access') {
                    datasourceUserPermissionsWorking.canPackageOwnedAccess = true;
                }
                if (eazlDatasourceUserPermissions.permissions[i] == 'package_shared_access') {
                    datasourceUserPermissionsWorking.canPackageSharedAccess = true;
                }
                if (eazlDatasourceUserPermissions.permissions[i] == 'remove_permission_package') {
                    datasourceUserPermissionsWorking.canRemovePermissionPackage = true;
                }
                if (eazlDatasourceUserPermissions.permissions[i] == 'view_package') {
                    datasourceUserPermissionsWorking.canViewPackage = true;
                }
            }
        }

        // Return
        return datasourceUserPermissionsWorking;
    }

    loadDatasourceGroupPermissions(eazlDatasourceGroupPermissions): DataSourceGroupPermissions {
        // Load Group Permissions for a given Datasource: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadDatasourceGroupPermissions', '@Start');

        let datasourceUserPermissionsWorking = new DataSourceGroupPermissions();

        if (eazlDatasourceGroupPermissions.groupName != null) {
            datasourceUserPermissionsWorking.groupName = eazlDatasourceGroupPermissions.groupName;
        } else {
            datasourceUserPermissionsWorking.groupName = '';
        }

        // Set default to false
        datasourceUserPermissionsWorking.canAddPackage = false;
        datasourceUserPermissionsWorking.canAssignPermissionPackage = false;
        datasourceUserPermissionsWorking.canChangePackage = false;
        datasourceUserPermissionsWorking.canDeletePackage = false;
        datasourceUserPermissionsWorking.canExecutePackage = false;
        datasourceUserPermissionsWorking.canPackageOwnedAccess = false;
        datasourceUserPermissionsWorking.canPackageSharedAccess = false;
        datasourceUserPermissionsWorking.canRemovePermissionPackage = false;
        datasourceUserPermissionsWorking.canViewPackage = false;

        if (eazlDatasourceGroupPermissions.permissions != null) {

            // Loop on those assigned
            for (var i = 0; i < eazlDatasourceGroupPermissions.permissions.length; i++) {

                if (eazlDatasourceGroupPermissions.permissions[i] == 'add_package') {
                    datasourceUserPermissionsWorking.canAddPackage = true;
                }
                if (eazlDatasourceGroupPermissions.permissions[i] == 'assign_permission_package') {
                    datasourceUserPermissionsWorking.canAssignPermissionPackage = true;
                }
                if (eazlDatasourceGroupPermissions.permissions[i] == 'change_package') {
                    datasourceUserPermissionsWorking.canChangePackage = true;
                }
                if (eazlDatasourceGroupPermissions.permissions[i] == 'delete_package') {
                    datasourceUserPermissionsWorking.canDeletePackage = true;
                }
                if (eazlDatasourceGroupPermissions.permissions[i] == 'execute_package') {
                    datasourceUserPermissionsWorking.canExecutePackage = true;
                }
                if (eazlDatasourceGroupPermissions.permissions[i] == 'package_owned_access') {
                    datasourceUserPermissionsWorking.canPackageOwnedAccess = true;
                }
                if (eazlDatasourceGroupPermissions.permissions[i] == 'package_shared_access') {
                    datasourceUserPermissionsWorking.canPackageSharedAccess = true;
                }
                if (eazlDatasourceGroupPermissions.permissions[i] == 'remove_permission_package') {
                    datasourceUserPermissionsWorking.canRemovePermissionPackage = true;
                }
                if (eazlDatasourceGroupPermissions.permissions[i] == 'view_package') {
                    datasourceUserPermissionsWorking.canViewPackage = true;
                }
            }
        }

        // Return
        return datasourceUserPermissionsWorking;
    }

    loadDashboardUserPermissions(eazlDatasourceUserPermissions): DashboardUserPermissions {
        // Load User Permissions for a given Dashboard: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadDashboardUserPermissions', '@Start');

        let dashboardUserPermissionsWorking = new DashboardUserPermissions();

        if (eazlDatasourceUserPermissions.username != null) {
            dashboardUserPermissionsWorking.username = eazlDatasourceUserPermissions.username;
        } else {
            dashboardUserPermissionsWorking.username = '';
        }

        // Set default to false
        dashboardUserPermissionsWorking.canAddDashboard = false;
        dashboardUserPermissionsWorking.canAssignPermissionDashboard = false;
        dashboardUserPermissionsWorking.canChangeDashboard = false;
        dashboardUserPermissionsWorking.canDeleteDashboard = false;
        dashboardUserPermissionsWorking.canRemovePermissionDashboard = false;
        dashboardUserPermissionsWorking.canViewDashboard = false;

        if (eazlDatasourceUserPermissions.permissions != null) {

            // Loop on those assigned
            for (var i = 0; i < eazlDatasourceUserPermissions.permissions.length; i++) {

                if (eazlDatasourceUserPermissions.permissions[i] == 'add_dashboard') {
                    dashboardUserPermissionsWorking.canAddDashboard = true;
                }
                if (eazlDatasourceUserPermissions.permissions[i] == 'assign_permission_dashboard') {
                    dashboardUserPermissionsWorking.canAssignPermissionDashboard = true;
                }
                if (eazlDatasourceUserPermissions.permissions[i] == 'change_dashboard') {
                    dashboardUserPermissionsWorking.canChangeDashboard = true;
                }
                if (eazlDatasourceUserPermissions.permissions[i] == 'delete_dashboard') {
                    dashboardUserPermissionsWorking.canDeleteDashboard = true;
                }
                if (eazlDatasourceUserPermissions.permissions[i] == 'remove_permission_dashboard') {
                    dashboardUserPermissionsWorking.canRemovePermissionDashboard = true;
                }
                if (eazlDatasourceUserPermissions.permissions[i] == 'view_dashboard') {
                    dashboardUserPermissionsWorking.canViewDashboard = true;
                }
            }
        }

        // Return
        return dashboardUserPermissionsWorking;
    }

    loadDashboardGroupPermissions(eazlDashboardGroupPermissions): DashboardGroupPermissions {
        // Load Group Permissions for a given Dashboard: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadDashboardGroupPermissions', '@Start');

        let dashboardGroupPermissionsWorking = new DashboardGroupPermissions();

        if (eazlDashboardGroupPermissions.groupName != null) {
            dashboardGroupPermissionsWorking.groupName = eazlDashboardGroupPermissions.groupName;
        } else {
            dashboardGroupPermissionsWorking.groupName = '';
        }

        // Set default to false
        dashboardGroupPermissionsWorking.canAddDashboard = false;
        dashboardGroupPermissionsWorking.canAssignPermissionDashboard = false;
        dashboardGroupPermissionsWorking.canChangeDashboard = false;
        dashboardGroupPermissionsWorking.canDeleteDashboard = false;
        dashboardGroupPermissionsWorking.canRemovePermissionDashboard = false;
        dashboardGroupPermissionsWorking.canViewDashboard = false;

        if (eazlDashboardGroupPermissions.permissions != null) {

            // Loop on those assigned
            for (var i = 0; i < eazlDashboardGroupPermissions.permissions.length; i++) {

                if (eazlDashboardGroupPermissions.permissions[i] == 'add_dashboard') {
                    dashboardGroupPermissionsWorking.canAddDashboard = true;
                }
                if (eazlDashboardGroupPermissions.permissions[i] == 'assign_permission_dashboard') {
                    dashboardGroupPermissionsWorking.canAssignPermissionDashboard = true;
                }
                if (eazlDashboardGroupPermissions.permissions[i] == 'change_dashboard') {
                    dashboardGroupPermissionsWorking.canChangeDashboard = true;
                }
                if (eazlDashboardGroupPermissions.permissions[i] == 'delete_dashboard') {
                    dashboardGroupPermissionsWorking.canDeleteDashboard = true;
                }
                if (eazlDashboardGroupPermissions.permissions[i] == 'remove_permission_dashboard') {
                    dashboardGroupPermissionsWorking.canRemovePermissionDashboard = true;
                }
                if (eazlDashboardGroupPermissions.permissions[i] == 'view_dashboard') {
                    dashboardGroupPermissionsWorking.canViewDashboard = true;
                }
            }
        }

        // Return
        return dashboardGroupPermissionsWorking;
    }

    loadDatasource(eazlDataSource: EazlDataSource): DataSource {
        // Load Datasource from Package: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadDatasource', '@Start');

        let dataSourceTaskWorking = new DataSource();

        dataSourceTaskWorking.datasourceID = eazlDataSource.id;

        if (eazlDataSource.name != null) {
            dataSourceTaskWorking.datasourceName = eazlDataSource.name;
        } else {
            dataSourceTaskWorking.datasourceName = '';
        }

        dataSourceTaskWorking.datasourceDescription = '';
        dataSourceTaskWorking.datasourceDBname = '';
        dataSourceTaskWorking.datasourceSource = '';
        dataSourceTaskWorking.datasourceDBType = '';
        dataSourceTaskWorking.datasourceDBconnectionProd = '';
        dataSourceTaskWorking.datasourceDBconnectionTest = '';
        dataSourceTaskWorking.datasourceEnvironment = '';
        dataSourceTaskWorking.datasourceDataQuality = '';
        dataSourceTaskWorking.datasourceDataIssues = null;
        dataSourceTaskWorking.datasourceMaxRowsReturned = -1;
        dataSourceTaskWorking.datasourceDefaultReturnFormat = '';
        dataSourceTaskWorking.datasourceUserEditable = false;

        if (eazlDataSource.repository_id != null) {
            dataSourceTaskWorking.packageRepositoryID = eazlDataSource.repository_id;
        } else {
            dataSourceTaskWorking.packageRepositoryID = -1;
        }

        if (eazlDataSource.compiled != null) {
            dataSourceTaskWorking.packageCompiled = eazlDataSource.compiled;
        } else {
            dataSourceTaskWorking.packageCompiled = false;
        }

        if (eazlDataSource.parameters != null) {
            dataSourceTaskWorking.datasourceParameters = eazlDataSource.parameters;
        } else {
            dataSourceTaskWorking.datasourceParameters = [];
        }

        if (eazlDataSource.fields != null) {
            dataSourceTaskWorking.datasourceFields = eazlDataSource.fields;
        } else {
            dataSourceTaskWorking.datasourceFields = [];
        }

        if (eazlDataSource.date_last_synced != null) {
            dataSourceTaskWorking.datasourceDateLastSynced = eazlDataSource.date_last_synced;
        } else {
            dataSourceTaskWorking.datasourceDateLastSynced = '';
        }

        if (eazlDataSource.last_sync_successful != null) {
            dataSourceTaskWorking.datasourceLastSyncSuccessful = eazlDataSource.last_sync_successful;
        } else {
            dataSourceTaskWorking.datasourceLastSyncSuccessful = false;
        }

        if (eazlDataSource.last_sync_error != null) {
            dataSourceTaskWorking.datasourceLastSyncError = eazlDataSource.last_sync_error;
        } else {
            dataSourceTaskWorking.datasourceLastSyncError = '';
        }

        if (eazlDataSource.last_runtime_error != null) {
            dataSourceTaskWorking.datasourceLastRuntimeError = eazlDataSource.last_runtime_error;
        } else {
            dataSourceTaskWorking.datasourceLastRuntimeError = '';
        }

        if (eazlDataSource.execute != null) {
            dataSourceTaskWorking.datasourceExecuteURL = eazlDataSource.execute;
        } else {
            dataSourceTaskWorking.datasourceExecuteURL = '';
        }

        if (eazlDataSource.permissions != null) {
            dataSourceTaskWorking.datasourcePermissions = eazlDataSource.permissions;
        } else {
            dataSourceTaskWorking.datasourcePermissions = [];
        }

        if (eazlDataSource.url != null) {
            dataSourceTaskWorking.datasourceUrl = eazlDataSource.url;
        } else {
            dataSourceTaskWorking.datasourceUrl = '';
        }

        dataSourceTaskWorking.datasourceSQL = '';
        dataSourceTaskWorking.datasourceCreatedDateTime = '';
        dataSourceTaskWorking.datasourceCreatedUserName = '';
        dataSourceTaskWorking.datasourceUpdatedDateTime = '';
        dataSourceTaskWorking.datasourceUpdatedUserName = '';

        // Return the result
        return dataSourceTaskWorking;
    }

    // loadFilter(eazlFilter: EazlFilter): Filter {
    //     // Load Filter: move data Eazl -> Canvas
    //     this.globalFunctionService.printToConsole(this.constructor.name,'loadFilter', '@Start');

    //     let filterWorking = new Filter();

    //     filterWorking.filterID = eazlFilter.id;

    //     if (eazlFilter.has_atleast_one_filter != null) {
    //         filterWorking.hasAtLeastOneFilter = eazlFilter.has_atleast_one_filter;
    //     } else {
    //         filterWorking.hasAtLeastOneFilter = false;
    //     }

    //     if (eazlFilter.description != null) {
    //         filterWorking.description = eazlFilter.description;
    //     } else {
    //         filterWorking.description = '';
    //     }

    //     // Return the result
    //     return filterWorking;
    // }

    loadGroupDatasourceAccess(
        eazlGroupDatasourceAccess: EazlGroupDatasourceAccess
        ): GroupDatasourceAccess {
        // Load GroupDatasourceAccess: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadGroupDatasourceAccess', '@Start');

        let groupDatasourceAccessWorking = new GroupDatasourceAccess();

        groupDatasourceAccessWorking.groupID = eazlGroupDatasourceAccess.id;

        if (eazlGroupDatasourceAccess.datasource_id != null) {
            groupDatasourceAccessWorking.datasourceID =
                eazlGroupDatasourceAccess.datasource_id;
        } else {
            groupDatasourceAccessWorking.datasourceID = -1;
        }

        if (eazlGroupDatasourceAccess.access_type != null) {
            groupDatasourceAccessWorking.groupDatasourceAccessAccessType =
                eazlGroupDatasourceAccess.access_type;
        } else {
            groupDatasourceAccessWorking.groupDatasourceAccessAccessType = '';
        }

        if (eazlGroupDatasourceAccess.created_on != null) {
            groupDatasourceAccessWorking.groupDatasourceAccessCreatedDateTime =
                eazlGroupDatasourceAccess.created_on;
        } else {
            groupDatasourceAccessWorking.groupDatasourceAccessCreatedDateTime = '';
        }

        if (eazlGroupDatasourceAccess.created_by != null) {
            groupDatasourceAccessWorking.groupDatasourceAccessCreatedUserName =
                eazlGroupDatasourceAccess.created_by;
        } else {
            groupDatasourceAccessWorking.groupDatasourceAccessCreatedUserName = '';
        }

        if (eazlGroupDatasourceAccess.updated_on != null) {
            groupDatasourceAccessWorking.groupDatasourceAccessUpdatedDateTime =
                eazlGroupDatasourceAccess.updated_on;
        } else {
            groupDatasourceAccessWorking.groupDatasourceAccessUpdatedDateTime = '';
        }

        if (eazlGroupDatasourceAccess.updated_by != null) {
            groupDatasourceAccessWorking.groupDatasourceAccessUpdatedUserName =
                eazlGroupDatasourceAccess.updated_by;
        } else {
            groupDatasourceAccessWorking.groupDatasourceAccessUpdatedUserName = '';
        }

        // Return the result
        return groupDatasourceAccessWorking;
    }

    loadPackageTask(eazlPackageTask: EazlPackageTask): PackageTask {
        // Load PackageTask: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadPackageTask', '@Start');

        let packageTaskWorking = new PackageTask();

        packageTaskWorking.packageTaskID = eazlPackageTask.id;

        if (eazlPackageTask.celery_task_id != null) {
            packageTaskWorking.packageTaskCeleryTaskID = eazlPackageTask.celery_task_id;
        } else {
            packageTaskWorking.packageTaskCeleryTaskID = -1;
        }

        if (eazlPackageTask.query != null) {
            packageTaskWorking.packageTaskPackage = eazlPackageTask.query;
        } else {
            packageTaskWorking.packageTaskPackage = '';
        }

        if (eazlPackageTask.executor != null) {
            packageTaskWorking.packageTaskUser = eazlPackageTask.executor;
        } else {
            packageTaskWorking.packageTaskUser = '';
        }

        if (eazlPackageTask.date_created != null) {
            packageTaskWorking.packageTaskCreatedDateTime = eazlPackageTask.date_created.toString();
        } else {
            packageTaskWorking.packageTaskCreatedDateTime = '';
        }

        // Return the result
        return packageTaskWorking;
    }

    loadReport(eazlReport: EazlReport): Report {
        // Load Report: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadReport', '@Start');

        let ReportWorking = new Report();

        ReportWorking.reportID = eazlReport.id;

        if (eazlReport.code != null) {
            ReportWorking.reportCode = eazlReport.code;
        } else {
            ReportWorking.reportCode = '';
        }

        if (eazlReport.name != null) {
            ReportWorking.reportName = eazlReport.name;
        } else {
            ReportWorking.reportName = '';
        }

        if (eazlReport.description != null) {
            ReportWorking.reportDescription = eazlReport.description;
        } else {
            ReportWorking.reportDescription = '';
        }

        // if (eazlReport.parameters != null) {
        //     ReportWorking.reportParameters = eazlReport.parameters;
        // } else {
        //     ReportWorking.reportParameters = '';
        // }

        if (eazlReport.package_id != null) {
            ReportWorking.dataSourceID = eazlReport.package_id;
        } else {
            ReportWorking.dataSourceID = -1;
        }

        if (eazlReport.date_created != null) {
            ReportWorking.reportCreatedDateTime = eazlReport.date_created;
        } else {
            ReportWorking.reportCreatedDateTime = '';
        }

        if (eazlReport.creator != null) {
            ReportWorking.reportCreatedUserName = eazlReport.creator;
        } else {
            ReportWorking.reportCreatedUserName = '';
        }

        if (eazlReport.date_edited != null) {
            ReportWorking.reportUpdatedDateTime = eazlReport.date_edited;
        } else {
            ReportWorking.reportUpdatedDateTime = '';
        }

        if (eazlReport.editor != null) {
            ReportWorking.reportUpdatedUserName = eazlReport.editor;
        } else {
            ReportWorking.reportUpdatedUserName = '';
        }

        if (eazlReport.package_permissions != null) {
            ReportWorking.reportPackagePermissions = eazlReport.package_permissions;
        } else {
            ReportWorking.reportPackagePermissions = null;
        }

        if (eazlReport.specification != null) {
            ReportWorking.reportSpecification = eazlReport.specification;
        } else {
            ReportWorking.reportSpecification = null;
        }

        if (eazlReport.fields != null) {
            ReportWorking.reportFields = eazlReport.fields;
            ReportWorking.reportFieldsString = '';
            for (var i = 0; i < eazlReport.fields.length; i++) {
                ReportWorking.reportFieldsString = ReportWorking.reportFieldsString + ' ' +
                    eazlReport.fields[i].name;
            }
        } else {
            ReportWorking.reportFields = null;
            ReportWorking.reportFieldsString = '';
        }

        if (eazlReport.execute != null) {
            ReportWorking.reportExecute = eazlReport.execute;
        } else {
            ReportWorking.reportExecute = '';
        }

        if (eazlReport.permissions != null) {
            ReportWorking.reportPermissions = eazlReport.permissions;
        } else {
            ReportWorking.reportPermissions = null;
        }

        if (eazlReport.url != null) {
            ReportWorking.reportUrl = eazlReport.url;
        } else {
            ReportWorking.reportUrl = '';
        }

        if (eazlReport.checksum != null) {
            ReportWorking.reportChecksum = eazlReport.checksum;
        } else {
            ReportWorking.reportChecksum = '';
        }

        if (eazlReport.version != null) {
            ReportWorking.reportVersion = eazlReport.version;
        } else {
            ReportWorking.reportVersion = '';
        }

        if (eazlReport.fetch != null) {
            ReportWorking.reportFetch = eazlReport.fetch;
        } else {
            ReportWorking.reportFetch = '';
        }

        // Return the result
        return ReportWorking;
    }

    loadReportWidgetSet(eazlReportWidgetSet: EazlReportWidgetSet): ReportWidgetSet {
        // Load ReportWidgetSet: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadReportWidgetSet', '@Start');

        let reportWidgetSetWorking = new ReportWidgetSet();

        reportWidgetSetWorking.widgetSetID = eazlReportWidgetSet.id;

        if (eazlReportWidgetSet.report_id != null) {
            reportWidgetSetWorking.reportID = eazlReportWidgetSet.report_id;
        } else {
            reportWidgetSetWorking.reportID = -1;
        }

        if (eazlReportWidgetSet.name != null) {
            reportWidgetSetWorking.widgetSetName = eazlReportWidgetSet.name;
        } else {
            reportWidgetSetWorking.widgetSetName = '';
        }

        if (eazlReportWidgetSet.description != null) {
            reportWidgetSetWorking.widgetSetDescription = eazlReportWidgetSet.description;
        } else {
            reportWidgetSetWorking.widgetSetDescription = '';
        }

        if (eazlReportWidgetSet.vega_spec != null) {
            reportWidgetSetWorking.vegaSpec = eazlReportWidgetSet.vega_spec;
        } else {
            reportWidgetSetWorking.vegaSpec = '';
        }

        if (eazlReportWidgetSet.updated_on != null) {
            reportWidgetSetWorking.reportWidgetSetUpdatedDateTime =
                eazlReportWidgetSet.updated_on;
        } else {
            reportWidgetSetWorking.reportWidgetSetUpdatedDateTime = '';
        }

        if (eazlReportWidgetSet.updated_by != null) {
            reportWidgetSetWorking.reportWidgetSetUpdatedUserName =
                eazlReportWidgetSet.updated_by;
        } else {
            reportWidgetSetWorking.reportWidgetSetUpdatedUserName = '';
        }

        if (eazlReportWidgetSet.created_on != null) {
            reportWidgetSetWorking.reportWidgetSetCreatedDateTime =
                eazlReportWidgetSet.created_on;
        } else {
            reportWidgetSetWorking.reportWidgetSetCreatedDateTime = '';
        }

        if (eazlReportWidgetSet.created_by != null) {
            reportWidgetSetWorking.reportWidgetSetCreatedUserName =
                eazlReportWidgetSet.created_by;
        } else {
            reportWidgetSetWorking.reportWidgetSetCreatedUserName = '';
        }

        // Return the result
        return reportWidgetSetWorking;
    }

    loadReportHistory(eazlReportHistory: EazlReportHistory): ReportHistory {
        // Load ReportHistory: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadReportHistory', '@Start');

        let reportHistoryWorking = new ReportHistory();

        reportHistoryWorking.reportHistoryID = eazlReportHistory.id;

        if (eazlReportHistory.executor != null) {
            reportHistoryWorking.reportHistoryUserName = eazlReportHistory.executor;
        } else {
            reportHistoryWorking.reportHistoryUserName = '';
        }

        if (eazlReportHistory.model_name != null  &&  eazlReportHistory.object_id != null) {
            if (eazlReportHistory.model_name == 'package') {
                reportHistoryWorking.reportHistoryDatasourceID = eazlReportHistory.object_id;
                reportHistoryWorking.reportHistoryReportID = -1;
            } else if (eazlReportHistory.model_name == 'query') {
                reportHistoryWorking.reportHistoryDatasourceID = -1;
                reportHistoryWorking.reportHistoryReportID = eazlReportHistory.object_id;
            } else {
                reportHistoryWorking.reportHistoryDatasourceID = -1;
                reportHistoryWorking.reportHistoryReportID = -1;
            }
        }

        if (eazlReportHistory.checksum != null) {
            reportHistoryWorking.reportHistoryChecksum = eazlReportHistory.checksum;
        } else {
            reportHistoryWorking.reportHistoryStartDateTime = '';
        }

        if (eazlReportHistory.date_created != null) {
            reportHistoryWorking.reportHistoryStartDateTime = eazlReportHistory.date_created;
            if (eazlReportHistory.run_time != null) {
                var endDate = new Date(eazlReportHistory.date_created)
                endDate.setSeconds(endDate.getSeconds() + eazlReportHistory.run_time);
                reportHistoryWorking.reportHistoryEndDateTime = endDate.toString();
            } else {
                reportHistoryWorking.reportHistoryEndDateTime =
                    reportHistoryWorking.reportHistoryStartDateTime
            }
        } else {
            reportHistoryWorking.reportHistoryStartDateTime = '';
            reportHistoryWorking.reportHistoryEndDateTime = '';
        }

        if (eazlReportHistory.state != null) {
            reportHistoryWorking.reportHistoryStatus = eazlReportHistory.state;
        } else {
            reportHistoryWorking.reportHistoryStatus = '';
        }

        if (eazlReportHistory.row_count != null) {
            reportHistoryWorking.reportHistoryNrRowsReturned = eazlReportHistory.row_count;
        } else {
            reportHistoryWorking.reportHistoryNrRowsReturned = 0;
        }

        if (eazlReportHistory.error != null) {
            reportHistoryWorking.error = eazlReportHistory.error;
        } else {
            reportHistoryWorking.error = '';
        }

        if (eazlReportHistory.url != null) {
            reportHistoryWorking.reportHistoryUrl = eazlReportHistory.url;
        } else {
            reportHistoryWorking.reportHistoryUrl = '';
        }

        // Return the result
        return reportHistoryWorking;
    }

    loadReportUserRelationship(eazlReportUserRelationship: EazlReportUserRelationship): ReportUserRelationship {
        // Load ReportUserRelationship: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadReportUserRelationship', '@Start');

        let ReportUserRelationshipWorking = new ReportUserRelationship();

        ReportUserRelationshipWorking.reportUserRelationshipID = eazlReportUserRelationship.id;

        if (eazlReportUserRelationship.username != null) {
            ReportUserRelationshipWorking.userName = eazlReportUserRelationship.username;
        } else {
            ReportUserRelationshipWorking.userName = '';
        }

        if (eazlReportUserRelationship.report_id != null) {
            ReportUserRelationshipWorking.reportID = eazlReportUserRelationship.report_id;
        } else {
            ReportUserRelationshipWorking.reportID = -1;
        }

        if (eazlReportUserRelationship.type != null) {
            ReportUserRelationshipWorking.reportUserRelationshipType =
                eazlReportUserRelationship.type;
        } else {
            ReportUserRelationshipWorking.reportUserRelationshipType = '';
        }

        if (eazlReportUserRelationship.rating != null) {
            ReportUserRelationshipWorking.reportUserRelationshipRating =
                eazlReportUserRelationship.rating;
        } else {
            ReportUserRelationshipWorking.reportUserRelationshipRating = 0;
        }

        if (eazlReportUserRelationship.created_on != null) {
            ReportUserRelationshipWorking.reportUserRelationshipCreatedDateTime =
                eazlReportUserRelationship.created_on;
        } else {
            ReportUserRelationshipWorking.reportUserRelationshipCreatedDateTime = '';
        }

        if (eazlReportUserRelationship.created_by != null) {
            ReportUserRelationshipWorking.reportUserRelationshipCreatedUserName =
                eazlReportUserRelationship.created_by;
        } else {
            ReportUserRelationshipWorking.reportUserRelationshipCreatedUserName = '';
        }

        if (eazlReportUserRelationship.updated_on != null) {
            ReportUserRelationshipWorking.reportUserRelationshipUpdatedDateTime =
                eazlReportUserRelationship.updated_on;
        } else {
            ReportUserRelationshipWorking.reportUserRelationshipUpdatedDateTime = '';
        }

        if (eazlReportUserRelationship.updated_by != null) {
            ReportUserRelationshipWorking.reportUserRelationshipUpdatedUserName =
                eazlReportUserRelationship.updated_by;
        } else {
            ReportUserRelationshipWorking.reportUserRelationshipUpdatedUserName = '';
        }

        // Return the result
        return ReportUserRelationshipWorking;
    }

    loadSystemConfiguration(eazlSystemConfiguration: EazlSystemConfiguration): SystemConfiguration {
        // Load SystemConfiguration: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadSystemConfiguration', '@Start');

        let systemConfigurationWorking = new SystemConfiguration();

        systemConfigurationWorking.systemConfigurationID = eazlSystemConfiguration.id;

        if (eazlSystemConfiguration.company_name != null) {
            systemConfigurationWorking.companyName = eazlSystemConfiguration.company_name;
        } else {
            systemConfigurationWorking.companyName = '';
        }

        if (eazlSystemConfiguration.company_logo != null) {
            systemConfigurationWorking.companyLogo = eazlSystemConfiguration.company_logo;
        } else {
            systemConfigurationWorking.companyLogo = '';
        }

        if (eazlSystemConfiguration.backend_url != null) {
            systemConfigurationWorking.backendUrl = eazlSystemConfiguration.backend_url;
        } else {
            systemConfigurationWorking.backendUrl = '';
        }

        if (eazlSystemConfiguration.result_expires != null) {
            systemConfigurationWorking.defaultDaysToKeepResultSet = eazlSystemConfiguration.result_expires;
        } else {
            systemConfigurationWorking.defaultDaysToKeepResultSet = 0;
        }

        if (eazlSystemConfiguration.default_row_limit != null) {
            systemConfigurationWorking.maxRowsDataReturned = eazlSystemConfiguration.default_row_limit;
        } else {
            systemConfigurationWorking.maxRowsDataReturned = 0;
        }

        // TODO - fix more better later
        systemConfigurationWorking.maxRowsPerWidgetGraph =
            this.globalVariableService.maxRowsPerWidgetGraph;
        // if (eazlSystemConfiguration.max_rows_per_widget_graph != null) {
        //     systemConfigurationWorking.maxRowsPerWidgetGraph = eazlSystemConfiguration.max_rows_per_widget_graph;
        // } else {
        //     systemConfigurationWorking.maxRowsPerWidgetGraph = 0;
        // }

        // Return the result
        return systemConfigurationWorking;
    }

    saveSystemConfiguration(systemConfiguration: SystemConfiguration): EazlSystemConfiguration {
        // Save SystemConfiguration: move data Canvas -> Eazl
        this.globalFunctionService.printToConsole(this.constructor.name,'saveSystemConfiguration', '@Start');

        let eazlSystemConfigurationWorking = new EazlSystemConfiguration();

        eazlSystemConfigurationWorking.id = systemConfiguration.systemConfigurationID;

        if (systemConfiguration.companyName != null) {
            eazlSystemConfigurationWorking.company_name = systemConfiguration.companyName;
        } else {
            eazlSystemConfigurationWorking.company_name = '';
        }

        if (systemConfiguration.companyLogo != null) {
            eazlSystemConfigurationWorking.company_logo = systemConfiguration.companyLogo;
        } else {
            eazlSystemConfigurationWorking.company_logo = null;
        }

// TODO - do this correctly, and better
eazlSystemConfigurationWorking.company_logo = null
        if (systemConfiguration.backendUrl != null) {
            eazlSystemConfigurationWorking.backend_url = systemConfiguration.backendUrl;
        } else {
            eazlSystemConfigurationWorking.backend_url = '';
        }

        if (systemConfiguration.defaultDaysToKeepResultSet != null) {
            eazlSystemConfigurationWorking.result_expires = systemConfiguration.defaultDaysToKeepResultSet;
        } else {
            eazlSystemConfigurationWorking.result_expires = 0;
        }

        if (systemConfiguration.maxRowsDataReturned != null) {
            eazlSystemConfigurationWorking.default_row_limit = systemConfiguration.maxRowsDataReturned;
        } else {
            eazlSystemConfigurationWorking.default_row_limit = 0;
        }

        // TODO - add in some form or other
        // if (systemConfiguration.maxRowsPerWidgetGraph != null) {
        //     eazlSystemConfigurationWorking.max_rows_per_widget_graph = systemConfiguration.maxRowsPerWidgetGraph;
        // } else {
        //     eazlSystemConfigurationWorking.max_rows_per_widget_graph = 0;
        // }

        // Return the result
        return eazlSystemConfigurationWorking;
    }

    loadWidgetTemplate(eazlWidgetTemplate: EazlWidgetTemplate): WidgetTemplate {
        // Load WidgetTemplate: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadWidgetTemplate', '@Start');

        let widgetTemplateWorking = new WidgetTemplate();

        widgetTemplateWorking.widgetTemplateID = eazlWidgetTemplate.id;

        if (eazlWidgetTemplate.name != null) {
            widgetTemplateWorking.widgetTemplateName = eazlWidgetTemplate.name;
        } else {
            widgetTemplateWorking.widgetTemplateName = '';
        }

        if (eazlWidgetTemplate.description != null) {
            widgetTemplateWorking.widgetTemplateDescription = eazlWidgetTemplate.description;
        } else {
            widgetTemplateWorking.widgetTemplateDescription = '';
        }

        // Create an empty sub-group
        widgetTemplateWorking.vegaParameters = {
            vegaGraphHeight: null,
            vegaGraphWidth: null,
            vegaGraphPadding: null,
            vegaHasSignals: null,
            vegaXcolumn: null,
            vegaYcolumn: null,
            vegaFillColor: null,
            vegaHoverColor: null
        }

        if (eazlWidgetTemplate.vega_chart_height != null) {
            widgetTemplateWorking.vegaParameters.vegaGraphHeight = eazlWidgetTemplate.vega_chart_height;
        } else {
            widgetTemplateWorking.vegaParameters.vegaGraphHeight = 0;
        }

        if (eazlWidgetTemplate.vega_chart_width != null) {
            widgetTemplateWorking.vegaParameters.vegaGraphWidth =
                eazlWidgetTemplate.vega_chart_width;
        } else {
            widgetTemplateWorking.vegaParameters.vegaGraphWidth = 0;
        }

        if (eazlWidgetTemplate.vega_chart_padding != null) {
            widgetTemplateWorking.vegaParameters.vegaGraphPadding =
                eazlWidgetTemplate.vega_chart_padding;
        } else {
            widgetTemplateWorking.vegaParameters.vegaGraphPadding = 0;
        }

        if (eazlWidgetTemplate.vega_chart_has_signals != null) {
            widgetTemplateWorking.vegaParameters.vegaHasSignals =
                eazlWidgetTemplate.vega_chart_has_signals;
        } else {
            widgetTemplateWorking.vegaParameters.vegaHasSignals = false;
        }

        if (eazlWidgetTemplate.vega_chart_x_column != null) {
            widgetTemplateWorking.vegaParameters.vegaXcolumn =
                eazlWidgetTemplate.vega_chart_x_column;
        } else {
            widgetTemplateWorking.vegaParameters.vegaXcolumn = '';
        }

        if (eazlWidgetTemplate.vega_chart_y_column != null) {
            widgetTemplateWorking.vegaParameters.vegaYcolumn =
                eazlWidgetTemplate.vega_chart_y_column;
        } else {
            widgetTemplateWorking.vegaParameters.vegaYcolumn = '';
        }

        if (eazlWidgetTemplate.vega_chart_fill_color != null) {
            widgetTemplateWorking.vegaParameters.vegaFillColor =
                eazlWidgetTemplate.vega_chart_fill_color;
        } else {
            widgetTemplateWorking.vegaParameters.vegaFillColor = '';
        }

        if (eazlWidgetTemplate.vega_chart_hover_color != null) {
            widgetTemplateWorking.vegaParameters.vegaHoverColor =
                eazlWidgetTemplate.vega_chart_hover_color;
        } else {
            widgetTemplateWorking.vegaParameters.vegaHoverColor = '';
        }

        if (eazlWidgetTemplate.vega_chart_specification != null) {
            widgetTemplateWorking.vegaSpec = eazlWidgetTemplate.vega_chart_specification;
        } else {
            widgetTemplateWorking.vegaSpec = '';
        }

        // Return the result
        return widgetTemplateWorking;
    }

    loadWidget(eazlWidget: EazlWidget): Widget {
        // Load Widget: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadWidget', '@Start');

        let widgetWorking = new Widget();

        if (eazlWidget.container_background_color != null) {
            widgetWorking.container.backgroundColor = eazlWidget.container_background_color;
        } else {
            widgetWorking.container.backgroundColor = '';
        }

        if (eazlWidget.container_border != null) {
            widgetWorking.container.border = eazlWidget.container_border;
        } else {
            widgetWorking.container.border = '';
        }

        if (eazlWidget.container_box_shadow != null) {
            widgetWorking.container.boxShadow = eazlWidget.container_box_shadow;
        } else {
            widgetWorking.container.boxShadow = '';
        }

        if (eazlWidget.container_color != null) {
            widgetWorking.container.color = eazlWidget.container_color;
        } else {
            widgetWorking.container.color = '';
        }

        if (eazlWidget.container_font_size != null) {
            widgetWorking.container.fontSize = eazlWidget.container_font_size;
        } else {
            widgetWorking.container.fontSize = 0;
        }

        if (eazlWidget.container_height != null) {
            widgetWorking.container.height = eazlWidget.container_height;
        } else {
            widgetWorking.container.height = 0;
        }

        if (eazlWidget.container_left != null) {
            widgetWorking.container.left = eazlWidget.container_left;
        } else {
            widgetWorking.container.left = 0;
        }

        if (eazlWidget.container_widget_title != null) {
            widgetWorking.container.widgetTitle = eazlWidget.container_widget_title;
        } else {
            widgetWorking.container.widgetTitle = '';
        }

        if (eazlWidget.container_top != null) {
            widgetWorking.container.top = eazlWidget.container_top;
        } else {
            widgetWorking.container.top = 0;
        }

        if (eazlWidget.container_width != null) {
            widgetWorking.container.width = eazlWidget.container_width;
        } else {
            widgetWorking.container.width = 0;
        }

        if (eazlWidget.areas_show_widget_text != null) {
            widgetWorking.areas.showWidgetText = eazlWidget.areas_show_widget_text;
        } else {
            widgetWorking.areas.showWidgetText = false;
        }

        if (eazlWidget.areas_show_widget_graph != null) {
            widgetWorking.areas.showWidgetGraph = eazlWidget.areas_show_widget_graph;
        } else {
            widgetWorking.areas.showWidgetGraph = false;
        }

        if (eazlWidget.areas_show_widget_table != null) {
            widgetWorking.areas.showWidgetTable = eazlWidget.areas_show_widget_table;
        } else {
            widgetWorking.areas.showWidgetTable = false;
        }

        if (eazlWidget.areas_show_widget_image != null) {
            widgetWorking.areas.showWidgetImage = eazlWidget.areas_show_widget_image;
        } else {
            widgetWorking.areas.showWidgetImage = false;
        }

        if (eazlWidget.textual_text_text != null) {
            widgetWorking.textual.textText = eazlWidget.textual_text_text;
        } else {
            widgetWorking.textual.textText = '';
        }

        if (eazlWidget.textual_text_backgroundColor != null) {
            widgetWorking.textual.textBackgroundColor = eazlWidget.textual_text_backgroundColor;
        } else {
            widgetWorking.textual.textBackgroundColor = '';
        }

        if (eazlWidget.textual_text_border != null) {
            widgetWorking.textual.textBorder = eazlWidget.textual_text_border;
        } else {
            widgetWorking.textual.textBorder = '';
        }

        if (eazlWidget.textual_text_color != null) {
            widgetWorking.textual.textColor = eazlWidget.textual_text_color;
        } else {
            widgetWorking.textual.textColor = '';
        }

        if (eazlWidget.textual_text_fontSize != null) {
            widgetWorking.textual.textFontSize = eazlWidget.textual_text_fontSize;
        } else {
            widgetWorking.textual.textFontSize = 16;
        }

        if (eazlWidget.textual_text_fontWeight != null) {
            widgetWorking.textual.textFontWeight = eazlWidget.textual_text_fontWeight;
        } else {
            widgetWorking.textual.textFontWeight = '';
        }

        if (eazlWidget.textual_text_height != null) {
            widgetWorking.textual.textHeight = eazlWidget.textual_text_height;
        } else {
            widgetWorking.textual.textHeight = 16;
        }

        if (eazlWidget.textual_text_left != null) {
            widgetWorking.textual.textLeft = eazlWidget.textual_text_left;
        } else {
            widgetWorking.textual.textLeft = 0;
        }

        if (eazlWidget.textual_text_margin != null) {
            widgetWorking.textual.textMargin = eazlWidget.textual_text_margin;
        } else {
            widgetWorking.textual.textMargin = '';
        }

        if (eazlWidget.textual_text_padding != null) {
            widgetWorking.textual.textPadding = eazlWidget.textual_text_padding;
        } else {
            widgetWorking.textual.textPadding = '';
        }

        if (eazlWidget.textual_text_position != null) {
            widgetWorking.textual.textPosition = eazlWidget.textual_text_position;
        } else {
            widgetWorking.textual.textPosition = '';
        }

        if (eazlWidget.textual_text_textAlign != null) {
            widgetWorking.textual.textTextAlign = eazlWidget.textual_text_textAlign;
        } else {
            widgetWorking.textual.textTextAlign = '';
        }

        if (eazlWidget.textual_text_top != null) {
            widgetWorking.textual.textTop = eazlWidget.textual_text_top;
        } else {
            widgetWorking.textual.textTop = 0;
        }

        if (eazlWidget.textual_text_width != null) {
            widgetWorking.textual.textWidth = eazlWidget.textual_text_width;
        } else {
            widgetWorking.textual.textWidth = 0;
        }

        if (eazlWidget.graph_graph_id != null) {
            widgetWorking.graph.graphID = eazlWidget.graph_graph_id;
        } else {
            widgetWorking.graph.graphID = -1;
        }

        if (eazlWidget.graph_graph_left != null) {
            widgetWorking.graph.graphLeft = eazlWidget.graph_graph_left;
        } else {
            widgetWorking.graph.graphLeft = 0;
        }

        if (eazlWidget.graph_graph_top != null) {
            widgetWorking.graph.graphTop = eazlWidget.graph_graph_top;
        } else {
            widgetWorking.graph.graphTop = 0;
        }

        if (eazlWidget.graph_vega_parameters_vega_graphHeight != null) {
            widgetWorking.graph.vegaParameters.vegaGraphHeight =
                eazlWidget.graph_vega_parameters_vega_graphHeight;
        } else {
            widgetWorking.graph.vegaParameters.vegaGraphHeight = 0;
        }

        if (eazlWidget.graph_vega_parameters_vega_graphWidth != null) {
            widgetWorking.graph.vegaParameters.vegaGraphWidth =
                eazlWidget.graph_vega_parameters_vega_graphWidth;
        } else {
            widgetWorking.graph.vegaParameters.vegaGraphWidth = 0;
        }

        if (eazlWidget.graph_vega_parameters_vega_graphPadding != null) {
            widgetWorking.graph.vegaParameters.vegaGraphPadding =
                eazlWidget.graph_vega_parameters_vega_graphPadding;
        } else {
            widgetWorking.graph.vegaParameters.vegaGraphPadding = 0;
        }

        if (eazlWidget.graph_vega_parameters_vega_hasSignals != null) {
            widgetWorking.graph.vegaParameters.vegaHasSignals =
                eazlWidget.graph_vega_parameters_vega_hasSignals;
        } else {
            widgetWorking.graph.vegaParameters.vegaHasSignals = false;
        }

        if (eazlWidget.graph_vega_parameters_vega_xcolumn != null) {
            widgetWorking.graph.vegaParameters.vegaXcolumn =
                eazlWidget.graph_vega_parameters_vega_xcolumn;
        } else {
            widgetWorking.graph.vegaParameters.vegaXcolumn = '';
        }

        if (eazlWidget.graph_vega_parameters_vega_ycolumn != null) {
            widgetWorking.graph.vegaParameters.vegaYcolumn =
                eazlWidget.graph_vega_parameters_vega_ycolumn;
        } else {
            widgetWorking.graph.vegaParameters.vegaYcolumn = '';
        }

        if (eazlWidget.graph_vega_parameters_vega_fillColor != null) {
            widgetWorking.graph.vegaParameters.vegaFillColor =
                eazlWidget.graph_vega_parameters_vega_fillColor;
        } else {
            widgetWorking.graph.vegaParameters.vegaFillColor = '';
        }

        if (eazlWidget.graph_vega_parameters_vega_hoverColor != null) {
            widgetWorking.graph.vegaParameters.vegaHoverColor =
                eazlWidget.graph_vega_parameters_vega_hoverColor;
        } else {
            widgetWorking.graph.vegaParameters.vegaHoverColor = '';
        }

        if (eazlWidget.graph_spec != null) {
            widgetWorking.graph.spec = eazlWidget.graph_spec;
        } else {
            widgetWorking.graph.spec = '';
        }

        if (eazlWidget.table_color != null) {
            widgetWorking.table.tableColor = eazlWidget.table_color;
        } else {
            widgetWorking.table.tableColor = '';
        }

        if (eazlWidget.table_cols != null) {
            widgetWorking.table.tableCols = eazlWidget.table_cols;
        } else {
            widgetWorking.table.tableCols = 0;
        }

        if (eazlWidget.table_height != null) {
            widgetWorking.table.tableHeight = eazlWidget.table_height;
        } else {
            widgetWorking.table.tableHeight = 0;
        }

        if (eazlWidget.table_hideHeader != null) {
            widgetWorking.table.tableHideHeader = eazlWidget.table_hideHeader;
        } else {
            widgetWorking.table.tableHideHeader = false;
        }

        if (eazlWidget.table_left != null) {
            widgetWorking.table.tableLeft = eazlWidget.table_left;
        } else {
            widgetWorking.table.tableLeft = 0;
        }

        if (eazlWidget.table_rows != null) {
            widgetWorking.table.tableRows = eazlWidget.table_rows;
        } else {
            widgetWorking.table.tableRows = 0;
        }

        if (eazlWidget.table_top != null) {
            widgetWorking.table.tableTop = eazlWidget.table_top;
        } else {
            widgetWorking.table.tableTop = 0;
        }

        if (eazlWidget.table_width != null) {
            widgetWorking.table.tableWidth = eazlWidget.table_width;
        } else {
            widgetWorking.table.tableWidth = 0;
        }

        if (eazlWidget.image_alt != null) {
            widgetWorking.image.imageAlt = eazlWidget.image_alt;
        } else {
            widgetWorking.image.imageAlt = '';
        }

        if (eazlWidget.image_heigt != null) {
            widgetWorking.image.imageHeigt = eazlWidget.image_heigt;
        } else {
            widgetWorking.image.imageHeigt = 0;
        }

        if (eazlWidget.image_left != null) {
            widgetWorking.image.imageLeft = eazlWidget.image_left;
        } else {
            widgetWorking.image.imageLeft = 0;
        }

        if (eazlWidget.image_source != null) {
            widgetWorking.image.imageSource = eazlWidget.image_source;
        } else {
            widgetWorking.image.imageSource = '';
        }

        if (eazlWidget.image_top != null) {
            widgetWorking.image.imageTop = eazlWidget.image_top;
        } else {
            widgetWorking.image.imageTop = 0;
        }

        if (eazlWidget.image_width != null) {
            widgetWorking.image.imageWidth = eazlWidget.image_width;
        } else {
            widgetWorking.image.imageWidth = 0;
        }

        if (eazlWidget.properties_widget_id != null) {
            widgetWorking.properties.widgetID = eazlWidget.properties_widget_id;
        } else {
            widgetWorking.properties.widgetID = -1;
        }

        if (eazlWidget.properties_dashboard_id != null) {
            widgetWorking.properties.dashboardID = eazlWidget.properties_dashboard_id;
        } else {
            widgetWorking.properties.dashboardID = -1;
        }

        if (eazlWidget.properties_dashboard_tab_id != null) {
            widgetWorking.properties.dashboardTabID = eazlWidget.properties_dashboard_tab_id;
        } else {
            widgetWorking.properties.dashboardTabID = -1;
        }

        if (eazlWidget.properties_dashboard_tab_name != null) {
            widgetWorking.properties.dashboardTabName =
                eazlWidget.properties_dashboard_tab_name;
        } else {
            widgetWorking.properties.dashboardTabName = '';
        }

        if (eazlWidget.properties_widget_code != null) {
            widgetWorking.properties.widgetCode = eazlWidget.properties_widget_code;
        } else {
            widgetWorking.properties.widgetCode = '';
        }

        if (eazlWidget.properties_widget_name != null) {
            widgetWorking.properties.widgetName = eazlWidget.properties_widget_name;
        } else {
            widgetWorking.properties.widgetName = '';
        }

        if (eazlWidget.properties_widget_description != null) {
            widgetWorking.properties.widgetDescription =
                eazlWidget.properties_widget_description;
        } else {
            widgetWorking.properties.widgetDescription = '';
        }

        if (eazlWidget.properties_widget_default_export_filetype != null) {
            widgetWorking.properties.widgetDefaultExportFileType =
                eazlWidget.properties_widget_default_export_filetype;
        } else {
            widgetWorking.properties.widgetDefaultExportFileType = '';
        }

        if (eazlWidget.properties_widget_hyperlink_tab_nr != null) {
            widgetWorking.properties.widgetHyperLinkTabNr =
                eazlWidget.properties_widget_hyperlink_tab_nr;
        } else {
            widgetWorking.properties.widgetHyperLinkTabNr = '';
        }

        if (eazlWidget.properties_widget_hyperlinkWidget_id != null) {
            widgetWorking.properties.widgetHyperLinkWidgetID =
                eazlWidget.properties_widget_hyperlinkWidget_id;
        } else {
            widgetWorking.properties.widgetHyperLinkWidgetID = '';
        }

        if (eazlWidget.properties_widget_refresh_mode != null) {
            widgetWorking.properties.widgetRefreshMode =
                eazlWidget.properties_widget_refresh_mode;
        } else {
            widgetWorking.properties.widgetRefreshMode = '';
        }

        if (eazlWidget.properties_widget_refresh_frequency != null) {
            widgetWorking.properties.widgetRefreshFrequency =
                eazlWidget.properties_widget_refresh_frequency;
        } else {
            widgetWorking.properties.widgetRefreshFrequency = 0;
        }

        if (eazlWidget.properties_widget_password != null) {
            widgetWorking.properties.widgetPassword = eazlWidget.properties_widget_password;
        } else {
            widgetWorking.properties.widgetPassword = '';
        }

        if (eazlWidget.properties_widget_is_liked != null) {
            widgetWorking.properties.widgetIsLiked = eazlWidget.properties_widget_is_liked;
        } else {
            widgetWorking.properties.widgetIsLiked = false;
        }

        if (eazlWidget.properties_widget_report_id != null) {
            widgetWorking.properties.widgetReportID = eazlWidget.properties_widget_report_id;
        } else {
            widgetWorking.properties.widgetReportID = -1;
        }

        if (eazlWidget.properties_widget_report_name != null) {
            widgetWorking.properties.widgetReportName =
                eazlWidget.properties_widget_report_name;
        } else {
            widgetWorking.properties.widgetReportName = '';
        }

        if (eazlWidget.properties_widget_report_parameters != null) {
            widgetWorking.properties.widgetReportParameters =
                eazlWidget.properties_widget_report_parameters;
        } else {
            widgetWorking.properties.widgetReportParameters = '';
        }

        if (eazlWidget.properties_widget_show_limited_rows != null) {
            widgetWorking.properties.widgetShowLimitedRows =
                eazlWidget.properties_widget_show_limited_rows;
        } else {
            widgetWorking.properties.widgetShowLimitedRows = 0;
        }

        if (eazlWidget.properties_widget_add_rest_row != null) {
            widgetWorking.properties.widgetAddRestRow = eazlWidget.properties_widget_add_rest_row;
        } else {
            widgetWorking.properties.widgetAddRestRow = false;
        }

        if (eazlWidget.properties_widget_type != null) {
            widgetWorking.properties.widgetType = eazlWidget.properties_widget_type;
        } else {
            widgetWorking.properties.widgetType = '';
        }

        if (eazlWidget.properties_widget_comments != null) {
            widgetWorking.properties.widgetComments = eazlWidget.properties_widget_comments;
        } else {
            widgetWorking.properties.widgetComments = '';
        }

        if (eazlWidget.properties_widget_index != null) {
            widgetWorking.properties.widgetIndex = eazlWidget.properties_widget_index;
        } else {
            widgetWorking.properties.widgetIndex = 0;
        }

        if (eazlWidget.properties_widget_is_locked != null) {
            widgetWorking.properties.widgetIsLocked = eazlWidget.properties_widget_is_locked;
        } else {
            widgetWorking.properties.widgetIsLocked = false;
        }

        if (eazlWidget.properties_widget_size != null) {
            widgetWorking.properties.widgetSize = eazlWidget.properties_widget_size;
        } else {
            widgetWorking.properties.widgetSize = '';
        }

        if (eazlWidget.properties_widget_system_message != null) {
            widgetWorking.properties.widgetSystemMessage = eazlWidget.properties_widget_system_message;
        } else {
            widgetWorking.properties.widgetSystemMessage = '';
        }

        if (eazlWidget.properties_widget_type_id != null) {
            widgetWorking.properties.widgetTypeID = eazlWidget.properties_widget_type_id;
        } else {
            widgetWorking.properties.widgetTypeID = -1;
        }

        if (eazlWidget.properties_widget_refreshed_on != null) {
            widgetWorking.properties.widgetRefreshedDateTime = eazlWidget.properties_widget_refreshed_on;
        } else {
            widgetWorking.properties.widgetRefreshedDateTime = '';
        }

        if (eazlWidget.properties_widget_refreshed_by != null) {
            widgetWorking.properties.widgetRefreshedUserName =
                eazlWidget.properties_widget_refreshed_by;
        } else {
            widgetWorking.properties.widgetRefreshedUserName = '';
        }

        if (eazlWidget.properties_widget_Created_on != null) {
            widgetWorking.properties.widgetCreatedDateTime =
                eazlWidget.properties_widget_Created_on;
        } else {
            widgetWorking.properties.widgetCreatedDateTime = '';
        }

        if (eazlWidget.properties_widget_Created_by != null) {
            widgetWorking.properties.widgetCreatedUserName =
                eazlWidget.properties_widget_Created_by;
        } else {
            widgetWorking.properties.widgetCreatedUserName = '';
        }

        if (eazlWidget.properties_widget_updated_on != null) {
            widgetWorking.properties.widgetUpdatedDateTime = eazlWidget.properties_widget_updated_on;
        } else {
            widgetWorking.properties.widgetUpdatedDateTime = '';
        }

        if (eazlWidget.properties_widget_updated_by != null) {
            widgetWorking.properties.widgetUpdatedUserName = eazlWidget.properties_widget_updated_by;
        } else {
            widgetWorking.properties.widgetUpdatedUserName = '';
        }

        // Return the result
        return widgetWorking;
    }

    loadWidgetTypes(eazlAppData: EazlAppData): WidgetType {
        // Load WidgetTypes: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadWidgetTypes', '@Start');

        let widgetTypesWorking = new WidgetType();
        widgetTypesWorking.value = {
            id: -1,
            name: ''
        }
        if (eazlAppData.label != null) {
            widgetTypesWorking.label = eazlAppData.label;
        } else {
            widgetTypesWorking.label = '';
        }

        if (eazlAppData.object_id != null) {
            widgetTypesWorking.value.id = eazlAppData.object_id;
        } else {
            widgetTypesWorking.value.id = -1;
        }

        if (eazlAppData.name != null) {
            widgetTypesWorking.value.name = eazlAppData.name;
        } else {
            widgetTypesWorking.value.name = '';
        }

        // Return the result
        return widgetTypesWorking;
    }

    loadGraphTypes(eazlAppData: EazlAppData): GraphType {
        // Load GraphTypes: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadGraphTypes', '@Start');

        // Create new local variable with right shape
        let graphTypesWorking = new GraphType();
        graphTypesWorking.value = {
            id: -1,
            name: ''
        }

        if (eazlAppData.label != null) {
            graphTypesWorking.label = eazlAppData.label;
        } else {
            graphTypesWorking.label = '';
        }

        if (eazlAppData.object_id != null) {
            graphTypesWorking.value.id = eazlAppData.object_id;
        } else {
            graphTypesWorking.value.id = -1;
        }

        if (eazlAppData.name != null) {
            graphTypesWorking.value.name = eazlAppData.name;
        } else {
            graphTypesWorking.value.name = '';
        }

        // Return the result
        return graphTypesWorking;
    }

    loadBorderDropdowns(eazlAppData: EazlAppData): SelectItem {
        // Load BorderDropdowns: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadBorderDropdowns', '@Start');

        let borderDropdownsWorking: SelectItem =
            {
                label: '',
                value:
                    {
                        id: 0,
                        name: ''
                    }
            };

        if (eazlAppData.label != null) {
            borderDropdownsWorking.label = eazlAppData.label;
        } else {
            borderDropdownsWorking.label = '';
        }

        if (eazlAppData.object_id != null) {
            borderDropdownsWorking.value.id = eazlAppData.object_id;
        } else {
            borderDropdownsWorking.value.id = -1;
        }

        if (eazlAppData.name != null) {
            borderDropdownsWorking.value.name = eazlAppData.name;
        } else {
            borderDropdownsWorking.value.name = '';
        }

        // Return the result
        return borderDropdownsWorking;
    }

    loadBoxShadowDropdowns(eazlAppData: EazlAppData): SelectItem {
        // Load BoxShadowDropdowns: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadBoxShadowDropdowns', '@Start');

        let boxShadowDropdownsWorking =
            {
                label: '',
                value:
                    {
                        id: 0,
                        name: ''
                    }
            };

        if (eazlAppData.label != null) {
            boxShadowDropdownsWorking.label = eazlAppData.label;
        } else {
            boxShadowDropdownsWorking.label = '';
        }

        if (eazlAppData.object_id != null) {
            boxShadowDropdownsWorking.value.id = eazlAppData.object_id;
        } else {
            boxShadowDropdownsWorking.value.id = -1;
        }

        if (eazlAppData.name != null) {
            boxShadowDropdownsWorking.value.name = eazlAppData.name;
        } else {
            boxShadowDropdownsWorking.value.name = '';
        }

        // Return the result
        return boxShadowDropdownsWorking;
    }

    loadFontSizeDropdowns(eazlAppData: EazlAppData): SelectItem {
        // Load FontSizeDropdowns: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadFontSizeDropdowns', '@Start');

        let fontSizeDropdownsWorking =
            {
                label: '',
                value:
                    {
                        id: 0,
                        name: ''
                    }
            };

        if (eazlAppData.label != null) {
            fontSizeDropdownsWorking.label = eazlAppData.label;
        } else {
            fontSizeDropdownsWorking.label = '';
        }

        if (eazlAppData.object_id != null) {
            fontSizeDropdownsWorking.value.id = eazlAppData.object_id;
        } else {
            fontSizeDropdownsWorking.value.id = -1;
        }

        if (eazlAppData.name != null) {
            fontSizeDropdownsWorking.value.name = eazlAppData.name;
        } else {
            fontSizeDropdownsWorking.value.name = '';
        }

        // Return the result
        return fontSizeDropdownsWorking;
    }

    loadGridSizeDropdowns(eazlAppData: EazlAppData): SelectItem {
        // Load GridSizeDropdowns: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadGridSizeDropdowns', '@Start');

        let gridSizeDropdownsWorking =
            {
                label: '',
                value:
                    {
                        id: 0,
                        name: ''
                    }
            };

        if (eazlAppData.label != null) {
            gridSizeDropdownsWorking.label = eazlAppData.label;
        } else {
            gridSizeDropdownsWorking.label = '';
        }

        if (eazlAppData.object_id != null) {
            gridSizeDropdownsWorking.value.id = eazlAppData.object_id;
        } else {
            gridSizeDropdownsWorking.value.id = -1;
        }

        if (eazlAppData.name != null) {
            gridSizeDropdownsWorking.value.name = eazlAppData.name;
        } else {
            gridSizeDropdownsWorking.value.name = '';
        }

        // Return the result
        return gridSizeDropdownsWorking;
    }

    loadBackgroundImageDropdowns(eazlAppData: EazlAppData): SelectItem {
        // Load BackgroundImageDropdowns: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadBackgroundImageDropdowns', '@Start');

        let backgroundImageDropdownsWorking =
            {
                label: '',
                value:
                    {
                        id: 0,
                        name: ''
                    }
            };

        if (eazlAppData.label != null) {
            backgroundImageDropdownsWorking.label = eazlAppData.label;
        } else {
            backgroundImageDropdownsWorking.label = '';
        }

        if (eazlAppData.object_id != null) {
            backgroundImageDropdownsWorking.value.id = eazlAppData.object_id;
        } else {
            backgroundImageDropdownsWorking.value.id = -1;
        }

        if (eazlAppData.code != null) {
            backgroundImageDropdownsWorking.value.name = eazlAppData.code;
        } else {
            backgroundImageDropdownsWorking.value.name = '';
        }

        // Return the result
        return backgroundImageDropdownsWorking;
    }

    loadTextMarginDropdown(eazlAppData: EazlAppData): SelectItem {
        // Load TextMarginDropdown: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadTextMarginDropdown', '@Start');

        let textMarginDropdownWorking =
            {
                label: '',
                value:
                    {
                        id: 0,
                        name: ''
                    }
            };

        if (eazlAppData.label != null) {
            textMarginDropdownWorking.label = eazlAppData.label;
        } else {
            textMarginDropdownWorking.label = '';
        }

        if (eazlAppData.object_id != null) {
            textMarginDropdownWorking.value.id = eazlAppData.object_id;
        } else {
            textMarginDropdownWorking.value.id = -1;
        }

        if (eazlAppData.name != null) {
            textMarginDropdownWorking.value.name = eazlAppData.name;
        } else {
            textMarginDropdownWorking.value.name = '';
        }

        // Return the result
        return textMarginDropdownWorking;
    }

    loadFontWeightDropdown(eazlAppData: EazlAppData): SelectItem {
        // Load FontWeightDropdown: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadFontWeightDropdown', '@Start');

        let fontWeightDropdownDropdownWorking =
            {
                label: '',
                value:
                    {
                        id: 0,
                        name: ''
                    }
            };

        if (eazlAppData.label != null) {
            fontWeightDropdownDropdownWorking.label = eazlAppData.label;
        } else {
            fontWeightDropdownDropdownWorking.label = '';
        }

        if (eazlAppData.object_id != null) {
            fontWeightDropdownDropdownWorking.value.id = eazlAppData.object_id;
        } else {
            fontWeightDropdownDropdownWorking.value.id = -1;
        }

        if (eazlAppData.name != null) {
            fontWeightDropdownDropdownWorking.value.name = eazlAppData.name;
        } else {
            fontWeightDropdownDropdownWorking.value.name = '';
        }

        // Return the result
        return fontWeightDropdownDropdownWorking;
    }

    loadTextPaddingDropdown(eazlAppData: EazlAppData): SelectItem {
        // Load TextPaddingDropdown: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadTextPaddingDropdown', '@Start');

        let fontWeightDropdownDropdownWorking =
            {
                label: '',
                value:
                    {
                        id: 0,
                        name: ''
                    }
            };

        if (eazlAppData.label != null) {
            fontWeightDropdownDropdownWorking.label = eazlAppData.label;
        } else {
            fontWeightDropdownDropdownWorking.label = '';
        }

        if (eazlAppData.object_id != null) {
            fontWeightDropdownDropdownWorking.value.id = eazlAppData.object_id;
        } else {
            fontWeightDropdownDropdownWorking.value.id = -1;
        }

        if (eazlAppData.name != null) {
            fontWeightDropdownDropdownWorking.value.name = eazlAppData.name;
        } else {
            fontWeightDropdownDropdownWorking.value.name = '';
        }

        // Return the result
        return fontWeightDropdownDropdownWorking;
    }

    loadTextPositionDropdown(eazlAppData: EazlAppData): SelectItem {
        // Load TextPositionDropdown: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadTextPositionDropdown', '@Start');

        let textPositionDropdownDropdownWorking =
            {
                label: '',
                value:
                    {
                        id: 0,
                        name: ''
                    }
            };

        if (eazlAppData.label != null) {
            textPositionDropdownDropdownWorking.label = eazlAppData.label;
        } else {
            textPositionDropdownDropdownWorking.label = '';
        }

        if (eazlAppData.object_id != null) {
            textPositionDropdownDropdownWorking.value.id = eazlAppData.object_id;
        } else {
            textPositionDropdownDropdownWorking.value.id = -1;
        }

        if (eazlAppData.name != null) {
            textPositionDropdownDropdownWorking.value.name = eazlAppData.name;
        } else {
            textPositionDropdownDropdownWorking.value.name = '';
        }

        // Return the result
        return textPositionDropdownDropdownWorking;
    }

    loadTextAlignDropdown(eazlAppData: EazlAppData): SelectItem {
        // Load TextAlignDropdown: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadTextAlignDropdown', '@Start');

        let textAlignDropdownDropdownWorking =
            {
                label: '',
                value:
                    {
                        id: 0,
                        name: ''
                    }
            };

        if (eazlAppData.label != null) {
            textAlignDropdownDropdownWorking.label = eazlAppData.label;
        } else {
            textAlignDropdownDropdownWorking.label = '';
        }

        if (eazlAppData.object_id != null) {
            textAlignDropdownDropdownWorking.value.id = eazlAppData.object_id;
        } else {
            textAlignDropdownDropdownWorking.value.id = -1;
        }

        if (eazlAppData.name != null) {
            textAlignDropdownDropdownWorking.value.name = eazlAppData.name;
        } else {
            textAlignDropdownDropdownWorking.value.name = '';
        }

        // Return the result
        return textAlignDropdownDropdownWorking;
    }

    loadImageSourceDropdown(eazlAppData: EazlAppData): SelectItem {
        // Load ImageSourceDropdown: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadImageSourceDropdown', '@Start');

        let imageSourceDropdownDropdownWorking =
            {
                label: '',
                value:
                    {
                        id: 0,
                        name: ''
                    }
            };

        if (eazlAppData.label != null) {
            imageSourceDropdownDropdownWorking.label = eazlAppData.label;
        } else {
            imageSourceDropdownDropdownWorking.label = '';
        }

        if (eazlAppData.object_id != null) {
            imageSourceDropdownDropdownWorking.value.id = eazlAppData.object_id;
        } else {
            imageSourceDropdownDropdownWorking.value.id = -1;
        }

        if (eazlAppData.name != null) {
            imageSourceDropdownDropdownWorking.value.name = eazlAppData.name;
        } else {
            imageSourceDropdownDropdownWorking.value.name = '';
        }

        // Return the result
        return imageSourceDropdownDropdownWorking;
    }

}

