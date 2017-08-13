// Schema for the Dashboard Tag class
// - This is to group Dashboards together, like tags, that are related
// - it has NO relationship with the Groups (of users) entitry

// Eazl
export class EazlDashboardTag {
    id: number;                                     // Unique ID
    tag: string;                                    // Name of the tag
    dashboard_id: number;                           // Dashboard which is tagged
    url: string;                                    // Django url
}

// Canvas
export class DashboardTag {
    dashboardTagID: number;
    dashboardTagName: string;
    dashboardID: number;
    dasbhoardURL: string;
    dashboardTagCreatedDateTime: string;            // Created on
    dashboardTagCreatedUserName: string;            // Created by
    dashboardTagUpdatedDateTime: string;            // Updated on
    dashboardTagUpdatedUserName: string;            // Updated by
}