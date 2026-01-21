import React from 'react';
import Chart from 'react-apexcharts';

const SalesChart = () => {
  const d_2options2 = {
    chart: {
      id: 'sparkline1',
      group: 'sparklines',
      type: 'area',
      height: 290,
      sparkline: {
        enabled: true
      },
    },
    stroke: {
      curve: 'smooth',
      width: 4
    },
    fill: {
      opacity: 1,
      // If you want to use gradient fill, uncomment below lines
      // type: "gradient",
      // gradient: {
      //   type: "vertical",
      //   shadeIntensity: 1,
      //   inverseColors: !1,
      //   opacityFrom: .30,
      //   opacityTo: .05,
      //   stops: [100, 100]
      // }
    },
    series: [{
      name: 'Daily Order',
      data: [1,3,2, 4, 6, 7, 4, 6, 3, 0, 6, 4]
    }],
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10','11','12'],
    yaxis: {
      min: 0
    },
    grid: {
      padding: {
        top: 125,
        right: 0,
        bottom: 0,
        left: 0
      },
      show: true, // Show grid
      borderColor: '#ccc', // Color of the grid lines
      strokeDashArray: 0, // Style of the grid lines (0 means solid lines)
      xaxis: {
        lines: {
          show: false // Show vertical grid lines
        }
      },
      yaxis: {
        lines: {
          show: true // Show horizontal grid lines
        }
      },
    },
    tooltip: {
      x: {
        show: false,
      },
      theme: 'dark' // If you want to use a variable for the theme, ensure it is defined
    },
    colors: ['#9f8df1']
  };

  return (
    <div className="chart">
      <Chart
        options={d_2options2}
        series={d_2options2.series}
        type="area"
        height={d_2options2.chart.height}
      />
    </div>
  );
}

export default SalesChart;
