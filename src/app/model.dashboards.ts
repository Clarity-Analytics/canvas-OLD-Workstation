// Schema for Dashboard class

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

// Canvas
export class Dashboard {
    dashboardID: number;                        // Unique DB ID
    dashboardCode: string;                      // Code or ShortName
    dashboardName: string;                      // Descriptive name
    dashboardDescription: string;               // User description
    dashboardRefreshMode: string;               // Manual, onOpen
    dashboardRefreshFrequency: number;          // Frequency to refresh Dashboard in seconds
    // dashboardTabs: 
    // dashboardTags: 
    dashboardComments: string;                  // Optional comments
    dashboardSystemMessage: string;             // Optional for Canvas to say something to user
    dashboardIsLocked: boolean;                 // If true, then cannot be modified
    isContainerHeaderDark: boolean;             // True if container header widgets dark (else light)
    showContainerHeader: boolean;               // True to show Container Header
    dashboardBackgroundColor: string;           // Optional color of the whole Dashboard
    dashboardBackgroundImageSrc: string;        // Optional picture to show in background
    dashboardDefaultExportFileType: string;     // Excel, JSON, PDF, PowerPoint, Jupyter or csv
    // dashboardPermissions:
    dashboardCreatedUserName: string;           // Created by
    dashboardCreatedDateTime: string;           // Created on
    dashboardUpdatedUserName: string;           // Updated by
    dashboardUpdatedDateTime: string;           // Updated on
    dashboardRefreshedDateTime: string;         // Data Refreshed on
    dashboardRefreshedUserName: string;         // Data Refreshed by
    dashboardNrGroups: number;                  // @Runtime: # of groups this dashboard belongs to
    dashboardIsLiked: boolean;                  // @RunTime: True if Dashboard is liked by me
    dashboardOpenTabNr: number;                 // Optional Tab Nr to open on (default = 0)
    dashboardOwners: string;                    // CSV of UserNames of owners
    dashboardPassword: string;                  // Optional password to open
    dashboardNrUsersSharedWith: number;         // @RunTime: @ of UserNames shared with
    dashboardNrGroupsSharedWith: number;        // @RunTime: @ of Groups shared with
}

    

