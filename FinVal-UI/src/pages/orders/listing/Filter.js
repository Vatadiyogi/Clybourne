import React, { useState, useEffect } from 'react';

const Filter = ({ data, filters, setFilters }) => {
  const [localFilters, setLocalFilters] = useState(() => {
    const savedFilters = localStorage.getItem('filters');
    return savedFilters ? JSON.parse(savedFilters) : {
      orderId: filters.orderId || '',
      company: filters.companyName || '',
      country: filters.country || '',
      status: filters.status || '',
      dateFrom: filters.startDate || '',
      dateTo: filters.endDate || '',
    };
  });

  // Save localFilters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('filters', JSON.stringify(localFilters));
  }, [localFilters]);

  // Apply the filters on page load
  useEffect(() => {
    setFilters(localFilters);

    return () => {
        localStorage.removeItem('filters');
    };
  }, []); // This runs once when the component mounts

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({
      ...localFilters,
      [name]: value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      orderId: '',
      companyName: '',
      country: '',
      status: '',
      startDate: '',
      endDate: '',
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    localStorage.removeItem('filters');
  };

  return (
    <div className="row mt-15px">
        <div className="col-sm-12">
            <fieldset className="ps-15px pe-15px pb-5px pt-10px h-100 d-block" style={{background:'#f2f3f6'}}>
                <legend className="fw-600 float-none border-1px col-auto fs-14 ps-15px pe-15px p-5px lh-1 border-radius-4px bg-light-blue text-blue m-0">Search your order</legend>
                <form onSubmit={handleSearch} className="contact-form-style-04 myform-01 justify-content-center">
                    <div className="row align-items-center">
                        <div className="col-12 col-lg-3">
                            <label className="text-black fw-500 fs-14 d-block lh-1 mb-2">Order</label>
                            <div className="input-group mb-10px">
                                <span className="input-group-text p-0 w-35px h-30px justify-content-center border-radius-0px">
                                    <i className="bi bi-hash align-middle fs-18 lh-1"></i>
                                </span>
                                <input className="mb-0 form-control bg-white h-30px fs-13" type="text" name="orderId" value={localFilters.orderId} onChange={handleInputChange}/>
                            </div>
                        </div>
                        <div className="col-12 col-lg-3">
                            <label className="text-black fw-500 fs-14 d-block lh-1 mb-2">Company</label>
                            <div className="input-group mb-10px">
                                <span className="input-group-text p-0 w-35px h-30px justify-content-center border-radius-0px">
                                    <i className="bi bi-buildings align-middle fs-18 lh-1"></i>
                                </span>
                                <div className="select">
                                    <select className="form-control h-30px fs-13" name="companyName" aria-label="select-industry" value={localFilters.companyName} onChange={handleInputChange}>
                                        <option value="">Select Company Name</option>
                                        {data.companies.map((company, index) => (
                                            <option key={index} value={company}>{company}</option>
                                         ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-3">
                            <label className="text-black fw-500 fs-14 d-block lh-1 mb-2">Country</label>
                            <div className="input-group mb-10px">
                                <span className="input-group-text p-0 w-35px h-30px justify-content-center border-radius-0px">
                                    <i className="bi bi-globe2 align-middle fs-18 lh-1"></i>
                                </span>
                                <div className="select">
                                    <select className="form-control h-30px fs-13" name="country" aria-label="select-industry" value={localFilters.country} onChange={handleInputChange}>
                                        <option value="">Select country name</option>
                                        {data.countries.map((country, index) => (
                                            <option key={index} value={country}>{country}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-3">
                            <label className="text-black fw-500 fs-14 d-block lh-1 mb-2">Order Status</label>
                            <div className="input-group mb-10px">
                                <span className="input-group-text p-0 w-35px h-30px justify-content-center border-radius-0px">
                                    <i className="bi bi-activity align-middle fs-18 lh-1"></i>
                                </span>
                                <div className="select">
                                    <select className="form-control h-30px fs-13" name="status" aria-label="select-industry" value={localFilters.status} onChange={handleInputChange}>
                                        <option value="">Select Status</option>
                                        <option value="Pending Submission">Pending Submission</option>
                                        <option value="Help Requested">Help Requested</option>
                                        <option value="Submitted">Submitted</option>
                                        <option value="Completed (Initial Report)">Completed</option>
                                        <option value="Re-submitted">Re-Submitted</option>
                                        <option value="Completed (Revised Report)">Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-3">
                            <label className="text-black fw-500 fs-14 d-block lh-1 mb-2">Date Created From</label>
                            <div className="input-group mb-10px">
                                <span className="input-group-text p-0 w-35px h-30px justify-content-center border-radius-0px">
                                    <i className="bi bi-calendar3 align-middle fs-18 lh-1"></i>
                                </span>
                                <input className="mb-0 form-control bg-white h-30px fs-13" type="date" name="startDate" aria-label="date" value={localFilters.startDate} onChange={handleInputChange}/> 
                            </div>
                        </div>
                        <div className="col-12 col-lg-3">
                            <label className="text-black fw-500 fs-14 d-block lh-1 mb-2">Date Created To</label>
                            <div className="input-group mb-10px">
                                <span className="input-group-text p-0 w-35px h-30px justify-content-center border-radius-0px">
                                    <i className="bi bi-calendar3 align-middle fs-18 lh-1"></i>
                                </span>
                                <input className="mb-0 form-control bg-white h-30px fs-13" type="date" name="endDate" aria-label="date"  value={localFilters.endDate} onChange={handleInputChange} /> 
                            </div>
                        </div>
                        <div className="col-12 col-lg-3">
                            <button className="border-radius-4px btn btn-round-edge bg-blue submit h-30px p-0 ps-15px pe-15px fs-12 m-0 text-white fs-12 fw-600 text-capitalize fin-btn" type="submit">
                                <i className="feather icon-feather-search m-0 fs-16 align-text-bottom"></i> Search
                            </button>
                            &nbsp;
                            <button onClick={handleReset} className="border-radius-4px btn btn-round-edge bg-blue submit h-30px p-0 ps-15px pe-15px fs-12 m-0 text-white fs-12 fw-600 text-capitalize fin-btn" type="button">
                                <i className="feather icon-feather-rotate-ccw m-0 fs-16 align-text-bottom"></i> Reset
                            </button>
                            
                        </div>
                    </div>
                </form>
            </fieldset>
        </div>
    </div>
  )
}

export default Filter;