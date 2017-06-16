// Canvas Data Access Layer
// - load: converts API data to Canvas data format
// - set: reverse of load

import { Injectable }                 from '@angular/core';

// Our Services
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
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
import { EazlDataSourceUserAccess }   from './model.datasourceUserAccess';
import { DatasourcesPerUser }         from './model.datasourcesPerUser';
import { EazlDatasourcesPerUser }     from './model.datasourcesPerUser';
import { EazlDashboard }              from './model.dashboards';
import { EazlCanvasMessage }          from './model.canvasMessage';
import { EazlCanvasMessageRecipient } from './model.canvasMessageRecipient';
import { EazlDashboardGroup }         from './model.dashboardGroup';
import { EazlDashboardGroupMembership }     from './model.dashboardGroupMembership';
import { EazlDashboardGroupRelationship }   from './model.dashboardGroupRelationship';
import { EazlDashboardTab }           from './model.dashboardTabs';
import { EazlDashboardsPerUser }      from './model.dashboardsPerUser';
import { EazlDashboardUserRelationship } from './model.dashboardUserRelationship';
import { EazlFilter }                 from './model.filter';
import { EazlGroup }                  from './model.group';
import { EazlNotification }           from './model.notification';
import { EazlReport }                 from './model.report';
import { EazlReportHistory }          from './model.reportHistory';
import { EazlReportUserRelationship } from './model.reportUserRelationship';
import { EazlReportWidgetSet }        from './model.report.widgetSets';
import { EazlUser }                   from './model.user';
import { Filter }                     from './model.filter';
import { Group }                      from './model.group';
import { GroupDatasourceAccess }      from './model.groupDSaccess';
import { EazlGroupDatasourceAccess }  from './model.groupDSaccess';
import { Notification }               from './model.notification';
import { Report }                     from './model.report';
import { ReportHistory }              from './model.reportHistory';
import { ReportUserRelationship }     from './model.reportUserRelationship';
import { ReportWidgetSet }            from './model.report.widgetSets';
import { User }                       from './model.user';

