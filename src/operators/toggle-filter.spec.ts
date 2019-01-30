import { of, from } from "rxjs";
import { toggleFilter } from "./toggle-filter";
import { last } from "rxjs/operators";

describe("toggle-filter", () => {
  it("should filter on a single value", done => {
    of("a")
      .pipe(toggleFilter())
      .subscribe(predicate => {
        expect(predicate("a")).toBe(true);
        expect(predicate("b")).toBe(false);
        done();
      });
  });

  it("should toggle on a single value", done => {
    from(["a", "a"])
      .pipe(
        toggleFilter(),
        last()
      )
      .subscribe(predicate => {
        expect(predicate("a")).toBe(false);
        expect(predicate("b")).toBe(false);
        done();
      });
  });

  it("should filter on a int value", done => {
    from([1, 1, 2])
      .pipe(
        toggleFilter(),
        last()
      )
      .subscribe(predicate => {
        expect(predicate(1)).toBe(false);
        expect(predicate(2)).toBe(true);
        done();
      });
  });
});
