import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { CalculateGraphData, roundOffNumber } from './Calculation';
import GraphHeading from './GraphHeading';

const Ebidta = ({data, finData, forecastData,unitOfNumber}) => {
    if (!finData || !finData.ebitda) {
       return null;
    }

    const { ebitda, year } = finData;
    
  let updatedEbitda = [...ebitda];

  // Function to format numbers with thousand separators and two decimal places
    const formatNumber = (number) => {
    return number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
  

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
    
    const matchingForecast = findMatchingForecast(forecastData, "Forecasted EBITDA Margin (%)");

    if (matchingForecast) {
      const percentages = matchingForecast.values.map(value => parseFloat(value));
      let currentEbitda = ebitda[0];

      // Start calculating from the initial sales value
      updatedEbitda = [currentEbitda];

       let currentSales = finData.sales;
       let updatedSales = [currentSales];
       let matchSalesObject = findMatchingForecast(forecastData, "Forecasted Sales Growth Rate (Y-o-Y) (%)");
 
       let SalesPercentArray  = matchSalesObject ? matchSalesObject.values.map(value => parseFloat(value)) : [1,1,1,1,1];

      // Iterate through each percentage and calculate new sales values
      percentages.forEach((percentage, index) => {
        currentSales = CalculateGraphData(currentSales, SalesPercentArray[index]);
        currentEbitda = currentSales * (percentage / 100);
        updatedEbitda.push(currentEbitda);
        updatedSales.push(currentSales);
      });
    }
  }  

    // Round off the values which is too large
    let roundedValues = roundOffNumber(updatedEbitda, unitOfNumber);
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
            type: 'bar'
        },
        title: {
            align: 'left',
            text: ''
        },
        credits: {
            href: '',
            mapText: '',
            enabled: false
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
                    fontSize: '10' // Added 'px' for consistency
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            labels: {
                enabled: false // Ensure labels are enabled
            },
            visible: true, // Ensure yAxis is visible
            
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            bar: {
              borderWidth: 0,
              borderRadius: 0
            },
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                formatter: function() {
                  return `<span style="font-size:9px;color:#000000;">${formatNumber(this.y)}</span>`; // Set the color explicitly
                },
                style: {
                  color: '#000000' // Ensure the text color is black
                }
              }
            }
          }
,          
        tooltip: {
            headerFormat: '',
            pointFormatter: function() {
                return `<span style="color:${this.color};font-size:11px;"><b>${formatNumber(this.y)}</b></span>`;
            }
        },
        series: [
            {
                name: 'EBITDA',
                colorByPoint: true,
                data: seriesData,
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
    
    return(
        <>
            <div className="card-header fw-700 fs-14 ps-10px pb-0 pt-5px mb-0 h-40px lh-normal border-0 bg-white text-blue">EBITDA
                <GraphHeading data={data} finData={finData}  valueType={valueTypes}/>
            </div>
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

export default Ebidta;