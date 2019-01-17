import { Subject, Observable, pipe, OperatorFunction } from "rxjs";
import { filter, scan, map, tap } from "rxjs/operators";
import { Crossfilter, Dimension, NaturallyOrderedValue, Predicate, EventType, Group } from "crossfilter2";

export class RxCrossfilter<T> {
  private cf: Crossfilter<T>;
  public changed: Subject<string>;
  public added: Observable<string>;
  public removed: Observable<string>;
  public filtered: Observable<string>;

  public dimensions: Dimension<T, NaturallyOrderedValue>[];

  constructor(cf: Crossfilter<T>) {
    this.cf = cf;
    this._init();
  }

  private _init() {
    this.changed = new Subject();
    this.cf.onChange(this.changed.next.bind(this.changed));
    this.added = this.changed.pipe(filter(type => type === EventType.DATA_ADDED));
    this.removed = this.changed.pipe(filter(type => type === EventType.DATA_REMOVED));
    this.filtered = this.changed.pipe(filter(type => type === EventType.FILTERED));
  }
}

export function toggleFilter<TValue extends NaturallyOrderedValue>() : OperatorFunction<TValue | [TValue, TValue], Predicate<TValue>> {
  return pipe(
    scan<TValue | [TValue, TValue], {[key: string]: Boolean}>((acc, one) => {
      acc[one.toString()] = !(Boolean(acc[one.toString()]));
      return acc;
    }, {}),
    map(acc => Object.keys(acc).filter(key => acc[key])),
    map(filters => (val: TValue) => filters.indexOf(val.toString()) >= 0),
  );
}

export function filterDimension<TValue extends NaturallyOrderedValue>(dimension: Dimension<any, TValue>) {
  return tap<TValue | [TValue, TValue] | Predicate<TValue>>(val => dimension.filter(val));
}

export function groupTop<TValue>(group: Group<any, any, TValue>, k: number) {
  return map(evt => group.top(k));
}

export function groupAll<TValue>(group: Group<any, any, TValue>) {
  return map(evt => group.all());
}



