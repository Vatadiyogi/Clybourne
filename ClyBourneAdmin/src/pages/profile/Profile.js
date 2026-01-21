import React, { useState, useEffect } from 'react';
import CommonLayout from "../../common/CommonLayout";
import Breadcrumb from "../../components/Breadcrumb";
import axios from 'axios';
import Swal from 'sweetalert2';
import { apiURL } from '../../Config';

const Profile = () => { 
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const breadcrumbItems = [
    { label: 'Profile', active: true }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    
    if (token && userId) {
      // Fetch existing values from the API
      axios.get(`${apiURL}api/admin/admin/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (response.data) {
          setFormValues({
            name: response.data.name || '',
            email: response.data.email || '',
            role: response.data.role || '',
            phone: response.data.phone || '',
            password: ''
          });
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    }
  }, []);

  const handleChange = (e) => {
   const { id, value } = e.target;
   setFormValues(prevValues => ({
     ...prevValues,
     [id]: value
   }));
   setErrors(prevErrors => ({
     ...prevErrors,
     [id]: ''
   }));
   };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formValues.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formValues.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (formValues.phone && !/^\d{10}$/.test(formValues.phone)) {
      errors.phone = 'Phone number must be 10 digits';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    
    if (token && userId) {
      const payload = { ...formValues };
      if (!payload.password) {
        delete payload.password;
      }
      
      axios.post(`${apiURL}api/admin/admin/profile/update/${userId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setLoading(false);
        Swal.fire('Success', 'Profile successfully updated', 'success');
      })
      .catch(error => {
        setLoading(false);
        Swal.fire('Error', 'There was an error updating the profile', 'error');
      });
    }
  };

  return (
    <CommonLayout page={'parameter'}>
      <div id="content" className="main-content">
        <div className="container">
          <div className="container">
            <div className="page-meta pb-2">
              <Breadcrumb items={breadcrumbItems} />
            </div>
            <div className="row">
              <div id="flHorizontalForm" className="col-lg-12 layout-spacing">
                <div className="statbox widget box box-shadow">
                  <div className="widget-header">
                    <div className="row">
                      <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                        <h4>Profile</h4>
                      </div>
                    </div>
                  </div>
                  <div className="widget-content widget-content-area">
                    <form onSubmit={handleSubmit}>
                      <div className="col-xl-10 col-lg-12 col-md-8 mt-md-0 mt-4">
                        <div className="form">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label htmlFor="name">Name*:</label>
                                <input 
                                  type="text" 
                                  className={`form-control mb-3 ${errors.name ? 'is-invalid' : ''}`} 
                                  id="name" 
                                  placeholder="Name" 
                                  value={formValues.name} 
                                  onChange={handleChange} 
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-group">
                                <label htmlFor="email">Email*:</label>
                                <input 
                                  type="text" 
                                  className={`form-control mb-3 ${errors.email ? 'is-invalid' : ''}`} 
                                  id="email" 
                                  placeholder="Email Address" 
                                  value={formValues.email} 
                                  onChange={handleChange} 
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-group">
                                <label htmlFor="role">Role:</label>
                                <input 
                                  type="text" 
                                  className="form-control mb-3" 
                                  id="role" 
                                  placeholder="Role" 
                                  value={formValues.role} 
                                  onChange={handleChange} 
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label htmlFor="phone">Phone:</label>
                                <input 
                                  type="text" 
                                  className={`form-control mb-3 ${errors.phone ? 'is-invalid' : ''}`} 
                                  id="phone" 
                                  placeholder="Write your phone number here" 
                                  value={formValues.phone} 
                                  onChange={handleChange} 
                                />
                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <input 
                                  type="text" 
                                  className="form-control mb-3" 
                                  id="password" 
                                  placeholder="Enter new password" 
                                  value={formValues.password} 
                                  onChange={handleChange} 
                                />
                              </div>
                            </div>

                            <div className="col-md-12 mt-1">
                              <div className="form-group text-end">
                                <button className="btn btn-secondary" type="submit" disabled={loading}>
                                  {loading ? 'Updating...' : 'Update'}
                                </button>
                              </div>
                            </div>

                          </div>
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
  );
};

export default Profile;
