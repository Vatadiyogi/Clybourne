import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CommonLayout from "../../../common/CommonLayout";
import DataTableComponent from "../../../components/DataTable/DataTableComponent";
import Breadcrumb from "../../../components/Breadcrumb";
import { apiURL } from "../../../Config";
import {formatDate} from "../../../common/utils/dateUtils";

const Emails = () => {
    const breadcrumbItems = [
        { label: 'Dashboard', link: '/dashboard' },
        { label: 'Setup', link: '/dashboard' },
        { label: 'Email Templates', active: true }
    ];

    const [data, setData] = useState([]); // State for plan data
    const [loading, setLoading] = useState(true); // Loading state

    const columns = [
        { 
            name: 'ID', 
            selector: row => row.templateId, 
            sortable: true, 
            wrap: true, width: '8%'
        },
        { 
            name: 'Name', 
            selector: row => row.title, 
            sortable: true, 
            wrap: true,
            width: '25%'
        },
        { 
            name: 'Subject', 
            selector: row => row.subject, 
            sortable: true, 
            wrap: true,
            width: '25%'
        },
        {
            name: 'Created On',
            selector: row => row.createdAt, // Provide the raw date for sorting
            sortable: true,
            wrap: true,
            width: '16%',
            cell: row => (
                <div style={{ whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                    {row.createdAt ? formatDate(row.createdAt) : ''}
                </div>
            )
        },
        {
            name: 'Updated On',
            selector: row => row.updatedAt, // Provide the raw date for sorting
            sortable: true,
            wrap: true,
            width: '16%',
            cell: row => (
                <div style={{ whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                    {row.updatedAt ? formatDate(row.updatedAt) : ''}
                </div>
            )
        },
        {
            name: 'Action',
            cell: row => (
                <div>
                    <Link to={`/email-templates/${row._id}`} className="btn btn-sm btn-primary me-2">Edit</Link>
                    {/* Add delete functionality if needed */}
                </div>
            ),
            ignoreRowClick: true,
            wrap: true,
            width: '10%'
        }
    ];
    
    const fetchTemplates = async () => {
        try {
            const response = await fetch(`${apiURL}api/admin/email/`);
            const responseData = await response.json();
            if (responseData.status) {
                setData(responseData.data.templates);
            } else {
                throw new Error('Failed to fetch plans');
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchTemplates();
    }, []);

    return (
        <CommonLayout>
            <div id="content" className="main-content">
                <div className="layout-px-spacing">
                    <div className="middle-content container-xxl p-0">
                        <Breadcrumb items={breadcrumbItems} />
                        <div className="row layout-spacing">
                            <div className="col-lg-12">
                                <div className="statbox widget box box-shadow">
                                    <div className="widget-header pb-2">
                                        <div className="row">
                                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                                {/* <h4>Plans</h4> */}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-xl-4 col-md-4 col-sm-12 col-12 pl-1">
                                            </div>
                                            <div className="col-xl-1 col-md-1"></div>
                                            <div className="col-xl-6 col-md-6 col-sm-12 col-12 text-end">
                                                <Link to="/add-email-templates" className="btn btn-primary mt-2">Add Templates</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget-content widget-content-area">
                                        {loading ? (
                                            <div className="loader mx-auto"></div>
                                        ) : <DataTableComponent
                                                title="Plan Records"
                                                columns={columns}
                                                data={data}
                                                searchFields={['Id', 'name', 'subject', 'createdAt', 'updatedAt']}
                                                pagination
                                                striped
                                                highlightOnHover
                                                className="table style-1 dt-table-hover"
                                            />
                                        }
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

export default Emails;
