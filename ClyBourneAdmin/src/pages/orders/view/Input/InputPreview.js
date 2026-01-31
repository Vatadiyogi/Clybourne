import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CommonLayout from "../../../../common/CommonLayout";
import { apiURL } from "../../../../Config";
import axios from "axios";
import { formatPreviewNumber } from "../../../../common/utils/numberUtils";
import { getMonthName } from "../../../../common/utils/dateUtils";
import "./InputPreview.css";
import Graph from "./Graph";

const InputPreview = () => {
    const { id  } = useParams();
    const [order, setOrder] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation(); // This will give you access to the full URL, including query parameters

  // Extract the 'type' query parameter
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get('type') || "null" ; // 'type' will be 'initials' or 'revised'
    

    const BusinessDetails = [
        { key: "companyName", label: "Company Name" },
        { key: "companyType", label: "Company Type" },
        { key: "industryType", label: "Industry Type" },
        { key: "yearsInBusiness", label: "Years in Business" },
        { key: "country", label: "Country" },
        { key: "financialYearEnd", label: "Financial Year End" },
        { key: "historicalEarningTrend", label: "Historical Earning Trend" },
        { key: "shortDescription", label: "Short Description" },
        { key: "contactNumber", label: "Contact Number" },
        { key: "emailAddress", label: "Email Address" },
        { key: "currencyUsed", label: "Currency used in Company" }
    ];    

    const FinancialDetails = [
        { key: "sales", label: "Sales" },
        { key: "costOfSales", label: "Cost of Sales" },
        { key: "ebitda", label: "EBITDA" },
        { key: "depreciation", label: "Depreciation" },
        { key: "interestExpense", label: "Interest Expense" },
        { key: "netProfit", label: "Net Profit" },
        { key: "cashBalance", label: "Cash Balance" },
        { key: "debtLoan", label: "Debt/Loan" },
        { key: "equity", label: "Equity" },
        { key: "receivables", label: "Receivables" },
        { key: "inventories", label: "Inventories" },
        { key: "payables", label: "Payables" },
        { key: "netFixedAssets", label: "Net Fixed Assets" }
    ];
    
    
    const FinancialProjections = [       
        { key: "salesGrowthRate", label: "Forecasted Sales Growth Rate % (Y-o-Y)" },
        { key: "cogsForecasted", label: "Forecasted COGS % (as of % revenue)" },
        { key: "ebitdaMargin", label: "Forecasted EBITDA Margin (%)" },
        { key: "depreciationRate", label: "Depreciation Rate (%)" },
        { key: "interestRate", label: "Interest Rate (%)" },
        { key: "netProfitMargin", label: "Forecasted Net Profit Margin (%)" }
    ];

    const BalanceSheets = [
        { key: "capex", label: "Forecasted Net Addition in CAPEX/Fixed Assets" },
        { key: "debtLoan", label: "Forecasted Debt/Loan" },
        { key: "receivables", label: "Receivable Days" },
        { key: "inventories", label: "Inventory Days" },
        { key: "payables", label: "Payable Days" },
    ];


    useEffect(() => {
        const fetchOrder = async (id) => {
            try {
                const response = await axios.get(`${apiURL}api/admin/orders/${id}`, {
                    params: {
                        type: type // Include the `type` parameter from query
                    }
                });
                const { customer, order, calculations } = response.data;
            
                // Update state with fetched order and customer data
                setOrder({
                    customerName: customer.customerName,
                    planType: customer.planType,
                    planSequenceId: customer.planSeq,
                    status: order.status,
                    createdOn: order.createdOn,
                    customerOrderSeq: order.customerSequence,
                    submittedOn: order.submittedOn,
                    companyName: order.companyName,
                    country: order.country,
                    calculations: calculations,
                    businessDetails: order.business,
                    valuationStatus: order.valuationStatus,
                    planData : order.planData,
                    
                });
                console.log("OOOOO",order)
                setLoading(false);
            } catch (error) {
                setError(error.message || 'Error fetching order and customer data');
                setLoading(false);
            }
        };

        fetchOrder(id); // Assuming 'id' is passed as a parameter in the route
    }, [id]);

    if (loading) {
        return <p>Loading...</p>; // Placeholder for loading indicator
    }

    if (error) {
        return <p>Error: {error}</p>; // Display error message if fetching data fails
    }
    let newYears = null;
    const years = order.calculations?.years;

    newYears =  years ? years.slice(1) : null;
    
    const handleBackClick = () => {
        navigate(-1); // This will navigate to the previous page
    };

    return (
        <CommonLayout>
            <div id="content" className="main-content">
                <div className="layout-px-spacing">
                    <div className="middle-content container-xxl p-0">
                        {/* Display order details */}
                        <div className="row layout-spacing">
                            <div className="col-lg-12">
                                <div className="statbox widget box box-shadow">
                                    <div className="widget-header pb-2">
                                        <div className="row">
                                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                                <h4>Input Data Preview</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget-content widget-content-area">
                                        <div className="row">
                                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-8 mx-auto">
                                                <div className="card">
                                                    <div className="card-body">
                                                        {/* Customer Details */}
                                                        <div className="row">
                                                            <div className="col-md-4">
                                                                <div className="label-value">
                                                                    <span className="label1">Customer Name: </span> 
                                                                    <span className="label2"> {order.customerName}</span> 
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <div className="label-value">
                                                                <span className="label1">Plan Type: </span> 
                                                                <span className="label2"> {order.planData?.planType}</span> 
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="label-value">
                                                                <span className="label1">Plan ID: </span> 
                                                                <span className="label2"> {order.planData?.planOrderId?.planSeqId}</span> 
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <div className="label-value">
                                                                <span className="label1">Report Order Sequence: </span> 
                                                                <span className="label2"> {order.customerOrderSeq}</span> 
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <hr/>
                                                        {/* Business Details */}
                                                        <div>
                                                            <h4>Business Details</h4>
                                                            {order.businessDetails.business ?
                                                            <>
                                                                {BusinessDetails.map((statement, rowIndex) => (
                                                                    <div className="row" key={rowIndex}>
                                                                        <div className="col-md-10">
                                                                            <div className="label-value">
                                                                                <b><span className="label1">{statement.label}: </span> </b>
                                                                                <span className="label2"> 
                                                                                {statement.key === "companyName" ? ( 
                                                                                    <span>{order.companyName}</span>
                                                                                    ) : statement.key === "companyType" ? ( 
                                                                                        <span>{order.businessDetails.business.companyType}</span>
                                                                                    ) : statement.key === "industryType" ? ( 
                                                                                        <span>{order.businessDetails.business.industryType}</span>
                                                                                    ) : statement.key === "yearsInBusiness" ? ( 
                                                                                        <span>{order.businessDetails.business.companyAge}</span>
                                                                                    ) : statement.key === "country" ? ( 
                                                                                        <span>{order.businessDetails.business.country}</span>
                                                                                    ) : statement.key === "financialYearEnd" ? ( 
                                                                                        <span>{getMonthName(order.businessDetails.business.FinYrEndMonth)} {order.businessDetails.business.FinYrEndDate} {order.businessDetails.business.FinYrEnd}</span>
                                                                                    ) : statement.key === "historicalEarningTrend" ? ( 
                                                                                        <span>{order.businessDetails.business.earningTrend}</span>
                                                                                    ) : statement.key === "shortDescription" ? ( 
                                                                                        <span>{order.businessDetails.business.description}</span>
                                                                                    ) : statement.key === "contactNumber" ? ( 
                                                                                        <span>+{order.businessDetails.business.contact.dialCode}-{order.businessDetails.business.contact.phoneNumber}</span>
                                                                                    ) : statement.key === "emailAddress" ? ( 
                                                                                        <span>{order.businessDetails.business.email}</span>
                                                                                    ) :statement.key === "currencyUsed" ? ( 
                                                                                        <span>{order.businessDetails.business.currency}</span>
                                                                                    ) :(
                                                                                        ""
                                                                                    ) }
                                                                                </span> 
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                             </>
                                                            : <></> 
                                                            }
                                                        </div>
                                                        <hr/>
                                                        {/* Current Financial Information */}
                                                         {console.log("order.calculations",order )}
                                                        {order.calculations?.finance ?
                                                       
                                                        <div>
                                                            <h4>Current Financial Information</h4>
                                                            <p>All financial number specified in ({order.calculations.finance.unitOfNumber})</p>
                                                            <p>Historical Number for the Year {order.calculations.years[0]}</p>
                                                            
                                                            {FinancialDetails.map((statement, rowIndex) => (
                                                                <div className="row" key={rowIndex}>
                                                                    <div className="col-md-6">
                                                                        <div className="label-value">
                                                                            <span className="label1">{statement.label}: </span> 
                                                                            <span className="label2"> 
                                                                                { statement.key === "sales" ? ( 
                                                                                   <span>{formatPreviewNumber(order.calculations.finance.sales)}</span>
                                                                                ) : statement.key === "costOfSales" ? ( 
                                                                                    <span>{formatPreviewNumber(order.calculations.finance.costOfSales)}</span>
                                                                                 ) : statement.key === "ebitda" ? ( 
                                                                                    <span>{formatPreviewNumber(order.calculations.finance.ebitda)}</span>
                                                                                 ) : statement.key === "depreciation" ? ( 
                                                                                    <span>{formatPreviewNumber(order.calculations.finance.depreciation)}</span>
                                                                                 ) : statement.key === "interestExpense" ? ( 
                                                                                    <span>{formatPreviewNumber(order.calculations.finance.interestExpense)}</span>
                                                                                 ) : statement.key === "netProfit" ? ( 
                                                                                    <span>{formatPreviewNumber(order.calculations.finance.netProfit)}</span>
                                                                                 ) : statement.key === "cashBalance" ? ( 
                                                                                    <span>{formatPreviewNumber(order.calculations.finance.cashBalance)}</span>
                                                                                 ) : statement.key === "debtLoan" ? ( 
                                                                                    <span>{formatPreviewNumber(order.calculations.finance.debtLoan)}</span>
                                                                                 ) : statement.key === "equity" ? ( 
                                                                                    <span>{formatPreviewNumber(order.calculations.finance.equity)}</span>
                                                                                 ) : statement.key === "receivables" ? ( 
                                                                                    <span>{formatPreviewNumber(order.calculations.finance.receivables)}</span>
                                                                                 ) :statement.key === "inventories" ? ( 
                                                                                    <span>{formatPreviewNumber(order.calculations.finance.inventories)}</span>
                                                                                 ) :statement.key === "payables" ? ( 
                                                                                    <span>{formatPreviewNumber(order.calculations.finance.payables)}</span>
                                                                                 ) :statement.key === "netFixedAssets" ? ( 
                                                                                    <span>{formatPreviewNumber(order.calculations.finance.netFixedAssets)}</span>
                                                                                 ) :(
                                                                                    ""
                                                                                ) }
                                                                            </span> 
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                         :<></>    
                                                            }
                                                        {/* Financial Projections */}
                                                        <hr/>
                                                        {order.calculations?.forecast_inc_stmt ?
                                                        <div>
                                                            <h4>Financial Projections</h4>
                                                            <p>Income Statement Assumptions</p>
                                                            
                                                            <div className="financial-projections">
                                                                <div className="row year-section">
                                                                <div className="col-md-5">
                                                                        {/* Empty div to align the years correctly */}
                                                                    </div>
                                                                    <div className="col-md-7 d-flex">
                                                                        {newYears.map((year, index) => (
                                                                            <div key={index} className="col other-items year-item" style={{ fontWeight: 'bold' }}>
                                                                                {year}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                {FinancialProjections.map((statement, rowIndex) => (
                                                                    <div className="row" key={rowIndex}>
                                                                        <div className="col-md-5">
                                                                            <div className="label-value">
                                                                                <span className="label1" style={{ width: '100%' }}>{statement.label}: </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-7">
                                                                            <div className="row">
                                                                                {newYears.map((_, colIndex) => (
                                                                                    <div key={colIndex} className="col other-items year-item">
                                                                                        {statement.key === "salesGrowthRate" ? (
                                                                                            <span>{formatPreviewNumber(order.calculations.forecast_inc_stmt[colIndex].salesGrowthRate)}%</span>
                                                                                        ) : statement.key === "cogsForecasted" ? (
                                                                                            <span>{formatPreviewNumber(order.calculations.forecast_inc_stmt[colIndex].cogs)}%</span>
                                                                                        ) : statement.key === "ebitdaMargin" ? (
                                                                                            <span>{formatPreviewNumber(order.calculations.forecast_inc_stmt[colIndex].ebitdaMargin)}%</span>
                                                                                        ) : statement.key === "depreciationRate" ? (
                                                                                            <span>{formatPreviewNumber(order.calculations.forecast_inc_stmt[colIndex].depreciationRate)}%</span>
                                                                                        ) : statement.key === "interestRate" ? (
                                                                                            <span>{formatPreviewNumber(order.calculations.forecast_inc_stmt[colIndex].interestRate)}%</span>
                                                                                        ) : statement.key === "netProfitMargin" ? (
                                                                                            <span>{formatPreviewNumber(order.calculations.forecast_inc_stmt[colIndex].netProfitMargin)}%</span>
                                                                                        ) : (
                                                                                            ""
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        :<></> }
                                                        {/* Graphs */}
                                                        {order.calculations?.finance ?
                                                            <Graph order={order} />
                                                            :<></>} 
                                                        {/* Balance Sheet Assumptions */}
                                                        <hr/>
                                                        {order.calculations?.forecast_bal_sheet ?
                                                        <div>
                                                            <h4>Balance Sheet Assumptions</h4>
                                                            
                                                            <div className="financial-projections">
                                                                <div className="row year-section">
                                                                <div className="col-md-5">
                                                                        {/* Empty div to align the years correctly */}
                                                                    </div>
                                                                    <div className="col-md-7 d-flex">
                                                                        {newYears.map((year, index) => (
                                                                            <div key={index} className="col other-items year-item" style={{ fontWeight: 'bold' }}>
                                                                                {year}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                {BalanceSheets.map((statement, rowIndex) => (
                                                                    <div className="row" key={rowIndex}>
                                                                        <div className="col-md-5">
                                                                            <div className="label-value">
                                                                                <span className="label1" style={{ width: '100%' }}>{statement.label}: </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-7">
                                                                            <div className="row">
                                                                                {newYears.map((_, colIndex) => (
                                                                                    <div key={colIndex} className="col other-items year-item">
                                                                                        {statement.key === "capex" ? (
                                                                                            <span>{formatPreviewNumber(order.calculations.forecast_bal_sheet[colIndex].fixedAssets)}</span>
                                                                                        ) : statement.key === "debtLoan" ? (
                                                                                            <span>{formatPreviewNumber(order.calculations.forecast_bal_sheet[colIndex].debtLoan)}</span>
                                                                                        ) : (
                                                                                            ""
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                                { statement.key === "receivables" ? (
                                                                                    <span>{order.calculations.forecast_rip_days.receivableDays}</span>
                                                                                ) : statement.key === "inventories" ? (
                                                                                    <span>{order.calculations.forecast_rip_days.inventoryDays}</span>
                                                                                ) : statement.key === "payables" ? (
                                                                                    <span>{order.calculations.forecast_rip_days.payableDays}</span>
                                                                                ) : (
                                                                                    ""
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        :<></> }
                                                        {/* Document Uploaded */}
                                                        <hr/>
                                                        {/* Back Button */}
                                                        <div className="container pt-4 pb-4">
                                                            <div className="row">
                                                            <div className="col text-center">
                                                                <div className="buttons d-flex justify-content-center">
                                                                    <button type="button" className="btn btn-sm btn-primary me-2" onClick={handleBackClick}>Back</button>
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CommonLayout>
    );
}

export default InputPreview;