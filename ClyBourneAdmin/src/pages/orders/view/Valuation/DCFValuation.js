import React from 'react';
import { formatNumber } from '../../../../common/utils/numberUtils';
import SummaryValuation from './SummaryValuation';

const DCFValuation = ({data}) => {
    if (!data || !data.years) {
        return <div>No valuation data available</div>; // Handle case where data is not available
    }
  const DCFValuations = [
    { key: "ebitda", label: "EBITDA" },
    { key: "aitt", label: "Adjustment for Impact of Tax on Interest" },
    { key: "cwc", label: "Change in Working Capital" },
    { key: "capex", label: "CAPEX" },
    { key: "fcff", label: "Free Cash Flow (FCFF)" },
  ];

  const Fcff = [
    { key: "disfactor", label: "Discounting Factor" },
    { key: "presentfcff", label: "Present Value of FCFF" }
  ];

  const Enterprise = [
    { key: "enterprise", label: "Enterprise Values" },
    { key: "netDebt", label: "(-) Net Debt" },
    { key: "debt", label: `Debt/Loan (${data.years[0]})` },
    { key: "cashBalance", label: `Cash Balance (${data.years[0]})` },

  ];

  const Wacc = [
    { key: "wacc", label: "Weighted Average Cost of Capital (WACC)" },
    { key: "AdjBeta", label: "Adjusted Beta" },
  ];
  
  const years = data.years;
  const newYears = ['FCFF Computation'].concat(years.slice(1)).concat('Terminal Value');


return (
    <div className="container valuation-container">
        <div className="row year-section">
            {newYears.map((year, index) => (
                <React.Fragment key={index}>   
                    {index === 0 ? (
                        <div className="col first-item year-item" style={{ fontWeight: 'bold' }}>
                        {year}
                        </div>
                    ) : (
                        <div className="other-items year-item" style={{ fontWeight: 'bold' }}>
                        {year}
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>

        <div className="row">
            <div className="col">
            <h5 className="sheet-heading">DCF Valuation</h5>
            </div>
        </div>

        {/* DCF Valuation Values Parameters */}
        {DCFValuations.map((statement, rowIndex) => (
            <div className="row" key={rowIndex}>
                <div className="first-item value-item-heading">{statement.label}</div>
                {data.years.map((_, colIndex) => (
                    <div key={colIndex} className=" other-items year-item">
                        { statement.key === "ebitda" ? (
                            <>
                                {colIndex === 5 ? (
                                    <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.terminalFCFF)} readOnly />
                                ) : (
                                    <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workDcfFCFF[colIndex]?.ebitda)} readOnly />
                                )}
                            </>
                        ) : statement.key === "aitt" ? (
                            <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workDcfFCFF[colIndex]?.interestTaxImpactAdj)} readOnly />
                        ) : statement.key === "cwc" ? (
                            <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workDcfFCFF[colIndex]?.workCapChange)} readOnly />
                        ) : statement.key === "capex" ? (
                            <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workDcfFCFF[colIndex]?.capex)} readOnly />
                        ) : statement.key === "fcff" ? (
                            <>
                                {colIndex === 5 ? (
                                    <input type="text" className="form-control form-control-additonal-style sum-bold" value={formatNumber(data.terminalFCFF)} readOnly />
                                ) : (
                                    <input type="text" className="form-control form-control-additonal-style sum-bold" value={formatNumber(data.workDcfFCFF[colIndex]?.freeCashFlow)} readOnly />
                                )}
                            </>
                        ) : (
                            <input type="text" className="form-control form-control-additonal-style" value="" readOnly/>
                        )}
                    </div>
                ))}
            </div>
        ))}

        <div className="row">
            <div className="col">
            <h5 className="sheet-heading">Present Values of FCFF</h5>
            </div>
        </div>

        {/* DCF Valuation Values Parameters */}
        {Fcff.map((statement, rowIndex) => (
            <div className="row" key={rowIndex}>
                <div className="first-item value-item-heading">{statement.label}</div>
                {data.years.map((_, colIndex) => (
                    <div key={colIndex} className=" other-items year-item">
                        {statement.key === "disfactor" ? (
                            colIndex === 5 ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.terminalDiscountFactor)} readOnly />
                            ) : (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workDcfFCFF[colIndex]?.discountFactor)} readOnly />
                            )
                        ) : statement.key === "presentfcff" ? (
                            colIndex === 5 ? (
                                <input type="text" className="form-control form-control-additonal-style sum-bold" value={formatNumber(data.terminalPresentFCFF)} readOnly />
                            ) : (
                                <input type="text" className="form-control form-control-additonal-style sum-bold" value={formatNumber(data.workDcfFCFF[colIndex]?.presentFreeCashFlow)} readOnly />
                            )
                        ) : (
                            <input type="text" className="form-control form-control-additonal-style" value="" readOnly/>
                        )}
                    </div>
                ))}
            </div>
        ))}
        <br/><br/> 
    
        {/* Enterprise Values Parameters */}
        {Enterprise.map((statement, rowIndex) => (
            <div className="row" key={rowIndex}>
                <div className="first-item value-item-heading">{statement.label}</div>
                <div className=" other-items year-item">
                        {statement.key === "enterprise" ? (
                            <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.enterpriseValue)} readOnly />
                        ) : statement.key === "netDebt" ? (
                            <input type="text" className="form-control form-control-additonal-style sum-bold" value={formatNumber(data.netDebt)} readOnly />
                        ) : statement.key === "debt" ? (
                            <input type="text" className="form-control form-control-additonal-style sum-bold" value={formatNumber(data.query.finance.debtLoan)} readOnly />
                        ) : statement.key === "cashBalance" ? (
                            <input type="text" className="form-control form-control-additonal-style sum-bold" value={formatNumber(data.query.finance.cashBalance)} readOnly />
                        ) : (
                            <input type="text" className="form-control form-control-additonal-style" value="" readOnly/>
                        )}
                    </div>
            </div>
        ))}

        <br/><br/>
        {/* WACC Parameters */}
        {Wacc.map((statement, rowIndex) => (
            <div className="row" key={rowIndex}>
                <div className="first-item value-item-heading">{statement.label}</div>
                    <div className=" other-items year-item">
                        {statement.key === "wacc" ? (
                            <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.wacc)} readOnly />
                        ) : statement.key === "AdjBeta" ? (
                            <input type="text" className="form-control form-control-additonal-style sum-bold" value={formatNumber(data.adjustedBeta)} readOnly />
                        ) : (
                            <input type="text" className="form-control form-control-additonal-style" value="" readOnly/>
                        )}
                    </div>
            </div>
        ))}
        <br/><br/>
        {/* Value of Company */}
        <div className="row equity_value">
            <div className="row">
                <div className="equity-first-item equity-value-item-heading"></div>
                    <div className=" other-items year-item">
                            <b>Min.</b>  
                    </div>
                    <div className=" other-items year-item">
                           <b>Average</b>   
                    </div>
                    <div className=" other-items year-item">
                            <b>Max.</b>
                    </div>
            </div>
            <div className="row">
                <div className="first-item value-item-heading">Equity Value of the Company</div>
                    <div className=" other-items year-item">
                            <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.companyEquityMinValue)} readOnly/>   
                    </div>
                    <div className=" other-items year-item">
                            <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.companyEquityAvgValue)} readOnly/>   
                    </div>
                    <div className=" other-items year-item">
                            <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.companyEquityMaxValue)} readOnly/>   
                    </div>
            </div>
        </div>
        
        <br/>
        
        <SummaryValuation data={data}/>

    </div>
);
}

export default DCFValuation;