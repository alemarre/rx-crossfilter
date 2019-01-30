import { RxCrossfilter } from "./rx-cf";
import { payments, paymentsByTotal } from "./demo/app-cf";
import { first, toArray, take } from "rxjs/operators";
import { expect } from "chai";

describe("RxCrossfilter", () => {
  it("should provide observables for all types of events", () => {
    let rxcf = new RxCrossfilter(payments);
    expect(rxcf.added).to.exist;
    expect(rxcf.changed).to.exist;
    expect(rxcf.filtered).to.exist;
    expect(rxcf.removed).to.exist;
  });

  it("should provide an observable for all events (on init then on any change)", done => {
    let rxcf = new RxCrossfilter(payments);
    rxcf.changed
      .pipe(
        take(2),
        toArray()
      )
      .subscribe(arr => {
        expect(arr[0]).to.be.eq("init");
        expect(arr[1]).to.be.eq("dataAdded");
        done();
      });
    payments.add(payments.all().slice(0, 1));
  });

  it("should provide an observable for data added events", done => {
    let rxcf = new RxCrossfilter(payments);
    rxcf.added.pipe(first()).subscribe(val => {
      expect(val).to.be.eq("dataAdded");
      done();
    });

    payments.add(payments.all().slice(0, 1));
  });

  it("should provide an observable for data removed events", done => {
    let rxcf = new RxCrossfilter(payments);
    rxcf.removed.pipe(first()).subscribe(val => {
      expect(val).to.be.eq("dataRemoved");
      done();
    });

    payments.remove(item => item.quantity === 1);
  });

  it("should provide an observable for data filtered events", done => {
    let rxcf = new RxCrossfilter(payments);
    rxcf.filtered.pipe(first()).subscribe(val => {
      expect(val).to.be.eq("filtered");
      done();
    });

    paymentsByTotal.filter(100);
  });
});
