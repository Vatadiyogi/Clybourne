"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CiCirclePlus } from "react-icons/ci";
import Link from "next/link";
import OrderTable from "../../component/OrderTable"
import { FiSearch } from "react-icons/fi";
import Axios from '../../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';

const Order = () => {
  const router = useRouter();
  const [filterData, setFilterData] = useState({
    countries: [],
    companies: [],
    customers: []
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    startDate: '',
    endDate: '',
    sortBy: 'createdAt', // Add sortBy to filters
    sortOrder: 'desc',   // Add sortOrder to filters
  });
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);

  // Fetch filter data and orders on component mount
  useEffect(() => {
    const fetchFilterData = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await Axios.get('/api/order/order-filter-data', {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response;
        if (data.status) {
          setFilterData({
            countries: data.data.data.countries || [],
            companies: data.data.data.companies || [],
            customers: data.data.data.customer || {}
          });
        } else {
          console.error('Failed to fetch filter data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilterData();
  }, []);

  // Fetch table data when filters change
  useEffect(() => {
    const fetchTableData = async () => {
      setFilterLoading(true);
      const token = localStorage.getItem('authToken');
      try {
        console.log('Sending filters:', filters); // Debug log
        
        const response = await Axios.post('/api/order/customer_order', filters, {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Response:', response.data); // Debug log

        if (response.data.status) {
          setTableData(response.data.data.orders_updated || []);
        } else {
          console.error('Failed to fetch table data:', response.data.message);
          setTableData([]);
        }
      } catch (error) {
        console.error('Error fetching table data:', error);
        setTableData([]);
      } finally {
        setLoading(false);
        setFilterLoading(false);
      }
    };

    fetchTableData();
  }, [filters]);

  const handleNewOrder = () => {
    router.push('/dashboard/newOrder');
  };

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
    }));
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilters(prev => ({
      ...prev,
      search: '',
    }));
  };

  const handleSortChange = (e) => {
    // Update both sortBy and sortOrder in filters
    const newSortBy = e.target.value;
    setFilters(prev => ({
      ...prev,
      sortBy: newSortBy,
      sortOrder: 'desc', // You can make this toggleable if needed
    }));
  };

  const handleStatusChange = (e) => {
    setFilters(prev => ({ ...prev, status: e.target.value }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center bg-gray-50">
        <div className="text-center">
          <CircularProgress size={40} style={{ color: "#16a085" }} />
          <p className="mt-3 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='lg:ps-8 bg-gray-50 p-3 lg:pe-14 xl:pe-24 lg:pt-3'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0'>
          <div className='' >
            <h2 className='text-[26px] fw-medium font-sans '>My Orders</h2>
            <p className='text-gray-700 text-sm text-medium'>Track, Manage, and Stay in Control – Access your current plan, and effortlessly find past and ongoing orders</p>
          </div>
          <div className='flex w-full justify-end'>
            <button
              onClick={handleNewOrder}
              className='bg-themegreen text-white font-medium flex items-center px-2 justify-center gap-3 text-xs text-center w-[146px] py-2 rounded-md'
            >
              New Orders
              <span>
                <CiCirclePlus className='text-[20px] fw-semibold' />
              </span>
            </button>
          </div>
        </div>

        {/* Current Active Plan */}
        <div className='flex lg:flex-row flex-col gap-4 lg:gap-6 xl:gap-10 my-5 font-sans'>
          <div className='p-4 rounded-md min-w-[250px] bg-themegreen text-white'>
            <h4 className='mb-1 text-xs text-medium'>Current Active Plan</h4>
            <h2 className='text-medium font-sans'>
              Plan Type / Plan ID  {filterData.customers?.activePlanType || 'N/A'} {filterData.customers?.planId ? `/ ${filterData.customers.planId}` : ''}
            </h2>
            <p className='mb-1 text-xs w-[70%]  text-medium'>
              New Orders Available
              <span className='ms-3 me-2'>
                :
              </span>
              <span>{filterData.customers?.TotalPlanOrderedCount || 0}</span>
            </p>
            <p className='mb-1 w-[70%] text-xs text-medium'>
              Plan Day Left
              <span className='ms-3 me-2'>
                :
              </span>
              <span>
                {filterData.customers?.daysLeft || 0}
              </span>
            </p>
          </div>

          {/* Search and Filters */}
          <div className='w-full flex flex-col gap-4 xl:gap-6 justify-center'>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2 w-[100%] shadow-sm relative">
              <FiSearch className="text-gray-500 text-lg" />
              <input
                type="text"
                placeholder="Search by Order Number, Company, or Country"
                className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="flex md:justify-between items-center flex-col xs:flex-row flex-nowrap xs:flex-wrap space-y-3 gap-2 md:gap-0 md:space-y-0">
              <span className="text-sm text-gray-600">Sort By</span>

              <div className='w-[-webkit-fill-available] xs:w-fit'>
                <select
                  className="border border-gray-300 rounded-md w-[-webkit-fill-available] xs:w-fit xl:px-3 px-1 xl:pe-6 py-1 xl:py-2 select-arrow-left text-sm text-gray-700 focus:outline-none"
                  value={filters.sortBy} // Use filters.sortBy
                  onChange={handleSortChange}
                >
                  <option value="createdAt">Order Date</option>
                  <option value="submittedOn">Submitted Date</option>
                  <option value="completedOn">Completed Date</option>
                </select>
              </div>

              {/* Optional: Add sort order toggle */}
              {/* <div className='w-[-webkit-fill-available] xs:w-fit'>
                <select
                  className="border border-gray-300 rounded-md w-[-webkit-fill-available] xs:w-fit xl:px-3 px-1 xl:pe-6 py-1 xl:py-2 select-arrow-left text-sm text-gray-700 focus:outline-none"
                  value={filters.sortOrder}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value }))}
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div> */}

              <div className='w-[-webkit-fill-available] xs:w-fit'>
                <select
                  className="border border-gray-300 rounded-md w-[-webkit-fill-available] xs:w-fit xl:px-3 px-1 xl:pe-6 py-1 xl:py-2 select-arrow-left text-sm text-gray-700 focus:outline-none"
                  value={filters.status}
                  onChange={handleStatusChange}
                >
                  <option value="">All Status</option>
                  <option value="Pending Submission">Pending Submission</option>
                  <option value="Help Requested">Help Requested</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Completed">Completed</option>
                  <option value="Re-Submitted">Re-Submitted</option>
                  <option value="Completed (Revised)">Completed (Revised)</option>
                </select>
              </div>

              <div>
                <span className="text-teal-500 text-sm cursor-pointer" onClick={() => console.log('Advanced search')}>
                  Advance Search
                </span>
              </div>

              <button
                className="bg-themegreen w-[-webkit-fill-available] xs:w-fit hover:bg-teal-600 text-white text-xs px-4 lg:px-[52px] py-2 rounded-md flex items-center justify-center gap-2 lg:!mt-2 xl:!mt-0"
                onClick={handleSearch}
                disabled={filterLoading}
              >
                {filterLoading ? (
                  <>
                    <CircularProgress size={16} style={{ color: "white" }} />
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div>
          {filterLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <CircularProgress size={40} style={{ color: "#16a085" }} />
                <p className="mt-3 text-gray-600">Loading orders...</p>
              </div>
            </div>
          ) : (
            <>
              {searchTerm && tableData.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No orders found for "{searchTerm}"</p>
                  <button
                    onClick={handleClearSearch}
                    className="mt-2 text-themegreen hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
              <OrderTable data={tableData} />
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Order;