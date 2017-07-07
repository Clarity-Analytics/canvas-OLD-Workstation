// Schema for the AppData = Application Data in Eazl
//
// It is effective singular data - ie no FK to other tables.  For example, colors.
// It is grouped by type.  For order, the record_id starts at 100 for each new type.
// This is not critical, just feels neater.

// Eazl
export class EazlAppData {
	record_id: number;
	entity: string;
    name: string;
    label: string;
    code: string;
	description: string;
	date_created: string;
	url: string;
}