// TODO - add loadDataSources

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
        groupWorking.groupCreatedUserID = '';
        groupWorking.groupUpdatedDateTime = '';
        groupWorking.groupUpdatedUserID = '';
        
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
            canvasMessageWorking.canvasMessageSenderUserID = eazlCanvasMessage.sender_username;
        } else {
            canvasMessageWorking.canvasMessageSenderUserID = '';
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

    loadMessageRecipient(eazlCanvasMessageRecipient: EazlCanvasMessageRecipient): CanvasMessageRecipient {
        // Load MessageRecipient: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadMessageRecipient', '@Start');
        
        let canvasMessageRecipientWorking = new CanvasMessageRecipient();
        
        canvasMessageRecipientWorking.canvasMessageRecipientID = eazlCanvasMessageRecipient.id;

        if (eazlCanvasMessageRecipient.message_id != null) {
            canvasMessageRecipientWorking.canvasMessageID = eazlCanvasMessageRecipient.message_id;
        } else {
            canvasMessageRecipientWorking.canvasMessageID = 0;
        }

        if (eazlCanvasMessageRecipient.username != null) {
            canvasMessageRecipientWorking.username = eazlCanvasMessageRecipient.username;
        } else {
            canvasMessageRecipientWorking.username = '';
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
            dashboardGroupWorking.dashboardGroupCreatedUserID = eazlDashboardGroup.created_by;
        } else {
            dashboardGroupWorking.dashboardGroupCreatedUserID = '';
        }
    
        if (eazlDashboardGroup.updated_on != null) {
            dashboardGroupWorking.dashboardGroupUpdatedDateTime = eazlDashboardGroup.updated_on;
        } else {
            dashboardGroupWorking.dashboardGroupUpdatedDateTime = '';
        }
    
        if (eazlDashboardGroup.updated_by != null) {
            dashboardGroupWorking.dashboardGroupUpdatedUserID = eazlDashboardGroup.updated_by;
        } else {
            dashboardGroupWorking.dashboardGroupUpdatedUserID = '';
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
            dashboardGroupMembershipWorking.dashboardGroupMembershipCreatedUserID = 
                eazlDashboardGroupMembership.updated_by;
        } else {
            dashboardGroupMembershipWorking.dashboardGroupMembershipCreatedUserID = '';
        }

        if (eazlDashboardGroupMembership.created_on != null) {
            dashboardGroupMembershipWorking.dashboardGroupMembershipUpdatedDateTime = 
                eazlDashboardGroupMembership.created_on;
        } else {
            dashboardGroupMembershipWorking.dashboardGroupMembershipUpdatedDateTime = '';
        }
    
        if (eazlDashboardGroupMembership.created_by != null) {
            dashboardGroupMembershipWorking.dashboardGroupMembershipUpdatedUserID = 
                eazlDashboardGroupMembership.created_by;
        } else {
            dashboardGroupMembershipWorking.dashboardGroupMembershipUpdatedUserID = '';
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
            DashboardGroupRelationshipWorking.dashboardGroupRelationshipUpdatedUserID = 
                eazlDashboardGroupRelationship.updated_by;
        } else {
            DashboardGroupRelationshipWorking.dashboardGroupRelationshipUpdatedUserID = '';
        }

        if (eazlDashboardGroupRelationship.created_on != null) {
            DashboardGroupRelationshipWorking.dashboardGroupRelationshipCreatedDateTime = 
                eazlDashboardGroupRelationship.created_on;
        } else {
            DashboardGroupRelationshipWorking.dashboardGroupRelationshipCreatedDateTime = '';
        }

        if (eazlDashboardGroupRelationship.created_by != null) {
            DashboardGroupRelationshipWorking.dashboardGroupRelationshipCreatedUserID = 
                eazlDashboardGroupRelationship.created_by;
        } else {
            DashboardGroupRelationshipWorking.dashboardGroupRelationshipCreatedUserID = '';
        }
        
        // Return the result
        return DashboardGroupRelationshipWorking;
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

        if (eazlDashboard.is_containerheader_dark != null) {
            dashboardWorking.isContainerHeaderDark = eazlDashboard.is_containerheader_dark;
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

        if (eazlDashboard.background_image_src != null) {
            dashboardWorking.dashboardBackgroundImageSrc = eazlDashboard.background_image_src;
        } else {
            dashboardWorking.dashboardBackgroundImageSrc = '';
        }

        if (eazlDashboard.comments != null) {
            dashboardWorking.dashboardComments = eazlDashboard.comments;
        } else {
            dashboardWorking.dashboardComments = '';
        }

        if (eazlDashboard.default_export_filetype != null) {
            dashboardWorking.dashboardDefaultExportFileType = eazlDashboard.default_export_filetype;
        } else {
            dashboardWorking.dashboardDefaultExportFileType = '';
        }

        if (eazlDashboard.description != null) {
            dashboardWorking.dashboardDescription = eazlDashboard.description;
        } else {
            dashboardWorking.dashboardDescription = '';
        }

        if (eazlDashboard.nr_groups != null) {
            dashboardWorking.dashboardNrGroups = eazlDashboard.nr_groups;
        } else {
            dashboardWorking.dashboardNrGroups = 0;
        }

        if (eazlDashboard.is_locked != null) {
            dashboardWorking.dashboardIsLocked = eazlDashboard.is_locked;
        } else {
            dashboardWorking.dashboardIsLocked = false;
        }

        if (eazlDashboard.is_liked != null) {
            dashboardWorking.dashboardIsLiked = eazlDashboard.is_liked;
        } else {
            dashboardWorking.dashboardIsLiked = false;
        }

        if (eazlDashboard.open_tab_nr != null) {
            dashboardWorking.dashboardOpenTabNr = eazlDashboard.open_tab_nr;
        } else {
            dashboardWorking.dashboardOpenTabNr = 0;
        }

        if (eazlDashboard.owner_userid != null) {
            dashboardWorking.dashboardOwnerUserID = eazlDashboard.owner_userid;
        } else {
            dashboardWorking.dashboardOwnerUserID = '';
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

        if (eazlDashboard.nrUsers_shared_with != null) {
            dashboardWorking.dashboardNrUsersSharedWith = eazlDashboard.nrUsers_shared_with;
        } else {
            dashboardWorking.dashboardNrUsersSharedWith = 0;
        }

        if (eazlDashboard.nr_groups_shared_with != null) {
            dashboardWorking.dashboardNrGroupsSharedWith = eazlDashboard.nr_groups_shared_with;
        } else {
            dashboardWorking.dashboardNrGroupsSharedWith = 0;
        }

        if (eazlDashboard.system_message != null) {
            dashboardWorking.dashboardSystemMessage = eazlDashboard.system_message;
        } else {
            dashboardWorking.dashboardSystemMessage = '';
        }

        if (eazlDashboard.refreshed_on != null) {
            dashboardWorking.dashboardRefreshedDateTime = eazlDashboard.refreshed_on;
        } else {
            dashboardWorking.dashboardRefreshedDateTime = '';
        }

        if (eazlDashboard.refreshed_by != null) {
            dashboardWorking.dashboardRefreshedUserID = eazlDashboard.refreshed_by;
        } else {
            dashboardWorking.dashboardRefreshedUserID = '';
        }

        if (eazlDashboard.updated_on != null) {
            dashboardWorking.dashboardUpdatedDateTime = eazlDashboard.updated_on;
        } else {
            dashboardWorking.dashboardUpdatedDateTime = '';
        }

        if (eazlDashboard.updated_by != null) {
            dashboardWorking.dashboardUpdatedUserID = eazlDashboard.updated_by;
        } else {
            dashboardWorking.dashboardUpdatedUserID = '';
        }

        if (eazlDashboard.created_on != null) {
            dashboardWorking.dashboardCreatedDateTime = eazlDashboard.created_on;
        } else {
            dashboardWorking.dashboardCreatedDateTime = '';
        }

        if (eazlDashboard.created_by != null) {
            dashboardWorking.dashboardCreatedUserID = eazlDashboard.created_by;
        } else {
            dashboardWorking.dashboardCreatedUserID = '';
        }

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
            dashboardUserRelationshipWorking.username = 
                eazlDashboardUserRelationship.username;
        } else {
            dashboardUserRelationshipWorking.username = '';
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
            dashboardUserRelationshipWorking.dashboardUserRelationshipCreatedUserID = 
                eazlDashboardUserRelationship.created_by;
        } else {
            dashboardUserRelationshipWorking.dashboardUserRelationshipCreatedUserID = '';
        }

        if (eazlDashboardUserRelationship.updated_on != null) {
            dashboardUserRelationshipWorking.dashboardUserRelationshipUpdatedDateTime = 
                eazlDashboardUserRelationship.updated_on;
        } else {
            dashboardUserRelationshipWorking.dashboardUserRelationshipUpdatedDateTime = '';
        }

        if (eazlDashboardUserRelationship.updated_by != null) {
            dashboardUserRelationshipWorking.dashboardUserRelationshipUpdatedUserID = 
                eazlDashboardUserRelationship.updated_by;
        } else {
            dashboardUserRelationshipWorking.dashboardUserRelationshipUpdatedUserID = '';
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
            datasourcesPerUserWorking.username = eazlDatasourcesPerUser.username;
        } else {
            datasourcesPerUserWorking.username = '';
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
            datasourcesPerUserWorking.datasourcesPerUserCreatedUserID = 
                eazlDatasourcesPerUser.created_by;
        } else {
            datasourcesPerUserWorking.datasourcesPerUserCreatedUserID = '';
        }

        if (eazlDatasourcesPerUser.updated_on != null) {
            datasourcesPerUserWorking.datasourcesPerUserUpdatedDateTime = 
                eazlDatasourcesPerUser.updated_on;
        } else {
            datasourcesPerUserWorking.datasourcesPerUserUpdatedDateTime = '';
        }

        if (eazlDatasourcesPerUser.updated_by != null) {
            datasourcesPerUserWorking.datasourcesPerUserUpdatedUserID = 
                eazlDatasourcesPerUser.updated_by;
        } else {
            datasourcesPerUserWorking.datasourcesPerUserUpdatedUserID = '';
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
            dataSourceUserAccessWorking.username = eazlDataSourceUserAccess.username;
        } else {
            dataSourceUserAccessWorking.username = '';
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
            dataSourceUserAccessWorking.datasourceUserAccessCreatedUserID = 
                eazlDataSourceUserAccess.created_by;
        } else {
            dataSourceUserAccessWorking.datasourceUserAccessCreatedUserID = '';
        }

        if (eazlDataSourceUserAccess.updated_on != null) {
            dataSourceUserAccessWorking.datasourceUserAccessUpdatedDateTime = 
                eazlDataSourceUserAccess.updated_on;
        } else {
            dataSourceUserAccessWorking.datasourceUserAccessUpdatedDateTime = '';
        }

        if (eazlDataSourceUserAccess.updated_by != null) {
            dataSourceUserAccessWorking.datasourceUserAccessUpdatedUserID = 
                eazlDataSourceUserAccess.updated_by;
        } else {
            dataSourceUserAccessWorking.datasourceUserAccessUpdatedUserID = '';
        }
        
        // Return the result
        return dataSourceUserAccessWorking;
    }             

    loadFilter(eazlFilter: EazlFilter): Filter {
        // Load Filter: move data Eazl -> Canvas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadFilter', '@Start');
    
        let filterWorking = new Filter();

        if (eazlFilter.has_atleast_one_filter != null) {
            filterWorking.hasAtLeastOneFilter = eazlFilter.has_atleast_one_filter;
        } else {
            filterWorking.hasAtLeastOneFilter = false;
        }
 
        if (eazlFilter.owner != null) {
            filterWorking.owner = eazlFilter.owner;
        } else {
            filterWorking.owner = '';
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
            groupDatasourceAccessWorking.groupDatasourceAccessCreatedUserID = 
                eazlGroupDatasourceAccess.created_by;
        } else {
            groupDatasourceAccessWorking.groupDatasourceAccessCreatedUserID = '';
        }

        if (eazlGroupDatasourceAccess.updated_on != null) {
            groupDatasourceAccessWorking.groupDatasourceAccessUpdatedDateTime = 
                eazlGroupDatasourceAccess.updated_on;
        } else {
            groupDatasourceAccessWorking.groupDatasourceAccessUpdatedDateTime = '';
        }

        if (eazlGroupDatasourceAccess.updated_by != null) {
            groupDatasourceAccessWorking.groupDatasourceAccessUpdatedUserID = 
                eazlGroupDatasourceAccess.updated_by;
        } else {
            groupDatasourceAccessWorking.groupDatasourceAccessUpdatedUserID = '';
        }

        // Return the result
        return groupDatasourceAccessWorking;
    }             

    loadNotification(eazlNotification: EazlNotification): Notification {
        // Load Notification: move data Eazl -> Canvas
        // TODO - do we really need this guy (see CanvasMessage), else add fields like id
        this.globalFunctionService.printToConsole(this.constructor.name,'loadNotification', '@Start');
    
        let notificationWorking = new Notification();
        
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
            ReportWorking.reportCreatedUserID = eazlReport.created_by;
        } else {
            ReportWorking.reportCreatedUserID = '';
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
        
        // Return the result
        return reportWidgetSetWorking;
    }             








    // loadCanvasMessage(eazlCanvasMessage: EazlCanvasMessage): CanvasMessage {
    //     // Load CanvasMessage: move data Eazl -> Canvas
    //     this.globalFunctionService.printToConsole(this.constructor.name,'loadCanvasMessage', '@Start');
    
    //     let canvasMessageWorking = new CanvasMessage();
        
    //     canvasMessageWorking.groupID = eazlCanvasMessage.id;

    //     if (eazlCanvasMessage.name != null) {
    //         canvasMessageWorking.groupName = eazlCanvasMessage.name;
    //     } else {
    //         canvasMessageWorking.groupName = '';
    //     }
        
    //     // Return the result
    //     return canvasMessageWorking;
    // }             




}

