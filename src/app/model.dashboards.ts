// Schema for Dashboard class

// Eazl
export class EazlDashboard {
    id: number;
    code: string; 
    name: string;
    description: string;
    refresh_mode: string;
    refresh_timer: number;
    tabs: any;
    comments: string;
    system_message: string;
    is_locked: false;
    is_container_header_dark: boolean;
    show_container_header: boolean;
    background_color: string;
    background_image: string;
    default_export_file_type: string;
    creator: string;
    date_created: string;
    editor: string;
    date_edited: string;
    open_tab_nr: number; 
    password: string;
    date_refreshed: string; 
    refresher: string; 
    url: string;
}

// Canvas
export class Dashboard {
    dashboardID: number;                        // Unique DB ID
    dashboardCode: string;                      // Code or ShortName
    dashboardName: string;                      // Descriptive name
    isContainerHeaderDark: boolean;             // True if container header widgets dark (else light)
    showContainerHeader: boolean;               // True to show Container Header
    dashboardBackgroundColor: string;           // Optional color of the whole Dashboard
    dashboardBackgroundImageSrc: string;        // Optional picture to show in background
    dashboardComments: string;                  // Optional comments
    dashboardDefaultExportFileType: string;     // Excel, JSON, PDF, PowerPoint, Jupyter or csv
    dashboardDescription: string;               // User description
    dashboardNrGroups: number;                  // @Runtime: # of groups this dashboard belongs to
    dashboardIsLocked: boolean;                 // If true, then cannot be modified
    dashboardIsLiked: boolean;                  // @RunTime: True if Dashboard is liked by me
    dashboardOpenTabNr: number;                 // Optional Tab Nr to open on (default = 0)
    dashboardOwners: string;                    // CSV of UserNames of owners
    dashboardPassword: string;                  // Optional password to open
    dashboardRefreshMode: string;               // Manual, onOpen
    dashboardRefreshFrequency: number;          // Frequency to refresh Dashboard in seconds
    dashboardNrUsersSharedWith: number;         // @RunTime: @ of UserNames shared with
    dashboardNrGroupsSharedWith: number;        // @RunTime: @ of Groups shared with
    dashboardSystemMessage: string;             // Optional for Canvas to say something to user
    dashboardRefreshedDateTime: string;         // Data Refreshed on
    dashboardRefreshedUserName: string;         // Data Refreshed by
    dashboardUpdatedDateTime: string;           // Updated on
    dashboardUpdatedUserName: string;           // Updated by
    dashboardCreatedDateTime: string;           // Created on
    dashboardCreatedUserName: string;           // Created by
}

    

