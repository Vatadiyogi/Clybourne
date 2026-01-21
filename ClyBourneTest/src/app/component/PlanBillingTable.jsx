"use client";
import React, { useState } from "react";
import { formatDateOnly } from "../../utils/utility";
import axios from "axios";
import { toast } from "react-toastify";

const PlanBillingTable = ({ historyPlans = [] }) => {
  if (!historyPlans || historyPlans.length === 0) return <div>No billing history available.</div>;

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(7);
  const [loadingInvoiceId, setLoadingInvoiceId] = useState(null);

  const totalPosts = historyPlans.length;
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = historyPlans.slice(firstPostIndex, lastPostIndex);

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const ucfirst = (str) => str?.charAt(0).toUpperCase() + str?.slice(1);

  const getPlanStatus = (item) => {
    if (item.displayStatus) {
      return ucfirst(item.displayStatus);
    }
    return ucfirst(item.planStatusType) || "NA";
  };

  // ✅ Check if invoice should be shown
  const shouldShowInvoice = (item) => {
    const isExpired = item.planStatusType === 'expired' || 
                     item.displayStatus === 'expired' ||
                     (item.expiresAt && new Date(item.expiresAt) < new Date());
    
    const invoiceGenerated = item.invoiceSent === 1 && item.invoicePath;
    
    return isExpired && invoiceGenerated;
  };

  // ✅ Get invoice download URL
  const getInvoiceUrl = (item) => {
    if (!item.invoicePath) return null;
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';
    
    if (item.invoicePath.startsWith('http')) {
      return item.invoicePath;
    }
    
    if (item.invoicePath.startsWith('/')) {
      return `${baseUrl}${item.invoicePath}`;
    }
    
    return `${baseUrl}/api/plan/download-invoice/${item.planSeqId}`;
  };

  // ✅ NEW: Manual invoice generation function
  const generateInvoiceManually = async (planSeqId) => {
    setLoadingInvoiceId(planSeqId);
    
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'}/api/plan/generate-invoice/${planSeqId}`
      );
      
      if (response.data.status) {
        toast.success('Invoice generated successfully! Please refresh the page.');
      } else {
        toast.error(`Failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Invoice generation error:', error);
      toast.error('Failed to generate invoice. Please try again.');
    } finally {
      setLoadingInvoiceId(null);
    }
  };

  // ✅ NEW: Check if plan is expired
  const isPlanExpired = (item) => {
    return item.planStatusType === 'expired' || 
           item.displayStatus === 'expired' ||
           (item.expiresAt && new Date(item.expiresAt) < new Date());
  };

  return (
    <div>
      <div className="!overflow-x-auto">
        <table className="min-w-full text-sm text-left mb-6">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2 text-[10px] border-b">Order Date</th>
              <th className="px-4 py-2 text-[10px] border-b">Plan Type</th>
              <th className="px-4 py-2 text-[10px] border-b">Plan Id</th>
              <th className="px-4 py-2 text-[10px] border-b">Order Type</th>
              <th className="px-4 py-2 text-[10px] border-b">#Reports Added</th>
              <th className="px-4 py-2 text-[10px] border-b">Access Days</th>
              <th className="px-4 py-2 text-[10px] border-b">#Report Utilized</th>
              <th className="px-4 py-2 text-[10px] border-b">Plan Expiry Date</th>
              <th className="px-4 py-2 text-[10px] border-b">Status</th>
              <th className="px-4 py-2 text-[10px] border-b">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((item, index) => {
              const showInvoice = shouldShowInvoice(item);
              const invoiceUrl = getInvoiceUrl(item);
              const expired = isPlanExpired(item);
              
              return (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2 text-[10px] border-b">{formatDateOnly(item.createdAt)}</td>
                  <td className="px-4 py-2 text-[10px] border-b">{item.planId?.name || "NA"}</td>
                  <td className="px-4 py-2 text-[10px] border-b">{item.planSeqId}</td>
                  <td className="px-4 py-2 text-[10px] border-b">{ucfirst(item.orderType)}</td>
                  <td className="px-4 py-2 text-[10px] border-b">{item.balanceQuota}</td>
                  <td className="px-4 py-2 text-[10px] border-b">{item.planId?.accessDays}</td>
                  <td className="px-4 py-2 text-[10px] border-b">{item.orders?.length || 0}</td>
                  <td className="px-4 py-2 text-[10px] border-b">
                    {item.expiresAt ? formatDateOnly(item.expiresAt) : "NA"}
                  </td>
                  <td className="px-4 py-2 text-[10px] border-b">{getPlanStatus(item)}</td>
                  
                  <td className="px-4 py-2 text-[10px] border-b">
                    {showInvoice ? (
                      // ✅ Download button - Invoice exists
                      <a
                        href={invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-xs px-3 py-1.5 border border-blue-300 rounded-md bg-blue-50 transition-colors hover:bg-blue-100"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download
                      </a>
                    ) : expired ? (
                      // 🔄 Generate invoice button - Expired but no invoice
                      <button
                        onClick={() => generateInvoiceManually(item.planSeqId)}
                        disabled={loadingInvoiceId === item.planSeqId}
                        className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 hover:underline text-xs px-3 py-1.5 border border-green-300 rounded-md bg-green-50 transition-colors hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingInvoiceId === item.planSeqId ? (
                          <>
                            <svg className="animate-spin h-3 w-3 mr-1" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Generating...
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Generate Invoice
                          </>
                        )}
                      </button>
                    ) : (
                      // ℹ️ Not applicable - Plan not expired
                      <span className="text-gray-400 text-xs">N/A</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination UI */}
      <div className="flex flex-wrap justify-between items-center mt-4">
        <div className="text-xs">
          Showing{" "}
          <select
            value={postsPerPage}
            onChange={(e) => setPostsPerPage(Number(e.target.value))}
            className="mx-2 border py-1"
          >
            {[5, 7, 10].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          items per page
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            First
          </button>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="px-2 py-1">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanBillingTable;  