// Schema for types of permissions per user:
// At model level, and at object level

export class EazlUserModelPermission {
    model: string;                                  // Model, ie query or dashboard
    model_permissions: string[];                    // Type, ie add_dashboard, change_dashboard
    object_permissions: any;
    // [
    //     {
    //         permission: number[],                   // Type of permission,ie view_dashboard
    //         remove_permission_dashboard: number[],  // Array of ids for this permission
    //         view_dashboard: number[]                // Array of ids for this permission
    //     }
    // ]
}

// Canvas
export class UserModelPermission {
    model: string;
    model_permissions: string[];
    object_permissions: any;
}