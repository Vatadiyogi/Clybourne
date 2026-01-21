import NetProfitMargin from "./NetProfitMargin";
import Cogs from "./Cogs";
import CompanyData from "./CompanyData";
import Country from "./Country";
import Ebidta from "./Ebidta";
import NetProfit from "./NetProfit";
import SalesChart from "./Sales";

// Function to check if forecastData contains a label with a matching string
const hasMatchingLabel = (data, searchString) => {
  for (let key in data) {
    if (data[key].label.includes(searchString)) {
      return true;
    }
  }
  return false;
};

const GraphElements = ({data, finData, forecastData}) => {

  return (
        <>
          <CompanyData data={data}/>
          <div className="row">
          {(finData || (forecastData && hasMatchingLabel(forecastData, "Forecasted Sales Growth Rate (Y-o-Y) (%)"))) &&
              <div className="col-sm-6 pe-5px sm-ps-5px">
                <div className="card mt-15px rounded-bottom-0 border-0 box-shadow">
                    <SalesChart data={data} finData={finData} forecastData={forecastData} />
                  </div>
              </div>
          }
          {(finData || (forecastData && hasMatchingLabel(forecastData, "Forecasted COGS (as % of revenue) (%)"))) &&
                <div className="col-sm-6 pe-5px sm-ps-5px">
                  <div className="card mt-15px rounded-bottom-0 border-0 box-shadow">
                      <Cogs data={data} finData={finData} forecastData={forecastData}/>
                  </div>
                </div>      
          }
          </div>
          <div className="row">
            {(finData || (forecastData && hasMatchingLabel(forecastData, "Forecasted EBITDA Margin (%)"))) &&      
              <div className="col-sm-4 pe-5px sm-ps-5px">
                <div className="card mt-15px rounded-bottom-0 border-0 box-shadow">
                  <Ebidta data={data} finData={finData} forecastData={forecastData}/>
                </div>
              </div>  
            }
           {(finData || (forecastData && hasMatchingLabel(forecastData, "Forecasted Net Profit Margin (%)"))) &&
              <div className="col-sm-4 pe-5px sm-ps-5px">
                <div className="card mt-15px rounded-bottom-0 border-0 box-shadow">
                    <NetProfit data={data} finData={finData} forecastData={forecastData}/>
                </div>
              </div>      
           }
          {(finData || (forecastData && hasMatchingLabel(forecastData, "Forecasted Net Profit Margin (%)"))) &&
              <div className="col-sm-4 pe-5px sm-ps-5px">
                <div className="card mt-15px rounded-bottom-0 border-0 box-shadow">
                    <NetProfitMargin data={data} finData={finData} forecastData={forecastData}/>
                </div>
              </div>  
          }
          {data && 
             <Country data={data} />
          }
        </div>
        </>
    )

}

export default GraphElements;