import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiURL } from '../../Config';
import axios from 'axios';
import { formatNumber } from '../../common/utils/numberUtils';
import './Report.css';

const EmailReport = React.forwardRef((props, ref) => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [checkboxData, setcheckboxData] = useState([]);

  const Array = ['EBITDA', 'Adjustment for Impact of Tax on Interest', 'Change in Working Capital', 'CAPEX', 'Free Cash Flow (FCFF)', 'Present Value of FCFF'];

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiURL}api/admin/orders/valuation-data/${id}`);
        setData(response.data);
        const trueValues = Object.entries(response.data.ValuationCheckBox).filter(([key, value]) => value === true);
        setcheckboxData(trueValues);
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div>
       {data ? (  // Add this check to ensure data is not null
       <div style={{ display : 'none'}}>
        <div ref={ref}>
          <h3>Company Details</h3>
          <ul>
            <li>Company Name : <b>{data.query?.business?.companyName}</b></li> 
            <li>Country : <b>{data.query?.business?.country}</b></li>
            <li>Company Type : <b>{data.query?.business?.companyType}</b></li>
            <li>Years in Business : <b>{data.query?.business?.companyAge}</b></li>
            <li>Industry Type : <b>{data.query?.business?.industryType}</b></li>
            <li>Short Description : <b>{data.query?.business?.description}</b></li>
            <li>Historical Earning Trend : <b>{data.query?.business?.earningTrend}</b></li>
            <li>Currency Code : <b>{data.query?.business?.currency}</b></li>
          </ul>
          <h3>Data From Last Financial Year</h3>
          <ul>
            <li>All Values are in : <b>{data.query?.finance?.valueType}</b></li>
            <li>Equity : <b>{data.query?.finance?.equity}</b></li>
            <li>Debt/Loan : <b>{data.query?.finance?.debtLoan}</b></li>
            <li>Sales : <b>{data.query?.finance?.sales}</b></li>
            <li>EBITDA : <b>{data.query?.finance?.ebitda}</b></li>
            <li>EBITDA Margin % : <b>{((data.query?.finance?.ebitda / data.query?.finance?.sales) * 100).toFixed(2)}</b></li>
            <li>Net Profit : <b>{data.query?.finance?.netProfit}</b></li>
            <li>Net Profit Margin % : <b>{((data.query?.finance?.netProfit / data.query?.finance?.sales) * 100).toFixed(2)}</b></li>
            <li>Cash Balance : <b>{data.query?.finance?.cashBalance}</b></li>
            <li>Profitability : <b>{data.query?.finance?.netProfit > 0 ? 'Yes' : 'No'}</b></li>
          </ul>
          <h3>Future Projections</h3>
          <table border="1">
            <thead>
              <tr>
                <th></th>
                {data.years.slice(1).map((year, colIndex) => (
                  <th key={colIndex + 1}>{year}</th> // colIndex is now offset by 1
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sales</td>
                {data.years.slice(1).map((year, colIndex) => (
                  <td key={colIndex + 1}>{formatNumber(data.workIncStmt[colIndex+1]?.sales)}</td> // colIndex is now offset by 1
                ))}
              </tr>
              <tr>
                <td>COGS</td>
                {data.years.slice(1).map((year, colIndex) => (
                  <td key={colIndex + 1}>{formatNumber(data.workIncStmt[colIndex+1]?.cogs)}</td> // colIndex is now offset by 1
                ))}
              </tr>
              <tr>
                <td>EBITDA</td>
                {data.years.slice(1).map((year, colIndex) => (
                  <td key={colIndex + 1}>{formatNumber(data.workIncStmt[colIndex+1]?.ebitda)}</td> // colIndex is now offset by 1
                ))}
              </tr>
            </tbody>
          </table>
          <h3>Calculated Forecasted Values</h3>
          <table border="1">
            <thead>
              <tr>
                <th></th>
                {data.years.slice(1).map((year, colIndex) => (
                  <th key={colIndex + 1}>{year}</th> // colIndex is now offset by 1
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CAPEX</td>
                {data.years.slice(1).map((year, colIndex) => (
                  <td key={colIndex + 1}>{formatNumber(data.workDcfFCFF[colIndex]?.capex)}</td> // colIndex is now offset by 1
                ))}
              </tr>
              <tr>
                <td>FCFF</td>
                {data.years.slice(1).map((year, colIndex) => (
                  <td key={colIndex + 1}>{formatNumber(data.workDcfFCFF[colIndex]?.freeCashFlow)}</td> // colIndex is now offset by 1
                ))}
              </tr>
            </tbody>
          </table>
          <h3>Valuation Data</h3>
          <ul>
            <li>Total Equity Value  : <b>{formatNumber(data.weightAvgEquityValue || 0)}</b></li>
            <li>Enterprise Value :</li>
              <table border="1">
                <thead>
                  <tr>
                    <th>Min</th>
                    <th>Average</th>
                    <th>Max</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{formatNumber(data.EnterpriseMinValue || 0) }</td>
                    <td>{formatNumber(data.EnterpriseAvgValue || 0) }</td>
                    <td>{formatNumber(data.EnterpriseMaxValue || 0) }</td>
                  </tr>
                </tbody>
              </table>

            <li>Company DCF Method :</li>
              <ul>
                <li>Equity Min value: <b>{formatNumber(data.companyEquityMinValue || 0) }</b></li>
                <li>Equity Average value: <b>{formatNumber(data.companyEquityAvgValue || 0) }</b></li>
                <li>Equity Max value: <b>{formatNumber(data.companyEquityMaxValue || 0) }</b></li>
                <li>Weightage % : <b>{formatNumber((data.RelativeWeightPercent * 100) || 0) }</b></li>
              </ul> 

            <li>Weighted Averages :</li>   
              <table border="1">
                <thead>
                  <tr>
                    <th>Method (Particular)</th>
                    <th>Equity Min value</th>
                    <th>Equity Average value</th>
                    <th>Equity Max value</th>
                    <th>Weightage %</th>
                  </tr>
                </thead>
                <tbody>
                {checkboxData.map((checkdata, rowIndex) => (
                  <tr key={rowIndex}>
                    {checkdata[0] === "checkBoxPE" ? (
                    <>
                      <td>P/E Multiple</td>
                      <td>{formatNumber(data.PE.minEqValue || 0) }</td>
                      <td>{formatNumber(data.PE.equityValue || 0) }</td>
                      <td>{formatNumber(data.PE.maxEqValue || 0) }</td>
                      <td>{formatNumber(data.PE.RelativeWeightPercent || 0) }</td>
                    </>
                    ): checkdata[0] === "checkBoxPE_1" ? (
                      <>
                        <td>P/E Multiple (1 yr forward)</td>
                        <td>{formatNumber(data.PE_1.minEqValue || 0) }</td>
                        <td>{formatNumber(data.PE_1.equityValue || 0) }</td>
                        <td>{formatNumber(data.PE_1.maxEqValue || 0) }</td>
                        <td>{formatNumber(data.PE_1.RelativeWeightPercent || 0) }</td>
                      </>
                    ): checkdata[0] === "checkBoxPS" ? (
                      <>
                        <td>P/S Multiple</td>
                        <td>{formatNumber(data.PS.minEqValue || 0) }</td>
                        <td>{formatNumber(data.PS.equityValue || 0) }</td>
                        <td>{formatNumber(data.PS.maxEqValue || 0) }</td>
                        <td>{formatNumber(data.PS.RelativeWeightPercent || 0) }</td>
                      </>
                    ):checkdata[0] === "checkBoxPS_1" ? (
                      <>
                        <td>P/S Multiple (1 yr forward)</td>
                        <td>{formatNumber(data.PS_1.minEqValue || 0) }</td>
                        <td>{formatNumber(data.PS_1.equityValue || 0) }</td>
                        <td>{formatNumber(data.PS_1.maxEqValue || 0) }</td>
                        <td>{formatNumber(data.PS_1.RelativeWeightPercent || 0) }</td>
                      </>
                    ):checkdata[0] === "checkBoxEV_SALES" ? (
                      <>
                        <td>EV/Sales Multiple</td>
                        <td>{formatNumber(data.EV_SALES.minEqValue || 0) }</td>
                        <td>{formatNumber(data.EV_SALES.equityValue || 0) }</td>
                        <td>{formatNumber(data.EV_SALES.maxEqValue || 0) }</td>
                        <td>{formatNumber(data.EV_SALES.RelativeWeightPercent || 0) }</td>
                      </>
                    ):checkdata[0] === "checkBoxEV_SALES_1" ? (
                      <>
                        <td>EV/Sales Multiple (1 yr forward)</td>
                        <td>{formatNumber(data.EV_SALES_1.minEqValue || 0) }</td>
                        <td>{formatNumber(data.EV_SALES_1.equityValue || 0) }</td>
                        <td>{formatNumber(data.EV_SALES_1.maxEqValue || 0) }</td>
                        <td>{formatNumber(data.EV_SALES_1.RelativeWeightPercent || 0) }</td>
                      </>
                    ): checkdata[0] === "checkBoxEV_EBITDA" ? (
                      <>
                        <td>EV/EBITDA Multiple</td>
                        <td>{formatNumber(data.EV_EBITDA.minEqValue || 0) }</td>
                        <td>{formatNumber(data.EV_EBITDA.equityValue || 0) }</td>
                        <td>{formatNumber(data.EV_EBITDA.maxEqValue || 0) }</td>
                        <td>{formatNumber(data.EV_EBITDA.RelativeWeightPercent || 0) }</td>
                      </>
                    ):checkdata[0] === "checkBoxEV_EBITDA_1" ? (
                      <>
                        <td>EV/EBITDA Multiple (1 yr forward)</td>
                        <td>{formatNumber(data.EV_EBITDA_1.minEqValue || 0) }</td>
                        <td>{formatNumber(data.EV_EBITDA_1.equityValue || 0) }</td>
                        <td>{formatNumber(data.EV_EBITDA_1.maxEqValue || 0) }</td>
                        <td>{formatNumber(data.EV_EBITDA_1.RelativeWeightPercent || 0) }</td>
                      </>
                    ):(
                      <></>
                    )}
                  </tr>
                ))}
                </tbody>
              </table>
            <li>Valuation Parameters :</li>
            <table border="1">
              <thead>     
                <tr>
                    <th></th>
                    {data.years.slice(1).map((year, colIndex) => (
                      <th key={colIndex + 1}>{year}</th> // colIndex is now offset by 1
                    ))}
                  <th>Terminal Value</th>
                </tr>
              </thead>
              <tbody>
                {Array.map((value, colIndex) => (
                  <tr key={colIndex}>
                    <td>{value}</td>
                    {value === "EBITDA" ? (
                      data.years.map((year, colYIndex) => (
                        colYIndex === 5 ? (
                          <td key={colYIndex}>{formatNumber(data.terminalFCFF)}</td>
                        ) : (
                          <td key={colYIndex}>{formatNumber(data.workDcfFCFF[colYIndex]?.ebitda)}</td>
                        )
                      ))
                    ) : value === "Adjustment for Impact of Tax on Interest" ? (
                      data.years.map((year, colYIndex) => (
                        colYIndex === 5 ? (
                          <td key={colYIndex}></td>
                        ) : (
                          <td key={colYIndex}>{formatNumber(data.workDcfFCFF[colYIndex]?.interestTaxImpactAdj)}</td>
                        )
                      ))
                    ) : value === "Change in Working Capital" ? (
                      data.years.map((year, colYIndex) => (
                        colYIndex === 5 ? (
                          <td key={colYIndex}></td>
                        ) : (
                          <td key={colYIndex}>{formatNumber(data.workDcfFCFF[colYIndex]?.workCapChange)}</td>
                        )
                      ))
                    ) : value === "CAPEX" ? (
                      data.years.map((year, colYIndex) => (
                        colYIndex === 5 ? (
                          <td key={colYIndex}></td>
                        ) : (
                          <td key={colYIndex}>{formatNumber(data.workDcfFCFF[colYIndex]?.capex)}</td>
                        )
                      ))
                    ) : value === "Free Cash Flow (FCFF)" ? (
                      data.years.map((year, colYIndex) => (
                        colYIndex === 5 ? (
                          <td key={colYIndex}>{formatNumber(data.terminalFCFF)}</td>
                        ) : (
                          <td key={colYIndex}>{formatNumber(data.workDcfFCFF[colYIndex]?.freeCashFlow)}</td>
                        )
                      ))
                    ) : value === "Present Value of FCFF" ? (
                      data.years.map((year, colYIndex) => (
                        colYIndex === 5 ? (
                          <td key={colYIndex}>{formatNumber(data.terminalFCFF)}</td>
                        ) : (
                          <td key={colYIndex}>{formatNumber(data.workDcfFCFF[colYIndex]?.presentFreeCashFlow || 0)}</td>
                        )
                      ))
                    ) : (<></>)
                    }
                  </tr>
                ))}
              </tbody>
            </table>  
            <li>Weighted Average Cost of Capital (WACC) : <b>{formatNumber(data.wacc)}</b></li>
            <li>Weighted Average Equity Value of the Company : <b>{formatNumber(data.weightAvgEquityValue || 0)}</b></li>
            <li>Net Debt : <b>{formatNumber(data.netDebt || 0)}</b></li>
            <li>Enterprise Value Average : <b>{formatNumber(data.EnterpriseAvgValue || 0)}</b></li>
            <li>Ratios of Weighted Averages :</li>
            <table border="1">
                <thead>
                  <tr>
                    <th>Particular</th>
                    <th>Adj. Multiple Factor</th>
                  </tr>
                </thead>
                <tbody>
                {checkboxData.map((checkdata, rowIndex) => (
                  <tr key={rowIndex}>
                    {checkdata[0] === "checkBoxPE" ? (
                    <>
                      <td>P/E Multiple</td>
                      <td>{formatNumber(data.PE.adjMultipleFactor || 0) }</td>
                    </>
                    ): checkdata[0] === "checkBoxPE_1" ? (
                      <>
                        <td>P/E Multiple (1 yr forward)</td>
                        <td>{formatNumber(data.PE_1.adjMultipleFactor || 0) }</td>
                      </>
                    ): checkdata[0] === "checkBoxPS" ? (
                      <>
                        <td>P/S Multiple</td>
                        <td>{formatNumber(data.PS.adjMultipleFactor || 0) }</td>
                      </>
                    ):checkdata[0] === "checkBoxPS_1" ? (
                      <>
                        <td>P/S Multiple (1 yr forward)</td>
                        <td>{formatNumber(data.PS_1.adjMultipleFactor || 0) }</td>
                      </>
                    ):checkdata[0] === "checkBoxEV_SALES" ? (
                      <>
                        <td>EV/Sales Multiple</td>
                        <td>{formatNumber(data.EV_SALES.adjMultipleFactor || 0) }</td>
                      </>
                    ):checkdata[0] === "checkBoxEV_SALES_1" ? (
                      <>
                        <td>EV/Sales Multiple (1 yr forward)</td>
                        <td>{formatNumber(data.EV_SALES_1.adjMultipleFactor || 0) }</td>
                      </>
                    ): checkdata[0] === "checkBoxEV_EBITDA" ? (
                      <>
                        <td>EV/EBITDA Multiple</td>
                        <td>{formatNumber(data.EV_EBITDA.adjMultipleFactor || 0) }</td>
                      </>
                    ):checkdata[0] === "checkBoxEV_EBITDA_1" ? (
                      <>
                        <td>EV/EBITDA Multiple (1 yr forward)</td>
                        <td>{formatNumber(data.EV_EBITDA_1.adjMultipleFactor || 0) }</td>
                      </>
                    ):(
                      <></>
                    )}
                  </tr>
                ))}
                </tbody>
              </table> 
          </ul>
        </div>
        </div>
       ): (
        <p>Loading...</p> // Display loading or placeholder when data is not ready
      )}
    </div>
  );
});

export default EmailReport;
