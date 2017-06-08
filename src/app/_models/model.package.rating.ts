export interface IPackageRating {
	package: number,
	mean_rating: number
}

export class PackageRating implements IPackageRating {
	package: number;
	mean_rating: number;
}