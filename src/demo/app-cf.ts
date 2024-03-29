import * as crossfilter from 'crossfilter2';

interface Payment {
    date: string;
    quantity: number;
    total: number;
    tip: number;
    type: string;
    productIDs: String[];
}

export const payments = crossfilter<Payment>([
  {date: "2011-11-14T16:17:54Z", quantity: 2, total: 190, tip: 100, type: "tab", productIDs: ["001"]},
  {date: "2011-11-14T16:20:19Z", quantity: 2, total: 190, tip: 100, type: "tab", productIDs: ["001", "005"]},
  {date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, tip: 200, type: "visa", productIDs: ["004", "005"]},
  {date: "2011-11-14T16:30:43Z", quantity: 2, total: 90, tip: 0, type: "tab", productIDs: ["001", "002"]},
  {date: "2011-11-14T16:48:46Z", quantity: 2, total: 90, tip: 0, type: "tab", productIDs: ["005"]},
  {date: "2011-11-14T16:53:41Z", quantity: 2, total: 90, tip: 0, type: "tab", productIDs: ["001", "004", "005"]},
  {date: "2011-11-14T16:54:06Z", quantity: 1, total: 100, tip: 0, type: "cash", productIDs: ["001", "002", "003", "004", "005"]},
  {date: "2011-11-14T16:58:03Z", quantity: 2, total: 90, tip: 0, type: "tab", productIDs: ["001"]},
  {date: "2011-11-14T17:07:21Z", quantity: 2, total: 90, tip: 0, type: "tab", productIDs: ["004", "005"]},
  {date: "2011-11-14T17:22:59Z", quantity: 2, total: 90, tip: 0, type: "tab", productIDs: ["001", "002", "004", "005"]},
  {date: "2011-11-14T17:25:45Z", quantity: 2, total: 200, tip: 0, type: "cash", productIDs: ["002"]},
  {date: "2011-11-14T17:29:52Z", quantity: 1, total: 200, tip: 100, type: "visa", productIDs: ["004"]}
]);
interface Group {
  total: number;
  count: number;
}

const addFn = (p: Group, v: Payment) => {
  p.total += v.total;
  p.count += 1;
  return p;
};
const remFn = (p: Group, v: Payment) => {
  p.total -= v.total;
  p.count -= 1;
  return p;
};
const initFn = () => {
  return {
    total: 0,
    count: 0
  };
};
export const paymentsByTotal = payments.dimension(d => d.total);
export const paymentVolumeByTotal = paymentsByTotal.group<number, Group>()
  .reduce(addFn, remFn, initFn)
  .order(value => value.total);

export const paymentsByType = payments.dimension(d => d.type);
export const paymentVolumeByType = paymentsByType.group<number, Group>()
  .reduce(addFn, remFn, initFn)
  .order(value => value.total);
