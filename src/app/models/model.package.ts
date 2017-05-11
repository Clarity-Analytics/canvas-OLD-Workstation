export interface Query {
	// To be completed
	name: string
}

export interface Field {
	name: string,
	dtype: string,
	package: number
}

export interface Parameter {
	name: string, 
	value: string, 
	parser: string,
	package: number
}

export interface Package {
	pk: number,
	name: string,
	repository: string,
	compiled: boolean,
	parameters: Parameter[],
	fields: Field[],
	queries: Query[],
	date_last_synced: Date,
	last_sync_successful: boolean,
	last_sync_error: string,
	last_runtime_error: string,
	execute: URL,
	url: URL
}