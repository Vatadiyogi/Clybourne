import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { CalculateGraphData, roundOffNumber } from './Calculation';
import GraphHeading from './GraphHeading';

const Cogs = ({data, finData , forecastData,unitOfNumber}) => {
   if (!finData || !finData.costOfSales) {
    return null;
  }

  const { costOfSales, year } = finData;

    // Function to format numbers with thousand separators and two decimal places
    const formatNumber = (number) => {
      return number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

  let updatedCogs = [...costOfSales];

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
    
    const matchingForecast = findMatchingForecast(forecastData, "Forecasted COGS (as % of revenue) (%)");

    if (matchingForecast) {
      const percentages = matchingForecast.values.map(value => parseFloat(value));
      let currentCogs = costOfSales[0];

      // Start calculating from the initial sales value
      updatedCogs = [currentCogs];
      let currentSales = finData.sales;
      let updatedSales = [currentSales];
      let matchSalesObject = findMatchingForecast(forecastData, "Forecasted Sales Growth Rate (Y-o-Y) (%)");

      let SalesPercentArray  = matchSalesObject ? matchSalesObject.values.map(value => parseFloat(value)) : [1,1,1,1,1];

      // Iterate through each percentage and calculate new sales values
      percentages.forEach((percentage, index) => {
        currentSales = CalculateGraphData(currentSales, SalesPercentArray[index]);
        currentCogs = currentSales * (percentage / 100);
        updatedCogs.push(currentCogs);
        updatedSales.push(currentSales);
      });    
    }
  }  


  // Round off the values which is too large
  let roundedValues = roundOffNumber(updatedCogs, unitOfNumber);
  let valueTypes = roundedValues.valueType;

  // Prepare the data for the chart
  const seriesData = year.map((yr, index) => ({
    name: yr,
    y: Number(roundedValues.roundedNumbers[index]),
    drilldown: yr,
    color: '#183ea3'
  }));

  const options = {
    chart: {
        type: 'column'
    },
    title: {
        align: 'left',
        text: ''
    },
    credits: {
        href: '',
        mapText: '',
        enabled: false,
    },
    subtitle: {
        align: 'left',
        text: ''
    },
    accessibility: {
        announceNewData: {
            enabled: true
        }
    },
    xAxis: {
        type: 'category',
        labels: {
            style: {
                fontSize: '10'
            }
        }
    },
    yAxis: {
        title: {
            text: ''
        },
        labels: {
            enabled: false
        },
        visible: false
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        column: {
            borderWidth: 0,
            borderRadius: 0
        },
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                formatter: function() {
                  return `<span style="font-size:9px;"><b>${formatNumber(this.y)}</b></span>`;
                }
            }
        }
    },
    tooltip: {
      pointFormatter: function() {
        return `<span style="color:${this.color};font-size:11px;"><b>${formatNumber(this.y)}</b></span>`; // Use formatted value for tooltips
      }
    },
    series: [
        {
            name: 'COGS',
            colorByPoint: true,
            data: seriesData
        }
    ]
  };

  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    width: '359px',
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
      <div className="card-header fw-700 fs-14 ps-10px pt-5px pb-0 mb-0 lh-normal border-0 bg-white text-blue">
        COGS
        <GraphHeading data={data} finData={finData} valueType={valueTypes}/>
      </div>
      <div className="card-body p-0 overflow-hidden">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          containerProps={{ style: containerStyle }}  // Apply the style here
        />
      </div>
    </>
  );
};

export default Cogs;
