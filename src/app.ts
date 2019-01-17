import { Observable, of, bindCallback, Subject, from, interval } from 'rxjs';
import { map, tap, filter, zip } from 'rxjs/operators';
import * as crossfilter from 'crossfilter2';
import { RxCrossfilter, filterDimension, toggleFilter, groupTop ,groupAll } from './rx-cf';

interface Payment {
    date: string;
    quantity: number;
    total: number;
    tip: number;
    type: string;
    productIDs: String[];
}

var payments = crossfilter<Payment>([
    {date: "2011-11-14T16:17:54Z", quantity: 2, total: 190, tip: 100, type: "tab", productIDs:["001"]},
    {date: "2011-11-14T16:20:19Z", quantity: 2, total: 190, tip: 100, type: "tab", productIDs:["001", "005"]},
    {date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, tip: 200, type: "visa", productIDs:["004" ,"005"]},
    {date: "2011-11-14T16:30:43Z", quantity: 2, total: 90, tip: 0, type: "tab", productIDs:["001", "002"]},
    {date: "2011-11-14T16:48:46Z", quantity: 2, total: 90, tip: 0, type: "tab", productIDs:["005"]},
    {date: "2011-11-14T16:53:41Z", quantity: 2, total: 90, tip: 0, type: "tab", productIDs:["001", "004" ,"005"]},
    {date: "2011-11-14T16:54:06Z", quantity: 1, total: 100, tip: 0, type: "cash", productIDs:["001", "002", "003", "004" ,"005"]},
    {date: "2011-11-14T16:58:03Z", quantity: 2, total: 90, tip: 0, type: "tab", productIDs:["001"]},
    {date: "2011-11-14T17:07:21Z", quantity: 2, total: 90, tip: 0, type: "tab", productIDs:["004" ,"005"]},
    {date: "2011-11-14T17:22:59Z", quantity: 2, total: 90, tip: 0, type: "tab", productIDs:["001", "002", "004" ,"005"]},
    {date: "2011-11-14T17:25:45Z", quantity: 2, total: 200, tip: 0, type: "cash", productIDs:["002"]},
    {date: "2011-11-14T17:29:52Z", quantity: 1, total: 200, tip: 100, type: "visa", productIDs:["004"]}
]);

var rxcf = new RxCrossfilter(payments);
rxcf.filtered.subscribe(x => console.log(x));

var paymentsByTotal = payments.dimension(d => d.total);

interface Group {
    total: number;
    count: number;
}

var paymentsByType = payments.dimension(d => d.type);
var paymentVolumeByType = paymentsByType.group<number,  Group>()
    .reduce(
        (p, v, nf) => {
            p.total += v.total;
            p.count += 1;
            return p;
        },
        (p, v, nf) => {
            p.total -= v.total;
            p.count -= 1;
            return p;
        },
        () => {
            return {
                total: 0,
                count: 0
            };
        }
    )
    .order(value => value.total)

payments.add([{date: "2011-11-15T17:29:52Z", quantity: 1, total: 90, tip: 100, type: "visa", productIDs:["004"]}]);

let filterValues: number[] = [100, 200, 300, 200];
let filterEvents = from(filterValues).pipe(zip(interval(500), (a, b) => a))

filterEvents
    .pipe(
        tap(x => console.log('filter', x)),
        toggleFilter(),
        filterDimension(paymentsByTotal)
    )
    .subscribe();

rxcf.filtered
    .pipe(
        // groupAll(paymentVolumeByType),
        groupTop(paymentVolumeByType, 2),
        tap(x => console.log(JSON.stringify(x)))
    )
    .subscribe();
