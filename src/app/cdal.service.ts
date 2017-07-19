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
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { CanvasDate }                 from './date.services';
import { CanvasMessage }              from './model.canvasMessage';
import { CanvasMessageRecipient }     from './model.canvasMessageRecipient';
import { Dashboard }                  from './model.dashboards';
import { DashboardsPerUser }          from './model.dashboardsPerUser';
import { DashboardGroup }             from './model.dashboardGroup';
import { DashboardGroupMembership }   from './model.dashboardGroupMembership';
import { DashboardGroupRelationship } from './model.dashboardGroupRelationship';
import { DashboardTab }               from './model.dashboardTabs';
import { DashboardUserRelationship }  from './model.dashboardUserRelationship';
import { DataSourceUserAccess }       from './model.datasourceUserAccess';
import { DatasourcesPerUser }         from './model.datasourcesPerUser';
import { EazlAppData }                from './model.appdata';
import { EazlDataSourceUserAccess }   from './model.datasourceUserAccess';
import { EazlDatasourcesPerUser }     from './model.datasourcesPerUser';
import { EazlDashboard }              from './model.dashboards';
import { EazlCanvasMessage }          from './model.canvasMessage';
import { EazlCanvasMessageRecipient } from './model.canvasMessageRecipient';
import { EazlDashboardGroup }         from './model.dashboardGroup';
import { EazlDashboardGroupMembership }     from './model.dashboardGroupMembership';
import { EazlDashboardGroupRelationship }   from './model.dashboardGroupRelationship';
import { EazlDashboardTab }           from './model.dashboardTabs';
import { EazlDashboardsPerUser }            from './model.dashboardsPerUser';
import { EazlDashboardUserRelationship }    from './model.dashboardUserRelationship';
import { EazlFilter }                 from './model.filter';
import { EazlGroup }                  from './model.group';
import { EazlGroupDatasourceAccess }  from './model.groupDSaccess';
import { EazlNotification }           from './model.notification';
import { EazlPackageTask }            from './model.package.task';
import { EazlPersonalisation }        from '././model.personalisation';
import { EazlReport }                 from './model.report';
import { EazlReportHistory }          from './model.reportHistory';
import { EazlReportUserRelationship } from './model.reportUserRelationship';
import { EazlReportWidgetSet }        from './model.report.widgetSets';
import { EazlSystemConfiguration }    from './model.systemconfiguration';
import { EazlUser }                   from './model.user';
import { EazlUserGroupMembership }    from './model.userGroupMembership';
import { EazlWidget }                 from './model.widget';
import { EazlWidgetComment }          from './model.widget.comment';
import { EazlWidgetTemplate }         from './model.widgetTemplates';
import { Filter }                     from './model.filter';
import { GraphType }                  from './model.graph.type';
import { Group }                      from './model.group';
import { GroupDatasourceAccess }      from './model.groupDSaccess';
import { Notification }               from './model.notification';
import { PackageTask }                from './model.package.task';
import { Personalisation }            from '././model.personalisation';
import { Report }                     from './model.report';
import { ReportHistory }              from './model.reportHistory';
import { ReportUserRelationship }     from './model.reportUserRelationship';
import { ReportWidgetSet }            from './model.report.widgetSets';
import { SystemConfiguration }        from './model.systemconfiguration';
import { User }                       from './model.user';
import { UserGroupMembership }        from './model.userGroupMembership';
import { Widget }                     from './model.widget';
import { WidgetComment }              from './model.widget.comment';
import { WidgetTemplate }             from './model.widgetTemplates';
import { WidgetType }                 from './model.widget.type';

// TODO - add loadDataSources

@Injectable()
export class CDAL {

