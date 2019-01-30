import { RxCrossfilter } from "./rx-cf";
import { payments, paymentsByTotal } from "./demo/app-cf";
import { first, toArray, take } from "rxjs/operators";

describe("RxCrossfilter", () => {
  it("should provide observables for all types of events", () => {
    let rxcf = new RxCrossfilter(payments);
    expect(rxcf.added).toBeTruthy();
    expect(rxcf.changed).toBeTruthy();
    expect(rxcf.filtered).toBeTruthy();
    expect(rxcf.removed).toBeTruthy();
  });

  it("should provide an observable for all events (on init then on any change)", done => {
    let rxcf = new RxCrossfilter(payments);
    rxcf.changed
      .pipe(
        take(2),
        toArray()
      )
      .subscribe(arr => {
        expect(arr[0]).toBe("init");
        expect(arr[1]).toBe("dataAdded");
        done();
      });
    payments.add(payments.all().slice(0, 1));
  });

  it("should provide an observable for data added events", done => {
    let rxcf = new RxCrossfilter(payments);
    rxcf.added.pipe(first()).subscribe(val => {
      expect(val).toBe("dataAdded");
      done();
    });

    payments.add(payments.all().slice(0, 1));
  });

  it("should provide an observable for data removed events", done => {
    let rxcf = new RxCrossfilter(payments);
    rxcf.removed.pipe(first()).subscribe(val => {
      expect(val).toBe("dataRemoved");
      done();
    });

    payments.remove(item => item.quantity === 1);
  });

  it("should provide an observable for data filtered events", done => {
    let rxcf = new RxCrossfilter(payments);
    rxcf.filtered.pipe(first()).subscribe(val => {
      expect(val).toBe("filtered");
      done();
    });

    paymentsByTotal.filter(100);
  });
});
