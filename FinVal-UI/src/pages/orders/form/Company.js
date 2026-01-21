import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import companyLogo from "../../../assets/finimg/company-name1.png";
import companyType from "../../../assets/finimg/company-type1.png";
import industryTypeImage from "../../../assets/finimg/industry -type.png";
import businessYearImage from "../../../assets/finimg/years-in-business1.png";
import countryImage from "../../../assets/finimg/country.png";
import financialYearImage from "../../../assets/finimg/financial-year.png";
import historicalYearImage from "../../../assets/finimg/historical-year-trend.png";
import descriptionImage from "../../../assets/finimg/short-description.png";
import contactImage from "../../../assets/finimg/contact-number.png";
import emailImage from "../../../assets/finimg/email-address.png";
import currencyImage from "../../../assets/finimg/currency-used-in-company.png";
import axios from 'axios';
import { apiURL } from '../../../config/Config';
import CustomDropdown from './CustomDropdown';
import PhoneInputs from './PhoneInputs';
import "./Form.css";
import Swal from 'sweetalert2';
import Loader from "../../../common/Loader";

const Company = ({ onSave, initialData, onFieldBlur, orderId, editAllowed }) => {
    const [isLoading, setIsLoading] = useState(false);
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear;
    const years = [previousYear-2,previousYear-1,previousYear];
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const [formData, setFormData] = useState({
        companyName: '',
        companyType: '',
        industryType: '',
        similarCompany: '',
        companyAge: '',
        country: '',
        FinYrEndDate: '',
        FinYrEndMonth: '',
        FinYrEnd: '',
        earningTrend: '',
        description: '',
        contact: {
            phoneNumber: '',
            dialCode: '',
        },
        email: '',
        currency: '',
        orderId : '',
    });
    const [countries, setCountries] = useState([]);
    const [businessYears, setbusinessYears] = useState([]);
    const [historicalTrends, sethistoricalTrends] = useState([]);
    const [availableSubIndustries, setAvailableSubIndustries] = useState([]);
    const [currency, setCurrency] = useState([]);
    const [errors, setErrors] = useState({});
    const [documents, setDouments] = useState(false);
    const [orderStatus, setOrderStatus] = useState(null);

    useEffect(() => {
        if (initialData?.order?.business?.business) {
        const data = initialData.order.business.business;  
            setFormData({
                companyName: data.companyName || '',
                companyType: data.companyType || '',
                industryType: data.industryType || '',
                similarCompany: data.similarCompany || '',
                companyAge: data.companyAge || '',
                country: data.country || '',
                FinYrEndDate: data.FinYrEndDate || '',
                FinYrEndMonth: data.FinYrEndMonth || '',
                FinYrEnd : data.FinYrEnd || '',
                earningTrend: data.earningTrend || '',
                description: data.description || '',
                contact: data.contact || '',
                email: data.email || '',
                currency: data.currency || '',
                orderId : orderId || '',
            });
        }

        if (initialData && initialData.documents && initialData.documents.document.length > 0) {
            setDouments(true); // Assume documents is an array of file objects
        }
        if (initialData && initialData.order) {
            setOrderStatus(initialData.order.status); // Assume documents is an array of file objects
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        handleBlur(name, value); 
        setFormData(prevData => {
            const updatedData = {
                ...prevData,
                [name]: type === 'checkbox' ? checked : value
            };  
            return updatedData;
        });
    };
  
    const validateForm = () => {
        const newErrors = {};
        
        Object.keys(formData).forEach(field => {
            // Check for required fields excluding 'similarCompany'
            if (field !== 'similarCompany' && field !== 'orderId' && !formData[field]) {
                newErrors[field] = 'This field is required';
            }
    
            // Handle validation for the 'contact' field separately
            if (field === 'contact') {
                if (!formData.contact.dialCode) {
                    newErrors.contact = 'Dial code is required';
                } else if (!formData.contact.phoneNumber) {
                    newErrors.contact = 'Phone number is required';
                }
                }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
       
    };

    const nextButton = async() => {
        onSave();
    }
    
    const handleSave = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true); // Start loading

            const token = localStorage.getItem('token');
            const url = orderId ? apiURL + '/order/update' : apiURL + '/order/store';
            const formDatas = orderId ? {orderId: orderId, businessdata: formData } : formData;
            const method = orderId ? 'PUT' : 'POST'; 
            try {
                const response = await axios({
                    method, 
                    url,
                    data: formDatas, 
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status) {
                    if (!orderId) { 
                        const newOrderId = response.data.data.order._id;
                        navigate({
                            pathname: `/valuation-form/${newOrderId}`,
                            search: `?step=1`,
                        });
                    }else{
                        onSave();
                    } 
                }
            } catch (error) {
                console.error('Error saving form:', error);
            } finally {
                setIsLoading(false); // Stop loading
            }
            //   onSave();
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'All Fields are required.',
            });
        }
    };

    const handleCancel = async() => {
        navigate('/orders');
    }
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(apiURL + '/front/formdata', {
                    headers: {
                      Authorization: `${token}`,
                      'Content-Type': 'application/json',
                    },
                  });
                
                if(response.status){  
                    if (response.data.data.planData.ActiveplanAvailable === false && response.data.data.planData.noPlan === false && !orderId){
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'You do not have any active plan. Please purchase a plan first.',
                          }).then(() => {
                            navigate('/pricing'); // Redirect to home or another page
                          });
                    }else if(response.data.data.planData.ActiveplanAvailable === false && response.data.data.planData.noPlan === true && !orderId){
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'You do not have any active plan. Please purchase a plan first.',
                          }).then(() => {
                            navigate('/orders'); // Redirect to home or another page
                          });
                    }
                    else if(response.data.data.planData.ActiveplanAvailable === true || orderId){
                        setCountries(response.data.data.countries);
                        sethistoricalTrends(response.data.data.historicaltrends);
                        setbusinessYears(response.data.data.businessdata);
                        setCurrency(response.data.data.currency);
                        setAvailableSubIndustries(response.data.data.subIndustries);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleBlur = (fieldName, value) => {
        onFieldBlur(fieldName, value);
    };

    return (
            <div className="card m-0 border-radius-0px border-0 box-shadow h-100" style={{backgroundColor: "#f2f3f6"}}>
            {isLoading ? 
                <Loader /> : 
                    <>
                    <div className="card-header fw-500 p-15px lh-normal bg-white">
                    <p className="text-blue fw-600 mb-0 fs-16 lh-1 mt-5px mb-5px d-inline-block">New Order: <span className="text-dark-blue">Business Details</span></p>
                        <div className="divider-style-03 divider-style-03-02 border-color-light-gray mb-10px mt-10px w-100"></div>
                        <span className="fw-400 fs-14">Please provide your business details</span>
                        <span className="fw-400 text-danger fs-12 float-end mt-5px">(All fields are mandatory)</span>
                    </div>
                    <div className="card-body p-0" style={{
                            maxHeight: '620px',
                            overflowY: 'auto', 
                            overflowX: 'hidden', 
                            padding: '20px', 
                            scrollbarWidth: 'thin', 
                        }}
                        data-scroll-options='{ "theme": "dark" }'>
                        <form action="" method="post" className="row myform p-0 border-radius-0px myform-02 justify-content-center">
                            <div className="col-11 mt-15px mb-10px">
                                <div className="row">
                                    <div className="w-40px pe-0">
                                        <img src={companyLogo} alt="Company Name"/>
                                    </div>
                                    <div className="col">
                                        <label className="text-black mt-10px mb-10px fw-500 fs-14 d-block lh-normal">Company Name</label>
                                        <input 
                                            className={`border-radius-0px box-shadow form-control financial-info-input ${errors.companyName ? 'is-invalid' : ''}`} 
                                            type="text" 
                                            name="companyName" 
                                            placeholder="Name of the company" 
                                            value={formData.companyName}
                                            onChange={handleChange} 
                                            readOnly={orderStatus === "Completed"}
                                        />
                                        {errors.companyName && <div className="invalid-feedback">{errors.companyName}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="col-11 mt-15px mb-10px">
                                <div className="row">
                                    <div className="w-40px pe-0">
                                        <img src={companyType} alt="Company Type" />
                                    </div>
                                    <div className="col">
                                        <label className="text-black mt-10px mb-10px fw-500 fs-14 d-block lh-normal">Company Type</label>
                                        <div className="form-check float-start ps-30px">
                                            <input 
                                                className="form-check-input p-0 mt-0 text-black" 
                                                type="radio" 
                                                name="companyType" 
                                                id="inlineRadio1" 
                                                value="Public"
                                                checked={formData.companyType === 'Public'}
                                                onChange={handleChange}
                                                disabled={orderStatus === "Completed"}
                                            />
                                            <label className="text-dark-gray mb-1 fw-400 fs-14 d-block lh-1" htmlFor="inlineRadio1">Public</label>
                                        </div>
                                        <div className="form-check float-start ps-30px">
                                            <input 
                                                className="form-check-input p-0 mt-0 text-black" 
                                                type="radio" 
                                                name="companyType" 
                                                id="inlineRadio2" 
                                                value="Private"
                                                checked={formData.companyType === 'Private'}
                                                onChange={handleChange}
                                                onBlur={() => handleBlur('companyType', 'Private')}
                                                disabled={orderStatus === "Completed"}
                                            />
                                            <label className="text-dark-gray mb-1 fw-400 fs-14 d-block lh-1" htmlFor="inlineRadio2">Private</label>
                                        </div>
                                    </div>
                                    {errors.companyType && <div className="text-danger">{errors.companyType}</div>}
                                </div>
                            </div>
                            <div className="col-11 mt-15px mb-10px">
                                <div className="row">
                                    <div className="w-40px pe-0">
                                        <img src={industryTypeImage} alt="Industry" />
                                    </div>
                                    <div className="col">
                                        <label className="text-black mt-10px mb-10px fw-500 fs-14 d-block lh-normal">Industry Type</label>
                                            <CustomDropdown
                                                data={availableSubIndustries}
                                                value={formData.industryType} 
                                                onChange={handleChange}
                                                error={errors.industryType}
                                                name="industryType"
                                                disabled={orderStatus === "Completed"}
                                                />
                                    </div>
                                </div>
                            </div>
                            <div className="col-11 mt-15px mb-10px">
                                <div className="row">
                                    <div className="w-40px pe-0">
                                        <img src={companyLogo} alt="Company Name"/>
                                    </div>
                                    <div className="col">
                                        <label className="text-black mt-10px mb-10px fw-500 fs-14 d-block lh-normal">Similar Public Company</label>
                                        <input 
                                            className={`border-radius-0px box-shadow form-control financial-info-input`} 
                                            type="text" 
                                            name="similarCompany" 
                                            placeholder="Similar Public Company" 
                                            value={formData.similarCompany}
                                            onChange={handleChange} 
                                            readOnly={orderStatus === "Completed"}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-11 mt-15px mb-10px">
                                <div className="row">
                                    <div className="w-40px pe-0">
                                        <img src={businessYearImage} alt="Business Years" />
                                    </div>
                                    <div className="col">
                                        <label className="text-black mt-10px mb-10px fw-500 fs-14 d-block lh-normal">Years in Business <span className="fs-12 text-light-gray fw-400">(Select one)</span></label>
                                        {businessYears.map(businessYear => (
                                        <div className="form-check float-start ps-30px" key={businessYear._id}>
                                            <input 
                                                className="form-check-input p-0 mt-0 text-black" 
                                                type="radio" 
                                                name="companyAge"
                                                id="inlineRadio3" 
                                                value={businessYear.display_value}
                                                checked={formData.companyAge === businessYear.display_value}
                                                onChange={handleChange}
                                                disabled={orderStatus === "Completed"}
                                            />
                                            <label className="text-dark-gray mb-1 fw-400 fs-14 d-block lh-1" htmlFor="inlineRadio3">{businessYear.display_value}</label>
                                        </div>
                                        ))}
                                    </div>
                                    {errors.companyAge && <div className="text-danger">{errors.companyAge}</div>}
                                </div>
                            </div>
                            <div className="col-11 mt-15px mb-10px">
                                <div className="row">
                                    <div className="w-40px pe-0">
                                        <img src={countryImage} alt="Country" />
                                    </div>
                                    <div className="col">
                                        <label className="text-black mt-10px mb-10px fw-500 fs-14 d-block lh-normal">Country</label>
                                        <div className="select">
                                            <select 
                                                className={`border-radius-0px box-shadow form-control ${errors.country ? 'is-invalid' : ''}  ${!formData.country ? 'empty-selected' : ''}`} 
                                                name="country" 
                                                aria-label="select-country"
                                                value={formData.country}
                                                onChange={handleChange}
                                                disabled={orderStatus === "Completed"}
                                            >
                                                <option value="" disabled>Select your country</option>
                                                {countries.map(country => (
                                                    <option key={country.code} value={country.name}>{country.name}</option>
                                                ))}
                                            </select>
                                            {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-11 mt-15px mb-10px">
                                <div className="row">
                                    <div className="w-40px pe-0">
                                        <img src={financialYearImage} alt="Financial Year" />
                                    </div>
                                    <div className="col">
                                    <label className="text-black mt-10px mb-10px fw-500 fs-14 d-block lh-normal">When did your last financial year end?</label>
                                        <div className="row">
                                            <div className="col-lg-4 col-10">
                                                <div className="select w-90">
                                                    <select className={`border-radius-0px box-shadow form-control ${errors.FinYrEndDate ? 'is-invalid' : ''} ${!formData.FinYrEndDate ? 'empty-selected' : ''}`} name="FinYrEndDate" aria-label="select-industry" value={formData.FinYrEndDate} onChange={handleChange} disabled={orderStatus === "Completed"}>
                                                        <option value="" disabled>Date</option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                        <option value="6">6</option>
                                                        <option value="7">7</option>
                                                        <option value="8">8</option>
                                                        <option value="9">9</option>
                                                        <option value="10">10</option>
                                                        <option value="11">11</option>
                                                        <option value="12">12</option>
                                                        <option value="13">13</option>
                                                        <option value="14">14</option>
                                                        <option value="15">15</option>
                                                        <option value="16">16</option>
                                                        <option value="17">17</option>
                                                        <option value="18">18</option>
                                                        <option value="19">19</option>
                                                        <option value="20">20</option>
                                                        <option value="21">21</option>
                                                        <option value="22">22</option>
                                                        <option value="23">23</option>
                                                        <option value="24">24</option>
                                                        <option value="25">25</option>
                                                        <option value="26">26</option>
                                                        <option value="27">27</option>
                                                        <option value="28">28</option>
                                                        <option value="29">29</option>
                                                        <option value="30">30</option>
                                                        <option value="31">31</option>
                                                    </select>
                                                </div>
                                                {errors.FinYrEndDate && <div className="invalid-feedback">{errors.FinYrEndDate}</div>}
                                            </div>
                                            <div className="col-lg-4 col-10">
                                                <div className="select w-90">
                                                    <select className={`border-radius-0px box-shadow form-control ${errors.FinYrEndMonth ? 'is-invalid' : ''}  ${!formData.FinYrEndMonth ? 'empty-selected' : ''}`} name="FinYrEndMonth" aria-label="select-industry" value={formData.FinYrEndMonth} onChange={handleChange} disabled={orderStatus === "Completed"}>
                                                        <option value="" disabled>Month</option>
                                                        <option value="1">January</option>
                                                        <option value="2">February</option>
                                                        <option value="3">March</option>
                                                        <option value="4">April</option>
                                                        <option value="5">May</option>
                                                        <option value="6">June</option>
                                                        <option value="7">July</option>
                                                        <option value="8">August</option>
                                                        <option value="9">September</option>
                                                        <option value="10">October</option>
                                                        <option value="11">November</option>
                                                        <option value="12">December</option>
                                                    </select>
                                                </div>
                                                {errors.FinYrEndMonth && <div className="invalid-feedback">{errors.FinYrEndMonth}</div>}
                                            </div>
                                            <div className="col-lg-4 col-10">
                                                <div className="select w-90">
                                                    <select className={`border-radius-0px box-shadow form-control ${errors.FinYrEnd ? 'is-invalid' : ''}  ${!formData.FinYrEnd ? 'empty-selected' : ''}`} name="FinYrEnd" aria-label="select-industry" value={formData.FinYrEnd} onChange={handleChange} disabled={orderStatus === "Completed"}>
                                                        <option value="" disabled>Year</option>
                                                        {years.map(item => (
                                                            <option key={item} value={item}>{item}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {errors.FinYrEndMonth && <div className="invalid-feedback">{errors.FinYrEnd}</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-11 mt-15px mb-10px">
                                <div className="row">
                                    <div className="w-40px pe-0">
                                        <img src={historicalYearImage} alt="Historical Earnings Trend" />
                                    </div>
                                    <div className="col">
                                        <label className="text-black mt-10px mb-10px fw-500 fs-14 d-block lh-normal">
                                            Historical Earning Trend <span className="fs-12 text-light-gray fw-400">(Select one)</span>
                                        </label>
                                        {historicalTrends.map((historicalTrend, index) => (
                                            <div className="form-check mb-15px ps-30px" key={historicalTrend._id}>
                                                <input
                                                    className="form-check-input p-0 mt-0 text-black"
                                                    type="radio"
                                                    name="earningTrend"
                                                    id={`earningTrend-${index}`}
                                                    value={historicalTrend.value}
                                                    checked={formData.earningTrend === historicalTrend.value}
                                                    onChange={(e) => setFormData({ ...formData, earningTrend: e.target.value })}
                                                    disabled={orderStatus === "Completed"}
                                                />
                                                <label
                                                    className="text-black mb-1 fw-400 fs-14 d-block lh-1"
                                                    htmlFor={`earningTrend-${index}`}
                                                >
                                                    {historicalTrend.value}
                                                </label>
                                            </div>
                                        ))}
                                        {errors.earningTrend && (
                                            <div className="text-danger">{errors.earningTrend}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-11 mt-15px mb-10px">
                                <div className="row">
                                    <div className="w-40px pe-0">
                                        <img src={descriptionImage} alt="Description" />
                                    </div>
                                    <div className="col">
                                        <label className="text-black mt-10px mb-10px fw-500 fs-14 d-block lh-normal">Description</label>
                                        <textarea 
                                            className={`border-radius-0px box-shadow form-control financial-info-input ${errors.description ? 'is-invalid' : ''}`} 
                                            name="description" 
                                            placeholder="Description of the business" 
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="4"
                                            disabled={orderStatus === "Completed"}
                                        />
                                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="col-11 mt-15px mb-10px">
                                <div className="row">
                                    <div className="w-40px pe-0">
                                        <img src={contactImage} alt="Contact Number" />
                                    </div>
                                    <div className="col">
                                        <label className="text-black mt-5px mb-10px fw-500 fs-14 d-block lh-normal">Contact Number<span className="fs-12 d-block text-light-gray fw-400">(Please enter your country code before the number)</span></label>
                                        {/* <input 
                                            className={`border-radius-0px box-shadow form-control ${errors.contact ? 'is-invalid' : ''}`} 
                                            type="text" 
                                            name="contact" 
                                            placeholder="Contact Number" 
                                            value={formData.contact}
                                            onChange={handleChange} 
                                        /> */}
                                        <PhoneInputs 
                                                value={formData.contact} 
                                                onChange={handleChange}
                                                error={errors.contact} 
                                                name="contact"
                                                disabled={orderStatus === "Completed"}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-11 mt-15px mb-10px">
                                <div className="row">
                                    <div className="w-40px pe-0">
                                        <img src={emailImage} alt="Email Address" />
                                    </div>
                                    <div className="col">
                                        <label className="text-black mt-10px mb-10px fw-500 fs-14 d-block lh-normal">Email Address</label>
                                        <input 
                                            className={`border-radius-0px box-shadow form-control financial-info-input ${errors.email ? 'is-invalid' : ''}`} 
                                            type="email" 
                                            name="email" 
                                            placeholder="Email Address" 
                                            value={formData.email}
                                            onChange={handleChange} 
                                            readOnly={orderStatus === "Completed"}
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="col-11 mt-15px mb-10px">
                                <div className="row">
                                    <div className="w-40px pe-0">
                                        <img src={currencyImage} alt="Currency Used" />
                                    </div>
                                    <div className="col">
                                        <label className="text-black mt-10px mb-10px fw-500 fs-14 d-block lh-normal">Currency Used</label>
                                        <div className="select">
                                            <select 
                                                className={`border-radius-0px box-shadow form-control ${errors.currency ? 'is-invalid' : ''} ${!formData.currency ? 'empty-selected' : ''}`} 
                                                name="currency" 
                                                aria-label="select-currency"
                                                value={formData.currency}
                                                onChange={handleChange}
                                                disabled={orderStatus === "Completed"}
                                            >
                                                <option value="" disabled>Select your Currency</option>
                                                {currency.map(item => (
                                                    <option key={item._id} value={item.code}>{item.code}</option>
                                                ))}
                                            </select>
                                            {errors.currency && <div className="invalid-feedback">{errors.currency}</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 mt-15px mb-15px text-center">
                            {!editAllowed ? (
                                <button
                                className="border-radius-0px btn btn-round-edge bg-blue submit h-40px p-0 ps-15px pe-15px fs-12 m-0 text-white fs-12 fw-600 text-capitalize fin-btn"
                                type="button"
                                onClick={nextButton}
                                >
                                    <span>
                                        <span><i className="feather icon-feather-arrow-right-circle m-0"></i></span>
                                        <span className="btn-double-text"> Next</span>
                                    </span>
                                </button>
                            ):(
                                isLoading ? (
                                    <span>
                                        <span><i className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></i></span>
                                        <span className="btn-double-text ms-3px" data-text="Submitting...">Submitting...</span>
                                    </span>
                                ) : (
                                  <>    
                                    <button className="border-radius-0px btn btn-round-edge bg-blue submit h-40px p-0 ps-15px pe-15px fs-12 m-0 text-white fs-12 fw-600 text-capitalize fin-btn" type="button" onClick={handleSave}>
                                    <span>
                                        <span><i className="feather icon-feather-save m-0"></i></span>
                                        {orderStatus === "Completed" ? 
                                            <span className="btn-double-text"> Go To Financial Info</span> 
                                            :
                                            <span className="btn-double-text"> Save:Go To Financial Info</span> 
                                        }
                                    </span>
                                </button>
                                &nbsp;
                                    <button className="border-radius-0px btn btn-round-edge bg-blue submit h-40px p-0 ps-15px pe-15px fs-12 m-0 text-white fs-12 fw-600 text-capitalize fin-btn" type="button" onClick={handleCancel}>
                                    <span>
                                        <span><i className="feather icon-feather-arrow-left-circle m-0 fs-16 align-text-bottom"></i></span>
                                         Cancel
                                    </span>
                                </button>
                                </>
                                
                            ))}
                            </div>
                        </form>    
                    </div>
                    </>
                }
            </div>
    )};

export default Company;
