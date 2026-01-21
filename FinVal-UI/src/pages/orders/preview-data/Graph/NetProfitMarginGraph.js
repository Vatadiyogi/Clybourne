import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { CalculateGraphData, roundOffNumber } from '../../Graph/Calculation';

const NetProfitMarginGraph = ({data, finData, forecastData}) => {
    if (!finData || !finData.netProfit) {
        return null;
    }
    
    const { netProfit, year } = finData;

    // Function to format numbers with thousand separators and two decimal places
    const formatNumber = (number) => {
        return number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    let updatedNetProfit = [...netProfit];
    
    let netProfitMargin = ( parseFloat(finData.netProfit) / parseFloat(finData.sales) ) * 100;
    
    let updatedNetProfitMarginPercent = [netProfitMargin];
    
    // Find the index of the object with the matching label in forecastData
    const findMatchingForecast = (forecastData, searchString) => {
        for (let key in forecastData) {
        if (forecastData[key].label === searchString) {
            return forecastData[key];
        }
        }
        return null;
    };

    // Check if forecastData is present and contains the expected object
    if (forecastData) {
    
        const matchingForecast = findMatchingForecast(forecastData, "Forecasted Net Profit Margin (%)");

        if (matchingForecast) {
            const percentages = matchingForecast.values.map(value => parseFloat(value));
            let currentNetProfit = netProfit[0];

            // Start calculating from the initial sales value
            updatedNetProfit = [currentNetProfit];

            let currentSales = finData.sales;
            let updatedSales = [currentSales];
            let matchSalesObject = findMatchingForecast(forecastData, "Forecasted Sales Growth Rate (Y-o-Y) (%)");
        
            let SalesPercentArray  = matchSalesObject ? matchSalesObject.values.map(value => parseFloat(value)) : [1,1,1,1,1];

            // Iterate through each percentage and calculate new sales values
            percentages.forEach((percentage, index) => {
                currentSales = CalculateGraphData(currentSales, SalesPercentArray[index]);
                currentNetProfit = (parseFloat(currentSales) * parseFloat(percentage)) / 100;
                updatedNetProfit.push(currentNetProfit);
                updatedNetProfitMarginPercent.push(percentage);
                updatedSales.push(currentSales);
            });
        }
    }  
    
    // Round off the values which is too large
    let roundedValues = roundOffNumber(updatedNetProfitMarginPercent, finData);
    
      // Prepare the data for the chart
      const seriesData = year.map((yr, index) => ({
        name: yr,
        y: Number(roundedValues.roundedNumbers[index]),
        drilldown: yr,
        color: '#021a5b'
      }));
    
      const options = {
        chart: {
            type: 'spline'
        },
        title: {
            text: '',
            align: 'left'
        },
        credits: {
            href: '',
            mapText: '',
            enabled: false,
        },
        subtitle: {
            text: '',
            align: 'left'
        },
        yAxis: {
            title: {
                text: ''
            },
            labels: {
                format: '{value}'
            },
            labels: {
                style: {
                    fontSize: '10'
                }
            },
            visible: false
        },
        xAxis: {
            type: 'category',
            labels: {
                style: {
                    fontSize: '10'
                }
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            enabled: true,
            headerFormat: '<span style="font-size:10px">{point.key}</span><br/>',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> <b>{point.y:.2f}%</b><br/>'
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                step: 'left',
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        const color = this.y < 0 ? '#ff7f7f' : '#021a5b'; // Check if the value is negative
                        return `<span style="font-size:9px; color:${color};"><b>${formatNumber(this.y)}</b></span>`;
                    }
                },
                enableMouseTracking: true  // Set to true to allow tooltip display
            }
        },
        series: [{
            name: 'Net Profit Margin',
            marker: {
                symbol: 'square'
            },
            zones: [
                {
                    value: 0, // Below this value, the style applies
                    color: '#ff7f7f' // Red marker for negative values
                },
                {
                    color: '#021a5b' // Default marker color for non-negative values
                }
            ],
            data: seriesData,
        }],
    };

    const containerStyle = {
        position: 'relative',
        overflow: 'hidden',
        width: '336px',
        height: '170px',
        textAlign: 'left',
        lineHeight: 'normal',
        zIndex: 0,
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
        userSelect: 'none',
        touchAction: 'manipulation',
        outline: 'none'
    };

    return (
        <>
        <div className="card-header fw-700 fs-14 ps-10px pb-0 pt-5px mb-0 h-40px lh-normal border-0 bg-white text-blue">Net Profit Margin<span className="fst-italic fw-500 fs-12 ms-1">(%)</span></div>
        <div className="card-body p-0 overflow-hidden">
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                containerProps={{ style: containerStyle }}  // Apply the style here
                />
        </div>
        </>
    )
}

export default NetProfitMarginGraph;