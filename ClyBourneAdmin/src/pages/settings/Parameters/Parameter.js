import React, { useState, useEffect } from 'react';
import CommonLayout from "../../../common/CommonLayout";
import Breadcrumb from "../../../components/Breadcrumb";
import axios from 'axios';
import Swal from 'sweetalert2';
import { apiURL } from '../../../Config';

const Parameter = () => {
   const [loading, setLoading] = useState(false);
   const [formValues, setFormValues] = useState({
     hoursAllowed: '',
     workingDays: '',
     dcfWeightage: ''
   });

   const breadcrumbItems = [
      { label: 'Dashboard', link: '/dashboard' },
      { label: 'Setup', link: '/dashboard' },
      { label: 'Parameters', active: true }
    ];

    useEffect(() => {
      // Fetch existing values from the API
      axios.get(apiURL + 'api/admin/setup/parameters')
        .then(response => {
          if (response.data) {
            const dcfWeightage = response.data.dcfWeightage?.toFixed(2) || '';
            setFormValues({
              hoursAllowed: response.data.hoursAllowed || '',
              workingDays: response.data.workingDays || '',
              dcfWeightage: dcfWeightage
            });
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }, []);


    const handleChange = (e) => {
      const { name, value } = e.target;
      // Validation for numeric and decimal values
      if (name === 'dcfWeightage') {
        const decimalPattern = /^\d*\.?\d{0,2}$/;
        if (value === '' || decimalPattern.test(value)) {
          setFormValues(prevState => ({ ...prevState, [name]: value }));
        }
      } else {
        const numericPattern = /^\d*$/;
        if (value === '' || numericPattern.test(value)) {
          setFormValues(prevState => ({ ...prevState, [name]: value }));
        }
      }
    };

    const handleBlur = (e) => {
      const { name, value } = e.target;
      if (name === 'dcfWeightage') {
        if (value && !value.includes('.')) {
          setFormValues(prevState => ({ ...prevState, [name]: `${value}.00` }));
        } else if (value && value.split('.')[1].length === 1) {
          setFormValues(prevState => ({ ...prevState, [name]: `${value}0` }));
        }
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      setLoading(true);
      axios.post(apiURL+'api/admin/setup/parameters', formValues)
        .then(response => {
          setLoading(false);
          Swal.fire('Success', 'Form successfully submitted', 'success');
        })
        .catch(error => {
          setLoading(false);
          Swal.fire('Error', 'There was an error submitting the form', 'error');
        });
    };


   return (
      <CommonLayout page={'parameter'}>
         <div id="content" className="main-content">
         <div className="container">
            <div className="container">
                  <div className="page-meta  pb-2">
                     <Breadcrumb items={breadcrumbItems}/>
                  </div>
                  <div className="row">
                     <div id="flHorizontalForm" className="col-lg-12 layout-spacing">
                        <div className="statbox widget box box-shadow">
                           <div className="widget-header">
                              <div className="row">
                                 <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                    {/* <h4>Parameters</h4> */}
                                 </div>
                              </div>
                           </div>
                           <div className="widget-content widget-content-area">
                              <form onSubmit={handleSubmit}>
                                 <div className="row mb-3">
                                    <label htmlFor="inputDays3" className="col-sm-3 col-form-label">Numbers of hours allowed to modify the report after initial report creation:</label>
                                    <div className="col-sm-9">
                                       <input
                                          type="text"
                                          className="form-control"
                                          id="inputHours"
                                          name="hoursAllowed"
                                          value={formValues.hoursAllowed}
                                          onChange={handleChange}
                                          />
                                       </div>
                                 </div>
                                 <div className="row mb-3">
                                    <label htmlFor="inputReport3" className="col-sm-3 col-form-label">Number of working days in which report to be generated:</label>
                                    <div className="col-sm-9">
                                       <input
                                          type="text"
                                          className="form-control"
                                          id="inputDays"
                                          name="workingDays"
                                          value={formValues.workingDays}
                                          onChange={handleChange}
                                       />
                                    </div>
                                 </div>
                                 <div className="row mb-3">
                                    <label htmlFor="inputdcf" className="col-sm-3 col-form-label">Default for DCF Weightage (%):</label>
                                    <div className="col-sm-9">
                                       <input
                                          type="text"
                                          className="form-control"
                                          id="inputDcf"
                                          name="dcfWeightage"
                                          value={formValues.dcfWeightage}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                        />
                                    </div>
                                 </div>
                                 <div className="row mb-3">
                                    <div className="col-sm-2">
                                       <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                          {loading ? 'Submitting...' : 'Submit'}
                                       </button>
                                    </div>
                                 </div>
                              </form>
                           </div>
                        </div>
                     </div>
                  </div>
            </div>
         </div>
         </div>
      </CommonLayout>
   )
}

export default Parameter;
