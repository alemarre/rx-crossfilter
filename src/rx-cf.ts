import { Subject, Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { Crossfilter, Dimension, NaturallyOrderedValue, Predicate, EventType } from "crossfilter2";

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

// Observer : flux des filtres (en mode toogle)
// Observable : les données de la dimension ont changé
export class RxDimension<TValue extends NaturallyOrderedValue> {
  exactFilters: TValue[];
  rangeFilters: [TValue, TValue][];
  functionFilters: [Predicate<TValue>];

  constructor() {
    // this._dimension = dimension;
    // this._init();
  }

  filter(filter: TValue | [TValue, TValue] | [Predicate<TValue>]) {

  }

  _init() {

  }
}

// Observable : les données du groupe ont changé
export class RxGroup {
  _init() {
  }
}
