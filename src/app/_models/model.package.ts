export interface IQuery {
	// To be completed
	name: string
}

export class Query implements IQuery {
	name: string;
}

export interface IField {
	name: string,
	dtype: string,
	package: number
}

export class Field {
	name: string;
	dtype: string;
	package: number;
}

export interface IParameter {
	name: string, 
	value: string, 
	parser: string,
	package: number
}

export class Parameter {
	name: string;
	value: string;
	parser: string;
	package: number;
}

export interface IPackage {
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

export class Package {
	pk: number;
	name: string;
	repository: string;
	compiled: boolean;
	parameters: Parameter[];
	fields: Field[];
	queries: Query[];
	date_last_synced: Date;
	last_sync_successful: boolean;
	last_sync_error: string;
	last_runtime_error: string;
	execute: URL;
	url: URL;
}