// Schema for Dashboard class

// Eazl
export class EazlDashboard {
    id: number;                                 // Unique DB ID
    code: string;                               // Code or ShortName
    name: string;                               // Descriptive name
    is_containerheader_dark: boolean;           // True if container header widgets dark (else light)
    show_container_header: boolean;             // True to show Container Header
    background_color: string;                   // Optional color of the whole Dashboard    
    background_image_src: string;               // Optional picture to show in background
    comments: string;                           // Optional comments
    default_export_filetype: string;            // Excel, JSON, PDF, PowerPoint, Jupyter or csv
    description: string;                        // User description
    nr_groups: number;                          // @Runtime: # of groups this dashboard belongs to
    is_locked: boolean;                         // If true, then cannot be modified
    is_liked: boolean;                          // @RunTime: True if Dashboard is liked by me
    open_tab_nr: number;                        // Optional Tab Nr to open on (default = 0)
    owner_userName: string;                     // UserName of owner
    password: string;                           // Optional password to open
    refresh_mode: string;                       // Manual, onOpen  
    nrUsers_shared_with: number;                // @RunTime: @ of UserNames shared with
    nr_groups_shared_with: number;              // @RunTime: @ of Groups shared with
    system_message: string;                     // Optional for Canvas to say something to user
    refreshed_on: string;                       // Data Refreshed on
    refreshed_by: string;                       // Data Refreshed by
    updated_on: string;                         // Updated on
    updated_by: string;                         // Updated by
    created_on: string;                         // Created on
    created_by: string;                         // Created by
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
    dashboardOwnerUserName: string;             // UserName of owner
    dashboardPassword: string;                  // Optional password to open
    dashboardRefreshMode: string;               // Manual, onOpen  
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
