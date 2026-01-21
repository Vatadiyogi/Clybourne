import React from 'react';
import { formatPreviewNumber } from '../../../common/numberUtils';

const BalanceSheet = ({ data }) => {
  const balanceSheetData = data?.calculations?.forecast_bal_sheet || [];
  const ripDaysData = data?.calculations?.forecast_rip_days || {};  

  const year = data?.calculations?.finance?.dataYear || 2023;
  const years = [year + 1, year + 2, year + 3, year + 4, year + 5];

  // Ensure default values
  const defaultValue = 0;
  const receivableDays = ripDaysData.receivableDays ?? defaultValue;
  const inventoryDays = ripDaysData.inventoryDays ?? defaultValue;
  const payableDays = ripDaysData.payableDays ?? defaultValue;

  return (
    <div className="col-lg-6">
      <fieldset className="bg-white p-15px mt-0 mt-sm-30px h-100 md-p-0">
        <legend className="fw-600 float-none border-1px col-auto fs-18 ps-15px pe-15px p-5px lh-1 border-radius-4px bg-blue text-golden">
          Financial Projections
        </legend>
        <table className="table table-striped table-bordered fs-14 mytable">
          <thead>
            <tr>
              <th scope="col" colSpan="5" className="fs-16 fw-400 pt-0 pb-0 bg-blue text-white">
                Balance Sheet Assumptions <span className="float-end fs-12 fst-italic">Values In {data?.order?.business?.business?.currency || "USD"} ({data?.calculations?.finance?.valueType || "Millions"})</span>
              </th>
            </tr>
          </thead>
          <tbody className="align-middle lh-sm">
            <tr>
              <th scope="row" colSpan="5" className="fs-14">
                Forecasted Net Addition in CAPEX/Fixed Assets
              </th>
            </tr>
            <tr>
              {balanceSheetData.map((item, index) => (
                <td key={`capex-${index}`} align="right">
                  <input
                    type="text"
                    className="w-50px form-control p-0 text-center border-radius-0px bg-light-blue text-blue fw-600 mb-5px border-1 border-blue fs-14"
                    value={years[index] || defaultValue}
                    disabled
                  />
                  <input
                    type="text"
                    className="form-control p-2 text-end border-radius-0px bg-dark-gray border-light-blue fs-14"
                    value={formatPreviewNumber(item.fixedAssets || defaultValue)}
                    disabled
                  />
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" colSpan="5" className="fs-14">
                Forecasted Debt/Loan
              </th>
            </tr>
            <tr>
              {balanceSheetData.map((item, index) => (
                <td key={`debt-${index}`} align="right">
                  <input
                    type="text"
                    className="w-50px form-control p-0 text-center border-radius-0px bg-light-blue text-blue fw-600 mb-5px border-1 border-blue fs-14"
                    value={years[index] || defaultValue}
                    disabled
                  />
                  <input
                    type="text"
                    className="form-control p-2 text-end border-radius-0px bg-dark-gray border-light-blue fs-14"
                    value={formatPreviewNumber(item.debtLoan || defaultValue)}
                    disabled
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <div className="col-sm-12">
          <div className="row">
            <div className="col d-flex justify-content-center align-items-center sm-ps-0 sm-pe-0">
              <p className="fs-14 fw-600 m-0 pe-5px lh-1 w-120px text-end">Receivable Days</p>
              <input
                id="receivableDaysRange"
                className="range sm-width-range"
                type="range"
                value={receivableDays}
                min="0"
                max="365"
                step="1"
                disabled
              />
              <input
                type="text"
                id="receivableDays"
                className="p-0 h-20px ms-1 fs-14"
                value={receivableDays}
                disabled
              />
              <span className="fs-14 lh-1 ps-1 fw-600 text-blue">Days</span>
            </div>
          </div>
        </div>
        <div className="col-sm-12 mt-15px">
          <div className="row">
            <div className="col d-flex justify-content-center align-items-center sm-ps-0 sm-pe-0">
              <p className="fs-14 fw-600 m-0 pe-5px lh-1 w-120px text-end">Inventory Days</p>
              <input
                id="inventoryDaysRange"
                className="range sm-width-range"
                type="range"
                value={inventoryDays}
                min="0"
                max="365"
                step="1"
                disabled
              />
              <input
                type="text"
                id="inventoryDays"
                className="p-0 h-20px ms-1 fs-14"
                value={inventoryDays}
                disabled
              />
              <span className="fs-14 lh-1 ps-1 fw-600 text-blue">Days</span>
            </div>
          </div>
        </div>
        <div className="col-sm-12 mt-15px">
          <div className="row">
            <div className="col d-flex justify-content-center align-items-center sm-ps-0 sm-pe-0">
              <p className="fs-14 fw-600 m-0 pe-5px lh-1 w-120px text-end">Payable Days</p>
              <input
                id="payableDaysRange"
                className="range sm-width-range"
                type="range"
                value={payableDays}
                min="0"
                max="365"
                step="1"
                disabled
              />
              <input
                type="text"
                id="payableDays"
                className="p-0 h-20px ms-1 fs-14"
                value={payableDays}
                disabled
              />
              <span className="fs-14 lh-1 ps-1 fw-600 text-blue">Days</span>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default BalanceSheet;
