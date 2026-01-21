"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from "../../utils/utility";
import Axios from "../../utils/api"
import Swal from 'sweetalert2';

const OrderTable = ({ data = [] }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPosPerPage] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const [downloading, setDownloading] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const lastPostIndex = currentPage * postPerPage;
  const firstPosIndex = lastPostIndex - postPerPage;
  const currentPosts = data.slice(firstPosIndex, lastPostIndex);
  const totalPosts = data.length;

  let pages = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postPerPage); i++) {
    pages.push(i);
  }

  // Check if order is within 48 hours of completion
  const isWithin48Hours = (completedDate) => {
    if (!completedDate) return false;
    try {
      const completed = new Date(completedDate);
      const hoursDifference = (now.getTime() - completed.getTime()) / (1000 * 60 * 60);
      return hoursDifference <= 48;
    } catch (error) {
      return false;
    }
  };

  // Get remaining time for display
  const getRemainingTime = (completedDate) => {
    if (!completedDate) return '';
    try {
      const completed = new Date(completedDate);
      const hoursDifference = (now.getTime() - completed.getTime()) / (1000 * 60 * 60);
      if (hoursDifference <= 48) {
        const remainingHours = Math.floor(48 - hoursDifference);
        const remainingMinutes = Math.floor((48 - hoursDifference) * 60) % 60;
        return `${remainingHours}h ${remainingMinutes}m`;
      }
    } catch (error) {
      return '';
    }
    return '';
  };

  // Handle report download
  // const handleDownloadReport = async (order) => {
  //   try {
  //     setDownloading(order._id);
  //     const token = localStorage.getItem('authToken');
  //     if (!token) {
  //       alert('Please login to download reports');
  //       return;
  //     }

  //     if (order.report_url) {
  //       window.open(order.report_url, '_blank');
  //     } else {
  //       const url = `http://localhost:5050/api/reports/generate/${order._id}`;
  //       window.open(url, '_blank');
  //     }

  //     setTimeout(() => setDownloading(null), 3000);
  //   } catch (error) {
  //     console.error('Download error:', error);
  //     alert('Failed to download report: ' + error.message);
  //     setDownloading(null);
  //   }
  // };

  // Update the handleDownloadReport function in your OrderTable component
