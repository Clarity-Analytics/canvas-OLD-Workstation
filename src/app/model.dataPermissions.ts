// Schema for types of permissions for Model & Object Permissions:

export class EazlDataPermission {
    model: string;                      // Model, ie query or dashboard
    model_permissions: string[];        // Type, ie add_dashboard, change_dashboard
    object_permissions: [
        {
            permission: string,         // Ie assign_permission_package, etc
            object_id: number[]         // Array of ids for above object permission
        }
    ];
}

// Canvas
export class dataPermission {
    model: string;
    modelPermissions: string[];
    objectPermissions: [
        {
            permission: string;
            objectID: number[]
        }
    ];
}

// Flattened version of the above, which works easier in p-tables, etc
export class dataModelPermissionFlat {
    model: string;                              // Model, ie Dashboard
    holderName: string;                         // Username/GroupName with access
    permissionVia: string;                      // User or Group
    modelPermission: string;                    // Model-level Permission in DB: 
                                                //   add_package, etc
}


// Flattened version of the above, which works easier in p-tables, etc
export class dataObjectPermissionFlat {
    model: string;                              // Model, ie Dashboard
    objectID: number;                           // ID of the row, ie 3
    objectName: string;                         // Name of the row, ie 'Bar Chart'
    holderName: string;                         // Username/GroupName with access
    permissionVia: string;                      // Granted to: User or Group
    objectPermission: string;                   // Row-level Permission in DB: 
                                                //    remove_permission_dashboard, etc
}