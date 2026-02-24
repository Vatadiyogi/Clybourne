// import React, { useState, useRef, useEffect } from 'react'; // Added useEffect
// import { formatNumber } from "../../../../common/utils/numberUtils";
// import axios from 'axios';
// import { apiURL } from '../../../../Config';
// import Swal from 'sweetalert2';
// import EmailReport from '../../../report/EmailReport';
// import { generatePdf } from '../../../../common/utils/pdfUtils';
// import "../../../report/Report.css";
// import { useNavigate } from 'react-router-dom';

// const SummaryValuation = ({ data }) => {
//   // Initialize with proper default structure to prevent null errors
//   const [generatingPreview, setGeneratingPreview] = useState(false);
//   const [loadingSubmit, setLoadingSubmit] = useState(false);
//   const [formData, setFormData] = useState(null); // Initialize as null
//   const reportRef = useRef();
//   const navigate = useNavigate();

//   // Initialize formData when data changes
//   useEffect(() => {
//     if (data) {
//       console.log('Initializing formData from props:', data);

//       const defaultCheckBoxes = {
//         checkBoxPE: false,
//         checkBoxPE_1: false,
//         checkBoxPS: false,
//         checkBoxPS_1: false,
//         checkBoxEV_SALES: false,
//         checkBoxEV_SALES_1: false,
//         checkBoxEV_EBITDA: false,
//         checkBoxEV_EBITDA_1: false
//       };

//       const defaultObject = {
//         netValue: 0,
//         multipleFactor: 0,
//         adjMultipleFactor: 0,
//         minEqValue: 0,
//         equityValue: 0,
//         maxEqValue: 0,
//         RelativeWeightPercent: 0
//       };

//       // Get checkbox values from various possible locations
//       const checkBoxesValues =
//         data.checkBoxesValues ||
//         data.query?.checkBoxesValues ||
//         defaultCheckBoxes;

//     console.log('Using checkbox values:', checkBoxesValues);
//       console.log('Final checkbox values:', checkBoxesValues);

//       const newFormData = {
//         ...data,
//         // Store checkbox values at root level for easier access
//         checkBoxesValues: checkBoxesValues,
//         query: {
//           ...(data?.query || {}),
//           _id: data?.query?._id || data?._id || '',
//         },
//         PE: data?.PE || defaultObject,
//         PE_1: data?.PE_1 || defaultObject,
//         PS: data?.PS || defaultObject,
//         PS_1: data?.PS_1 || defaultObject,
//         EV_SALES: data?.EV_SALES || defaultObject,
//         EV_SALES_1: data?.EV_SALES_1 || defaultObject,
//         EV_EBITDA: data?.EV_EBITDA || defaultObject,
//         EV_EBITDA_1: data?.EV_EBITDA_1 || defaultObject,
//         workBackEndInputs: data?.workBackEndInputs || { dcfWeightPercentage: 0 },
//         netDebt: data?.netDebt || 0,
//         weightMinEquityValue: data?.weightMinEquityValue || 0,
//         weightAvgEquityValue: data?.weightAvgEquityValue || 0,
//         weightMaxEquityValue: data?.weightMaxEquityValue || 0,
//         EnterpriseMinValue: data?.EnterpriseMinValue || 0,
//         EnterpriseAvgValue: data?.EnterpriseAvgValue || 0,
//         EnterpriseMaxValue: data?.EnterpriseMaxValue || 0
//       };

//       setFormData(newFormData);
//     }
//   }, [data]);

//   const handleCheckboxChange = (key) => {
//     setFormData((prevData) => {
//       if (!prevData) return prevData;

//       return {
//         ...prevData,
//         checkBoxesValues: {
//           ...(prevData.checkBoxesValues || {}),
//           [key]: !(prevData.checkBoxesValues?.[key] || false),
//         },
//       };
//     });
//   };

//   const handleSubmit = async () => {
//     if (!formData) return;

//     setLoadingSubmit(true);
//     try {
//       // Get current checkbox values from formData.checkBoxesValues
//       const currentCheckBoxesValues = formData.checkBoxesValues || {
//         checkBoxPE: false,
//         checkBoxPE_1: false,
//         checkBoxPS: false,
//         checkBoxPS_1: false,
//         checkBoxEV_SALES: false,
//         checkBoxEV_SALES_1: false,
//         checkBoxEV_EBITDA: false,
//         checkBoxEV_EBITDA_1: false
//       };

//       const body = {
//         checkBoxValues: currentCheckBoxesValues,
//       };

//       console.log('Sending checkbox data:', body);

//       if (!formData.query?._id) {
//         Swal.fire('Error!', 'Order ID is missing.', 'error');
//         return;
//       }

//       const response = await axios.put(
//         `${apiURL}api/admin/orders/checkbox-calculations/${formData.query._id}`,
//         body,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log('Response from server:', response.data);

//       // Update state with response data
//       const responseData = response.data || {};
//       setFormData((prevData) => ({
//         ...prevData,
//         ...responseData,
//         // Update checkbox values from response (check multiple locations)
//         checkBoxesValues:
//           responseData.checkBoxesValues ||
//           responseData.query?.checkBoxesValues ||
//           prevData.checkBoxesValues,
//         query: {
//           ...prevData.query,
//           _id: responseData.query?._id || prevData.query?._id,
//         }
//       }));

//       Swal.fire('Success', 'Calculations saved to database!', 'success');

//       // Optional: reload after success
//       setTimeout(() => {
//         window.location.reload();
//       }, 1500);

//     } catch (error) {
//       console.error('Error submitting form', error);
//       Swal.fire('Error!', 'Failed to update calculations.', 'error');
//     } finally {
//       setLoadingSubmit(false);
//     }
//   };

//   // Add a debug button to see current state
//   // const debugState = () => {
//   //   console.log('Current formData:', formData);
//   //   console.log('Checkbox values:', formData?.checkBoxesValues);
//   //   Swal.fire({
//   //     title: 'Debug Info',
//   //     html: `
//   //       <div style="text-align: left;">
//   //         <h6>Checkbox Values:</h6>
//   //         <pre>${JSON.stringify(formData?.checkBoxesValues || {}, null, 2)}</pre>
//   //         <hr>
//   //         <h6>Order ID:</h6>
//   //         <p>${formData?.query?._id || 'N/A'}</p>
//   //       </div>
//   //     `,
//   //     width: '600px'
//   //   });
//   // };

//   // Show loading if formData is not initialized yet
//   if (!formData) {
//     return (
//       <div className="text-center p-5">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <p className="mt-3">Loading valuation data...</p>
//       </div>
//     );
//   }

