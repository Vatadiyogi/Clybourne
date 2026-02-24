import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { apiURL } from '../../../../Config';
import './ExcelForm.css';
import { formatNumber } from '../../../../common/utils/numberUtils';

const ExcelForm = ({order, onValuationSuccess }) => {
  const { id } = useParams();
  const [excelData, setExcelData] = useState('');
  const [table, setTable] = useState([]);
  const [showButton, setShowButton] = useState(true);
  const [second, setSecond] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [finalResponse, setFinalResponse] = useState({});
  const [loading, setLoading] = useState(false); // Loader state
  const [loadingSubmit, setLoadingSubmit] = useState(false); // New state for submit loading


  const processExcelData = (pastedText) => {
    if (pastedText !== '') {
      setShowTable(true);
      const data = [];
      const rows = Array.isArray(pastedText) ? pastedText : [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = Array.isArray(row)
          ? row.map((cell) => (cell != null ? String(cell).trim() : ''))
          : [row];
        data.push(cells);
      }
      setTable(data);
    }
  };

  const handleInputChange = (event) => {
    setExcelData(event.target.value);
  };

  // Show the excel data paste in Textarea
  const handleClick = () => {
    const pastedText = excelData;
    if(pastedText !== ''){
      setShowTable(true);
      const data = [];
      const rows = pastedText.split("\n");
      for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].split("\t");
        data.push(cells);
      }
      setTable(data);
    }
  };

  // Delete and Reset the excel data
  const handleReset = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete and reset the data?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true); // Show loader
        axios.delete(apiURL + 'api/admin/orders/reset-data/' + id) // Replace with your API endpoint
          .then(() => {
            setShowTable(false);
            setTable([]);
            setSecond(false);
            setExcelData('');
            setShowButton(true);
            Swal.fire(
              'Deleted!',
              'Your data has been deleted and reset.',
              'success'
            );
          })
          .catch((error) => {
            Swal.fire(
              'Error!',
              'There was an error resetting the data.',
              'error'
            );
          })
          .finally(() => {
            setLoading(false); // Hide loader
          });
      }
    });
  };

  //Store Back end table data
  const handleSubmit = async () => {
    try {
      const body = {
        "back_end_table": table
      };
      const response = await axios.put(apiURL + 'api/admin/orders/' + id, body, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      setFinalResponse(response.data.workBackEndTableAvg);
      if (response.status === 200) {
        // setMain(false);
        setSecond(true);
      }
    } catch (error) {
      Swal({
        title: "Error",
        text: "Please check the data",
        icon: "error",
        button: "Ok",
      });
    }
  };

  //Submit the Valuation Data and generate take to FCFF screen
  const generateValuation = async () => {
    setLoadingSubmit(true); 
    try {
      const response = await axios.put(apiURL + 'api/admin/orders/store-valuation-data/' + id, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (response.status === 200) {
        Swal.fire('Success', 'Valuation saved successfully', 'success').then((result) => {
          if (result.isConfirmed) {
            onValuationSuccess(); // Assuming valuationData is the data you need
          }
        });
      }
    } catch (error) {
      Swal({
        title: "Error",
        text: "Please check the data",
        icon: "error",
        button: "Ok",
      });
    }finally{
      setLoadingSubmit(false);
    }
  };

  //Get Data for Backend Calculations Average on page load
  const processValuationData = useCallback(async () => {
    try {
      const response = await axios.get(`${apiURL}api/admin/orders/valuation-data/${id}`);
      if (response.status === 200) {
        setFinalResponse(response.data.workBackEndTableAvg);
        setSecond(true);
      }
    } catch (error) {
      console.error("Error fetching valuation data", error);
    }
  }, [id]); // Make sure to include 'id' in the dependency array if it's used inside processValuationData
  
  useEffect(() => {
    if (order && order.calculations && order.calculations.back_end_table) {
      processExcelData(order.calculations.back_end_table);
      setShowButton(false);
      processValuationData(); // Call processValuationData here
    }
  }, [order, processValuationData]); // Include processValuationData in the dependency array
  

  const backEvent = async () => {
    window.location.reload();
  }

  useEffect(() => {
    if (order && order.calculations && order.calculations.back_end_table) {
      processExcelData(order.calculations.back_end_table);
      setShowButton(false);
      processValuationData(); // Assuming this function is defined elsewhere
    }
    // Include processValuationData in the dependency array if it's used in this effect
  }, [order, processValuationData]);

  return (
    <div id="card_1" className="report col-xxl-12 col-xl-12 col-lg-12 col-md-12">
      {loading && <div className="loader">Loading...</div>} {/* Loader display */}
      <h5>Calculating the Averages of Comparables</h5>
      <p>Please copy the data from the calculation template excel from columns "B" to "P" (multiple rows) and paste it in the text area below</p>
      <div className="row">
        <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
          <div className="row">
            <div className="col-md-12">
              <textarea
                type='text'
                value={excelData}
                onChange={handleInputChange}  
                placeholder="Paste Here"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary form-control xlsdata"
              />
            </div>
          </div>
          <div className="container pt-4 pb-4">
            <div className="row">
              <div className="col text-center">
                <div className="buttons d-flex justify-content-center">
                  <button type="button" className="btn btn-sm btn-danger me-2" onClick={backEvent}>Back</button>
                  {showButton && (
                    showTable ? (
                      <button type="button" className="btn btn-sm btn-success me-2" onClick={handleSubmit}>Save & Calculate Comparable Averages</button>
                    ) : (
                      <button type="button" className="btn btn-sm btn-primary me-2" onClick={handleClick}>Show</button>
                    )
                  )}
                  <button type="button" className="btn btn-sm btn-primary" onClick={handleReset}>Delete & Reset</button>
                </div>
              </div>
            </div>
          </div>
          {showTable && (
            <div className="overflow-auto w-full h-[60%] table-responsive">
              <table className="table table-bordered">
                <thead className="bg-bodydark1">
                  <tr>
                    <th className="px-6 py-3">Particulars</th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">Headquarters</th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">Revenues</th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">P/E</th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">P/E+1</th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">P/S</th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">P/S+1</th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">EV/Sales</th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">EV/Sales +1</th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">EV/EBITDA</th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">EV/EBITDA +1</th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">Beta</th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">D/E</th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">Tax Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map((item, index) => (
                    <tr className="" key={index}>
                      <td>{item[0]}</td>
                      <td>{item[1]}</td>
                      <td>{item[2]}</td>
                      <td>{item[3]}</td>
                      <td>{item[4]}</td>
                      <td>{item[5]}</td>
                      <td>{item[6]}</td>
                      <td>{item[7]}</td>
                      <td>{item[8]}</td>
                      <td>{item[9]}</td>
                      <td>{item[10]}</td>
                      <td>{item[11]}</td>
                      <td>{item[12]}</td>
                      <td>{item[13]}</td>
                      <td>{item[14]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {second && (
        <div className='pt-4'>
          <h5>Calculated Averages </h5>
          <div className='w-full justify-end flex'>
            <div className="overflow-auto w-full h-[60%] table-responsive">
              <table className="table table-bordered">
                <tbody>
                    <tr>
                      <td>P/E Multiple :</td>
                      <td>{formatNumber(finalResponse.pe)}</td>
                    </tr>
                    <tr>
                      <td>P/E Multiple (1 yr forward):</td>
                      <td>{formatNumber(finalResponse.pe_1)}</td>
                    </tr>
                    <tr>
                      <td>P/S Multiple :</td>
                      <td>{formatNumber(finalResponse.ps)}</td>
                    </tr>
                    <tr>
                      <td>P/S Multiple (1 yr forward) :</td>
                      <td>{formatNumber(finalResponse.ps_1)}</td>
                    </tr>
                    <tr>
                      <td>EV/Sales Multiple :</td>
                      <td>{formatNumber(finalResponse.evs)}</td>
                    </tr>
                    <tr>
                      <td>EV/Sales Multiple (1 yr forward) :</td>
                      <td>{formatNumber(finalResponse.evs_1)}</td>
                    </tr>
                    <tr>
                      <td>EV/EBITDA Multiple :</td>
                      <td>{formatNumber(finalResponse.ev_ebitda)}</td>
                    </tr>
                    <tr>
                      <td>EV/EBITDA Multiple (1 yr forward) :</td>
                      <td>{formatNumber(finalResponse.ev_ebitda_1)}</td>
                    </tr>
                    <tr>
                      <td>UnLevered Beta :</td>
                      <td>{formatNumber(finalResponse.un_lev_beta)}</td>
                    </tr>
                </tbody>
              </table>
            </div>
            <div className="container pt-4 pb-4">
                <div className="row">
                <div className="col text-center">
                    <div className="buttons d-flex justify-content-center">
                    {loadingSubmit ? (
                          <button className="btn btn-secondary w-100 for-size-padding" disabled>
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              Loading...
                          </button>
                      ) : (
                        <button type="button" className="btn btn-sm btn-success me-2" onClick={generateValuation}>Save & Generate Valuation Data</button>
                      )}  
                    </div>
                </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelForm;
