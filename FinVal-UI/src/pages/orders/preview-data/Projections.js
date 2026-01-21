import { formatNumber, formatPreviewNumber } from "../../../common/numberUtils";
const Projections = ({ data }) => {
    const projections = data?.calculations?.forecast_inc_stmt;
    const year = data?.calculations?.finance?.dataYear;
    // Define your headings
    const years = [year+1, year+2, year+3, year+4, year+5];
    const headings = [
      { label: "Forecasted Sales Growth Rate (Y-o-Y) (%)", key: "salesGrowthRate" },
      { label: "Forecasted COGS (as % of revenue) (%)", key: "cogs" },
      { label: "Forecasted EBITDA Margin (%)", key: "ebitdaMargin" },
      { label: "Interest Rate (%)", key: "interestRate" },
      { label: "Depreciation Rate (%)", key: "depreciationRate" },
      { label: "Forecasted Net Profit Margin (%)", key: "netProfitMargin" }
    ];
  
    return (
      <div className="row mt-30px">
        <div className="col-sm-12">
          <fieldset className="bg-white p-15px h-100">
            <legend className="fw-600 float-none border-1px col-auto fs-18 ps-15px pe-15px p-5px lh-1 border-radius-4px bg-blue text-golden">
              Financial Projections
            </legend>
            <table className="table table-striped table-bordered fs-13 mytable table-responsive-mobile">
              <thead >
                <tr>
                  <th scope="col" colSpan="6" className="fs-16 fw-400 pt-0 pb-0 bg-blue text-white">
                    Income Statement Assumptions
                  </th>
                </tr>
                <tr className="table-header-hidden-mobile">
                  <th scope="col" className="fs-16 fw-400 w-300px ls-1px bg-blue text-white">
                    YEAR
                  </th>
                  {years.map((year, index) => (
                    <th key={index} scope="col" className="bg-blue">
                      <input
                        type="text"
                        className="form-control p-0 ps-10px pe-10px text-center bg-light-blue text-blue fw-600 border-radius-0px fs-14"
                        value={year}
                        disabled
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="align-middle lh-sm">
                {headings.map((heading, rowIndex) => (
                  <tr key={rowIndex} className="table-row-mobile">
                    <th scope="row" className="fs-14 table-heading-mobile">
                      {heading.label}
                    </th>
                    {projections.map((projection, colIndex) => (
                      
                      <td key={colIndex} data-label={years[colIndex]} className="table-cell-mobile md-d-flex">
                        <input
                          type="text"
                          className="form-control p-0 text-center border-radius-0px bg-dark-gray border-light-blue fs-14"
                          value={formatPreviewNumber(projection[heading.key] || 0.00)}
                          disabled
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

          </fieldset>
        </div>
      </div>
    );
  };
  
  export default Projections;
  