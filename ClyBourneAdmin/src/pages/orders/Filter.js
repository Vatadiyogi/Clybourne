import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Select from 'react-select'; // Import react-select
import { apiURL } from '../../Config';
import './Filter.css';

const Filter = ({ onFilterChange }) => {
    const [countries, setCountries] = useState([]);
    const [customerNames, setCustomerNames] = useState([]);
    const [companyNames, setCompanyNames] = useState([]);
    const [assignedTo, setAssignedTo] = useState([]);
    const [custody, setCustody] = useState('');
    const [orderStatus, setOrderStatus] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedAssignee, setSelectedAssignee] = useState('');
    const [resetting, setResetting] = useState(false);

    const handleFilterSubmit = useCallback(
        (e) => {
            if (e) e.preventDefault();

            const filters = {
                country: selectedCountry ? selectedCountry : '',
                customerNames: selectedCustomer ? selectedCustomer : '',
                companyNames: selectedCompany ? selectedCompany : '',
                assignedTo: selectedAssignee ? selectedAssignee : '',
                custody,
                orderStatus
            };

            onFilterChange(filters);
            setResetting(false);
        },
        [selectedCountry, selectedCustomer, selectedCompany, selectedAssignee, custody, orderStatus, onFilterChange]
    );

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const response = await axios.get(`${apiURL}api/admin/orders/dropdowns`);
                setCountries(response.data.countries || []);
                setCustomerNames(response.data.customers || []);
                setCompanyNames(response.data.companies || []);
                setAssignedTo(response.data.assignedTo || []);
            } catch (error) {
                console.error('Error fetching dropdown data:', error);
            }
        };

        fetchDropdownData();
    }, []);

    useEffect(() => {
        const storedCountry = localStorage.getItem('selectedCountry');
        const storedCustomer = localStorage.getItem('selectedCustomer');
        const storedCompany = localStorage.getItem('selectedCompany');
        const storedAssignee = localStorage.getItem('selectedAssignee');
        const storedOrderStatus = localStorage.getItem('orderStatus') || '';
        const storedCustody = localStorage.getItem('custody') || '';

        setSelectedCountry(storedCountry || '');
        setSelectedCustomer(storedCustomer || '');
        setSelectedCompany(storedCompany || '');
        setSelectedAssignee(storedAssignee || '');
        setOrderStatus(storedOrderStatus);
        setCustody(storedCustody);

        setResetting(true);
    }, [setResetting]);

    useEffect(() => {
        localStorage.setItem('selectedCountry', selectedCountry);
        localStorage.setItem('selectedCustomer', selectedCustomer);
        localStorage.setItem('selectedCompany', selectedCompany);
        localStorage.setItem('selectedAssignee', selectedAssignee);
        localStorage.setItem('orderStatus', orderStatus);
        localStorage.setItem('custody', custody);
    }, [selectedCountry, selectedCustomer, selectedCompany, selectedAssignee, orderStatus, custody]);

    useEffect(() => {
        if (resetting) {
            handleFilterSubmit();
        }
    }, [resetting, handleFilterSubmit]);

    const handleReset = () => {
        setSelectedCountry('');
        setSelectedCustomer('');
        setSelectedCompany('');
        setSelectedAssignee('');
        setOrderStatus('');
        setCustody('');

        localStorage.removeItem('selectedCountry');
        localStorage.removeItem('selectedCustomer');
        localStorage.removeItem('selectedCompany');
        localStorage.removeItem('selectedAssignee');
        localStorage.removeItem('orderStatus');
        localStorage.removeItem('custody');

        setResetting(true);
    };

    // Mapping data to options for react-select
    const countryOptions = countries.map((country) => ({
        value: country.name,
        label: country.name
    }));
    const customerOptions = customerNames.map((customer) => ({
        value: customer._id,
        label: customer.email
    }));
    const companyOptions = companyNames.map((company) => ({
        value: company.companyName,
        label: company.companyName
    }));
    const assigneeOptions = assignedTo.map((assignee) => ({
        value: assignee._id,
        label: assignee.name
    }));

    return (
        <div className="filter-container">
            <form onSubmit={handleFilterSubmit}>
                <div className="row mb-2">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="customerName">Customer</label>
                            <Select
                                options={customerOptions}
                                value={customerOptions.find(option => option.value === selectedCustomer)}
                                onChange={(option) => setSelectedCustomer(option ? option.value : '')}
                                isClearable
                                placeholder="Select Customer"
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="companyName">Company Name</label>
                            <Select
                                options={companyOptions}
                                value={companyOptions.find(option => option.value === selectedCompany)}
                                onChange={(option) => setSelectedCompany(option ? option.value : '')}
                                isClearable
                                placeholder="Select Company"
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <Select
                                options={countryOptions}
                                value={countryOptions.find(option => option.value === selectedCountry)}
                                onChange={(option) => setSelectedCountry(option ? option.value : '')}
                                isClearable
                                placeholder="Select Country"
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="orderStatus">Order Status</label>
                            <select
                                className="form-select"
                                value={orderStatus}
                                onChange={(e) => setOrderStatus(e.target.value)}
                            >
                                <option value="">Select Order Status</option>
                                <option value="Submitted">Submitted</option>
                                <option value="Re-submitted">Re-Submitted</option>
                                <option value="Help Requested">Help Requested</option>
                                <option value="Completed (Initial Report)">Completed (Initial Report)</option>
                                <option value="Completed (Revised Report)">Completed (Revised Report)</option>
                                <option value="Pending Submission">Pending Submission</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row mt-4 align-items-center">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="assignee">Assigned to</label>
                            <Select
                                options={assigneeOptions}
                                value={assigneeOptions.find(option => option.value === selectedAssignee)}
                                onChange={(option) => setSelectedAssignee(option ? option.value : '')}
                                isClearable
                                placeholder="Select Assignee"
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="custody">Custody</label>
                            <select
                                className="form-select"
                                value={custody}
                                onChange={(e) => setCustody(e.target.value)}
                                style={{ borderRadius: '10px' }}
                            >
                                <option value="">Select Custody</option>
                                <option value="company">Company</option>
                                <option value="customer">Customer</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3 mt-4">
                        <button type="submit" className="btn btn-md btn-primary me-2">
                            Submit
                        </button>
                        <button type="button" className="btn btn-md btn-danger me-2" onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Filter;
