import React, { useState, useEffect } from 'react';
import anime from 'animejs';
import Heading from './Heading';
import Filter from './Filter';
import Table from './Table';
import axios from 'axios';
import { apiURL } from '../../../config/Config';

const Listing = () => {
  const [filterData, setFilterData] = useState({ countries: [], companies: [], customers: [] });
  const [filters, setFilters] = useState({
    orderId: '',
    companyName: '',
    country: '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchFilterData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(apiURL + '/order/order-filter-data', {
          headers: {
            Authorization: `${token}`, 
            'Content-Type': 'application/json',
          },
        });
        const data = await response;
        if (data.status) {
          setFilterData({
            countries: data.data.data.countries, 
            companies: data.data.data.companies,
            customers: data.data.data.customer
          });
        } else {
          console.error('Failed to fetch filter data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilterData();

    const elements = document.querySelectorAll('[data-anime]');
    elements.forEach(el => {
      const animeConfig = JSON.parse(el.getAttribute('data-anime'));
      anime({
        targets: el,
        ...animeConfig,
      });
    });
  }, []);

  useEffect(() => {
    const fetchTableData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post(apiURL + '/order/customer_order', filters, {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response;
        if (data.status) {
          setTableData(data.data.data.orders_updated);
        } else {
          console.error('Failed to fetch table data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };

    fetchTableData();
  }, [filters]);

  return (
    <>
      <section className="position-relative pt-15px pb-15px">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 order-1 order-lg-2 md-mb-50px" data-anime='{ "el": "childs", "translateY": [50, 0], "opacity": [0,1], "duration": 1200, "delay": 0, "staggervalue": 150, "easing": "easeOutQuad" }'>
              <div className="row align-items-center justify-content-center position-relative z-index-1">
                <div className="col-md-11">
                  <div className="card mt-15px rounded-bottom-0 border-0 box-shadow">
                    <div className="card-body overflow-hidden ps-15px pe-15px pt-0 pb-0 sm-ps-5px sm-pe-5px">
                      
                      <Heading data={filterData} />

                       {filterData && filterData?.customers?.activePlanType === 'A' &&
                          <Filter data={filterData} filters={filters} setFilters={setFilters} /> 
                       }
                      
                      <Table data={tableData} />

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Listing;
