// Schema for the Dashboard Group class
// - This is to group Dashboards together, like tags, that are related
// - it has NO relationship with the Groups (of users) entitry

// Eazl
export class EazlDashboardTag {
    id: number;
    name: string;
    description: string;
    created_on: string;                             // Created on
    created_by: string;                             // Created by
    updated_on: string;                             // Updated on
    updated_by: string;                             // Updated by
}

// Canvas
export class DashboardTag {
    dashboardTagID: number;
    dashboardTagName: string;
    dashboardTagDescription: string;
    dashboardTagCreatedDateTime: string;            // Created on
    dashboardTagCreatedUserName: string;            // Created by
    dashboardTagUpdatedDateTime: string;            // Updated on
    dashboardTagUpdatedUserName: string;            // Updated by
}