const handleDownloadReport = async (order) => {
  try {
    // Set downloading state for UI feedback
    setDownloading(order._id);
    
    // Get authentication token
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please login to download reports',
        confirmButtonColor: '#16a085'
      });
      setDownloading(null);
      return;
    }

    // Validate order ID
    if (!order?._id) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Order ID',
        text: 'Order information is incomplete',
        confirmButtonColor: '#16a085'
      });
      setDownloading(null);
      return;
    }

    // Show loading message
    Swal.fire({
      title: 'Generating Report',
      text: 'Please wait while we generate your PDF report...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Construct the API URL
    const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/';
    const downloadUrl = `${apiURL}/api/admin/orders/${order._id}/report-ejs`;

    console.log('Downloading PDF from:', downloadUrl);

    // Fetch PDF from backend
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'Authorization': ` ${token}`,
        'Accept': 'application/pdf',
        'Cache-Control': 'no-cache'
      }
    });

    // Handle response errors
    if (!response.ok) {
      let errorMessage = `Failed to generate report: ${response.status} ${response.statusText}`;
      
      try {
        const errorText = await response.text();
        console.error('Server error details:', errorText);
        errorMessage += ` - ${errorText.substring(0, 100)}`;
      } catch (e) {
        console.error('Error reading error response:', e);
      }
      
      throw new Error(errorMessage);
    }

    // Get the PDF as blob
    const pdfBlob = await response.blob();

    // Check if it's actually a PDF
    if (!pdfBlob.type.includes('pdf')) {
      console.error('Response is not PDF:', pdfBlob.type, pdfBlob);
      throw new Error('Server returned non-PDF content. Please try again.');
    }

    // Create download link
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename with order info
    const fileName = `Valuation-Report-${
      order.customerOrderSequence || 
      order.orderId || 
      order._id
    }-${order.companyName || 'Company'}.pdf`;
    
    link.download = fileName.replace(/[^a-z0-9_.-]/gi, '_');
    
    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setDownloading(null);
    }, 100);

    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'Report Downloaded',
      text: 'Your valuation report has been downloaded successfully.',
      confirmButtonColor: '#16a085',
      timer: 2000,
      showConfirmButton: false
    });

  } catch (error) {
    console.error('Download error:', error);
    
    // Close any open loading dialogs
    Swal.close();
    setDownloading(null);

    // Try alternative method - direct link
    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/';
      const directUrl = `${apiURL}api/admin/orders/${order._id}/report-ejs`;

      Swal.fire({
        icon: 'warning',
        title: 'Download Issue',
        html: `
          <div style="text-align: left;">
            <p style="margin-bottom: 10px;">${error.message || 'Failed to download automatically.'}</p>
            <p style="margin-bottom: 15px;">Try downloading directly:</p>
            <div style="text-align: center;">
              <a href="${directUrl}" 
                 target="_blank" 
                 style="
                   display: inline-block;
                   padding: 10px 20px;
                   background-color: #16a085;
                   color: white;
                   text-decoration: none;
                   border-radius: 5px;
                   font-weight: bold;
                   margin-bottom: 10px;
                 ">
                Click to Download PDF
              </a>
            </div>
            <p style="font-size: 12px; color: #666; margin-top: 10px;">
              If the link doesn't work, copy this URL:<br>
              <code style="font-size: 11px; word-break: break-all;">${directUrl}</code>
            </p>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Close',
        confirmButtonColor: '#16a085'
      });

    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: 'Unable to download the report. Please try again later or contact support.',
        confirmButtonColor: '#16a085'
      });
    }
  }
};

  // Also update the renderReportLinks function to ensure proper styling
  const renderReportLinks = (order) => {
    if (order.status === 'Completed' || order.status === 'Completed (Revised)') {
      return (
        <div className="mt-1">
          <button
            onClick={() => handleDownloadReport(order)}
            disabled={downloading === order._id}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-[8px] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
          >
            {downloading === order._id ? (
              <>
                <span className="inline-block animate-spin mr-1">⏳</span>
                Generating...
              </>
            ) : (
              '📄 Download Report'
            )}
          </button>
        </div>
      );
    }

    if (order.status === 'Re-Submitted') {
      return (
        <div className="mt-1">
          <span className="text-blue-500 text-[8px] font-medium">
            ✓ Modified - Awaiting Review
          </span>
        </div>
      );
    }

    return null;
  };

  // Enhanced handleEditOrder function
  const handleEditOrder = async (order) => {
    try {
      console.log('Editing order:', order._id, 'Status:', order.status);

      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      setIsLoading(true);

      // Clear all form data
      localStorage.removeItem('companyFormData');
      localStorage.removeItem('financialFormData');
      localStorage.removeItem('forecastFormData');
      localStorage.removeItem('balanceSheetFormData');
      localStorage.removeItem('isModification');

      // Store order ID and status
      localStorage.setItem('currentOrderId', order._id);
      localStorage.setItem('orderStatus', order.status);

      // Set modification flag for Completed status only (NOT for Completed (Revised))
      if (order.status === 'Completed') {
        localStorage.setItem('isModification', 'true');
      }

      // Fetch order data for editing
      const response = await Axios.get(`/api/order/preview/${order._id}`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response:', response.data);

      if (response.data.status || response.data.order) {
        const orderData = response.data;

        // Determine if company should be read-only
        // For Completed (Revised) orders, everything is read-only
        const isCompanyReadOnly = order.status === 'Completed' ||
          order.status === 'Completed (Revised)';

        // For Completed (Revised) orders, show error message
        if (order.status === 'Completed (Revised)') {
          Swal.fire({
            icon: 'error',
            title: 'Cannot Modify',
            text: 'This order has already been revised and cannot be modified further.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#16a085'
          }).then(() => {
            router.push(`/dashboard/order/${order._id}`);
          });
          return;
        }

        // Load company data
        if (orderData.order?.business?.business) {
          const businessData = orderData.order.business.business;
          const companyFormData = {
            companyName: businessData.companyName || "",
            companyType: businessData.companyType || "",
            industryType: businessData.industryType || "",
            similarCompany: businessData.similarCompany || "",
            yearsInBusiness: businessData.companyAge || "",
            country: businessData.country || "",
            countryFullName: businessData.country || "",
            yearEndDay: businessData.FinYrEndDate || "",
            yearEndMonth: businessData.FinYrEndMonth || "",
            yearEndYear: businessData.FinYrEnd || new Date().getFullYear(),
            earningTrend: businessData.earningTrend || "",
            businessDescription: businessData.description || "",
            email: businessData.email || "",
            currency: businessData.currency || "USD",
            contact: businessData.contact?.phoneNumber || businessData.contact || "",
            isReadOnly: isCompanyReadOnly
          };
          localStorage.setItem('companyFormData', JSON.stringify(companyFormData));
          console.log('Company data loaded (read-only:', isCompanyReadOnly, ')');
        }

        // Load financial data
        if (orderData.calculations?.finance) {
          localStorage.setItem('financialFormData', JSON.stringify(orderData.calculations.finance));
        }

        // Load forecast data
        if (orderData.calculations?.forecast_inc_stmt) {
          const forecastData = {
            forecastData: orderData.calculations.forecast_inc_stmt.map((item, index) => ({
              year: index + 1,
              salesGrowth: item.salesGrowthRate || "",
              cogsPercent: item.cogs || "",
              ebitdaMargin: item.ebitdaMargin || "",
              depreciationRate: item.depreciationRate || "",
              interestRate: item.interestRate || "",
              netProfitMargin: item.netProfitMargin || ""
            }))
          };
          localStorage.setItem('forecastFormData', JSON.stringify(forecastData));
        }

        // Load balance sheet data
        if (orderData.calculations?.forecast_bal_sheet || orderData.calculations?.forecast_rip_days) {
          const balanceSheetData = {
            forecastData: (orderData.calculations.forecast_bal_sheet || []).map((item, index) => ({
              year: index + 1,
              capex: item.fixedAssets || "",
              debt: item.debtLoan || ""
            })),
            receivableDays: orderData.calculations.forecast_rip_days?.receivableDays || 30,
            inventoryDays: orderData.calculations.forecast_rip_days?.inventoryDays || 45,
            payableDays: orderData.calculations.forecast_rip_days?.payableDays || 30
          };
          localStorage.setItem('balanceSheetFormData', JSON.stringify(balanceSheetData));
        }

        // Redirect with appropriate parameters
        let redirectUrl = `/dashboard/newOrder?step=company&orderId=${order._id}`;

        // Show appropriate message based on status
        if (order.status === 'Completed') {
          redirectUrl += '&modify=true';

          // Show modification warning
          setTimeout(() => {
            Swal.fire({
              icon: 'info',
              title: 'Modification Mode',
              html: `
                <div style="text-align: left;">
                  <p><strong>You are modifying a completed order.</strong></p>
                  <p>📌 <strong>Company information is READ-ONLY</strong></p>
                  <p>✅ You can edit Financial, Forecast, and Balance Sheet data</p>
                  <p>⏰ This can be done once within 48 hours of completion</p>
                  <p>📄 Status will change to "Re-Submitted" after saving</p>
                </div>
              `,
              showConfirmButton: true,
              confirmButtonText: 'Proceed',
              confirmButtonColor: '#16a085'
            });
          }, 500);
        } else if (order.status === 'Pending Submission') {
          setTimeout(() => {
            Swal.fire({
              icon: 'info',
              title: 'Editing Order',
              text: 'You can edit all form fields for pending submissions.',
              timer: 2000,
              showConfirmButton: false
            });
          }, 500);
        }

        router.push(redirectUrl);

      } else {
        // Fallback to basic edit
        router.push(`/dashboard/newOrder?step=company&orderId=${order._id}`);
      }
    } catch (error) {
      console.error('Error fetching order data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load order data. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if order has already been modified
  const hasAlreadyModified = (order) => {
    // If status is "Completed (Revised)", it's already been modified
    return order.status === 'Re-Submitted' ||
      order.status === 'Completed (Revised)' ||
      order.modification_count > 0 ||
      order.resubmit_pending === 0;
  };

  // Render report download links
  // const renderReportLinks = (order) => {
  //   if (order.status === 'Completed' || order.status === 'Completed (Revised)') {
  //     return (
  //       <div className="mt-1">
  //         <button
  //           onClick={() => handleDownloadReport(order)}
  //           disabled={downloading === order._id}
  //           className="bg-yellow-500 text-white px-3  rounded-md text-[8px] hover:bg-yellow-600 disabled:opacity-50 font-medium"
  //         >
  //           {downloading === order._id ? '⏳ Downloading...' : '📄 Download Report'}
  //         </button>
  //       </div>
  //     );
  //   }

  //   if (order.status === 'Re-Submitted') {
  //     return (
  //       <div className="mt-1">
  //         <span className="text-blue-500 text-[8px] font-medium">
  //           ✓ Modified - Awaiting Review
  //         </span>
  //       </div>
  //     );
  //   }

  //   return null;
  // };

  // Render action button based on status - UPDATED LOGIC
  const renderActionButton = (order) => {
    console.log('Rendering action for order:', order._id, 'Status:', order.status);

    const isPlanExpired = order.orderplan?.planOrderId?.planStatusType === 'expired';

    // Plan expired case
    if (isPlanExpired) {
      return (
        <div className="flex flex-col items-center space-y-1">
          <span
            className="text-teal-500 text-[10px] cursor-pointer hover:underline"
            onClick={() => router.push(`/dashboard/order/${order._id}`)}
          >
            View Details
          </span>
          <div className="text-red-500 text-[8px]">Plan Expired</div>
        </div>
      );
    }

    // Completed (Revised) - VIEW ONLY, NO MODIFICATION ALLOWED
    if (order.status === 'Completed (Revised)') {
      return (
        <div className="flex flex-col items-center space-y-1">
          <span
            className="text-teal-500 text-[10px] cursor-pointer hover:underline"
            onClick={() => router.push(`/dashboard/order/${order._id}`)}
          >
            View Details
          </span>
          <div className="text-gray-500 text-[8px]">
            Already revised
          </div>
        </div>
      );
    }

    // Pending Submission - Full Edit Access
    if (order.status === 'Pending Submission') {
      return (
        <span
          className="text-teal-500 text-[10px] cursor-pointer hover:underline"
          onClick={() => handleEditOrder(order)}
        >
          Edit All
        </span>
      );
    }

    // Completed status (not revised) - Modification window
    if (order.status === 'Completed') {
      console.log('Processing Completed order:', order._id);

      // Check if already modified
      const alreadyModified = hasAlreadyModified(order);

      if (alreadyModified) {
        console.log('Order already modified - showing View Details');
        return (
          <span
            className="text-teal-500 text-[10px] cursor-pointer hover:underline"
            onClick={() => router.push(`/dashboard/order/${order._id}`)}
          >
            View Details
          </span>
        );
      }

      // Check 48-hour window
      const relevantDate = order.completedOn || order.submittedOn;
      const canModify = relevantDate ? isWithin48Hours(relevantDate) : true;
      const hoursSinceCompletion = relevantDate
        ? Math.floor((now.getTime() - new Date(relevantDate).getTime()) / (1000 * 60 * 60))
        : 0;
      const remainingHours = Math.max(0, 48 - hoursSinceCompletion);

      console.log('Modification check:', {
        relevantDate,
        canModify,
        hoursSinceCompletion,
        remainingHours
      });

      if (canModify) {
        // Within 48 hours: Show "Modify"
        return (
          <div className="flex flex-col items-center space-y-1">
            <span
              className="text-blue-600 text-[10px] cursor-pointer hover:underline font-bold"
              onClick={() => handleEditOrder(order)}
            >
              Modify (48h)
            </span>
            <div className="text-yellow-600 text-[8px]">
              {remainingHours}h remaining
            </div>
            <div className="text-gray-500 text-[7px]">
              Company info read-only
            </div>
          </div>
        );
      } else {
        // After 48 hours: View only
        return (
          <span
            className="text-teal-500 text-[10px] cursor-pointer hover:underline"
            onClick={() => router.push(`/dashboard/order/${order._id}`)}
          >
            View Details
          </span>
        );
      }
    }

    // Re-Submitted, Submitted, Help Requested - View Details only
    if (order.status === 'Re-Submitted' ||
      order.status === 'Submitted' ||
      order.status === 'Help Requested') {
      return (
        <span
          className="text-teal-500 text-[10px] cursor-pointer hover:underline"
          onClick={() => router.push(`/dashboard/order/${order._id}`)}
        >
          View Details
        </span>
      );
    }

    // Default: View Details
    return (
      <span
        className="text-teal-500 text-[10px] cursor-pointer hover:underline"
        onClick={() => router.push(`/dashboard/order/${order._id}`)}
      >
        View Details
      </span>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-100';
      case 'Completed (Revised)':
        return 'text-emerald-600 bg-emerald-100'; // Different color for revised
      case 'Pending Submission':
        return 'text-yellow-600 bg-yellow-100';
      case 'Help Requested':
        return 'text-blue-600 bg-blue-100';
      case 'Submitted':
      case 'Re-Submitted':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-themegreen"></div>
        <span className="ml-2">Loading order data...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="!overflow-x-auto">
        <table className="min-w-full text-sm text-left mb-6">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 text-[10px] py-2 border-b border-gray-300">Order no.</th>
              <th className="px-4 text-[10px] py-2 border-b border-gray-300">Plan Id</th>
              <th className="px-4 text-[10px] py-2 border-b border-gray-300">Company name</th>
              <th className="px-4 text-[10px] py-2 border-b border-gray-300">Status</th>
              <th className="px-4 text-[10px] py-2 border-b border-gray-300">Country</th>
              <th className="px-4 text-[10px] py-2 border-b border-gray-300">Date Created</th>
              <th className="px-4 text-[10px] py-2 border-b border-gray-300">Date Submitted</th>
              <th className="px-4 text-[10px] py-2 border-b border-gray-300">Date Completed</th>
              <th className="px-4 text-[10px] py-2 border-b border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.length > 0 ? (
              currentPosts.map((order, index) => {
                const relevantDate = order.completedOn || order.submittedOn;
                const canModify = relevantDate ? isWithin48Hours(relevantDate) : false;
                const alreadyModified = hasAlreadyModified(order);

                return (
                  <tr
                    key={order._id || index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-4 py-2 text-[10px] border-b">
                      {order.customerOrderSequence || order.orderId}
                    </td>
                    <td className="px-4 py-2 text-[10px] border-b">
                      {order.orderplan?.planOrderId?.planSeqId || '-'}
                    </td>
                    <td className="px-4 py-2 text-[10px] border-b">
                      <div>
                        {order.companyName}
                        {renderReportLinks(order)}

                        {/* Show modification info for completed orders (not revised) */}
                        {/* {order.status === 'Completed' &&
                          !alreadyModified &&
                          relevantDate && canModify && (
                            <div className="text-yellow-600 text-[8px] mt-1">
                              ⏰ {getRemainingTime(relevantDate)} to modify
                            </div>
                          )} */}

                        {/* Show revised message for Completed (Revised) */}
                        {/* {order.status === 'Completed (Revised)' && (
                          <div className="text-emerald-600 text-[8px] mt-1">
                            ✓ Already revised
                          </div>
                        )} */}

                        {/* Show edit mode info */}
                        {/* {order.status === 'Pending Submission' && (
                          <div className="text-green-600 text-[8px] mt-1">
                            ✓ Full edit access
                          </div>
                        )} */}

                        {/* {order.status === 'Re-Submitted' && (
                          <div className="text-blue-600 text-[8px] mt-1">
                            ⏳ Awaiting review
                          </div>
                        )} */}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-[10px] border-b">
                      <span className={`px-2 py-1 rounded-full text-[8px] ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-[10px] border-b">{order.country}</td>
                    <td className="px-4 py-2 text-[10px] border-b">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-2 text-[10px] border-b">
                      {order.submittedOn ? formatDate(order.submittedOn) : '-'}
                    </td>
                    <td className="px-4 py-2 text-[10px] border-b">
                      {order.completedOn ? formatDate(order.completedOn) : '-'}
                    </td>
                    <td className="px-4 py-2 text-[10px] border-b">
                      {renderActionButton(order)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="px-4 py-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.length > 0 && (
        <div className='flex w-full justify-between gap-1 sm:gap-0 mt-3 mb-3 md:mb-6'>
          <div className='text-[10px] md:text-xs text-gray-900'>
            Showing
            <select
              value={postPerPage}
              onChange={(e) => {
                setPosPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="mx-1 md:mx-2 border rounded py-1 border-gray-500 text-[10px] md:text-xs md:px-2"
            >
              <option value={7}>7</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            <span className='text-[10px] md:text-xs text-gray-500'>items per page </span>
          </div>
          <div className="flex sm:flex-row flex-col items-center">
            <div>
              {pages.map((page, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2 text-[10px] md:text-xs py-[4px] ${currentPage === page
                    ? 'bg-gray-200 text-black border border-themeblue rounded-md'
                    : ''
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <div className='flex gap-2'>
              <button
                className="text-[10px] md:text-xs text-gray-500"
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="text-[10px] md:text-xs text-gray-500"
                onClick={() =>
                  setCurrentPage(
                    currentPage < pages.length ? currentPage + 1 : pages.length
                  )
                }
                disabled={currentPage === pages.length}
              >
                Next
              </button>
              <button
                className="text-[10px] md:text-xs text-gray-500"
                onClick={() => setCurrentPage(pages.length)}
              >
                End
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;