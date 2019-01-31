import { of, from } from "rxjs";
import { toggleFilter } from "./toggle-filter";
import { last } from "rxjs/operators";
import { expect } from "chai";

describe("toggle-filter", () => {
  it("should filter on a single value", done => {
    of("a")
      .pipe(
        toggleFilter(),
        last()
      )
      .subscribe(predicate => {
        expect(predicate("a")).to.be.eq(true);
        expect(predicate("b")).to.be.eq(false);
        done();
      });
  });

  it("should toggle values", done => {
    from(["a", "b", "a"])
      .pipe(
        toggleFilter(),
        last()
      )
      .subscribe(predicate => {
        expect(predicate("a")).to.be.eq(false);
        expect(predicate("b")).to.be.eq(true);
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
        expect(predicate(1)).to.be.eq(false);
        expect(predicate(2)).to.be.eq(true);
        done();
      });
  });

  it("should return null if there is no filters", done => {
    from([1, 1])
      .pipe(
        toggleFilter(),
        last()
      )
      .subscribe(predicate => {
        expect(predicate).to.be.null;
        done();
      });
  })
});
