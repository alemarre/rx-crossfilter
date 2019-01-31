import { Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { RxCrossfilter, filterDimension, groupAll } from "../rx-cf";
import * as Chart from "chart.js";
import {
  payments,
  paymentsByTotal,
  paymentVolumeByTotal,
  paymentsByType,
  paymentVolumeByType
} from "./app-cf";
import { toggleFilter } from "../operators/toggle-filter";

const rxcf = new RxCrossfilter(payments);

const colors = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)'
];

// Create charts as described in chart.js documentation
const barchart = new Chart("barchart", {
  type: "bar",
  options: {
    responsive: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }
});
const piechart = new Chart("piechart", {
  type: "doughnut",
  options: {
    responsive: false
  }
});

// Bind chart's clicks to dimension filtering
fromChartClick(barchart)
  .pipe(
    getClickedElementKey(),
    toggleFilter(),
    filterDimension(paymentsByType)
  )
  .subscribe();

fromChartClick(piechart)
  .pipe(
    getClickedElementKey(),
    toggleFilter(),
    filterDimension(paymentsByTotal)
  )
  .subscribe();

// Bind crossfilter changes to chart data update
rxcf.changed
  .pipe(
    groupAll(paymentVolumeByType),
    map(all => {
      let data: Chart.ChartData = {
        labels: all.map(d => d.key),
        datasets: [
          {
            label: "Volume by type",
            data: all.map(d => d.value.total),
            backgroundColor: colors
          }
        ]
      };
      return data;
    }),
    updateChartData(barchart)
  )
  .subscribe();

rxcf.changed
  .pipe(
    groupAll(paymentVolumeByTotal),
    map(all => {
      let data: Chart.ChartData = {
        labels: all.map(d => d.key),
        datasets: [
          {
            label: "Volume by total",
            data: all.map(d => d.value.total),
            backgroundColor: colors
          }
        ]
      };
      return data;
    }),
    updateChartData(piechart)
  )
  .subscribe();

function fromChartClick(chart: Chart) {
  const click = new Subject<any>();
  chart.config.options.onClick = (event, activeElement) => {
    click.next(activeElement);
  };
  return click.asObservable();
}

function getClickedElementKey() {
  return map(x => x && x[0] && x[0]._chart.data.labels[x[0]._index]);
}

function updateChartData(chart: Chart) {
  return tap((data: Chart.ChartData) => {
    chart.data = data;
    chart.update();
  });
}
