import Cogs from "./Graph/Cogs";
import EbitdaGraph from "./Graph/EbitdaGraph";
import SalesChart from "./Graph/Sales";
import NetProfitGraph from "./Graph/NetProfitGraph";
import NetProfitMarginGraph from "./Graph/NetProfitMarginGraph";

const Graph = ({order}) => {
  console.log(order);  
  return (
    <div className="col-sm-12 pt-4">
        <div className="row">
        <div className="col-md-1"></div>
            <div className="col-sm-5">
                <div className="card mt-30px rounded-bottom-0 border-0 box-shadow">
                    <SalesChart data={order.calculations.business} finData={order.calculations.graphData.finData} forecastData={order.calculations.graphData.forecastData}/>
                </div>
            </div>

            <div className="col-sm-5">
                <div className="card mt-30px rounded-bottom-0 border-0 box-shadow">
                    <Cogs  data={order.calculations.business} finData={order.calculations.graphData.finData} forecastData={order.calculations.graphData.forecastData}/> 
                </div>
            </div>
        </div>
        <div className="row pt-4">
        <div className="col-md-1"></div>
            <div className="col-sm-5">
                <div className="card mt-30px rounded-bottom-0 border-0 box-shadow">
                   <EbitdaGraph  data={order.calculations.business} finData={order.calculations.graphData.finData} forecastData={order.calculations.graphData.forecastData}/> 
                </div>
            </div> 
            <div className="col-sm-5">
                <div className="card mt-30px rounded-bottom-0 border-0 box-shadow">
                   <NetProfitGraph  data={order.calculations.business} finData={order.calculations.graphData.finData} forecastData={order.calculations.graphData.forecastData}/> 
                </div>
            </div>
        </div>
        <div className="row pt-4">
        <div className="col-md-1"></div>
            <div className="col-sm-5">
                <div className="card mt-30px rounded-bottom-0 border-0 box-shadow">
                <NetProfitMarginGraph  data={order.calculations.business} finData={order.calculations.graphData.finData} forecastData={order.calculations.graphData.forecastData} />
                </div>
            </div>
        </div>
        </div>
  )
}

export default Graph;