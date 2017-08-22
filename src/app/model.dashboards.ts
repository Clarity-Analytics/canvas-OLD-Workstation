// Schema for Dashboard-related classes

// Eazl
export class EazlDashboard {
    id: number;
    code: string; 
    name: string;
    description: string;
    password: string;
    refresh_mode: string;
    refresh_timer: number;
    default_tab_id: number;
    tabs: number[];
    tags: string[];
    comments: string;
    system_message: string;
    is_locked: false;
    is_container_header_dark: boolean;
    show_container_header: boolean;
    background_color: string;
    background_image: string;
    default_export_file_type: string;
    permissions: string[];
    creator: string;
    date_created: string;
    editor: string;
    date_edited: string;
    refresher: string; 
    date_refreshed: string; 
    url: string;
}

export class EazlDashboardUserPermissions {
    username: string;
    permissions: string[];                      // Permissions at model level per dashboard: 
            // add_dashboard, assign_permission_dashboard, change_dashboard,
            // delete_dashboard, remove_permission_dashboard, view_dashboard
}

export class EazlDashboardGroupPermissions {
    username: string;
    permissions: string[];                      // Permissions at model level per dashboard: 
            // add_dashboard, assign_permission_dashboard, change_dashboard,
            // delete_dashboard, remove_permission_dashboard, view_dashboard
}

// Canvas
export class Dashboard {
    dashboardID: number;                        // Unique DB ID
    dashboardCode: string;                      // Code or ShortName
    dashboardName: string;                      // Descriptive name
    dashboardDescription: string;               // User description
    dashboardPassword: string;                  // Optional password to open
    dashboardRefreshMode: string;               // Manual, onOpen
    dashboardRefreshFrequency: number;          // Frequency to refresh Dashboard in seconds
    dashboardOpenTabNr: number;                 // Optional Tab Nr to open on (default = 0)
    dashboardTabs: number[]; 
    dashboardTags: string[];
    dashboardComments: string;                  // Optional comments
    dashboardSystemMessage: string;             // Optional for Canvas to say something to user
    dashboardIsLocked: boolean;                 // If true, then cannot be modified
    isContainerHeaderDark: boolean;             // True if container header widgets dark (else light)
    showContainerHeader: boolean;               // True to show Container Header
    dashboardBackgroundColor: string;           // Optional color of the whole Dashboard
    dashboardBackgroundImageSrc: string;        // Optional picture to show in background
    dashboardDefaultExportFileType: string;     // Excel, JSON, PDF, PowerPoint, Jupyter or csv
    dashboardPermissions: string[];
    dashboardCreatedUserName: string;           // Created by
    dashboardCreatedDateTime: string;           // Created on
    dashboardUpdatedUserName: string;           // Updated by
    dashboardUpdatedDateTime: string;           // Updated on
    dashboardRefreshedDateTime: string;         // Data Refreshed on
    dashboardRefreshedUserName: string;         // Data Refreshed by
    dashboardUrl: string;                       // URL used by RESTi
    dashboardNrGroups: number;                  // @Runtime: # of groups this dashboard belongs to
    dashboardIsLiked: boolean;                  // @RunTime: True if Dashboard is liked by me
}

export class DashboardUserPermissions {
    username: string;
    canAddDashboard: boolean;
    canAssignPermissionDashboard: boolean;
    canChangeDashboard: boolean;
    canDeleteDashboard: boolean;
    canRemovePermissionDashboard: boolean;
    canViewDashboard: boolean;
}
    

export class DashboardGroupPermissions {
    groupName: string;
    canAddDashboard: boolean;
    canAssignPermissionDashboard: boolean;
    canChangeDashboard: boolean;
    canDeleteDashboard: boolean;
    canRemovePermissionDashboard: boolean;
    canViewDashboard: boolean;
}
    

