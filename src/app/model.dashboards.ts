// Schema for Dashboard object

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
    dashboardGroups: [                          // Array of groups to which it belongs
        {
            dashboardGroupName: string;
        }
    ];
    dashboardIsLocked: boolean;                 // If true, then cannot be modified
    dashboardLiked: [                           // Array of UserIDs that likes this
        {
            dashboardLikedUserID: string; 
        }
    ];
    dashboardOpenTabNr: number;                 // Optional Tab Nr to open on (default = 0)
    dashboardOwnerUserID: string;               // UserID of owner
    dashboardPassword: string;                  // Optional password to open
    dashboardRefreshMode: string;               // Manual, onOpen  
    dashboardSharedWith: [                      // Array of UserIDs shared with
        {
            dashboardSharedWithUserID: string;               
            dashboardSharedWithType: string     // ReadOnly, Full
        }
    ];
    dashboardSystemMessage: string;             // Optional for Canvas to say something to user
    dashboardRefreshedDateTime: string;         // Data Refreshed on
    dashboardRefreshedUserID: string;           // Data Refreshed by
    dashboardUpdatedDateTime: string;           // Updated on
    dashboardUpdatedUserID: string;             // Updated by
    dashboardCreatedDateTime: string;           // Created on
    dashboardCreatedUserID: string;             // Created by
}
