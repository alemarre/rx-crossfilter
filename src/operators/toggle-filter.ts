import { pipe, OperatorFunction } from "rxjs";
import { scan, map } from "rxjs/operators";
import { NaturallyOrderedValue, Predicate } from "crossfilter2";

// if at least one value is 'true', only true values are filtered (=displayed)
// if no key, or all are 'false', all values are filtered (=displayed)
interface ToggleAccumulator {
  [key: string]: Boolean;
}
export function toggleFilter<
  TValue extends NaturallyOrderedValue
>(): OperatorFunction<TValue | [TValue, TValue], Predicate<TValue>> {
  return pipe(
    scan<TValue | [TValue, TValue], ToggleAccumulator>((acc, one) => {
      acc[one.toString()] = !Boolean(acc[one.toString()]);
      return acc;
    }, {}),
    map(acc => Object.keys(acc).filter(key => acc[key])),
    map(filters => {
      // if filters is an empty array, remove all filters
      console.log(filters);
      if (!filters) {
        return null;
      } else {
        return (val: TValue) => filters.indexOf(val.toString()) >= 0;
      }
    })
  );
}
