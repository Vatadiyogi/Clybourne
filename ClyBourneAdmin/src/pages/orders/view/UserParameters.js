import { formatNumber } from '../../../common/utils/numberUtils';

const UserParameters = ({ data }) => {
    const IncomeStatements = [
        { key: "sales", label: "Sales" },
        { key: "salesGrowthRate", label: "Forecasted Sales Growth Rate % (Y-o-Y)" },
        { key: "cogs", label: "COGS" },
        { key: "cogsForecasted", label: "Forecasted COGS % (as of % revenue)" },
        { key: "ebitda", label: "EBITDA" },
        { key: "ebitdaMargin", label: "Forecasted EBITDA Margin (%)" },
        { key: "depreciation", label: "Depreciation" },
        { key: "depreciationRate", label: "Depreciation Rate (%)" },
        { key: "ebit", label: "EBIT" },
        { key: "interestExpense", label: "Interest Expense" },
        { key: "interestRate", label: "Interest Rate (%)" },
        { key: "ebt", label: "EBT" },
        { key: "netProfit", label: "Net Profit" },
        { key: "netProfitMargin", label: "Forecasted Net Profit Margin (%)" }
    ];

    const BalanceSheets = [
        { key: "receivables", label: "Receivables" },
        { key: "inventories", label: "Inventories" },
        { key: "payables", label: "Payables" },
        { key: "workingCapitals", label: "Working Capitals" },
        { key: "netFixedAssets", label: "Net Fixed Assets" },
        { key: "capex", label: "Net Addition in CAPEX/Fixed Assets" },
        { key: "debtLoan", label: "Debt/Loan" },
        { key: "equity", label: "Equity" },
        { key: "cashBalance", label: "Cash Balance" }
    ];

    const CashFlowStatement = [
        { key: "netProfit", label: "Net Profit" },
        { key: "depreciation", label: "Depreciation" },
        { key: "changeCapital", label: "Change in Working Capital" },
        { key: "receivables", label: "Receivables" },
        { key: "inventories", label: "Inventories" },
        { key: "payables", label: "Payables" },
        { key: "capExpenditure", label: "Capital Expenditure" },
        { key: "debtChange", label: "Change in Debt" }
    ];

    return (
        <div className="container valuation-container">
            <div className="row year-section">
                <div className="col first-item year-item"></div>
                {data.years.map((year, index) => (
                    <div key={index} className="other-items year-item" style={{ fontWeight: 'bold' }}>
                        {year}
                    </div>
                ))}
            </div>

            <div className="row">
                <div className="col">
                <h5 className="sheet-heading">Income Statement</h5>
                </div>
            </div>

            {/* Income Statements Values Parameters */}
            {IncomeStatements.map((statement, rowIndex) => (
                <div className="row" key={rowIndex}>
                    <div className="first-item value-item-heading">{statement.label}</div>
                    {data.years.map((_, colIndex) => (
                        <div key={colIndex} className=" other-items year-item">
                            {statement.key === "sales" ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workIncStmt[colIndex]?.sales)} readOnly/>
                            ) : statement.key === "salesGrowthRate" && colIndex > 0 ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.forecast_inc_stmt[colIndex-1]?.salesGrowthRate)} readOnly/>
                            ) : statement.key === "cogs" ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workIncStmt[colIndex].cogs)} readOnly/>
                            ) : statement.key === "cogsForecasted" && colIndex > 0 ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.forecast_inc_stmt[colIndex-1]?.cogs)} readOnly/>
                            ) : statement.key === "ebitda" ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workIncStmt[colIndex]?.ebitda)} readOnly />
                            ) : statement.key === "ebitdaMargin" && colIndex > 0 ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.forecast_inc_stmt[colIndex-1]?.ebitdaMargin)} readOnly/>
                            ) : statement.key === "depreciation" ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workIncStmt[colIndex]?.depreciation)} readOnly/>
                            ) : statement.key === "depreciationRate" && colIndex > 0 ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.forecast_inc_stmt[colIndex-1]?.depreciationRate)} readOnly/>
                            ) : statement.key === "ebit" ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workIncStmt[colIndex]?.ebit)} readOnly/>
                            ) : statement.key === "interestExpense" ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workIncStmt[colIndex]?.intExp)} readOnly/>
                            ) : statement.key === "interestRate" && colIndex > 0 ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.forecast_inc_stmt[colIndex-1]?.interestRate)} readOnly/>
                            ) : statement.key === "ebt" ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workIncStmt[colIndex]?.ebt)} readOnly/>
                            ) : statement.key === "netProfit" ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workIncStmt[colIndex]?.netProfit)} readOnly/>
                            ) : statement.key === "netProfitMargin" && colIndex > 0 ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.forecast_inc_stmt[colIndex-1]?.netProfitMargin)} readOnly/>
                            ) : (
                                <input type="text" className="form-control form-control-additonal-style" value="" readOnly/>
                            )}
                        </div>
                    ))}
                </div>
            ))}

            {/* Balance Sheet Value Parameters */}
            <div className="row">
                <div className="col">
                    <h5 className="sheet-heading">Balance Sheet</h5>
                </div>
            </div>

            {BalanceSheets.map((statement, rowIndex) => (
                <div className="row" key={rowIndex}>
                    <div className="col first-item value-item-heading">{statement.label}</div>
                    {data.years.map((_, colIndex) => (
                        <div key={colIndex} className=" other-items year-item">
                            {statement.key === "receivables" ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workBalSheet[colIndex].receivable)} readOnly/>
                            ) : statement.key === "inventories" ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workBalSheet[colIndex].inventory)} readOnly/>
                            ) : statement.key === "payables" ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workBalSheet[colIndex].payable)} readOnly/>
                            ) : statement.key === "workingCapitals" ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workBalSheet[colIndex].workingCapital)} readOnly/>
                            ) : statement.key === "netFixedAssets" ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workBalSheet[colIndex].netFixedAsset)} readOnly/>
                            ) : statement.key === "capex" ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workBalSheet[colIndex]?.fixedAsset)} readOnly/> 
                            ) : statement.key === "debtLoan" ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workBalSheet[colIndex].debtLoan)} readOnly/>
                            ) : statement.key === "equity" ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workBalSheet[colIndex].equity)} readOnly/>
                            ) : statement.key === "cashBalance" ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workBalSheet[colIndex].cashBalance)} readOnly/>
                            ) : (
                                <input type="text" className="form-control form-control-additonal-style" value="" readOnly/>
                            )}
                        </div>
                    ))}
                </div>
            ))}

            {/* Cash Flow Statement */}
            <div className="row">
                <div className="col">
                    <h5 className="sheet-heading">Cash Flow Statement</h5>
                </div>
            </div>

            {CashFlowStatement.map((statement, rowIndex) => (
                <div className="row" key={rowIndex}>
                    <div className="col first-item value-item-heading">{statement.label}</div>
                    {data.years.map((_, colIndex) => (
                        <div key={colIndex} className="other-items year-item">
                            {statement.key === "netProfit" && colIndex > 0 ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workCashFlowStmt[colIndex-1]?.netProfit?.toFixed(2))} readOnly/>
                            ) : statement.key === "depreciation" && colIndex > 0 ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workCashFlowStmt[colIndex-1]?.depreciation?.toFixed(2))} readOnly/>
                            ) : statement.key === "changeCapital" && colIndex > 0 ? (
                                <input type="text" className="form-control form-control-additonal-style" value={0} readOnly/>
                            ) : statement.key === "receivables" && colIndex > 0 ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workCashFlowStmt[colIndex-1]?.receivable?.toFixed(2))} readOnly/>
                            ) : statement.key === "inventories" && colIndex > 0 ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workCashFlowStmt[colIndex-1]?.inventory?.toFixed(2))} readOnly/>
                            ) : statement.key === "payables" && colIndex > 0 ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workCashFlowStmt[colIndex-1]?.payable?.toFixed(2))} readOnly/> 
                            ) : statement.key === "capExpenditure" && colIndex > 0 ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workCashFlowStmt[colIndex-1]?.capExp?.toFixed(2))} readOnly/>
                            ) : statement.key === "debtChange" && colIndex > 0 ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workCashFlowStmt[colIndex-1]?.debtChange?.toFixed(2))} readOnly/>
                            ) : (
                                <input type="text" className="form-control form-control-additonal-style" value="" readOnly/>
                            )}
                        </div>
                    ))}
                </div>
            ))}

            <hr/>

            <div className="row">
                <div className="col first-item value-item-heading">Cash Movement during the year</div>
                    {data.years.map((_, colIndex) => (
                        <div key={colIndex} className=" other-items year-item">
                            {colIndex > 0 ? (
                                <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workCashFlowStmt[colIndex-1]?.cashMovement?.toFixed(2))} readOnly/>
                            ) : (
                                <input type="text" className="form-control form-control-additonal-style" value="" readOnly/>
                            )}
                        </div>
                    ))}
            </div>
            <div className="row">
                <div className="col first-item value-item-heading">Equity Fundraising</div>
                    {data.years.map((_, colIndex) => (
                            <div key={colIndex} className=" other-items year-item">
                                {colIndex > 0 ? (
                                    <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workCashFlowStmt[colIndex-1]?.equityFund?.toFixed(2))} readOnly/>
                                ) : (
                                    <input type="text" className="form-control form-control-additonal-style" value="" readOnly/>
                                )}
                            </div>
                    ))}
            </div>      

            <hr/>
            
            <div className="row">
                <div className="col first-item value-item-heading">Net Cash Movement </div>
                    {data.years.map((_, colIndex) => (
                            <div key={colIndex} className=" other-items year-item">
                                {colIndex > 0 ? (
                                    <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workCashFlowStmt[colIndex-1]?.netCashMovement?.toFixed(2))} readOnly/>
                                ) : (
                                    <input type="text" className="form-control form-control-additonal-style" value="" readOnly/>
                                )}
                            </div>
                    ))}
            </div>
            <div className="row">
                <div className="col first-item value-item-heading">Beginning Balance of Cash</div>
                    {data.years.map((_, colIndex) => (
                            <div key={colIndex} className=" other-items year-item">
                                {colIndex > 0 ? (
                                    <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workCashFlowStmt[colIndex-1]?.yearBegnCash?.toFixed(2))} readOnly/>
                                ) : (
                                    <input type="text" className="form-control form-control-additonal-style" value="" readOnly/>
                                )}
                            </div>
                    ))}
            </div>   

            <hr/>
            
            <div className="row">
                <div className="col first-item value-item-heading">End of the year Cash</div>
                    {data.years.map((_, colIndex) => (
                            <div key={colIndex} className=" other-items year-item">
                                {colIndex > 0 ? (
                                    <input type="text" className="form-control form-control-additonal-style" value={formatNumber(data.workCashFlowStmt[colIndex-1]?.yearEndCash?.toFixed(2))} readOnly/>
                                ) : (
                                    <input type="text" className="form-control form-control-additonal-style" value="" readOnly/>
                                )}
                            </div>
                    ))}
            </div>



        </div>
    );
};

export default UserParameters;
