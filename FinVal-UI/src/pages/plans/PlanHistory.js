import { formatDate } from "../../common/dateUtils";
import { invoiceURL } from "../../config/Config";
import { Link } from "react-router-dom";
import React, { useState } from 'react';
const PlanHistory = ({ data }) => {
    function ucfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRow = (index) => {
        setExpandedRows((prev) => {
            const isExpanded = prev.includes(index);
            if (isExpanded) {
                return prev.filter((rowIndex) => rowIndex !== index);
            } else {
                return [...prev, index];
            }
        });
    };
    return (
        <div className="table-responsive">
            <table className="table table-striped table-bordered fs-14 lh-normal mytable border-light-blue align-middle text-left">
                <thead className="border-solid border-1 border-light-blue">
                    <tr>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue w-110px">Order Date</th>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue">Plan Type</th>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue desktop-only">Plan ID</th>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue desktop-only">Order Type</th>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue desktop-only w-50px">#Reports<br />Added</th>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue desktop-only w-50px">Access<br />Days</th>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue desktop-only w-50px">#Reports<br />Utilized</th>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue desktop-only w-110px">Plan Expiry Date</th>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue w-100px">Status</th>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue desktop-only w-110px">Invoice</th>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue mobile-only text-center">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td className="fs-14 sm-fs-12">{formatDate(item.createdAt)}</td>
                                <td className="fs-14 sm-fs-12">{item.planId && item.planId.name}</td>
                                <td className="fs-14 desktop-only">{item.planSeqId}</td>
                                <td className="fs-14 desktop-only">{item.orderType === "new" ? "New Order" : "Upgrade Order"}</td>
                                <td className="fs-14 desktop-only">{item.balanceQuota}</td>
                                <td className="fs-14 desktop-only">{item.planId.accessDays}</td>
                                <td className="fs-14 desktop-only">{item.orders.length}</td>
                                <td className="fs-14 desktop-only">{item.expiresAt ? formatDate(item.expiresAt) : 'NA'}</td>
                                <td className="fs-14 sm-fs-12">{item.planStatusType ? ucfirst(item.planStatusType) : "NA"}</td>
                                <td className="fs-14 desktop-only">
                                    {item.planStatusType === 'expired' && (
                                        <Link
                                            to={`${invoiceURL}${item.invoicePath}`} // Replace with the actual URL of the PDF
                                            className="fs-12 m-0 lh-1 pt-10px pb-10px text-white fs-12 fw-400 text-capitalize fin-btn d-inline-block ls-05px w-110px text-center border-radius-4px"
                                            target="_blank"
                                            download
                                        >
                                            <i className="bi bi-file-earmark-pdf"></i> Invoice
                                        </Link>
                                    )}
                                </td>
                                {/* Mobile toggle button for details */}
                                <td className="align-middle text-center mobile-only">
                                    <button
                                        onClick={() => toggleRow(index)}
                                        className="btn btn-link p-0 border-0 toggle-details"
                                    >

                                        {expandedRows.includes(index) ? <i className="bi bi-dash-circle-fill sm-fs-15 text-blue"></i> : <i class="bi bi-plus-circle-fill sm-fs-15 text-blue"></i>}
                                    </button>
                                </td>
                            </tr>
                            {/* Expanded Row for Mobile View */}
                            {expandedRows.includes(index) && (
                                <tr className="bg-light mobile-only">
                                    <td colSpan="10">
                                        <div className="p-3">
                                            <p className="sm-mb-10px"><strong>Order Date:</strong> {formatDate(item.createdAt)}</p>
                                            <p className="sm-mb-10px"><strong>Plan Type:</strong> {item.planId && item.planId.name}</p>
                                            <p className="sm-mb-10px"><strong>Status:</strong> {item.planStatusType ? ucfirst(item.planStatusType) : "NA"}</p>
                                            {item.planStatusType === 'expired' && (
                                                <Link
                                                    to={`${invoiceURL}${item.invoicePath}`} // Replace with the actual URL of the PDF
                                                    className="fs-12 m-0 lh-1 pt-10px pb-10px text-white fs-12 fw-400 text-capitalize fin-btn d-inline-block ls-05px w-110px text-center border-radius-4px"
                                                    target="_blank"
                                                    download
                                                >
                                                    <i className="bi bi-file-earmark-pdf"></i> Invoice
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>

    )
}

export default PlanHistory;