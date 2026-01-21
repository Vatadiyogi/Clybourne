import React from 'react';
import Chart from 'react-apexcharts';

const DonutChart = ({ data }) => {
    // Prepare data for the chart
    const chartData = {
        series: data.map(item => item.value), // Array of values for the chart
        labels: data.map(item => item.label) // Array of labels corresponding to each value
    };

    // Calculate the total value
    const totalValue = chartData.series.reduce((acc, value) => acc + value, 0);

    // Chart options
    const chartOptions = {
        chart: {
            type: 'donut'
        },
        labels: chartData.labels,
        colors: ['#00E396', '#008FFB', '#9F8DF1'],
        

        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }],
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            formatter: () => totalValue
                        }
                    }
                }
            }
        }
    };

    return (
        <div className="donut-chart">
            <Chart options={chartOptions} series={chartData.series} type="donut" width="100%" />
        </div>
    );
};

export default DonutChart;
