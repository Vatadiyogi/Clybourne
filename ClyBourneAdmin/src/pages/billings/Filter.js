import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from '../../components/Datepicker/Datepicker';
import axios from 'axios';
import { apiURL } from '../../Config';
import './Filter.css';

const Filter = ({ onFilterChange }) => {
    const [planOrderId, setPlanOrderId] = useState('');
    const [country, setCountry] = useState('');
    const [planType, setPlanType] = useState('');
    const [orderType, setOrderType] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [countries, setCountries] = useState([]);
    const [error, setError] = useState('');
    const [resetting, setResetting] = useState(false);

    const handleFromDateChange = (date) => {
        setFromDate(date);
    };

    const handleToDateChange = (date) => {
        setToDate(date);
    };

    const handleFilterSubmit = useCallback(
        (e) => {
            if (e) e.preventDefault();
            let adjustedFromDate = null;
            let adjustedToDate = null;
            let validationError = '';

            // Validate date range
            if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
                validationError = 'From Date cannot be greater than To Date';
                setError(validationError);
                return;
            }

            if (fromDate) {
                adjustedFromDate = new Date(fromDate);
                adjustedFromDate.setDate(adjustedFromDate.getDate() + 1); // Add 1 day
            }

            if (toDate) {
                adjustedToDate = new Date(toDate);
                adjustedToDate.setDate(adjustedToDate.getDate() + 1); // Add 1 day
            }

            const filters = {
                planOrderId,
                country,
                planType,
                orderType,
                fromDate: adjustedFromDate,
                toDate: adjustedToDate,
            };

            onFilterChange(filters);
            setResetting(false);
        },
        [planOrderId, country, planType, orderType, fromDate, toDate, onFilterChange]
    );

    useEffect(() => {
        // Fetch countries from an API (Example using REST Countries)
        const fetchCountries = async () => {
            try {
                const response = await axios.get(`${apiURL}api/country/`);
                setCountries(response.data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        fetchCountries();
    }, []);

    // Load form values from localStorage on component mount
    useEffect(() => {
        const storedPlanOrderId = localStorage.getItem('planOrderId');
        const storedCountry = localStorage.getItem('country');
        const storedPlanType = localStorage.getItem('planType');
        const storedOrderType = localStorage.getItem('orderType');
        const storedFromDate = localStorage.getItem('fromDate');
        const storedToDate = localStorage.getItem('toDate');

        if (storedPlanOrderId) setPlanOrderId(storedPlanOrderId);
        if (storedCountry) setCountry(storedCountry);
        if (storedPlanType) setPlanType(storedPlanType);
        if (storedOrderType) setOrderType(storedOrderType);
        if (storedFromDate) setFromDate(new Date(storedFromDate));
        if (storedToDate) setToDate(new Date(storedToDate));

        setResetting(true);
    }, [setResetting]);

    // Save form values to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('planOrderId', planOrderId);
        localStorage.setItem('country', country);
        localStorage.setItem('planType', planType);
        localStorage.setItem('orderType', orderType);
        if (fromDate) localStorage.setItem('fromDate', fromDate.toISOString());
        else localStorage.removeItem('fromDate');
        if (toDate) localStorage.setItem('toDate', toDate.toISOString());
        else localStorage.removeItem('toDate');
    }, [planOrderId, country, planType, orderType, fromDate, toDate]);

    useEffect(() => {
        if (resetting) {
            handleFilterSubmit();
        }
    }, [resetting, handleFilterSubmit]);

    const handleReset = () => {
        // Clear all state values
        setPlanOrderId('');
        setCountry('');
        setPlanType('');
        setOrderType('');
        setFromDate(null);
        setToDate(null);

        // Clear localStorage values
        localStorage.removeItem('planOrderId');
        localStorage.removeItem('country');
        localStorage.removeItem('planType');
        localStorage.removeItem('orderType');
        localStorage.removeItem('fromDate');
        localStorage.removeItem('toDate');

        // Set resetting state to true to trigger useEffect
        setResetting(true);
    };

    return (
        <div className="filter-container">
            <form onSubmit={handleFilterSubmit}>
                {error && <div className="invalid-feedback mb-2">{error}</div>}
                <div className="row mb-2">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="planOrderId">Plan Order ID</label>
                            <input
                                type="text"
                                className="form-control"
                                id="planOrderId"
                                value={planOrderId}
                                onChange={(e) => setPlanOrderId(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <select
                                className="form-select"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            >
                                <option value="">Select Country</option>
                                {countries.map((country, index) => (
                                    <option key={index} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="planType">Plan Type</label>
                            <select
                                name="planType"
                                id="planType"
                                className="form-select"
                                value={planType}
                                onChange={(e) => setPlanType(e.target.value)}
                            >
                                <option value="">Select Plan Type</option>
                                <option value="BO">Business Owner</option>
                                <option value="BOP">Business Owner Plus</option>
                                <option value="A">Advisor</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="orderType">Order Type</label>
                            <select
                                name="orderType"
                                id="orderType"
                                className="form-select"
                                value={orderType}
                                onChange={(e) => setOrderType(e.target.value)}
                            >
                                <option value="">Select Order Type</option>
                                <option value="New">New</option>
                                <option value="Upgrade">Upgrade</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row  mt-4 align-items-center">
                    <div className="col-md-2 mt-4">
                        <h5>Transaction Date:</h5>
                    </div>
                    <div className="col-md-3 mt-4">
                        <div className="form-group row">
                            <label htmlFor="fromDate" className="col-sm-2 col-form-label">From:</label>
                            <div className="col-sm-10">
                                <DatePicker selectedDate={fromDate} handleDateChange={handleFromDateChange} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mt-4">
                        <div className="form-group row">
                            <label htmlFor="toDate" className="col-sm-2 col-form-label">To:</label>
                            <div className="col-sm-10">
                                <DatePicker selectedDate={toDate} handleDateChange={handleToDateChange} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mt-4">
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