//   const Parameters = ['', 'Particular', 'Financial Metric', 'Multiple Factor', 'Adj. Multiple Factor', 'Equity Min Value', 'Equity Avg. Value', 'Equity Max Value', 'Weight(%)'];

//   const SummaryParameters = [
//     { key: "pe", label: "P/E Multiple", checkBoxKey: "checkBoxPE" },
//     { key: "pe_1", label: "P/E Multiple (1 yr forward)", checkBoxKey: "checkBoxPE_1" },
//     { key: "ps", label: "P/S Multiple", checkBoxKey: "checkBoxPS" },
//     { key: "ps_1", label: "P/S Multiple (1 yr forward)", checkBoxKey: "checkBoxPS_1" },
//     { key: "ev", label: "EV/Sales Multiple", checkBoxKey: "checkBoxEV_SALES" },
//     { key: "ev_1", label: "EV/Sales Multiple (1 yr forward)", checkBoxKey: "checkBoxEV_SALES_1" },
//     { key: "ebitda", label: "EV/EBITDA Multiple", checkBoxKey: "checkBoxEV_EBITDA" },
//     { key: "ebitda_1", label: "EV/EBITDA Multiple (1 yr forward)", checkBoxKey: "checkBoxEV_EBITDA_1" }
//   ];
//   const emailReport = async () => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: "Are you sure you want to complete this report calculation and email the final report to customer?",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, complete and send to customer',
//       cancelButtonText: 'No',
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33'
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         if (!reportRef.current) {
//           console.error('Report reference is not set.');
//           Swal.fire('Error!', 'Report reference is not available.', 'error');
//           return;
//         }

//         setLoadingSubmit(true);
//         try {
//           // Generate the PDF using the ref
//           const pdfBlob = await generatePdf(reportRef);

//           // Prepare the form data to send to the backend
//           const formDataToSend = new FormData();
//           formDataToSend.append('pdf', pdfBlob, 'report.pdf');
//           formDataToSend.append('orderId', formData.query?._id || '');

//           // Send the PDF to the backend for storage
//           await axios.post(`${apiURL}api/admin/orders/complete-order`, formDataToSend, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           });

//           Swal.fire({
//             title: 'Success!',
//             text: 'The report has been emailed to the customer.',
//             icon: 'success',
//             confirmButtonText: 'OK'
//           }).then((result) => {
//             if (result.isConfirmed) {
//               navigate('/orders');
//             }
//           });
//         } catch (error) {
//           console.error('Error sending report:', error);
//           Swal.fire('Error!', 'There was an error sending the report.', 'error');
//         } finally {
//           setLoadingSubmit(false);
//         }
//       }
//     });
//   };
//   // Add new function for EJS report
//   const previewEJSReport = async () => {
//     try {
//       if (!formData.query?._id) {
//         Swal.fire('Error!', 'Order ID is missing.', 'error');
//         return;
//       }

//       setGeneratingPreview(true);

//       // Open EJS report in new tab
//       const previewUrl = `${apiURL}api/admin/orders/${formData.query._id}/report-ejs?format=html`;
//       window.open(previewUrl, '_blank');

//     } catch (error) {
//       console.error('Error:', error);
//       Swal.fire('Error!', 'Failed to generate preview.', 'error');
//     } finally {
//       setGeneratingPreview(false);
//     }
//   };
//   // Render cell data based on parameter key
//   const renderCellData = (paramKey, field) => {
//     switch (paramKey) {
//       case "pe":
//         return formData.PE?.[field] || 0;
//       case "pe_1":
//         return formData.PE_1?.[field] || 0;
//       case "ps":
//         return formData.PS?.[field] || 0;
//       case "ps_1":
//         return formData.PS_1?.[field] || 0;
//       case "ev":
//         return formData.EV_SALES?.[field] || 0;
//       case "ev_1":
//         return formData.EV_SALES_1?.[field] || 0;
//       case "ebitda":
//         return formData.EV_EBITDA?.[field] || 0;
//       case "ebitda_1":
//         return formData.EV_EBITDA_1?.[field] || 0;
//       default:
//         return 0;
//     }
//   };
//   const downloadEJSReport = async () => {
//     try {
//       if (!formData.query?._id) {
//         Swal.fire('Error!', 'Order ID is missing.', 'error');
//         return;
//       }

//       setGeneratingPreview(true);

//       // Show loading
//       Swal.fire({
//         title: 'Generating PDF Report',
//         text: 'Please wait while we generate your report...',
//         allowOutsideClick: false,
//         showConfirmButton: false,
//         didOpen: () => Swal.showLoading()
//       });

//       // Get order ID
//       const orderId = formData.query._id;

//       // Create the download URL
//       const downloadUrl = `${apiURL}api/admin/orders/${orderId}/report-ejs`;

//       console.log('Downloading PDF from:', downloadUrl);

//       // Method 1: Fetch the PDF as blob and create download
//       const response = await fetch(downloadUrl, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/pdf',
//         },

//       });

//    console.log('Downloaded pdf:', response.body);

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // Get the PDF blob
//       const pdfBlob = await response.blob();

//       // Verify it's a PDF
//       if (pdfBlob.type !== 'application/pdf') {
//         throw new Error('Server did not return a PDF file');
//       }

//       // Create download link
//       const url = window.URL.createObjectURL(pdfBlob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `Valuation-Report-${orderId}.pdf`;
//       document.body.appendChild(link);
//       link.click();

//       setTimeout(() => {
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(url);
//       }, 100);


//       // Success message
//       Swal.fire({
//         icon: 'success',
//         title: 'Download Started',
//         text: 'Your valuation report PDF is downloading.',
//         timer: 2000,
//         showConfirmButton: false
//       });

//     } catch (error) {
//       console.error('Error downloading PDF:', error);

//       // Try alternative method - direct link
//       try {
//         const orderId = formData.query._id;
//         const directUrl = `${apiURL}api/admin/orders/${orderId}/report-ejs`;

//         Swal.fire({
//           icon: 'info',
//           title: 'Alternative Method',
//           html: `
//             <p>Try downloading directly:</p>
//             <p><a href="${directUrl}" target="_blank" class="btn btn-primary">Click to Download</a></p>
//             <p>Or copy this URL: <code>${directUrl}</code></p>
//           `,
//           showConfirmButton: true,
//           confirmButtonText: 'OK'
//         });

//       } catch (fallbackError) {
//         Swal.fire({
//           icon: 'error',
//           title: 'Download Failed',
//           text: 'Failed to download report. Please try again.',
//         });
//       }
//     } finally {
//       setGeneratingPreview(false);
//     }
//   };
//   // Add this function for testing
//   const testReportGeneration = async () => {
//     try {
//       if (!formData.query?._id) {
//         Swal.fire('Error!', 'Order ID is missing.', 'error');
//         return;
//       }

//       const orderId = formData.query._id;

//       // Test HTML first
//       const testUrl = `${apiURL}api/admin/orders/${orderId}/report-ejs?format=html`;
//       window.open(testUrl, '_blank');

//       // Then test PDF after 2 seconds
//       setTimeout(() => {
//         const pdfUrl = `${apiURL}api/admin/orders/${orderId}/report-ejs`;
//         window.open(pdfUrl, '_blank');
//       }, 2000);

//     } catch (error) {
//       console.error('Test error:', error);
//       Swal.fire('Error!', 'Test failed. Check console.', 'error');
//     }
//   };

//   return (
//     <>
//       <div className="row mb-3">
//         <div className="col">
//           <h5 className="sheet-heading">Summary Valuation</h5>
//         </div>
//         {/* <div className="col-auto">
//           <button
//             className="btn btn-sm btn-outline-secondary"
//             onClick={debugState}
//             title="Debug current state"
//           >
//             <i className="bi bi-bug"></i> Debug
//           </button>
//         </div> */}
//       </div>

//       <div className="row">
//         <div className="col-md-6">
//           <div className="label-value">
//             <span className="label1">DCF Weightage (%): </span>
//             <span className="label2">{formData.workBackEndInputs?.dcfWeightPercentage || 0}</span>
//           </div>
//         </div>
//       </div>
//       <div className="row">
//         <div className="col-md-6">
//           <div className="label-value">
//             <span className="label1">Net Debt: </span>
//             <span className="label2">{formatNumber(formData.netDebt || 0)}</span>
//           </div>
//         </div>
//       </div>

//       <div className="table-responsive summary-table">
//         <table className="table table-bordered">
//           <thead>
//             <tr>
//               {Parameters.map((param, rowIndex) => (
//                 <th scope="col" key={rowIndex}>{param}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {SummaryParameters.map((summaryparam, rowIndex) => {
//               const equityValue = renderCellData(summaryparam.key, 'equityValue');
//               const relativeWeight = renderCellData(summaryparam.key, 'RelativeWeightPercent');

//               // Check if this metric has valid data
//               const hasValidValues = (equityValue && equityValue !== 0) ||
//                 (relativeWeight && relativeWeight !== 0);

//               // Use existing checkbox value OR auto-check if has valid values
//               const shouldBeChecked = formData.checkBoxesValues?.[summaryparam.checkBoxKey] || hasValidValues;

//               return (
//                 <tr key={rowIndex}>
//                   <td>
//                     <div className="form-check form-check-primary form-check-inline">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         id={`form-check-${summaryparam.key}`}
//                         checked={shouldBeChecked}
//                         onChange={() => handleCheckboxChange(summaryparam.checkBoxKey)}
//                         disabled={!shouldBeChecked}
//                       />
//                     </div>
//                   </td>
//                   <td>{summaryparam.label}</td>
//                   <td className="textRight">{formatNumber(renderCellData(summaryparam.key, 'netValue'))}</td>
//                   <td className="textRight">{formatNumber(renderCellData(summaryparam.key, 'multipleFactor'))}</td>
//                   <td className="textRight">{formatNumber(renderCellData(summaryparam.key, 'adjMultipleFactor'))}</td>
//                   <td className="textRight">{formatNumber(renderCellData(summaryparam.key, 'minEqValue'))}</td>
//                   <td className="textRight">{formatNumber(renderCellData(summaryparam.key, 'equityValue'))}</td>
//                   <td className="textRight">{formatNumber(renderCellData(summaryparam.key, 'maxEqValue'))}</td>
//                   <td className="textRight">
//                     {renderCellData(summaryparam.key, 'RelativeWeightPercent') === 0
//                       ? ''
//                       : formatNumber(renderCellData(summaryparam.key, 'RelativeWeightPercent'))}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {loadingSubmit ? (
//         <button className="btn btn-secondary w-100 for-size-padding" disabled>
//           <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
//           Loading...
//         </button>
//       ) : (
//         <div className="buttons d-flex justify-content">
//           <button type="submit" className="btn btn-sm btn-primary me-2" onClick={handleSubmit}>
//             Save & Re-calculate Weighted Average Values
//           </button>
//         </div>
//       )}

//       <br /><br />

//       {/* Value of Company */}
//       <div className="row equity_value">
//         <div className="row">
//           <div className="equity-first-item equity-value-item-heading"></div>
//           <div className="other-items year-item">
//             <b>Min.</b>
//           </div>
//           <div className="other-items year-item">
//             <b>Average</b>
//           </div>
//           <div className="other-items year-item">
//             <b>Max.</b>
//           </div>
//         </div>
//         <div className="row">
//           <div className="first-item value-item-heading">Weighted Average Equity Value of the Company</div>
//           <div className="other-items year-item">
//             <input type="text" className="form-control form-control-additonal-style"
//               value={formatNumber(formData.weightMinEquityValue || 0)} readOnly />
//           </div>
//           <div className="other-items year-item">
//             <input type="text" className="form-control form-control-additonal-style"
//               value={formatNumber(formData.weightAvgEquityValue || 0)} readOnly />
//           </div>
//           <div className="other-items year-item">
//             <input type="text" className="form-control form-control-additonal-style"
//               value={formatNumber(formData.weightMaxEquityValue || 0)} readOnly />
//           </div>
//         </div>
//         <div className="row">
//           <div className="first-item value-item-heading">Add : Net Debt</div>
//           <div className="other-items year-item">
//             <input type="text" className="form-control form-control-additonal-style"
//               value={formatNumber(formData.netDebt || 0)} readOnly />
//           </div>
//           <div className="other-items year-item">
//             <input type="text" className="form-control form-control-additonal-style"
//               value={formatNumber(formData.netDebt || 0)} readOnly />
//           </div>
//           <div className="other-items year-item">
//             <input type="text" className="form-control form-control-additonal-style"
//               value={formatNumber(formData.netDebt || 0)} readOnly />
//           </div>
//         </div>
//         <div className="row">
//           <div className="first-item value-item-heading">Enterprise Value (INR)</div>
//           <div className="other-items year-item">
//             <input type="text" className="form-control form-control-additonal-style"
//               value={formatNumber(formData.EnterpriseMinValue || 0)} readOnly />
//           </div>
//           <div className="other-items year-item">
//             <input type="text" className="form-control form-control-additonal-style"
//               value={formatNumber(formData.EnterpriseAvgValue || 0)} readOnly />
//           </div>
//           <div className="other-items year-item">
//             <input type="text" className="form-control form-control-additonal-style"
//               value={formatNumber(formData.EnterpriseMaxValue || 0)} readOnly />
//           </div>
//         </div>
//       </div>

//       <div className="container pt-4 pb-4">
//         <div className="row">
//           <div className="col text-center">
//             {loadingSubmit || generatingPreview ? (
//               <button className="btn btn-secondary w-100 for-size-padding" disabled>
//                 <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
//                 {generatingPreview ? 'Generating Report...' : 'Loading...'}
//               </button>
//             ) : (
//               <div className="buttons d-flex justify-content-center flex-wrap gap-2">
//                 {/* Existing Button 1: View Current Report */}
//                 <button
//                   className="btn btn-sm btn-primary"
//                   onClick={() => {
//                     if (formData.query?._id) {
//                       window.open(`/report/${formData.query._id}`, '_blank', 'noopener,noreferrer');
//                     } else {
//                       Swal.fire('Error!', 'Order ID is missing.', 'error');
//                     }
//                   }}
//                   disabled={!formData.query?._id}
//                   title="View the current report format"
//                 >
//                   View Current Report
//                 </button>

//                 {/* New Button 2: Preview Dynamic Report */}
//                 <button
//                   className="btn btn-sm btn-info text-white"
//                   onClick={previewEJSReport}
//                   disabled={!formData.query?._id || generatingPreview}
//                   title="Preview the new dynamic report design"
//                 >
//                   <i className="bi bi-eye me-1"></i>
//                   Preview New Report
//                 </button>

//                 {/* New Button 3: Download Dynamic Report */}
//                 <button
//                   className="btn btn-sm btn-success"
//                   onClick={downloadEJSReport}
//                   disabled={!formData.query?._id || generatingPreview}
//                   title="Download the new dynamic report as PDF"
//                 >
//                   <i className="bi bi-download me-1"></i>
//                   Download New Report
//                 </button>

//                 {/* Existing Button 4: Email Report */}
//                 <button
//                   type="button"
//                   className="btn btn-sm btn-warning text-white"
//                   onClick={emailReport}
//                   disabled={!formData.query?._id}
//                   title="Email report to customer"
//                 >
//                   <i className="bi bi-envelope me-1"></i>
//                   Email Report
//                 </button>
//                 {/* // Add this button to your button group: */}
//                 <button
//                   className="btn btn-sm btn-secondary"
//                   onClick={testReportGeneration}
//                   title="Test report generation"
//                 >
//                   <i className="bi bi-bug me-1"></i>
//                   Test Report
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* Make sure to use formData.checkBoxesValues instead of formData.query.checkBoxesValues */}

