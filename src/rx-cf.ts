import { Subject, Observable, pipe, OperatorFunction } from "rxjs";
import { filter, scan, map, tap, startWith } from "rxjs/operators";
import { Crossfilter, Dimension, NaturallyOrderedValue, Predicate, EventType, Group } from "crossfilter2";

export class RxCrossfilter<T> {
  private cf: Crossfilter<T>;
  private _subject: Subject<string>;
  public changed: Observable<string>;
  public added: Observable<string>;
  public removed: Observable<string>;
  public filtered: Observable<string>;

  public dimensions: Dimension<T, NaturallyOrderedValue>[];

  constructor(cf: Crossfilter<T>) {
    this.cf = cf;
    this._init();
  }

  private _init() {
    this._subject = new Subject()
    this.cf.onChange(this._subject.next.bind(this._subject));

    this.changed = this._subject.pipe(startWith('init'));
    this.added = this.changed.pipe(filter(type => type === EventType.DATA_ADDED));
    this.removed = this.changed.pipe(filter(type => type === EventType.DATA_REMOVED));
    this.filtered = this.changed.pipe(filter(type => type === EventType.FILTERED));
  }
}

// if at least one value is 'true', only true values are filtered (=displayed)
// if no key, or all are 'false', all values are filtered (=displayed)
interface toggleAccumulator {
  [key: string]: Boolean
}
export function toggleFilter<TValue extends NaturallyOrderedValue>() : OperatorFunction<TValue | [TValue, TValue], Predicate<TValue>> {
  return pipe(
    scan<TValue | [TValue, TValue], toggleAccumulator>((acc, one) => {
      acc[one.toString()] = !(Boolean(acc[one.toString()]));
      return acc;
    }, {}),
    map(acc => Object.keys(acc).filter(key => acc[key])),
    map(filters => {
      // if filters is an empty array, remove all filters
      console.log(filters);
      if (!filters) {
        return null;
      } else {
        return (val: TValue) => filters.indexOf(val.toString()) >= 0
      }
    })
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
