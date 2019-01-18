import { Observable, of, bindCallback, Subject, from, interval } from 'rxjs';
import { map, tap, filter, zip } from 'rxjs/operators';
import { RxCrossfilter, filterDimension, toggleFilter, groupTop ,groupAll } from '../rx-cf';
import * as Chart from 'chart.js';
import { payments, paymentsByTotal, paymentVolumeByTotal, paymentsByType, paymentVolumeByType } from './app-cf';

var rxcf = new RxCrossfilter(payments);
rxcf.filtered.subscribe(x => console.log(x));

var barchartClick = new Subject<any>();

var barchart = new Chart("barchart", {
    type: 'bar',
    options: {
        onClick: (event, activeElement) => {
            console.log(this);
            barchartClick.next(activeElement)
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});

barchartClick.pipe(
    map(x => x && x[0] && x[0]._chart.data.labels[x[0]._index]),
    toggleFilter(),
    filterDimension(paymentsByType),
).subscribe();

rxcf.changed
    .pipe(
        groupAll(paymentVolumeByType),
        map(all => {
            let data: Chart.ChartData = {
                labels: all.map(d => d.key),
                datasets: [{
                    label: 'Volume by type',
                    data: all.map(d => d.value.total)
                }]
            }
            return data;
        }),
        tap(data => {
            barchart.data = data;
            barchart.update();
        })
    )
    .subscribe();

var piechartClick = new Subject<any>();
var piechart = new Chart("piechart", {
    type: 'doughnut',
    options: {
        onClick: (event, activeElement) => piechartClick.next(activeElement),
    }
});

piechartClick.pipe(
    map(x => x && x[0] && x[0]._chart.data.labels[x[0]._index]),
    tap(x => console.log(x)),
    toggleFilter(),
    filterDimension(paymentsByTotal),
).subscribe();

rxcf.changed
    .pipe(
        groupAll(paymentVolumeByTotal),
        map(all => {
            let data: Chart.ChartData = {
                labels: all.map(d => d.key),
                datasets: [{
                    label: 'Volume by total',
                    data: all.map(d => d.value.total)
                }]
            }
            return data;
        }),
        tap(data => {
            piechart.data = data;
            piechart.update();
        })
    )
    .subscribe();