    constructor(
        private canvasDate: CanvasDate,
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

            if (eazlUser.profile.dashboard_id_at_startup != null) {
                userWorking.profile.dashboardIDStartup = eazlUser.profile.dashboard_id_at_startup;
            } else {
                userWorking.profile.dashboardIDStartup = -1;
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
                dashboard_id_at_startup: 0,
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
                eazlUserWorking.profile.profile_picture = user.profile.photoPath;
            } else {
                eazlUserWorking.profile.profile_picture = '';
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
                eazlUserWorking.profile.dashboard_id_at_startup = user.profile.dashboardIDStartup;
            } else {
                eazlUserWorking.profile.dashboard_id_at_startup = -1;
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

        if (eazlGroup.name != null) {
            groupWorking.groupDescription = eazlGroup.name;
        } else {
            groupWorking.groupDescription = '';
        }

        groupWorking.groupCreatedDateTime = '';
        groupWorking.groupCreatedUserName = '';
        groupWorking.groupUpdatedDateTime = '';
        groupWorking.groupUpdatedUserName = '';

        // Return the result
        return groupWorking;
    }

    loadDashboardTab(eazlDashboardTab: EazlDashboardTab): DashboardTab {
        // Load DashboardTab: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadDashboardTab', '@Start');

        let dashboardTabWorking = new DashboardTab();

        dashboardTabWorking.dashboardID = eazlDashboardTab.id;
        // TODO - replace with correct IDs
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

    loadCanvasMessage(eazlCanvasMessage: EazlCanvasMessage): CanvasMessage {
        // Load Group: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadCanvasMessage', '@Start');

        let canvasMessageWorking = new CanvasMessage();

        canvasMessageWorking.canvasMessageID = eazlCanvasMessage.id;

        if (eazlCanvasMessage.conversation_id != null) {
            canvasMessageWorking.canvasMessageConversationID = eazlCanvasMessage.conversation_id;
        } else {
            canvasMessageWorking.canvasMessageConversationID = 0;
        }

        if (eazlCanvasMessage.sender_username != null) {
            canvasMessageWorking.canvasMessageSenderUserName = eazlCanvasMessage.sender_username;
        } else {
            canvasMessageWorking.canvasMessageSenderUserName = '';
        }

        if (eazlCanvasMessage.sent_datetime != null) {
            canvasMessageWorking.canvasMessageSentDateTime = eazlCanvasMessage.sent_datetime;
        } else {
            canvasMessageWorking.canvasMessageSentDateTime = '';
        }

        if (eazlCanvasMessage.issystem_generated != null) {
            canvasMessageWorking.canvasMessageIsSystemGenerated = eazlCanvasMessage.issystem_generated;
        } else {
            canvasMessageWorking.canvasMessageIsSystemGenerated = false;
        }

        if (eazlCanvasMessage.dashboard_id != null) {
            canvasMessageWorking.canvasMessageDashboardID = eazlCanvasMessage.dashboard_id;
        } else {
            canvasMessageWorking.canvasMessageDashboardID = 0;
        }

        if (eazlCanvasMessage.report_id != null) {
            canvasMessageWorking.canvasMessageReportID = eazlCanvasMessage.report_id;
        } else {
            canvasMessageWorking.canvasMessageReportID = 0;
        }

        if (eazlCanvasMessage.widget_id != null) {
            canvasMessageWorking.canvasMessageWidgetID = eazlCanvasMessage.widget_id;
        } else {
            canvasMessageWorking.canvasMessageWidgetID = 0;
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

        if (eazlCanvasMessage.sent_to_me != null) {
            canvasMessageWorking.canvasMessageSentToMe = eazlCanvasMessage.sent_to_me;
        } else {
            canvasMessageWorking.canvasMessageSentToMe = false;
        }

        if (eazlCanvasMessage.my_status != null) {
            canvasMessageWorking.canvasMessageMyStatus = eazlCanvasMessage.my_status;
        } else {
            canvasMessageWorking.canvasMessageMyStatus = '';
        }

        // Return the result
        return canvasMessageWorking;
    }

    loadCanvasMessageRecipient(eazlCanvasMessageRecipient: EazlCanvasMessageRecipient): CanvasMessageRecipient {
        // Load MessageRecipient: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadCanvasMessageRecipient', '@Start');

        let canvasMessageRecipientWorking = new CanvasMessageRecipient();

        canvasMessageRecipientWorking.canvasMessageRecipientID = eazlCanvasMessageRecipient.id;

        if (eazlCanvasMessageRecipient.message_id != null) {
            canvasMessageRecipientWorking.canvasMessageID = eazlCanvasMessageRecipient.message_id;
        } else {
            canvasMessageRecipientWorking.canvasMessageID = 0;
        }

        if (eazlCanvasMessageRecipient.username != null) {
            canvasMessageRecipientWorking.userName = eazlCanvasMessageRecipient.username;
        } else {
            canvasMessageRecipientWorking.userName = '';
        }

        if (eazlCanvasMessageRecipient.recipient_status != null) {
            canvasMessageRecipientWorking.canvasMessageRecipientStatus = eazlCanvasMessageRecipient.recipient_status;
        } else {
            canvasMessageRecipientWorking.canvasMessageRecipientStatus = '';
        }

        if (eazlCanvasMessageRecipient.read_datetime != null) {
            canvasMessageRecipientWorking.canvasMessageReadDateTime = eazlCanvasMessageRecipient.read_datetime;
        } else {
            canvasMessageRecipientWorking.canvasMessageReadDateTime = '';
        }

        // Return the result
        return canvasMessageRecipientWorking;
    }

    loadDashboardGroup(eazlDashboardGroup: EazlDashboardGroup): DashboardGroup {
        // Load DashboardGroup: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadDashboardGroup', '@Start');

        let dashboardGroupWorking = new DashboardGroup();

        dashboardGroupWorking.dashboardGroupID = eazlDashboardGroup.id;

        if (eazlDashboardGroup.name != null) {
            dashboardGroupWorking.dashboardGroupName = eazlDashboardGroup.name;
        } else {
            dashboardGroupWorking.dashboardGroupName = '';
        }

        if (eazlDashboardGroup.description != null) {
            dashboardGroupWorking.dashboardGroupDescription = eazlDashboardGroup.description;
        } else {
            dashboardGroupWorking.dashboardGroupDescription = '';
        }

        if (eazlDashboardGroup.created_on != null) {
            dashboardGroupWorking.dashboardGroupCreatedDateTime = eazlDashboardGroup.created_on;
        } else {
            dashboardGroupWorking.dashboardGroupCreatedDateTime = '';
        }

        if (eazlDashboardGroup.created_by != null) {
            dashboardGroupWorking.dashboardGroupCreatedUserName = eazlDashboardGroup.created_by;
        } else {
            dashboardGroupWorking.dashboardGroupCreatedUserName = '';
        }

        if (eazlDashboardGroup.updated_on != null) {
            dashboardGroupWorking.dashboardGroupUpdatedDateTime = eazlDashboardGroup.updated_on;
        } else {
            dashboardGroupWorking.dashboardGroupUpdatedDateTime = '';
        }

        if (eazlDashboardGroup.updated_by != null) {
            dashboardGroupWorking.dashboardGroupUpdatedUserName = eazlDashboardGroup.updated_by;
        } else {
            dashboardGroupWorking.dashboardGroupUpdatedUserName = '';
        }


        // Return the result
        return dashboardGroupWorking;
    }

    loadDashboardGroupMembership(
        eazlDashboardGroupMembership: EazlDashboardGroupMembership
        ): DashboardGroupMembership {
        // Load DashboardGroupMembership: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadDashboardGroupMembership', '@Start');

        let dashboardGroupMembershipWorking = new DashboardGroupMembership();

        dashboardGroupMembershipWorking.dashboardGroupID = eazlDashboardGroupMembership.id;

        if (eazlDashboardGroupMembership.dashboard_id != null) {
            dashboardGroupMembershipWorking.dashboardID =
                eazlDashboardGroupMembership.dashboard_id;
        } else {
            dashboardGroupMembershipWorking.dashboardID = 0;
        }

        if (eazlDashboardGroupMembership.updated_on != null) {
            dashboardGroupMembershipWorking.dashboardGroupMembershipCreatedDateTime =
                eazlDashboardGroupMembership.updated_on;
        } else {
            dashboardGroupMembershipWorking.dashboardGroupMembershipCreatedDateTime = '';
        }

        if (eazlDashboardGroupMembership.updated_by != null) {
            dashboardGroupMembershipWorking.dashboardGroupMembershipCreatedUserName =
                eazlDashboardGroupMembership.updated_by;
        } else {
            dashboardGroupMembershipWorking.dashboardGroupMembershipCreatedUserName = '';
        }

        if (eazlDashboardGroupMembership.created_on != null) {
            dashboardGroupMembershipWorking.dashboardGroupMembershipUpdatedDateTime =
                eazlDashboardGroupMembership.created_on;
        } else {
            dashboardGroupMembershipWorking.dashboardGroupMembershipUpdatedDateTime = '';
        }

        if (eazlDashboardGroupMembership.created_by != null) {
            dashboardGroupMembershipWorking.dashboardGroupMembershipUpdatedUserName =
                eazlDashboardGroupMembership.created_by;
        } else {
            dashboardGroupMembershipWorking.dashboardGroupMembershipUpdatedUserName = '';
        }

        // Return the result
        return dashboardGroupMembershipWorking;
    }

    loadDashboardGroupRelationship(eazlDashboardGroupRelationship: EazlDashboardGroupRelationship): DashboardGroupRelationship {
        // Load DashboardGroupRelationship: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadDashboardGroupRelationship', '@Start');

        let DashboardGroupRelationshipWorking = new DashboardGroupRelationship();

        DashboardGroupRelationshipWorking.dashboardGroupRelationshipID =
            eazlDashboardGroupRelationship.id;

        if (eazlDashboardGroupRelationship.dashboard_id != null) {
            DashboardGroupRelationshipWorking.dashboardID =
                eazlDashboardGroupRelationship.dashboard_id;
        } else {
            DashboardGroupRelationshipWorking.dashboardID = 0;
        }

        if (eazlDashboardGroupRelationship.group_id != null) {
            DashboardGroupRelationshipWorking.groupID =
                eazlDashboardGroupRelationship.group_id;
        } else {
            DashboardGroupRelationshipWorking.groupID = 0;
        }

        if (eazlDashboardGroupRelationship.type != null) {
            DashboardGroupRelationshipWorking.dashboardGroupRelationshipType =
                eazlDashboardGroupRelationship.type;
        } else {
            DashboardGroupRelationshipWorking.dashboardGroupRelationshipType = '';
        }

        if (eazlDashboardGroupRelationship.rating != null) {
            DashboardGroupRelationshipWorking.dashboardGroupRelationshipRating =
                eazlDashboardGroupRelationship.rating;
        } else {
            DashboardGroupRelationshipWorking.dashboardGroupRelationshipRating = 0;
        }

        if (eazlDashboardGroupRelationship.updated_on != null) {
            DashboardGroupRelationshipWorking.dashboardGroupRelationshipUpdatedDateTime =
                eazlDashboardGroupRelationship.updated_on;
        } else {
            DashboardGroupRelationshipWorking.dashboardGroupRelationshipUpdatedDateTime = '';
        }

        if (eazlDashboardGroupRelationship.updated_by != null) {
            DashboardGroupRelationshipWorking.dashboardGroupRelationshipUpdatedUserName =
                eazlDashboardGroupRelationship.updated_by;
        } else {
            DashboardGroupRelationshipWorking.dashboardGroupRelationshipUpdatedUserName = '';
        }

        if (eazlDashboardGroupRelationship.created_on != null) {
            DashboardGroupRelationshipWorking.dashboardGroupRelationshipCreatedDateTime =
                eazlDashboardGroupRelationship.created_on;
        } else {
            DashboardGroupRelationshipWorking.dashboardGroupRelationshipCreatedDateTime = '';
        }

        if (eazlDashboardGroupRelationship.created_by != null) {
            DashboardGroupRelationshipWorking.dashboardGroupRelationshipCreatedUserName =
                eazlDashboardGroupRelationship.created_by;
        } else {
            DashboardGroupRelationshipWorking.dashboardGroupRelationshipCreatedUserName = '';
        }

        // Return the result
        return DashboardGroupRelationshipWorking;
    }

    // loadDashboard(eazlDashboard: EazlDashboard): Dashboard {
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

        if (eazlDashboard.description != null) {
            dashboardWorking.dashboardDescription = eazlDashboard.description;
        } else {
            dashboardWorking.dashboardDescription = '';
        }

        if (eazlDashboard.is_locked != null) {
            dashboardWorking.dashboardIsLocked = eazlDashboard.is_locked;
        } else {
            dashboardWorking.dashboardIsLocked = false;
        }

        if (eazlDashboard.open_tab_nr != null) {
            dashboardWorking.dashboardOpenTabNr = eazlDashboard.open_tab_nr;
        } else {
            dashboardWorking.dashboardOpenTabNr = 0;
        }

        if (eazlDashboard.password != null) {
            dashboardWorking.dashboardPassword = eazlDashboard.password;
        } else {
            dashboardWorking.dashboardPassword = '';
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

        // Calculated fields
        // -----------------

        //     dashboardWorking.dashboardNrGroups = 0;

        //     dashboardWorking.dashboardIsLiked = false;

        //     dashboardWorking.dashboardOwners = '';

        //     dashboardWorking.dashboardNrUsersSharedWith = 0;

        //     dashboardWorking.dashboardNrGroupsSharedWith = eazlDashboard.nr_groups_shared_with;

        // Return the result
        return dashboardWorking;
    }

    loadDashboardsPerUser(eazlDashboardsPerUser: EazlDashboardsPerUser): DashboardsPerUser {
        // Load DashboardsPerUser: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadDashboardsPerUser', '@Start');

        let dashboardsPerUserWorking = new DashboardsPerUser();

        dashboardsPerUserWorking.dashboardID = eazlDashboardsPerUser.dashboard_id;

        if (eazlDashboardsPerUser.name != null) {
            dashboardsPerUserWorking.dashboardName = eazlDashboardsPerUser.name;
        } else {
            dashboardsPerUserWorking.dashboardName = '';
        }

        if (eazlDashboardsPerUser.username != null) {
            dashboardsPerUserWorking.username = eazlDashboardsPerUser.username;
        } else {
            dashboardsPerUserWorking.username = '';
        }

        if (eazlDashboardsPerUser.accessVia != null) {
            dashboardsPerUserWorking.dashboardsPerUserAccessVia =
                eazlDashboardsPerUser.accessVia;
        } else {
            dashboardsPerUserWorking.dashboardsPerUserAccessVia = '';
        }

        if (eazlDashboardsPerUser.accessType != null) {
            dashboardsPerUserWorking.dashboardsPerUserAccessType =
                eazlDashboardsPerUser.accessType;
        } else {
            dashboardsPerUserWorking.dashboardsPerUserAccessType = '';
        }

        // Return the result
        return dashboardsPerUserWorking;
    }

    loadDashboardUserRelationship(
        eazlDashboardUserRelationship: EazlDashboardUserRelationship
        ): DashboardUserRelationship {
        // Load DashboardUserRelationship: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadDashboardUserRelationship', '@Start');

        let dashboardUserRelationshipWorking = new DashboardUserRelationship();

        dashboardUserRelationshipWorking.dashboardUserRelationshipID =
            eazlDashboardUserRelationship.id;

        if (eazlDashboardUserRelationship.dashboard_id != null) {
            dashboardUserRelationshipWorking.dashboardID =
                eazlDashboardUserRelationship.dashboard_id;
        } else {
            dashboardUserRelationshipWorking.dashboardID = 0;
        }

        if (eazlDashboardUserRelationship.username != null) {
            dashboardUserRelationshipWorking.userName =
                eazlDashboardUserRelationship.username;
        } else {
            dashboardUserRelationshipWorking.userName = '';
        }

        if (eazlDashboardUserRelationship.type != null) {
            dashboardUserRelationshipWorking.dashboardUserRelationshipType =
                eazlDashboardUserRelationship.type;
        } else {
            dashboardUserRelationshipWorking.dashboardUserRelationshipType = '';
        }

        if (eazlDashboardUserRelationship.rating != null) {
            dashboardUserRelationshipWorking.dashboardUserRelationshipRating =
                eazlDashboardUserRelationship.rating;
        } else {
            dashboardUserRelationshipWorking.dashboardUserRelationshipRating = 0;
        }

        if (eazlDashboardUserRelationship.created_on != null) {
            dashboardUserRelationshipWorking.dashboardUserRelationshipCreatedDateTime =
                eazlDashboardUserRelationship.created_on;
        } else {
            dashboardUserRelationshipWorking.dashboardUserRelationshipCreatedDateTime = '';
        }

        if (eazlDashboardUserRelationship.created_by != null) {
            dashboardUserRelationshipWorking.dashboardUserRelationshipCreatedUserName =
                eazlDashboardUserRelationship.created_by;
        } else {
            dashboardUserRelationshipWorking.dashboardUserRelationshipCreatedUserName = '';
        }

        if (eazlDashboardUserRelationship.updated_on != null) {
            dashboardUserRelationshipWorking.dashboardUserRelationshipUpdatedDateTime =
                eazlDashboardUserRelationship.updated_on;
        } else {
            dashboardUserRelationshipWorking.dashboardUserRelationshipUpdatedDateTime = '';
        }

        if (eazlDashboardUserRelationship.updated_by != null) {
            dashboardUserRelationshipWorking.dashboardUserRelationshipUpdatedUserName =
                eazlDashboardUserRelationship.updated_by;
        } else {
            dashboardUserRelationshipWorking.dashboardUserRelationshipUpdatedUserName = '';
        }

        // Return the result
        return dashboardUserRelationshipWorking;
    }

    loadDatasourcesPerUser(eazlDatasourcesPerUser: EazlDatasourcesPerUser): DatasourcesPerUser {
        // Load DatasourcesPerUser: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadDatasourcesPerUser', '@Start');

        let datasourcesPerUserWorking = new DatasourcesPerUser();

        datasourcesPerUserWorking.datasourceID = eazlDatasourcesPerUser.id;

        if (eazlDatasourcesPerUser.name != null) {
            datasourcesPerUserWorking.datasourceName = eazlDatasourcesPerUser.name;
        } else {
            datasourcesPerUserWorking.datasourceName = '';
        }

        if (eazlDatasourcesPerUser.username != null) {
            datasourcesPerUserWorking.userName = eazlDatasourcesPerUser.username;
        } else {
            datasourcesPerUserWorking.userName = '';
        }

        if (eazlDatasourcesPerUser.access_via != null) {
            datasourcesPerUserWorking.datasourcesPerUserAccessVia =
                eazlDatasourcesPerUser.access_via;
        } else {
            datasourcesPerUserWorking.datasourcesPerUserAccessVia = '';
        }

        if (eazlDatasourcesPerUser.access_type != null) {
            datasourcesPerUserWorking.datasourcesPerUserAccessType =
                eazlDatasourcesPerUser.access_type;
        } else {
            datasourcesPerUserWorking.datasourcesPerUserAccessType = '';
        }

        if (eazlDatasourcesPerUser.created_on != null) {
            datasourcesPerUserWorking.datasourcesPerUserCreatedDateTime =
                eazlDatasourcesPerUser.created_on;
        } else {
            datasourcesPerUserWorking.datasourcesPerUserCreatedDateTime = '';
        }

        if (eazlDatasourcesPerUser.created_by != null) {
            datasourcesPerUserWorking.datasourcesPerUserCreatedUserName =
                eazlDatasourcesPerUser.created_by;
        } else {
            datasourcesPerUserWorking.datasourcesPerUserCreatedUserName = '';
        }

        if (eazlDatasourcesPerUser.updated_on != null) {
            datasourcesPerUserWorking.datasourcesPerUserUpdatedDateTime =
                eazlDatasourcesPerUser.updated_on;
        } else {
            datasourcesPerUserWorking.datasourcesPerUserUpdatedDateTime = '';
        }

        if (eazlDatasourcesPerUser.updated_by != null) {
            datasourcesPerUserWorking.datasourcesPerUserUpdatedUserName =
                eazlDatasourcesPerUser.updated_by;
        } else {
            datasourcesPerUserWorking.datasourcesPerUserUpdatedUserName = '';
        }

        // Return the result
        return datasourcesPerUserWorking;
    }

    loadDataSourceUserAccess(eazlDataSourceUserAccess: EazlDataSourceUserAccess): DataSourceUserAccess {
        // Load DataSourceUserAccess: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadDataSourceUserAccess', '@Start');

        let dataSourceUserAccessWorking = new DataSourceUserAccess();

        dataSourceUserAccessWorking.datasourceID = eazlDataSourceUserAccess.id;

        if (eazlDataSourceUserAccess.username != null) {
            dataSourceUserAccessWorking.userName = eazlDataSourceUserAccess.username;
        } else {
            dataSourceUserAccessWorking.userName = '';
        }

        if (eazlDataSourceUserAccess.type != null) {
            dataSourceUserAccessWorking.dataSourceUserAccessType =
                eazlDataSourceUserAccess.type;
        } else {
            dataSourceUserAccessWorking.dataSourceUserAccessType = '';
        }

        if (eazlDataSourceUserAccess.scope != null) {
            dataSourceUserAccessWorking.dataSourceUserAccessScope =
                eazlDataSourceUserAccess.scope;
        } else {
            dataSourceUserAccessWorking.dataSourceUserAccessScope = '';
        }

        if (eazlDataSourceUserAccess.created_on != null) {
            dataSourceUserAccessWorking.datasourceUserAccessCreatedDateTime =
                eazlDataSourceUserAccess.created_on;
        } else {
            dataSourceUserAccessWorking.datasourceUserAccessCreatedDateTime = '';
        }

        if (eazlDataSourceUserAccess.created_by != null) {
            dataSourceUserAccessWorking.datasourceUserAccessCreatedUserName =
                eazlDataSourceUserAccess.created_by;
        } else {
            dataSourceUserAccessWorking.datasourceUserAccessCreatedUserName = '';
        }

        if (eazlDataSourceUserAccess.updated_on != null) {
            dataSourceUserAccessWorking.datasourceUserAccessUpdatedDateTime =
                eazlDataSourceUserAccess.updated_on;
        } else {
            dataSourceUserAccessWorking.datasourceUserAccessUpdatedDateTime = '';
        }

        if (eazlDataSourceUserAccess.updated_by != null) {
            dataSourceUserAccessWorking.datasourceUserAccessUpdatedUserName =
                eazlDataSourceUserAccess.updated_by;
        } else {
            dataSourceUserAccessWorking.datasourceUserAccessUpdatedUserName = '';
        }

        // Return the result
        return dataSourceUserAccessWorking;
    }

    loadFilter(eazlFilter: EazlFilter): Filter {
        // Load Filter: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadFilter', '@Start');

        let filterWorking = new Filter();

        filterWorking.filterID = eazlFilter.id;

        if (eazlFilter.has_atleast_one_filter != null) {
            filterWorking.hasAtLeastOneFilter = eazlFilter.has_atleast_one_filter;
        } else {
            filterWorking.hasAtLeastOneFilter = false;
        }

        if (eazlFilter.owner != null) {
            filterWorking.ownerUserName = eazlFilter.owner;
        } else {
            filterWorking.ownerUserName = '';
        }

        if (eazlFilter.description != null) {
            filterWorking.description = eazlFilter.description;
        } else {
            filterWorking.description = '';
        }

        // Return the result
        return filterWorking;
    }

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
            groupDatasourceAccessWorking.datasourceID = 0;
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

    loadNotification(eazlNotification: EazlNotification): Notification {
        // Load Notification: move data Eazl -> Canvas
        // TODO - do we really need this guy (see CanvasMessage), else add fields like id
        this.globalFunctionService.printToConsole(this.constructor.name,'loadNotification', '@Start');

        let notificationWorking = new Notification();

        notificationWorking.notificationID = eazlNotification.id;

        if (eazlNotification.author != null) {
            notificationWorking.author = eazlNotification.author;
        } else {
            notificationWorking.author = '';
        }

        if (eazlNotification.date_send != null) {
            notificationWorking.dateSend = eazlNotification.date_send;
        } else {
            notificationWorking.dateSend = '';
        }

        if (eazlNotification.message_type != null) {
            notificationWorking.messageType = eazlNotification.message_type;
        } else {
            notificationWorking.messageType = '';
        }

        if (eazlNotification.message != null) {
            notificationWorking.message = eazlNotification.message;
        } else {
            notificationWorking.message = '';
        }

        // Return the result
        return notificationWorking;
    }

    loadPackageTask(eazlPackageTask: EazlPackageTask): PackageTask {
        // Load PackageTask: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadNotification', '@Start');

        let packageTaskWorking = new PackageTask();

        packageTaskWorking.packageTaskID = eazlPackageTask.id;

        if (eazlPackageTask.celery_task_id != null) {
            packageTaskWorking.packageTaskCeleryTaskID = eazlPackageTask.celery_task_id;
        } else {
            packageTaskWorking.packageTaskCeleryTaskID = 0;
        }

        if (eazlPackageTask.package != null) {
            packageTaskWorking.packageTaskPackage = eazlPackageTask.package;
        } else {
            packageTaskWorking.packageTaskPackage = '';
        }

        if (eazlPackageTask.user != null) {
            packageTaskWorking.packageTaskUser = eazlPackageTask.user;
        } else {
            packageTaskWorking.packageTaskUser = '';
        }

        if (eazlPackageTask.date_added != null) {
            packageTaskWorking.packageTaskCreatedDateTime = eazlPackageTask.date_added.toString();
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

        if (eazlReport.name != null) {
            ReportWorking.reportName = eazlReport.name;
        } else {
            ReportWorking.reportName = '';
        }

        if (eazlReport.description != null) {
            ReportWorking.description = eazlReport.description;
        } else {
            ReportWorking.description = '';
        }

        if (eazlReport.parameters != null) {
            ReportWorking.reportParameters = eazlReport.parameters;
        } else {
            ReportWorking.reportParameters = '';
        }

        if (eazlReport.datasource_id != null) {
            ReportWorking.dataSourceID = eazlReport.datasource_id;
        } else {
            ReportWorking.dataSourceID = 0;
        }

        if (eazlReport.datasource_parameters != null) {
            ReportWorking.dataSourceParameters = eazlReport.datasource_parameters;
        } else {
            ReportWorking.dataSourceParameters = '';
        }

        if (eazlReport.report_fields != null) {
            ReportWorking.reportFields = eazlReport.report_fields;
        } else {
            ReportWorking.reportFields = [];
        }

        if (eazlReport.report_data != null) {
            ReportWorking.reportData = eazlReport.report_data;
        } else {
            ReportWorking.reportData = [];
        }

        if (eazlReport.created_on != null) {
            ReportWorking.reportCreatedDateTime = eazlReport.created_on;
        } else {
            ReportWorking.reportCreatedDateTime = '';
        }

        if (eazlReport.created_by != null) {
            ReportWorking.reportCreatedUserName = eazlReport.created_by;
        } else {
            ReportWorking.reportCreatedUserName = '';
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
            reportWidgetSetWorking.reportID = 0;
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

        if (eazlReportHistory.username != null) {
            reportHistoryWorking.userName = eazlReportHistory.username;
        } else {
            reportHistoryWorking.userName = '';
        }

        if (eazlReportHistory.report_id != null) {
            reportHistoryWorking.reportID = eazlReportHistory.report_id;
        } else {
            reportHistoryWorking.reportID = 0;
        }

        if (eazlReportHistory.datasource_id != null) {
            reportHistoryWorking.datasourceID = eazlReportHistory.datasource_id;
        } else {
            reportHistoryWorking.datasourceID = 0;
        }

        if (eazlReportHistory.start_on != null) {
            reportHistoryWorking.reportHistoryStartDateTime = eazlReportHistory.start_on;
        } else {
            reportHistoryWorking.reportHistoryStartDateTime = '';
        }

        if (eazlReportHistory.end_on != null) {
            reportHistoryWorking.reportHistoryEndDateTime = eazlReportHistory.end_on;
        } else {
            reportHistoryWorking.reportHistoryEndDateTime = '';
        }

        if (eazlReportHistory.status != null) {
            reportHistoryWorking.reportHistoryStatus = eazlReportHistory.status;
        } else {
            reportHistoryWorking.reportHistoryStatus = '';
        }

        if (eazlReportHistory.nr_rows_returned != null) {
            reportHistoryWorking.reportHistoryNrRowsReturned = eazlReportHistory.nr_rows_returned;
        } else {
            reportHistoryWorking.reportHistoryNrRowsReturned = 0;
        }

        if (eazlReportHistory.comments != null) {
            reportHistoryWorking.reportHistoryComments = eazlReportHistory.comments;
        } else {
            reportHistoryWorking.reportHistoryComments = '';
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
            ReportUserRelationshipWorking.reportID = 0;
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
        
        if (eazlSystemConfiguration.record_id != null) {
            systemConfigurationWorking.recordID = eazlSystemConfiguration.record_id;
        } else {
            systemConfigurationWorking.recordID = 0;
        }

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

        if (systemConfiguration.recordID != null) {
            eazlSystemConfigurationWorking.record_id = systemConfiguration.recordID;
        } else {
            eazlSystemConfigurationWorking.record_id = 0;
        }

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

    loadPersonalisation(eazlPersonalisation: EazlPersonalisation): Personalisation {
        // Load Personalisation: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadPersonalisation', '@Start');

        let personalisationWorking = new Personalisation();

        personalisationWorking.personalisationID = eazlPersonalisation.id;

        if (eazlPersonalisation.record_id != null) {
            personalisationWorking.personalisationRecordID = eazlPersonalisation.record_id;
        } else {
            personalisationWorking.personalisationRecordID = 0;
        }
        if (eazlPersonalisation.dashboard_id_at_startup != null) {
            personalisationWorking.dashboardIDStartup = eazlPersonalisation.dashboard_id_at_startup;
        } else {
            personalisationWorking.dashboardIDStartup = 0;
        }

        if (eazlPersonalisation.environment != null) {
            personalisationWorking.environment = eazlPersonalisation.environment;
        } else {
            personalisationWorking.environment = '';
        }

        if (eazlPersonalisation.average_warning_runtime != null) {
            personalisationWorking.averageWarningRuntime = eazlPersonalisation.average_warning_runtime;
        } else {
            personalisationWorking.averageWarningRuntime = 0;
        }

        if (eazlPersonalisation.frontend_color_scheme != null) {
            personalisationWorking.frontendColorScheme = eazlPersonalisation.frontend_color_scheme;
        } else {
            personalisationWorking.frontendColorScheme = '';
        }

        if (eazlPersonalisation.default_widget_configuration != null) {
            personalisationWorking.defaultWidgetConfiguration = eazlPersonalisation.default_widget_configuration;
        } else {
            personalisationWorking.defaultWidgetConfiguration = '';
        }

        if (eazlPersonalisation.default_report_filters != null) {
            personalisationWorking.defaultReportFilters = eazlPersonalisation.default_report_filters;
        } else {
            personalisationWorking.defaultReportFilters = '';
        }

        if (eazlPersonalisation.growl_sticky != null) {
            personalisationWorking.growlSticky = eazlPersonalisation.growl_sticky;
        } else {
            personalisationWorking.growlSticky = false;
        }

        if (eazlPersonalisation.growl_life != null) {
            personalisationWorking.growlLife = eazlPersonalisation.growl_life;
        } else {
            personalisationWorking.growlLife = 0;
        }

        if (eazlPersonalisation.grid_size != null) {
            personalisationWorking.gridSize = eazlPersonalisation.grid_size;
        } else {
            personalisationWorking.gridSize = 0;
        }

        if (eazlPersonalisation.snap_to_grid != null) {
            personalisationWorking.snapToGrid = eazlPersonalisation.snap_to_grid;
        } else {
            personalisationWorking.snapToGrid = false;
        }

        // Return the result
        return personalisationWorking;
    }

    savePersonalisation(personalisation: Personalisation): EazlPersonalisation {
        // Load Personalisation: move data Canvas -> Eazl
        this.globalFunctionService.printToConsole(this.constructor.name,'savePersonalisation', '@Start');

        let eazlPersonalisationWorking = new EazlPersonalisation();

        eazlPersonalisationWorking.record_id = personalisation.personalisationID;

        if (personalisation.personalisationRecordID != null) {
            eazlPersonalisationWorking.record_id = personalisation.personalisationRecordID;
        } else {
            eazlPersonalisationWorking.record_id = 0;
        }

        if (personalisation.dashboardIDStartup != null) {
            eazlPersonalisationWorking.dashboard_id_at_startup = personalisation.dashboardIDStartup;
        } else {
            eazlPersonalisationWorking.dashboard_id_at_startup = 0;
        }

        if (personalisation.environment != null) {
            eazlPersonalisationWorking.environment = personalisation.environment;
        } else {
            eazlPersonalisationWorking.environment = '';
        }

        if (personalisation.averageWarningRuntime != null) {
            eazlPersonalisationWorking.average_warning_runtime = personalisation.averageWarningRuntime;
        } else {
            eazlPersonalisationWorking.average_warning_runtime = 0;
        }

        if (personalisation.frontendColorScheme != null) {
            eazlPersonalisationWorking.frontend_color_scheme = personalisation.frontendColorScheme;
        } else {
            eazlPersonalisationWorking.frontend_color_scheme = '';
        }

        if (personalisation.defaultWidgetConfiguration != null) {
            eazlPersonalisationWorking.default_widget_configuration = personalisation.defaultWidgetConfiguration;
        } else {
            eazlPersonalisationWorking.default_widget_configuration = '';
        }

        if (personalisation.defaultReportFilters != null) {
            eazlPersonalisationWorking.default_report_filters = personalisation.defaultReportFilters;
        } else {
            eazlPersonalisationWorking.default_report_filters = '';
        }

        if (personalisation.growlSticky != null) {
            eazlPersonalisationWorking.growl_sticky = personalisation.growlSticky;
        } else {
            eazlPersonalisationWorking.growl_sticky = false;
        }

        if (personalisation.growlLife != null) {
            eazlPersonalisationWorking.growl_life = personalisation.growlLife;
        } else {
            eazlPersonalisationWorking.growl_life = 0;
        }

        if (personalisation.gridSize != null) {
            eazlPersonalisationWorking.grid_size = personalisation.gridSize;
        } else {
            eazlPersonalisationWorking.grid_size = 0;
        }

        if (personalisation.snapToGrid != null) {
            eazlPersonalisationWorking.snap_to_grid = personalisation.snapToGrid;
        } else {
            eazlPersonalisationWorking.snap_to_grid = false;
        }

        // Return the result
        return eazlPersonalisationWorking;
    }

    loadUserGroupMembership(eazlUserGroupMembership: EazlUserGroupMembership): UserGroupMembership {
        // Load UserGroupMembership: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadUserGroupMembership', '@Start');

        let userGroupMembershipWorking = new UserGroupMembership();

        userGroupMembershipWorking.groupID = eazlUserGroupMembership.id;

        if (eazlUserGroupMembership.username != null) {
            userGroupMembershipWorking.userName = eazlUserGroupMembership.username;
        } else {
            userGroupMembershipWorking.userName = '';
        }

        if (eazlUserGroupMembership.created_on != null) {
            userGroupMembershipWorking.userGroupMembershipCreatedDateTime =
                eazlUserGroupMembership.created_on;
        } else {
            userGroupMembershipWorking.userGroupMembershipCreatedDateTime = '';
        }

        if (eazlUserGroupMembership.created_by != null) {
            userGroupMembershipWorking.userGroupMembershipCreatedUserName =
                eazlUserGroupMembership.created_by;
        } else {
            userGroupMembershipWorking.userGroupMembershipCreatedUserName = '';
        }

        if (eazlUserGroupMembership.updated_on != null) {
            userGroupMembershipWorking.userGroupMembershipUpdatedDateTime =
                eazlUserGroupMembership.updated_on;
        } else {
            userGroupMembershipWorking.userGroupMembershipUpdatedDateTime = '';
        }

        if (eazlUserGroupMembership.updated_by != null) {
            userGroupMembershipWorking.userGroupMembershipUpdatedUserName =
                eazlUserGroupMembership.updated_by;
        } else {
            userGroupMembershipWorking.userGroupMembershipUpdatedUserName = '';
        }

        // Return the result
        return userGroupMembershipWorking;
    }      systemConfigurationID

    loadWidgetComment(eazlWidgetComment: EazlWidgetComment): WidgetComment {
        // Load WidgetComment: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadWidgetComment', '@Start');

        let widgetCommentWorking = new WidgetComment();

        widgetCommentWorking.widgetCommentID = eazlWidgetComment.id;

        if (eazlWidgetComment.widget_id != null) {
            widgetCommentWorking.widgetID = eazlWidgetComment.widget_id;
        } else {
            widgetCommentWorking.widgetID = 0;
        }

        if (eazlWidgetComment.thread_id != null) {
            widgetCommentWorking.widgetCommentThreadID = eazlWidgetComment.thread_id;
        } else {
            widgetCommentWorking.widgetCommentThreadID = 0;
        }

        if (eazlWidgetComment.created_on != null) {
            widgetCommentWorking.widgetCommentCreatedDateTime = eazlWidgetComment.created_on;
        } else {
            widgetCommentWorking.widgetCommentCreatedDateTime = '';
        }

        if (eazlWidgetComment.created_by != null) {
            widgetCommentWorking.widgetCommentCreatedUserName = eazlWidgetComment.created_by;
        } else {
            widgetCommentWorking.widgetCommentCreatedUserName = '';
        }

        if (eazlWidgetComment.heading != null) {
            widgetCommentWorking.widgetCommentHeading = eazlWidgetComment.heading;
        } else {
            widgetCommentWorking.widgetCommentHeading = '';
        }

        if (eazlWidgetComment.body != null) {
            widgetCommentWorking.widgetCommentBody = eazlWidgetComment.body;
        } else {
            widgetCommentWorking.widgetCommentBody = '';
        }

        // Return the result
        return widgetCommentWorking;
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

        if (eazlWidgetTemplate.vega_parameters_vega_graph_height != null) {
            widgetTemplateWorking.vegaParameters.vegaGraphHeight = eazlWidgetTemplate.vega_parameters_vega_graph_height;
        } else {
            widgetTemplateWorking.vegaParameters.vegaGraphHeight = 0;
        }

        if (eazlWidgetTemplate.vega_parameters_vega_graph_width != null) {
            widgetTemplateWorking.vegaParameters.vegaGraphWidth =
                eazlWidgetTemplate.vega_parameters_vega_graph_width;
        } else {
            widgetTemplateWorking.vegaParameters.vegaGraphWidth = 0;
        }

        if (eazlWidgetTemplate.vega_parameters_vega_graph_padding != null) {
            widgetTemplateWorking.vegaParameters.vegaGraphPadding =
                eazlWidgetTemplate.vega_parameters_vega_graph_padding;
        } else {
            widgetTemplateWorking.vegaParameters.vegaGraphPadding = 0;
        }

        if (eazlWidgetTemplate.vega_parameters_vega_has_signals != null) {
            widgetTemplateWorking.vegaParameters.vegaHasSignals =
                eazlWidgetTemplate.vega_parameters_vega_has_signals;
        } else {
            widgetTemplateWorking.vegaParameters.vegaHasSignals = false;
        }

        if (eazlWidgetTemplate.vega_parameters_vega_xcolumn != null) {
            widgetTemplateWorking.vegaParameters.vegaXcolumn =
                eazlWidgetTemplate.vega_parameters_vega_xcolumn;
        } else {
            widgetTemplateWorking.vegaParameters.vegaXcolumn = '';
        }

        if (eazlWidgetTemplate.vega_parameters_vega_ycolumn != null) {
            widgetTemplateWorking.vegaParameters.vegaYcolumn =
                eazlWidgetTemplate.vega_parameters_vega_ycolumn;
        } else {
            widgetTemplateWorking.vegaParameters.vegaYcolumn = '';
        }

        if (eazlWidgetTemplate.vega_parameters_vega_fill_color != null) {
            widgetTemplateWorking.vegaParameters.vegaFillColor =
                eazlWidgetTemplate.vega_parameters_vega_fill_color;
        } else {
            widgetTemplateWorking.vegaParameters.vegaFillColor = '';
        }

        if (eazlWidgetTemplate.vega_parameters_vega_hover_color != null) {
            widgetTemplateWorking.vegaParameters.vegaHoverColor =
                eazlWidgetTemplate.vega_parameters_vega_hover_color;
        } else {
            widgetTemplateWorking.vegaParameters.vegaHoverColor = '';
        }

        if (eazlWidgetTemplate.vega_spec != null) {
            widgetTemplateWorking.vegaSpec = eazlWidgetTemplate.vega_spec;
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
            widgetWorking.graph.graphID = 0;
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
            widgetWorking.properties.widgetID = 0;
        }

        if (eazlWidget.properties_dashboard_id != null) {
            widgetWorking.properties.dashboardID = eazlWidget.properties_dashboard_id;
        } else {
            widgetWorking.properties.dashboardID = 0;
        }

        if (eazlWidget.properties_dashboard_tab_id != null) {
            widgetWorking.properties.dashboardTabID = eazlWidget.properties_dashboard_tab_id;
        } else {
            widgetWorking.properties.dashboardTabID = 0;
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
            widgetWorking.properties.widgetReportID = 0;
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
            widgetWorking.properties.widgetTypeID = 0;
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

        if (eazlAppData.record_id != null) {
            widgetTypesWorking.value.id = eazlAppData.record_id;
        } else {
            widgetTypesWorking.value.id = 0;
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

        if (eazlAppData.record_id != null) {
            graphTypesWorking.value.id = eazlAppData.record_id;
        } else {
            graphTypesWorking.value.id = 0;
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

        if (eazlAppData.record_id != null) {
            borderDropdownsWorking.value.id = eazlAppData.record_id;
        } else {
            borderDropdownsWorking.value.id = 0;
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

        if (eazlAppData.record_id != null) {
            boxShadowDropdownsWorking.value.id = eazlAppData.record_id;
        } else {
            boxShadowDropdownsWorking.value.id = 0;
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

        if (eazlAppData.record_id != null) {
            fontSizeDropdownsWorking.value.id = eazlAppData.record_id;
        } else {
            fontSizeDropdownsWorking.value.id = 0;
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

        if (eazlAppData.record_id != null) {
            gridSizeDropdownsWorking.value.id = eazlAppData.record_id;
        } else {
            gridSizeDropdownsWorking.value.id = 0;
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

        if (eazlAppData.record_id != null) {
            backgroundImageDropdownsWorking.value.id = eazlAppData.record_id;
        } else {
            backgroundImageDropdownsWorking.value.id = 0;
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

        if (eazlAppData.record_id != null) {
            textMarginDropdownWorking.value.id = eazlAppData.record_id;
        } else {
            textMarginDropdownWorking.value.id = 0;
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

        if (eazlAppData.record_id != null) {
            fontWeightDropdownDropdownWorking.value.id = eazlAppData.record_id;
        } else {
            fontWeightDropdownDropdownWorking.value.id = 0;
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

        if (eazlAppData.record_id != null) {
            fontWeightDropdownDropdownWorking.value.id = eazlAppData.record_id;
        } else {
            fontWeightDropdownDropdownWorking.value.id = 0;
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

        if (eazlAppData.record_id != null) {
            textPositionDropdownDropdownWorking.value.id = eazlAppData.record_id;
        } else {
            textPositionDropdownDropdownWorking.value.id = 0;
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

        if (eazlAppData.record_id != null) {
            textAlignDropdownDropdownWorking.value.id = eazlAppData.record_id;
        } else {
            textAlignDropdownDropdownWorking.value.id = 0;
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

        if (eazlAppData.record_id != null) {
            imageSourceDropdownDropdownWorking.value.id = eazlAppData.record_id;
        } else {
            imageSourceDropdownDropdownWorking.value.id = 0;
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

