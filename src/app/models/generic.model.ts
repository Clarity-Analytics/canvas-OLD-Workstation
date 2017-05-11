import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


export class Model<T> {
	model: Observable<T>;
	private _data: BehaviorSubject<T>;
	
	constructor(data: T) {
		this._data = new BehaviorSubject(data);
		this.model = this._data.asObservable();
	}

	getValue(): T {
		return this._data.getValue();
	}

	setValue(value: T): void {
		this._data.next(value);
	}
}


export class ModelFactory<T> {
	create(data: T): Model<T> {
		return new Model(data);
	}
}


export function useModelFactory() {
	return new ModelFactory();
}


export const CanvasModelProvider = {
	provide: ModelFactory,
	useFactory: useModelFactory
}