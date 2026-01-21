import React from 'react';
import Chart from 'react-apexcharts';

const RevenueChart = () => {
  const d_6options2 = {
    chart: {
      id: 'sparkline4',
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
      name: 'Sales',
      data: [1000,4000,1500, 5000, 4500, 9000, 3000, 5000, 2000, 0, 12000, 8000]
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
    <div className="chart2">
      <Chart
        options={d_6options2}
        series={d_6options2.series}
        type="area"
        height={d_6options2.chart.height}
      />
    </div>
  );
}

export default RevenueChart;
