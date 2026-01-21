import React, { useState, useEffect } from "react";
import CommonLayout from "../../../common/CommonLayout";
import Breadcrumb from "../../../components/Breadcrumb";
import DataTableComponent from "../../../components/DataTable/DataTableComponent";
import { apiURL } from "../../../Config";
import AddHolidayModal from "./AddHolidayModal";
import Swal from "sweetalert2";

const Holiday = () => {
    const breadcrumbItems = [
        { label: 'Dashboard', link: '/dashboard' },
        { label: 'Setup', link: '/dashboard' },
        { label: 'Holiday List', active: true }
    ];

    const storedYear = localStorage.getItem('selectedYear');
    const [selectedYear, setSelectedYear] = useState(storedYear || "");
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState([]); // State for holiday data

    const columns = [
        { name: 'Sl No.', selector: row => row.slNo, sortable: true },
        { name: 'Date', selector: row => row.dateFormatted, sortable: true },
        { name: 'Day of Week', selector: row => row.day, sortable: true },
        { name: 'Description', selector: row => row.description, sortable: true },
        {
            name: 'Action',
            cell: (row) => (
                <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(row.id)}
                >
                    Delete
                </button>
            ),
        },
    ];

    const fetchHolidayData = async (year) => {
        try {
            if (!year) {
                setData([]);
                localStorage.removeItem('selectedYear');
                return;
            }
            const response = await fetch(`${apiURL}api/admin/holiday/holidays?year=${year}`);
            const responseData = await response.json();

            if (response.ok) {
                if (responseData.length > 0) {
                    setData(responseData);
                    localStorage.setItem('selectedYear', year);
                } else {
                    setData([]);
                    localStorage.setItem('selectedYear', year); // Update localStorage anyway
                }
            } else {
                console.error('Failed to fetch holiday data:', responseData);
            }
        } catch (error) {
            console.error('Error fetching holiday data:', error);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${apiURL}api/admin/holiday/${id}`, {
                        method: 'DELETE',
                    });
                    if (response.ok) {
                        Swal.fire(
                            'Deleted!',
                            'Holiday has been deleted.',
                            'success'
                        );
                        fetchHolidayData(selectedYear); // Refresh data
                    } else {
                        const responseData = await response.json();
                        Swal.fire(
                            'Error!',
                            responseData.message || 'Failed to delete holiday',
                            'error'
                        );
                    }
                } catch (error) {
                    console.error('Error deleting holiday:', error);
                    Swal.fire(
                        'Error!',
                        'An error occurred while deleting the holiday.',
                        'error'
                    );
                }
            }
        });
    };

    useEffect(() => {
        fetchHolidayData(selectedYear);
    }, [selectedYear]);

    const handleYearChange = (event) => {
        const year = event.target.value;
        setSelectedYear(year);
    };

    return (
        <CommonLayout page={'holiday'}>
            <div id="content" className="main-content">
                <div className="layout-px-spacing">
                    <div className="middle-content container-xxl p-0">
                        <Breadcrumb items={breadcrumbItems}/>
                        <div className="row layout-spacing">
                            <div className="col-lg-12">
                                <div className="statbox widget box box-shadow">
                                    <div className="widget-header pb-2">
                                        <div className="row">
                                            <div className="col-xl-12 col-md-12 col-sm-12 col-12 mt-1">
                                                {/* <h4>Holiday List</h4> */}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-xl-4 col-md-4 col-sm-12 col-12 pl-1">
                                                <select
                                                    className="form-select"
                                                    value={selectedYear}
                                                    onChange={handleYearChange}
                                                >
                                                    <option value="">Select year to display holidays</option>
                                                    <option value={2023}>2023</option>
                                                    <option value={2024}>2024</option>
                                                </select>
                                            </div>
                                            <div className="col-xl-1 col-md-1"></div>
                                            <div className="col-xl-6 col-md-6 col-sm-12 col-12 text-end">
                                                <button
                                                    className="btn btn-primary mt-2"
                                                    onClick={() => setShowModal(true)}
                                                >Add Holiday</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget-content widget-content-area">
                                        <DataTableComponent
                                            title="Holiday Records"
                                            columns={columns}
                                            data={data}
                                            searchFields={['dateFormatted', 'day', 'description']} // Specify search fields here
                                            pagination
                                            striped
                                            highlightOnHover
                                            className="table style-1 dt-table-hover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddHolidayModal
                show={showModal}
                handleClose={() => setShowModal(false)}
            />
        </CommonLayout>
    );
}

export default Holiday;
