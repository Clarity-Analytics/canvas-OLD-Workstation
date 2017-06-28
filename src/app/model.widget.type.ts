// Schema for the Widget Type

// Eazl
export class EazlWidgetType {
    label: string;
    value_id: number;
    value_name: string;
}

// Canvas
export class WidgetType {
    label: string;
    value: {
        id: number;
        name: string;
    }
}