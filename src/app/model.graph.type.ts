// Schema for the Graph Type

// Eazl - use EazlAppData
// export class EazlGraphType {
//     label: string;
//     value_id: number;
//     value_name: string;
// }

// Canvas
export class GraphType {
    label: string;
    value: {
        id: number;
        name: string;
    }
}