//       <EmailReport ref={reportRef} />
//     </>
//   )
// }

// export default SummaryValuation;

import React, { useState, useRef, useEffect } from 'react'; // Added useEffect
import { formatNumber } from "../../../../common/utils/numberUtils";
import axios from 'axios';
import { apiURL } from '../../../../Config';
import Swal from 'sweetalert2';
import EmailReport from '../../../report/EmailReport';
import { generatePdf } from '../../../../common/utils/pdfUtils';
import "../../../report/Report.css";
import { useNavigate } from 'react-router-dom';

const SummaryValuation = ({ data }) => {
  // Initialize with proper default structure to prevent null errors
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [formData, setFormData] = useState(null); // Initialize as null
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const reportRef = useRef();
  const navigate = useNavigate();

  // Initialize formData when data changes
  useEffect(() => {
    if (data) {
      console.log('Initializing formData from props:', data);

      const defaultCheckBoxes = {
        checkBoxPE: true,
        checkBoxPE_1: true,
        checkBoxPS: true,
        checkBoxPS_1: true,
        checkBoxEV_SALES: true,
        checkBoxEV_SALES_1: true,
        checkBoxEV_EBITDA: true,
        checkBoxEV_EBITDA_1: true
      };

      const defaultObject = {
        netValue: 0,
        multipleFactor: 0,
        adjMultipleFactor: 0,
        minEqValue: 0,
        equityValue: 0,
        maxEqValue: 0,
        RelativeWeightPercent: 0
      };

      // Get checkbox values from various possible locations
      const checkBoxesValuesFromData = data.checkBoxesValues || data.query?.checkBoxesValues;
      
      // Helper function to check if a method has valid values
      const hasValidValues = (methodKey) => {
        let methodData;
        switch (methodKey) {
          case 'checkBoxPE':
            methodData = data.PE;
            break;
          case 'checkBoxPE_1':
            methodData = data.PE_1;
            break;
          case 'checkBoxPS':
            methodData = data.PS;
            break;
          case 'checkBoxPS_1':
            methodData = data.PS_1;
            break;
          case 'checkBoxEV_SALES':
            methodData = data.EV_SALES;
            break;
          case 'checkBoxEV_SALES_1':
            methodData = data.EV_SALES_1;
            break;
          case 'checkBoxEV_EBITDA':
            methodData = data.EV_EBITDA;
            break;
          case 'checkBoxEV_EBITDA_1':
            methodData = data.EV_EBITDA_1;
            break;
          default:
            return false;
        }
        
        // Check if method has valid equity value or relative weight
        const equityValue = methodData?.equityValue || 0;
        const relativeWeight = methodData?.RelativeWeightPercent || 0;
        return (equityValue && equityValue !== 0) || (relativeWeight && relativeWeight !== 0);
      };
      
      // Helper function: if method has values, check it; otherwise use saved preference or false
      const getCheckboxValue = (key) => {
        // First, check if the method has valid values
        const methodHasValues = hasValidValues(key);
        
        // If method has values, it should be checked by default
        if (methodHasValues) {
          // But if user explicitly saved it as false, respect that
          if (checkBoxesValuesFromData && checkBoxesValuesFromData[key] === false) {
            return false; // User explicitly unchecked it
          }
          return true; // Method has values, so check it
        }
        
        // If method doesn't have values, use saved preference or default to false
        if (checkBoxesValuesFromData && checkBoxesValuesFromData[key] !== undefined) {
          return checkBoxesValuesFromData[key];
        }
        
        return false; // No values, so unchecked
      };
      
      // Ensure all checkbox keys exist, defaulting based on whether they have values
      const finalCheckBoxesValues = {
        checkBoxPE: getCheckboxValue('checkBoxPE'),
        checkBoxPE_1: getCheckboxValue('checkBoxPE_1'),
        checkBoxPS: getCheckboxValue('checkBoxPS'),
        checkBoxPS_1: getCheckboxValue('checkBoxPS_1'),
        checkBoxEV_SALES: getCheckboxValue('checkBoxEV_SALES'),
        checkBoxEV_SALES_1: getCheckboxValue('checkBoxEV_SALES_1'),
        checkBoxEV_EBITDA: getCheckboxValue('checkBoxEV_EBITDA'),
        checkBoxEV_EBITDA_1: getCheckboxValue('checkBoxEV_EBITDA_1')
      };
      
      console.log('=== Checkbox Initialization ===');
      console.log('Checkbox values from data:', checkBoxesValuesFromData);
      console.log('Final checkbox values:', finalCheckBoxesValues);
      
      // Debug: Check each method's values
      ['checkBoxPE', 'checkBoxPE_1', 'checkBoxPS', 'checkBoxPS_1', 
         'checkBoxEV_SALES', 'checkBoxEV_SALES_1', 'checkBoxEV_EBITDA', 'checkBoxEV_EBITDA_1'].forEach(key => {
        const hasValues = hasValidValues(key);
        const finalValue = finalCheckBoxesValues[key];
        console.log(`${key}: hasValues=${hasValues}, finalValue=${finalValue}`);
      });

      console.log('Using checkbox values:', finalCheckBoxesValues);
      console.log('Final checkbox values:', finalCheckBoxesValues);

      const newFormData = {
        ...data,
        // Store checkbox values at root level for easier access
        checkBoxesValues: finalCheckBoxesValues,
        query: {
          ...(data?.query || {}),
          _id: data?.query?._id || data?._id || '',
        },
        PE: data?.PE || defaultObject,
        PE_1: data?.PE_1 || defaultObject,
        PS: data?.PS || defaultObject,
        PS_1: data?.PS_1 || defaultObject,
        EV_SALES: data?.EV_SALES || defaultObject,
        EV_SALES_1: data?.EV_SALES_1 || defaultObject,
        EV_EBITDA: data?.EV_EBITDA || defaultObject,
        EV_EBITDA_1: data?.EV_EBITDA_1 || defaultObject,
        workBackEndInputs: data?.workBackEndInputs || { dcfWeightPercentage: 0 },
        netDebt: data?.netDebt || 0,
        weightMinEquityValue: data?.weightMinEquityValue || 0,
        weightAvgEquityValue: data?.weightAvgEquityValue || 0,
        weightMaxEquityValue: data?.weightMaxEquityValue || 0,
        EnterpriseMinValue: data?.EnterpriseMinValue || 0,
        EnterpriseAvgValue: data?.EnterpriseAvgValue || 0,
        EnterpriseMaxValue: data?.EnterpriseMaxValue || 0,
        adminDescription: data?.adminDescription ?? data?.query?.adminDescription ?? ''
      };

      setFormData(newFormData);
    }
  }, [data]);

  const openAddDescriptionModal = async () => {
    if (!formData?.query?._id) {
      Swal.fire('Error!', 'Order ID is missing.', 'error');
      return;
    }
    const currentDescription = formData.adminDescription || '';
    const { value: adminDescription } = await Swal.fire({
      title: 'Add Description',
      html: '<p class="text-muted small mb-2">Admin description for this valuation (saved to valuation data).</p>',
      input: 'textarea',
      inputLabel: 'Description',
      inputValue: currentDescription,
      inputPlaceholder: 'Enter description...',
      inputAttributes: { rows: 5 },
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => null,
    });
    if (adminDescription === undefined) return;
    try {
      await axios.put(
        `${apiURL}api/admin/orders/valuation-data/${formData.query._id}/admin-description`,
        { adminDescription: adminDescription || null },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setFormData((prev) => (prev ? { ...prev, adminDescription: adminDescription || '' } : prev));
      Swal.fire('Saved!', 'Admin description has been saved.', 'success');
    } catch (err) {
      console.error('Error saving admin description:', err);
      Swal.fire('Error!', 'Failed to save description.', 'error');
    }
  };

  const handleCheckboxChange = async (key) => {
    if (!formData || !formData.query?._id) {
      Swal.fire('Error!', 'Order ID is missing.', 'error');
      return;
    }
    setHasUserInteracted(true);

    // Get current value before toggling
    const currentValue = formData.checkBoxesValues?.[key] || false;
    const newValue = !currentValue;

    console.log(`Checkbox ${key}: ${currentValue} -> ${newValue}`);

    // Update local state immediately for UI responsiveness
    const updatedCheckBoxesValues = {
      ...(formData.checkBoxesValues || {}),
      [key]: newValue, // Explicitly set the new value
    };

    // Store the previous value for potential rollback
    const previousValue = currentValue;

    setFormData((prevData) => {
      if (!prevData) return prevData;
      return {
        ...prevData,
        checkBoxesValues: {
          ...(prevData.checkBoxesValues || {}),
          [key]: newValue, // Ensure the new value is set
        },
      };
    });

    // Save to database immediately
    try {
      const body = {
        checkBoxValues: updatedCheckBoxesValues,
      };

      console.log('Saving checkbox change to database:', key, 'New value:', updatedCheckBoxesValues[key]);
      console.log('All checkbox values being sent:', updatedCheckBoxesValues);

      const response = await axios.put(
        `${apiURL}api/admin/orders/checkbox-calculations/${formData.query._id}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log('Checkbox saved successfully:', response.data);
      console.log('Checkbox values in response:', response.data.query?.checkBoxesValues || response.data.checkBoxesValues);

      // Update state with response data to ensure sync
      const responseData = response.data || {};
      
      // Get checkbox values from response - use what server saved
      // The server should return the exact values we sent, including false values
      const savedCheckBoxesValues = 
        responseData.query?.checkBoxesValues || 
        responseData.checkBoxesValues;
      
      // Verify the server saved the value we sent (especially important for false values)
      let finalCheckBoxesValues = savedCheckBoxesValues || updatedCheckBoxesValues;
      
      if (savedCheckBoxesValues) {
        // Check if the server saved the correct value for the checkbox we just changed
        const serverValue = savedCheckBoxesValues[key];
        if (serverValue !== newValue) {
          console.warn(`Server value mismatch for ${key}: expected ${newValue}, got ${serverValue}. Using our value.`);
          // Use our updated value instead of server value for this checkbox
          finalCheckBoxesValues = {
            ...savedCheckBoxesValues,
            [key]: newValue
          };
        } else {
          console.log(`Server confirmed checkbox ${key} = ${newValue}`);
        }
      } else {
        console.warn('Server did not return checkbox values, using local values');
        finalCheckBoxesValues = updatedCheckBoxesValues;
      }
      
      console.log('Final checkbox values to use:', finalCheckBoxesValues);

      setFormData((prevData) => {
        if (!prevData) return prevData;
        return {
          ...prevData,
          // Only update specific fields from response, don't spread everything
          checkBoxesValues: finalCheckBoxesValues,
          PE: responseData.PE !== undefined ? responseData.PE : prevData.PE,
          PE_1: responseData.PE_1 !== undefined ? responseData.PE_1 : prevData.PE_1,
          PS: responseData.PS !== undefined ? responseData.PS : prevData.PS,
          PS_1: responseData.PS_1 !== undefined ? responseData.PS_1 : prevData.PS_1,
          EV_SALES: responseData.EV_SALES !== undefined ? responseData.EV_SALES : prevData.EV_SALES,
          EV_SALES_1: responseData.EV_SALES_1 !== undefined ? responseData.EV_SALES_1 : prevData.EV_SALES_1,
          EV_EBITDA: responseData.EV_EBITDA !== undefined ? responseData.EV_EBITDA : prevData.EV_EBITDA,
          EV_EBITDA_1: responseData.EV_EBITDA_1 !== undefined ? responseData.EV_EBITDA_1 : prevData.EV_EBITDA_1,
          netDebt: responseData.netDebt !== undefined ? responseData.netDebt : prevData.netDebt,
          weightAvgEquityValue: responseData.weightAvgEquityValue !== undefined ? responseData.weightAvgEquityValue : prevData.weightAvgEquityValue,
          weightMinEquityValue: responseData.weightMinEquityValue !== undefined ? responseData.weightMinEquityValue : prevData.weightMinEquityValue,
          weightMaxEquityValue: responseData.weightMaxEquityValue !== undefined ? responseData.weightMaxEquityValue : prevData.weightMaxEquityValue,
          EnterpriseAvgValue: responseData.EnterpriseAvgValue !== undefined ? responseData.EnterpriseAvgValue : prevData.EnterpriseAvgValue,
          EnterpriseMinValue: responseData.EnterpriseMinValue !== undefined ? responseData.EnterpriseMinValue : prevData.EnterpriseMinValue,
          EnterpriseMaxValue: responseData.EnterpriseMaxValue !== undefined ? responseData.EnterpriseMaxValue : prevData.EnterpriseMaxValue,
          workBackEndInputs: responseData.workBackEndInputs || prevData.workBackEndInputs,
          query: {
            ...prevData.query,
            _id: responseData.query?._id || prevData.query?._id,
          }
        };
      });

    } catch (error) {
      console.error('Error saving checkbox to database:', error);
      
      // Revert the checkbox change on error
      setFormData((prevData) => {
        if (!prevData) return prevData;
        return {
          ...prevData,
          checkBoxesValues: {
            ...(prevData.checkBoxesValues || {}),
            [key]: previousValue, // Revert to previous value
          },
        };
      });

      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: `Failed to save checkbox change. Please try again.`,
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;

    setLoadingSubmit(true);
    try {
      // Get current checkbox values from formData.checkBoxesValues
      const currentCheckBoxesValues = formData.checkBoxesValues || {
        checkBoxPE: true,
        checkBoxPE_1: true,
        checkBoxPS: true,
        checkBoxPS_1: true,
        checkBoxEV_SALES: true,
        checkBoxEV_SALES_1: true,
        checkBoxEV_EBITDA: true,
        checkBoxEV_EBITDA_1: true
      };
      console.log('=== UI CHECKBOX VALUES (BEFORE SUBMIT) ===');
      console.log('PE:', currentCheckBoxesValues.checkBoxPE);
      console.log('PS:', currentCheckBoxesValues.checkBoxPS);
      console.log('EV_SALES:', currentCheckBoxesValues.checkBoxEV_SALES);
      console.log('EV_EBITDA:', currentCheckBoxesValues.checkBoxEV_EBITDA);
        console.log('PE1:', currentCheckBoxesValues.checkBoxPE_1);
      console.log('PS1:', currentCheckBoxesValues.checkBoxPS_1);
      console.log('EV_SALE1S:', currentCheckBoxesValues.checkBoxEV_SALES_1);
      console.log('EV_EBITDA1:', currentCheckBoxesValues.checkBoxEV_EBITDA_1);
      const body = {
        checkBoxValues: currentCheckBoxesValues,
      };

      console.log('Sending checkbox data:', body);

      if (!formData.query?._id) {
        Swal.fire('Error!', 'Order ID is missing.', 'error');
        return;
      }

      const response = await axios.put(
        `${apiURL}api/admin/orders/checkbox-calculations/${formData.query._id}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log('Response from server:', response.data);

      // Update state with response data
      const responseData = response.data || {};
      setFormData((prevData) => ({
        ...prevData,
        ...responseData,
        // Update checkbox values from response (check multiple locations)
        checkBoxesValues:
          responseData.checkBoxesValues ||
          responseData.query?.checkBoxesValues ||
          prevData.checkBoxesValues,
        query: {
          ...prevData.query,
          _id: responseData.query?._id || prevData.query?._id,
        }
      }));

      Swal.fire('Success', 'Calculations saved to database!', 'success');

      // Optional: reload after success
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Error submitting form', error);
      Swal.fire('Error!', 'Failed to update calculations.', 'error');
    } finally {
      setLoadingSubmit(false);
    }
  };


  // Show loading if formData is not initialized yet
  if (!formData) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading valuation data...</p>
      </div>
    );
  }

  const Parameters = ['', 'Particular', 'Financial Metric', 'Multiple Factor', 'Adj. Multiple Factor', 'Equity Min Value', 'Equity Avg. Value', 'Equity Max Value', 'Weight(%)'];

  const SummaryParameters = [
    { key: "pe", label: "P/E Multiple", checkBoxKey: "checkBoxPE" },
    { key: "pe_1", label: "P/E Multiple (1 yr forward)", checkBoxKey: "checkBoxPE_1" },
    { key: "ps", label: "P/S Multiple", checkBoxKey: "checkBoxPS" },
    { key: "ps_1", label: "P/S Multiple (1 yr forward)", checkBoxKey: "checkBoxPS_1" },
    { key: "ev", label: "EV/Sales Multiple", checkBoxKey: "checkBoxEV_SALES" },
    { key: "ev_1", label: "EV/Sales Multiple (1 yr forward)", checkBoxKey: "checkBoxEV_SALES_1" },
    { key: "ebitda", label: "EV/EBITDA Multiple", checkBoxKey: "checkBoxEV_EBITDA" },
    { key: "ebitda_1", label: "EV/EBITDA Multiple (1 yr forward)", checkBoxKey: "checkBoxEV_EBITDA_1" }
  ];
  const emailReport = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to complete this report calculation and email the final report to customer?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, complete and send to customer',
      cancelButtonText: 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!reportRef.current) {
          console.error('Report reference is not set.');
          Swal.fire('Error!', 'Report reference is not available.', 'error');
          return;
        }

        setLoadingSubmit(true);
        try {
          // Generate the PDF using the ref
          const pdfBlob = await generatePdf(reportRef);

          // Prepare the form data to send to the backend
          const formDataToSend = new FormData();
          formDataToSend.append('pdf', pdfBlob, 'report.pdf');
          formDataToSend.append('orderId', formData.query?._id || '');

          // Send the PDF to the backend for storage
          await axios.post(`${apiURL}api/admin/orders/complete-order`, formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          Swal.fire({
            title: 'Success!',
            text: 'The report has been emailed to the customer.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/orders');
            }
          });
        } catch (error) {
          console.error('Error sending report:', error);
          Swal.fire('Error!', 'There was an error sending the report.', 'error');
        } finally {
          setLoadingSubmit(false);
        }
      }
    });
  };
  // Add new function for EJS report
  const previewEJSReport = async () => {
    // handleSubmit()
    try {
      if (!formData.query?._id) {
        Swal.fire('Error!', 'Order ID is missing.', 'error');
        return;
      }

      setGeneratingPreview(true);

      // Open EJS report in new tab
      const previewUrl = `${apiURL}api/admin/orders/${formData.query._id}/report-ejs?format=html`;
      window.open(previewUrl, '_blank');

    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error!', 'Failed to generate preview.', 'error');
    } finally {
      setGeneratingPreview(false);
    }
  };
  // Render cell data based on parameter key
  const renderCellData = (paramKey, field) => {
    switch (paramKey) {
      case "pe":
        return formData.PE?.[field] || 0;
      case "pe_1":
        return formData.PE_1?.[field] || 0;
      case "ps":
        return formData.PS?.[field] || 0;
      case "ps_1":
        return formData.PS_1?.[field] || 0;
      case "ev":
        return formData.EV_SALES?.[field] || 0;
      case "ev_1":
        return formData.EV_SALES_1?.[field] || 0;
      case "ebitda":
        return formData.EV_EBITDA?.[field] || 0;
      case "ebitda_1":
        return formData.EV_EBITDA_1?.[field] || 0;
      default:
        return 0;
    }
  };
  const downloadEJSReport = async () => {
    try {
      if (!formData.query?._id) {
        Swal.fire('Error!', 'Order ID is missing.', 'error');
        return;
      }

      setGeneratingPreview(true);

      // Show loading
      Swal.fire({
        title: 'Generating PDF Report',
        text: 'Please wait while we generate your report...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading()
      });

      // Get order ID
      const orderId = formData.query._id;

      // Create the download URL
      const downloadUrl = `${apiURL}api/admin/orders/${orderId}/report-ejs`;

      console.log('Downloading PDF from:', downloadUrl);

      // Method 1: Fetch the PDF as blob and create download
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },

      });

      console.log('Downloaded pdf:', response.body);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Get the PDF blob
      const pdfBlob = await response.blob();

      // Verify it's a PDF
      if (pdfBlob.type !== 'application/pdf') {
        throw new Error('Server did not return a PDF file');
      }

      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Valuation-Report-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);


      // Success message
      Swal.fire({
        icon: 'success',
        title: 'Download Started',
        text: 'Your valuation report PDF is downloading.',
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      console.error('Error downloading PDF:', error);

      // Try alternative method - direct link
      try {
        const orderId = formData.query._id;
        const directUrl = `${apiURL}api/admin/orders/${orderId}/report-ejs`;

        Swal.fire({
          icon: 'info',
          title: 'Alternative Method',
          html: `
            <p>Try downloading directly:</p>
            <p><a href="${directUrl}" target="_blank" class="btn btn-primary">Click to Download</a></p>
            <p>Or copy this URL: <code>${directUrl}</code></p>
          `,
          showConfirmButton: true,
          confirmButtonText: 'OK'
        });

      } catch (fallbackError) {
        Swal.fire({
          icon: 'error',
          title: 'Download Failed',
          text: 'Failed to download report. Please try again.',
        });
      }
    } finally {
      setGeneratingPreview(false);
    }
  };
  // Add this function for testing
  const testReportGeneration = async () => {
    try {
      if (!formData.query?._id) {
        Swal.fire('Error!', 'Order ID is missing.', 'error');
        return;
      }

      const orderId = formData.query._id;

      // Test HTML first
      const testUrl = `${apiURL}api/admin/orders/${orderId}/report-ejs?format=html`;
      window.open(testUrl, '_blank');

      // Then test PDF after 2 seconds
      setTimeout(() => {
        const pdfUrl = `${apiURL}api/admin/orders/${orderId}/report-ejs`;
        window.open(pdfUrl, '_blank');
      }, 2000);

    } catch (error) {
      console.error('Test error:', error);
      Swal.fire('Error!', 'Test failed. Check console.', 'error');
    }
  };

  return (
    <>
      <div className="row mb-3">
        <div className="col">
          <h5 className="sheet-heading">Summary Valuation</h5>
        </div>
        {/* <div className="col-auto">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={debugState}
            title="Debug current state"
          >
            <i className="bi bi-bug"></i> Debug
          </button>
        </div> */}
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="label-value">
            <span className="label1">DCF Weightage (%): </span>
            <span className="label2">{formData.workBackEndInputs?.dcfWeightPercentage || 0}</span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="label-value">
            <span className="label1">Net Debt: </span>
            <span className="label2">{formatNumber(formData.netDebt || 0)}</span>
          </div>
        </div>
      </div>

      <div className="table-responsive summary-table">
        <table className="table table-bordered">
          <thead>
            <tr>
              {Parameters.map((param, rowIndex) => (
                <th scope="col" key={rowIndex}>{param}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SummaryParameters.map((summaryparam, rowIndex) => {
              
              const equityValue = renderCellData(summaryparam.key, 'multipleFactor');
              const relativeWeight = renderCellData(summaryparam.key, 'RelativeWeightPercent');
              // console.log("hasValidValues check now",equityValue)
              // Check if this metric has valid data
              const hasValidValues = (equityValue && equityValue > 0)? true:false;
              // If method has values, it should be checked (unless user explicitly unchecked it)
              // Otherwise use saved preference or default to false
             const savedValue = formData.checkBoxesValues?.[summaryparam.checkBoxKey];

              let isChecked;

              // 🟢 First load → ignore backend false → use auto rule
              if (!hasUserInteracted && savedValue === false) {
                isChecked = hasValidValues;
              }
              // 🟢 If backend has true → always true
              else if (savedValue === true) {
                isChecked = true;
              }
              // 🟢 User explicitly unchecked
              else if (savedValue === false) {
                isChecked = false;
              }
              // 🟢 No backend value
              else {
                isChecked = hasValidValues;

               }
              // Debug log for troubleshooting
              // if (rowIndex === 0) {
              //   console.log(`Checkbox ${summaryparam.checkBoxKey}: hasValidValues=${hasValidValues}, savedValue=${formData.checkBoxesValues?.[summaryparam.checkBoxKey]}, isChecked=${isChecked}`);
              // }

              return (
                <tr key={rowIndex}>
                  <td>
                    <div className="form-check form-check-primary form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`form-check-${summaryparam.key}`}
                        checked={isChecked} // ONLY use saved state value
                        onChange={() => handleCheckboxChange(summaryparam.checkBoxKey)}
                      // disabled={!shouldBeChecked}
                      />
                    </div>
                  </td>
                  <td>{summaryparam.label}</td>
                  <td className="textRight">{formatNumber(renderCellData(summaryparam.key, 'netValue'))}</td>
                  <td className="textRight">{formatNumber(renderCellData(summaryparam.key, 'multipleFactor'))}</td>
                  <td className="textRight">{formatNumber(renderCellData(summaryparam.key, 'adjMultipleFactor'))}</td>
                  <td className="textRight">{formatNumber(renderCellData(summaryparam.key, 'minEqValue'))}</td>
                  <td className="textRight">{formatNumber(renderCellData(summaryparam.key, 'equityValue'))}</td>
                  <td className="textRight">{formatNumber(renderCellData(summaryparam.key, 'maxEqValue'))}</td>
                  <td className="textRight">
                    {renderCellData(summaryparam.key, 'RelativeWeightPercent') === 0
                      ? ''
                      : formatNumber(renderCellData(summaryparam.key, 'RelativeWeightPercent'))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {loadingSubmit ? (
        <button className="btn btn-secondary w-100 for-size-padding" disabled>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Loading...
        </button>
      ) : (
        <div className="buttons d-flex justify-content">
          <button type="submit" className="btn btn-sm btn-primary me-2" onClick={handleSubmit}>
            Save & Re-calculate Weighted Average Values
          </button>
        </div>
      )}

      <br /><br />

      {/* Value of Company */}
      <div className="row equity_value">
        <div className="row">
          <div className="equity-first-item equity-value-item-heading"></div>
          <div className="other-items year-item">
            <b>Min.</b>
          </div>
          <div className="other-items year-item">
            <b>Average</b>
          </div>
          <div className="other-items year-item">
            <b>Max.</b>
          </div>
        </div>
        <div className="row">
          <div className="first-item value-item-heading">Weighted Average Equity Value of the Company</div>
          <div className="other-items year-item">
            <input type="text" className="form-control form-control-additonal-style"
              value={formatNumber(formData.weightMinEquityValue || 0)} readOnly />
          </div>
          <div className="other-items year-item">
            <input type="text" className="form-control form-control-additonal-style"
              value={formatNumber(formData.weightAvgEquityValue || 0)} readOnly />
          </div>
          <div className="other-items year-item">
            <input type="text" className="form-control form-control-additonal-style"
              value={formatNumber(formData.weightMaxEquityValue || 0)} readOnly />
          </div>
        </div>
        <div className="row">
          <div className="first-item value-item-heading">Add : Net Debt</div>
          <div className="other-items year-item">
            <input type="text" className="form-control form-control-additonal-style"
              value={formatNumber(formData.netDebt || 0)} readOnly />
          </div>
          <div className="other-items year-item">
            <input type="text" className="form-control form-control-additonal-style"
              value={formatNumber(formData.netDebt || 0)} readOnly />
          </div>
          <div className="other-items year-item">
            <input type="text" className="form-control form-control-additonal-style"
              value={formatNumber(formData.netDebt || 0)} readOnly />
          </div>
        </div>
        <div className="row">
          <div className="first-item value-item-heading">Enterprise Value (INR)</div>
          <div className="other-items year-item">
            <input type="text" className="form-control form-control-additonal-style"
              value={formatNumber(formData.EnterpriseMinValue || 0)} readOnly />
          </div>
          <div className="other-items year-item">
            <input type="text" className="form-control form-control-additonal-style"
              value={formatNumber(formData.EnterpriseAvgValue || 0)} readOnly />
          </div>
          <div className="other-items year-item">
            <input type="text" className="form-control form-control-additonal-style"
              value={formatNumber(formData.EnterpriseMaxValue || 0)} readOnly />
          </div>
        </div>
      </div>

      <div className="container pt-4 pb-4">
        <div className="row">
          <div className="col text-center">
            {loadingSubmit || generatingPreview ? (
              <button className="btn btn-secondary w-100 for-size-padding" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {generatingPreview ? 'Generating Report...' : 'Loading...'}
              </button>
            ) : (
              <div className="buttons d-flex justify-content-center flex-wrap gap-2">
                 <button
                  className="btn btn-sm btn-primary"
                  onClick={openAddDescriptionModal}
                  disabled={!formData?.query?._id}
                  title="Add or edit admin description for this valuation"
                >
                  Add Description
                </button>
                {/* Existing Button 1: View Current Report */}
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    if (formData.query?._id) {
                      window.open(`/report/${formData.query._id}`, '_blank', 'noopener,noreferrer');
                    } else {
                      Swal.fire('Error!', 'Order ID is missing.', 'error');
                    }
                  }}
                  disabled={!formData.query?._id}
                  title="View the current report format"
                >
                  View Current Report
                </button>

                {/* New Button 2: Preview Dynamic Report */}
                <button
                  className="btn btn-sm btn-info text-white"
                  onClick={previewEJSReport}
                  disabled={!formData.query?._id || generatingPreview}
                  title="Preview the new dynamic report design"
                >
                  <i className="bi bi-eye me-1"></i>
                  Preview New Report
                </button>

                {/* New Button 3: Download Dynamic Report */}
                <button
                  className="btn btn-sm btn-success"
                  onClick={downloadEJSReport}
                  disabled={!formData.query?._id || generatingPreview}
                  title="Download the new dynamic report as PDF"
                >
                  <i className="bi bi-download me-1"></i>
                  Download New Report
                </button>

                {/* Existing Button 4: Email Report */}
                <button
                  type="button"
                  className="btn btn-sm btn-warning text-white"
                  onClick={emailReport}
                  disabled={!formData.query?._id}
                  title="Email report to customer"
                >
                  <i className="bi bi-envelope me-1"></i>
                  Email Report
                </button>
                {/* // Add this button to your button group: */}
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={testReportGeneration}
                  title="Test report generation"
                >
                  <i className="bi bi-bug me-1"></i>
                  Test Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Make sure to use formData.checkBoxesValues instead of formData.query.checkBoxesValues */}

      <EmailReport ref={reportRef} />
    </>
  )
}

export default SummaryValuation;