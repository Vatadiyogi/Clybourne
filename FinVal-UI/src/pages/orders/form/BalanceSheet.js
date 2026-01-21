import React, { useState, useEffect } from 'react';
import { apiURL } from '../../../config/Config';
import axios from 'axios';
import { formatNumber } from '../../../common/numberUtils';
import { useNavigate } from 'react-router-dom';
import SupportLink from './Modal/SupportLink';
import { NumericFormat } from 'react-number-format';

const BalanceSheet = ({ onSave, initialData ,backButton, orderId, editAllowed }) => {
  const year= initialData.order.business.business.FinYrEnd + 1;
  const currency= initialData.order.business.business.currency;
  const valueType = initialData.calculations.finance.valueType;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const role = localStorage.getItem('role');
  // State to manage forecast balance sheet data
  const [forecastBalSheetData, setForecastBalSheetData] = useState([
    { fixedAssets: "", debtLoan: "" },
    { fixedAssets: "", debtLoan: "" },
    { fixedAssets: "", debtLoan: "" },
    { fixedAssets: "", debtLoan: "" },
    { fixedAssets: "", debtLoan: "" }
  ]);

  useEffect(() => {
    if (initialData) {
      if (initialData?.calculations?.forecast_bal_sheet) {
        const formattedBalSheetData = initialData.calculations.forecast_bal_sheet.map(item => ({
          fixedAssets: formatNumber(item.fixedAssets),
          debtLoan: formatNumber(item.debtLoan)
        }));
        setForecastBalSheetData(formattedBalSheetData);
      }
      if (initialData?.calculations?.forecast_rip_days) {
        setForecastRipDaysData(initialData.calculations.forecast_rip_days || {
          receivableDays: "0",
          inventoryDays: "0",
          payableDays: "0"
        });
      }
    }
  }, [initialData]);

  // State to manage forecast RIP days data
  const [forecastRipDaysData, setForecastRipDaysData] = useState({
    receivableDays: "0",
    inventoryDays: "0",
    payableDays: "0"
  });

  // Handle change for balance sheet data
  const handleBalSheetInputChange = (index, field, value) => {
    const updatedData = [...forecastBalSheetData];
  
    // Allow empty input to clear the field
    if (value === '' || value.match(/^\d+(\.\d{0,2})?$/)) {
      updatedData[index][field] = value;
      setForecastBalSheetData(updatedData);
    }
  };
  
  // Handle change for RIP days data
  const handleRipDaysInputChange = (field, value) => {
    const updatedData = { ...forecastRipDaysData, [field]: value };
    setForecastRipDaysData(updatedData);
  };

  // Handle form submission
  const handleSubmit = async (event, buttonName) => {
    event.preventDefault();
    setIsLoading(true);
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(apiURL + '/order/update', {
            forcast_bal_sheet_data: forecastBalSheetData,
            forcast_rip_days_data: forecastRipDaysData,
            orderId : orderId,
        },
        {
            headers: {
                Authorization: `${token}`
            }
        });
        if (response.status === 200) {
            if (buttonName === 'back') {
              backButton(); // Call backButton function
          } else if (buttonName === 'save') {
              navigate('/preview-data/' + orderId);
          }
         }
    } catch (error) {
        console.error("There was an error submitting the form!", error);
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <div className="card m-0 border-radius-0px border-0 box-shadow h-100" style={{ backgroundColor: "#f2f3f6" }}>
      <div className="card-header fw-500 p-15px lh-normal bg-white">
        <p className="text-blue fw-600 mb-0 fs-16 lh-1 mt-5px mb-5px">
          New Order: <span className="text-dark-blue">Financial Projections</span>
          {initialData && initialData.order.status !== 'Completed' ?
                editAllowed && (role && role !== 'admin') && <SupportLink data={initialData}/> 
                : <></>
            }
        </p>
      </div>
      <div className="card-body p-0 lg-max-height-430px"data-scroll-options='{ "theme": "dark" }'>
        <div className="row">
          <div className="col-sm-12 p-15px ps-30px pe-30px">
            <table className="table table-striped table-bordered fs-12 mytable balanceSheet-table">
              <thead>
                <tr>
                  <th scope="col" colSpan="5" className="fs-14 fw-400 pt-0 pb-0 bg-blue text-white">
                    Balance Sheet Assumptions <span className="float-end fs-12 fst-italic">Values In {currency} ({valueType})</span>
                  </th>
                </tr>
              </thead>
              <tbody className="align-middle lh-sm">
                <tr>
                  <th scope="row" colSpan="5" className="year-label-cell">Forecasted Net Addition in CAPEX/Fixed Assets</th>
                </tr>
                <tr>
                  {forecastBalSheetData.map((item, index) => (
                    <td key={index} align="right" class>
                      <input type="text" className="w-50px form-control p-0 text-center border-radius-0px bg-light-blue text-blue fw-600 mb-5px border-1 border-blue" value={year + index} disabled />
                      <NumericFormat
                        className="form-control p-2 text-end border-radius-0px financial-info-input"
                        value={item.fixedAssets}
                        onValueChange={(values) => {
                          const { value } = values; // raw numeric value without formatting
                          handleBalSheetInputChange(index, 'fixedAssets', value);
                        }}
                        onBlur={(e) => {
                          const formattedValue = parseFloat(e.target.value.replace(/,/g, '')).toFixed(2);
                          handleBalSheetInputChange(index, 'fixedAssets', formattedValue);
                        }}
                        thousandSeparator={true}
                        decimalScale={2}
                        placeholder="0.00"
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" colSpan="6" className="year-label-cell">Forecasted Debt/Loan</th>
                </tr>
                <tr>
                  {forecastBalSheetData.map((item, index) => (
                    <td key={index} align="right" >
                      <input type="text" className="w-50px form-control p-0 text-center border-radius-0px bg-light-blue text-blue fw-600 mb-5px border-1 border-blue" value={year + index} disabled />
                       <NumericFormat
                        className="form-control p-2 text-end border-radius-0px financial-info-input"
                        value={item.debtLoan}
                        onValueChange={(values) => {
                          const { value } = values; // raw numeric value without formatting
                          handleBalSheetInputChange(index, 'debtLoan', value);
                        }}
                        onBlur={(e) => {
                          const formattedValue = parseFloat(e.target.value.replace(/,/g, '')).toFixed(2);
                          handleBalSheetInputChange(index, 'debtLoan', formattedValue);
                        }}
                        thousandSeparator={true}
                        decimalScale={2}
                        placeholder="0.00"
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            <div className="col-sm-12">
              <div className="row">
                <div className="col d-flex justify-content-center align-items-center">
                  <p className="fs-12 fw-600 m-0 pe-5px lh-1 w-110px text-end">Receivable Days</p>
                  <input
                    id="receivableDaysRange"
                    className="range sm-width-range"
                    type="range"
                    value={forecastRipDaysData.receivableDays}
                    min="0"
                    max="365"
                    step="1"
                    onChange={(e) => handleRipDaysInputChange('receivableDays', e.target.value)}
                  />
                  <input
                    type="text"
                    id="receivableDays"
                    className="p-0 h-20px ms-1"
                    value={forecastRipDaysData.receivableDays}
                    onChange={(e) => handleRipDaysInputChange('receivableDays', e.target.value)}
                  />
                  <span className="fs-12 lh-1 ps-1 fw-600 text-blue">Days</span>
                </div>
              </div>
            </div>
            <div className="col-sm-12 mt-15px">
              <div className="row">
                <div className="col d-flex justify-content-center align-items-center">
                  <p className="fs-12 fw-600 m-0 pe-5px lh-1 w-110px text-end">Inventory Days</p>
                  <input
                    id="inventoryDaysRange"
                    className="range sm-width-range"
                    type="range"
                    value={forecastRipDaysData.inventoryDays}
                    min="0"
                    max="365"
                    step="1"
                    onChange={(e) => handleRipDaysInputChange('inventoryDays', e.target.value)}
                  />
                  <input
                    type="text"
                    id="inventoryDays"
                    className="p-0 h-20px ms-1"
                    value={forecastRipDaysData.inventoryDays}
                    onChange={(e) => handleRipDaysInputChange('inventoryDays', e.target.value)}
                  />
                  <span className="fs-12 lh-1 ps-1 fw-600 text-blue">Days</span>
                </div>
              </div>
            </div>
            <div className="col-sm-12 mt-15px">
              <div className="row">
                <div className="col d-flex justify-content-center align-items-center">
                  <p className="fs-12 fw-600 m-0 pe-5px lh-1 w-110px text-end">Payable Days</p>
                  <input
                    id="payableDaysRange"
                    className="range sm-width-range"
                    type="range"
                    value={forecastRipDaysData.payableDays}
                    min="0"
                    max="365"
                    step="1"
                    onChange={(e) => handleRipDaysInputChange('payableDays', e.target.value)}
                  />
                  <input
                    type="text"
                    id="payableDays"
                    className="p-0 h-20px ms-1"
                    value={forecastRipDaysData.payableDays}
                    onChange={(e) => handleRipDaysInputChange('payableDays', e.target.value)}
                  />
                  <span className="fs-12 lh-1 ps-1 fw-600 text-blue">Days</span>
                </div>
              </div>
            </div>
            <div className="col-sm-12 mt-15px">
              <p className="fs-12 fw-500 m-0 pe-5px lh-1 text-end fst-italic">Use slider to set the value 0 to 365</p>
            </div>
          </div>
        </div>
      </div>
      {!editAllowed ? (
            <div className="col-sm-12 mt-20px mb-15px text-center">
                <button
                    onClick={backButton}
                    className="border-radius-0px btn btn-round-edge bg-blue submit h-40px p-0 ps-15px pe-15px fs-12 m-0 text-white fs-12 fw-600 text-capitalize fin-btn"
                    type="button"
                >
                    <span>
                        <span><i className="feather icon-feather-arrow-left-circle m-0"></i></span>
                        <span className="btn-double-text"> Back</span> 
                    </span>
                </button>
            </div>
      ):(isLoading ? (
          <span>
              <span><i className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></i></span>
              <span className="btn-double-text ms-3px" data-text="Submitting...">Submitting...</span>
          </span>
      ) : (
        <div className="col-sm-12 text-center">
            <button onClick={(e) => handleSubmit(e, 'back')} className="border-radius-0px btn btn-round-edge bg-blue submit h-40px p-0 ps-15px pe-15px fs-12 m-0 text-white fs-12 fw-600 text-capitalize fin-btn" type="submit">
                  <span>
                      <span><i className="feather icon-feather-arrow-left-circle m-0"></i></span>
                      <span className="btn-double-text"> Back</span> 
                  </span>
              </button>
              &nbsp;
              <button onClick={(e) => handleSubmit(e, 'save')} className="border-radius-0px btn btn-round-edge bg-blue submit h-40px p-0 ps-15px pe-15px fs-12 m-0 text-white fs-12 fw-600 text-capitalize fin-btn">
                  <span>
                      <span><i className="feather icon-feather-save m-0"></i></span>
                      <span className="btn-double-text"> Save & Preview Data</span> 
                  </span>
              </button>
        </div>
      ))}  
    </div>
  );
};

export default BalanceSheet;
