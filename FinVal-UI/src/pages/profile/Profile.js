import React, { useEffect, useState } from 'react';
import Loader from "../../common/Loader";
import { apiURL } from '../../config/Config';
import axios from 'axios';
import anime from 'animejs';
import './Profile.css';
import Swal from 'sweetalert2';
import ResetPassword from './ResetPassword';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Ensure the root element is set for accessibility

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        company: '',
        jobTitle: '',
        country: '',
        phone: '',
        email: ''
    });
    const [errors, setErrors] = useState({});
    const token = localStorage.getItem('token');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    useEffect(() => {
        const elements = document.querySelectorAll('[data-anime]');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const animeConfig = JSON.parse(el.getAttribute('data-anime'));
                    anime({
                        targets: el,
                        ...animeConfig,
                    });
                    observer.unobserve(el);
                }
            });
        });
        elements.forEach(el => {
            observer.observe(el);
        });
        return () => {
            elements.forEach(el => observer.unobserve(el));
        };
    }, []);

    // Fetch profile data and countries list
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const profileResponse = await axios.get(apiURL + '/front/customer/profile', {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                
                const userData = profileResponse.data.data.user;
                const countriesData = profileResponse.data.data.countries || [];

                setProfileData(userData);
                setCountries(countriesData);
                setFormData({
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    company: userData.company,
                    jobTitle: userData.jobTitle,
                    country: userData.country,
                    phone: userData.phone,
                    email: userData.email
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile:", error);
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [token]);

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Validate form
    const validate = () => {
        let formErrors = {};
        
        if (!formData.first_name.trim()) {
            formErrors.first_name = "First Name is required.";
        }
        if (!formData.last_name.trim()) {
            formErrors.last_name = "Last Name is required.";
        }
        if (!formData.company.trim()) {
            formErrors.company = "Company is required.";
        }
        if (!formData.jobTitle.trim()) {
            formErrors.jobTitle = "Job Title is required.";
        }
        if (!formData.country.trim()) {
            formErrors.country = "Country is required.";
        }

        // Phone validation (optional, but must be 10 digits if provided)
        if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
            formErrors.phone = "Phone Number must be exactly 10 digits.";
        }

        setErrors(formErrors);

        // Return true if no errors
        return Object.keys(formErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate before submitting
        if (validate()) {
            try {
                const response = await axios.put(`${apiURL}/front/customer/update_profile`, formData, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                 if(response.status){
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Profile Updated Successfully',
                      })
                 }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Something went wrong.Please try again.',
                    });
                 }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Something went wrong.Please try again.',
                });
            }
        }
    };

    return (
        <>
        <section className="position-relative bg-white">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12 order-1 order-lg-2 md-mb-50px" data-anime='{ "el": "childs", "translateY": [50, 0], "opacity": [0,1], "duration": 1200, "delay": 0, "staggervalue": 150, "easing": "easeOutQuad" }'>
                        <div className="row mb-0">
                            <div className="col text-center">
                                <h2 className="fs-50 text-dark-gray fw-600 ls-minus-1px">My Profile</h2>
                            </div>
                        </div>
                        <div className="row align-items-center justify-content-center position-relative z-index-1">
                            <div className="col-xl-8 col-md-8">
                                <form className="row contact-form-style-02 bg-very-light-gray border-radius-10px p-10 pt-5 myform-01" onSubmit={handleSubmit}>
                                    <div className="col-sm-12 mt-10px text-end">
                                        <button
                                            className="btn btn-round-edge bg-blue submit h-30px p-0 ps-5px pe-5px fs-12 m-10px text-white fs-12 fw-600 text-capitalize fin-btn"
                                            type="button"
                                        >
                                            <span onClick={openModal}>
                                                <span><i className="bi bi-repeat m-0 align-middle"></i></span>
                                                <span className="btn-double-text"> Reset Login Password</span>
                                            </span>
                                        </button>
                                    </div>

                                    <div className="col-sm-12 mt-20px">
                                        <div className="row align-items-center">
                                            <div className="col-lg-3">
                                                <label className="text-black mb-0 fw-600 d-block lh-1 md-mb-5px">Email</label>
                                            </div>
                                            <div className="col-lg-9">
                                                <div className="input-group">
                                                    <span className="input-group-text p-15px border-radius-0px">
                                                        <i className="bi bi-envelope-at align-middle fs-20 lh-1"></i>
                                                    </span>
                                                    <input className="border-radius-0px bg-white box-shadow form-control" type="email" name="email" value={formData.email} disabled />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* First Name */}
                                    <div className="col-sm-12 mt-20px">
                                        <div className="row align-items-center">
                                            <div className="col-lg-3">
                                                <label className="text-black mb-0 fw-600 d-block lh-1 md-mb-5px">First Name</label>
                                            </div>
                                            <div className="col-lg-9">
                                                <div className="input-group">
                                                    <span className="input-group-text p-15px border-radius-0px">
                                                        <i className="bi bi-person-circle align-middle fs-20 lh-1"></i>
                                                    </span>
                                                    <input className="border-radius-0px bg-white box-shadow form-control" type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} />
                                                </div>
                                                {errors.first_name && <p className="text-danger">{errors.first_name}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Last Name */}
                                    <div className="col-sm-12 mt-20px">
                                        <div className="row align-items-center">
                                            <div className="col-lg-3">
                                                <label className="text-black mb-0 fw-600 d-block lh-1 md-mb-5px">Last Name</label>
                                            </div>
                                            <div className="col-lg-9">
                                                <div className="input-group">
                                                    <span className="input-group-text p-15px border-radius-0px">
                                                        <i className="bi bi-person-circle align-middle fs-20 lh-1"></i>
                                                    </span>
                                                    <input className="border-radius-0px bg-white box-shadow form-control" type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} />
                                                </div>
                                                {errors.last_name && <p className="text-danger mt-1">{errors.last_name}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Company */}
                                    <div className="col-sm-12 mt-20px">
                                        <div className="row align-items-center">
                                            <div className="col-lg-3">
                                                <label className="text-black mb-0 fw-600 d-block lh-1 md-mb-5px">Company</label>
                                            </div>
                                            <div className="col-lg-9">
                                                <div className="input-group">
                                                    <span className="input-group-text p-15px border-radius-0px">
                                                        <i className="bi bi-buildings align-middle fs-20 lh-1"></i>
                                                    </span>
                                                    <input className="border-radius-0px bg-white box-shadow form-control" type="text" name="company" value={formData.company} onChange={handleInputChange} />
                                                </div>
                                                {errors.company && <p className="text-danger mt-1">{errors.company}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Job Title */}
                                    <div className="col-sm-12 mt-20px">
                                        <div className="row align-items-center">
                                            <div className="col-lg-3">
                                                <label className="text-black mb-0 fw-600 d-block lh-1 md-mb-5px">Job Title</label>
                                            </div>
                                            <div className="col-lg-9">
                                                <div className="input-group">
                                                    <span className="input-group-text p-15px border-radius-0px">
                                                        <i className="bi bi-briefcase align-middle fs-20 lh-1"></i>
                                                    </span>
                                                    <input className="border-radius-0px bg-white box-shadow form-control" type="text" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} />
                                                </div>
                                                {errors.jobTitle && <p className="text-danger mt-1">{errors.jobTitle}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Country */}
                                    <div className="col-sm-12 mt-20px">
                                        <div className="row align-items-center">
                                            <div className="col-lg-3">
                                                <label className="text-black mb-0 fw-600 d-block lh-1 md-mb-5px">Country</label>
                                            </div>
                                            <div className="col">
                                                <div class="input-group">
                                                    <span class="input-group-text p-15px border-radius-0px">
                                                        <i class="bi bi-globe align-middle fs-20 lh-1"></i>
                                                    </span>
                                                    <div className='select'>
                                                        <select name="country" className="form-control" value={formData.country} onChange={handleInputChange}>
                                                            <option value="">Select Country</option>
                                                            {countries.map((country) => (
                                                                <option key={country.id} value={country.name}>
                                                                    {country.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>    
                                                    {errors.country && <p className="text-danger mt-1">{errors.country}</p>}
                                                 </div>   
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phone Number */}
                                    <div className="col-sm-12 mt-20px">
                                        <div className="row align-items-center">
                                            <div className="col-lg-3">
                                                <label className="text-black mb-0 fw-600 d-block lh-1 md-mb-5px">Phone Number</label>
                                            </div>
                                            <div className="col-lg-9">
                                                <div className="input-group">
                                                    <span className="input-group-text p-15px border-radius-0px">
                                                        <i className="bi bi-phone align-middle fs-20 lh-1"></i>
                                                    </span>
                                                    <input className="border-radius-0px bg-white box-shadow form-control" type="text" name="phone" value={formData.phone} onChange={handleInputChange}  
                                                    onKeyDown={(e) => {
                                                        // Allow backspace, delete, arrow keys, and tab
                                                        if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Tab') {
                                                            return;
                                                        }
                                                        // Prevent entering anything other than numbers
                                                        if (!/^[0-9]+$/.test(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    maxLength="10"/>
                                                </div>
                                                {errors.phone && <p className="text-danger mt-1">{errors.phone}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-12 mt-10px text-center">
                                        <button className="btn btn-round-edge bg-blue submit h-30px p-0 ps-5px pe-5px fs-12 text-white fw-600 text-capitalize" type="submit">
                                            Update Profile
                                        </button>
                                    </div>
                                </form>
                                {loading && <Loader />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Reset Password"
        className="modal-popup-main"
        overlayClassName="modal-overlay"
      >
        <button onClick={closeModal} className="close-modal-btn">
          &times;
        </button>
        <ResetPassword />
      </Modal>
    </>  
    );
};

export default Profile;
