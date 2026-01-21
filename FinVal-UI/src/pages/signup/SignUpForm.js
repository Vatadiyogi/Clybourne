import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiURL } from "../../config/Config";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";  // Import reCAPTCHA

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    new_password: '',
    first_name: '',
    last_name: '',
    company: '',
    jobTitle: '',
    // industry: '',
    country: ''
  });

  const [recaptchaToken, setRecaptchaToken] = useState("");  // State for reCAPTCHA
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  // const [backendSuccess, setBackendSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);

  const errorRef = useRef(null);
  const recaptchaRef = useRef(null);  // Create a ref for reCAPTCHA
  // const successRef = useRef(null);
  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      new_password: '',
      first_name: '',
      last_name: '',
      company: '',
      jobTitle: '',
      // industry: '',
      country: ''
    });
    setRecaptchaToken(''); // Clear reCAPTCHA token
    if (recaptchaRef.current) {
      recaptchaRef.current.reset(); // Reset the reCAPTCHA
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formData.email) {
      formErrors.email = 'Email is required';
    }
    if (!formData.password) {
      formErrors.password = 'Password is required';
    }
    if (!formData.password || formData.password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters long';
    }
    if (formData.password !== formData.new_password) {
      formErrors.new_password = 'Passwords do not match';
    }
    if (!formData.first_name) {
      formErrors.first_name = 'First Name is required';
    }
    if (!formData.last_name) {
      formErrors.last_name = 'Last Name is required';
    }
    if (!formData.company) {
      formErrors.company = 'Company is required';
    }
    if (!formData.jobTitle) {
      formErrors.jobTitle = 'Job Title is required';
    }
    // if (!formData.industry) {
    //   formErrors.industry = 'Industry is required';
    // }
    if (!formData.country) {
      formErrors.country = 'Country is required';
    }

    if (!recaptchaToken) formErrors.recaptcha = 'Please complete the reCAPTCHA';

    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      try {
        setBackendError('');
        // setBackendSuccess('');
        const response = await axios.post(apiURL + '/front/customer/signup', formData);
        if (response.status === 200) {
          resetForm();
          // setBackendSuccess(response.data.message);
          const userEmail = response.data.data.customer.email; // Example email
          const maskedEmail = await maskEmail(userEmail);

          Swal.fire({
            icon: 'success',
            title: 'Sign Up for Fin-Advisor Evaluation',
            html: `<p>Thank you for submitting your details</p>
            <p>To complete your registration process, please click on the verification link sent to your email address <strong>${maskedEmail}</strong></p>`,
          })
          setErrors(formErrors);
        }else{
          setBackendError(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          setBackendError(error.response.message || 'Email ID already exists.');
        } else {
          setBackendError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  // Function to mask the email (first 3 and last letter visible)
const maskEmail = async (email) => {
  const emailParts = email.split('@');
  const localPart = emailParts[0];
  const domainPart = emailParts[1];
  
  // Mask local part (first 3 letters and last letter shown)
  const maskedLocal = localPart.slice(0, 3) + '****' + localPart.slice(-1);

  return `${maskedLocal}@${domainPart}`;
}

  // Use useEffect to scroll to the error or success message
  useEffect(() => {
    if (backendError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth' });
    } 
    // else if (backendSuccess && successRef.current) {
    //   successRef.current.scrollIntoView({ behavior: 'smooth' });
    // }

    // Fetch plan data from API
    const fetchCountries = async () => {
      try {
          const response = await axios.get(apiURL + '/front/countries');
          const data = response.data;
          if (data.status) {
             setCountries(data.data.countries); 
          }
      } catch (err) {
          console.error("Error fetching plan data:", err);
          // Handle error appropriately here
      }
  };

  fetchCountries();

  }, [backendError]);

   // Function to handle reCAPTCHA
  const onRecaptchaChange = (token) => {
    setRecaptchaToken(token);  // Set the token when reCAPTCHA is completed
  };

  return (
    <>        
        <form onSubmit={handleSubmit} className="row contact-form-style-02 bg-very-light-gray border-radius-10px p-10 pt-2">
            <div className="col-md-12 text-center">
                <h6 className="alt-font text-dark-gray fw-600 ls-minus-1px">Sign Up for Fin-Advisor Evaluation</h6>
            </div>
            {backendError && (
              <div ref={errorRef} className="col-md-12 text-center text-danger">
                {backendError}
              </div>
            )}
            {/* {backendSuccess && (
              <div ref={successRef} className="col-md-12 text-center text-success">
                {backendSuccess}
              </div>
            )} */}
            <div className="col-md-12 mb-30px">
                <input
                  className="border-radius-4px border-color-white box-shadow form-control"
                  type="email"
                  name="email"
                  placeholder="Email*"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="text-danger">{errors.email}</span>}
            </div>
            <div className="col-md-6 mb-30px">
                <input
                  className="input-name border-radius-4px border-color-white box-shadow-double-large form-control"
                  type="password"
                  name="password"
                  placeholder="Password*"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <span className="text-danger">{errors.password}</span>}
            </div>
            <div className="col-md-6 mb-30px">
                <input
                  className="input-name border-radius-4px border-color-white box-shadow-double-large form-control"
                  type="password"
                  name="new_password"
                  placeholder="Re-type Password*"
                  value={formData.new_password}
                  onChange={handleChange}
                />
                {errors.new_password && <span className="text-danger">{errors.new_password}</span>}
            </div>

            <div className="col-md-12 text-center">
                <p className="mb-0 fs-14 lh-26 text-center md-w-100">A verification link will be sent on your email</p>
                <hr/>
                <h6 className="alt-font text-dark-gray fw-600 ls-minus-1px">Please provide your profile details</h6>
            </div>
            
            <div className="col-md-6 mb-30px">
                <input
                  className="input-name border-radius-4px border-color-white box-shadow-double-large form-control"
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
                {errors.first_name && <span className="text-danger">{errors.first_name}</span>}
            </div>
            <div className="col-md-6 mb-30px">
                <input
                  className="input-name border-radius-4px border-color-white box-shadow-double-large form-control"
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
                {errors.last_name && <span className="text-danger">{errors.last_name}</span>}
            </div>
            <div className="col-md-12 mb-30px">
                <input
                  className="input-name border-radius-4px border-color-white box-shadow-double-large form-control "
                  type="text"
                  name="company"
                  placeholder="Company"
                  value={formData.company}
                  onChange={handleChange}
                />
                {errors.company && <span className="text-danger">{errors.company}</span>}
            </div>
            <div className="col-md-12 mb-30px">
                <input
                  className="input-name border-radius-4px border-color-white box-shadow-double-large form-control "
                  type="text"
                  name="jobTitle"
                  placeholder="Job Title"
                  value={formData.jobTitle}
                  onChange={handleChange}
                />
                {errors.jobTitle && <span className="text-danger">{errors.jobTitle}</span>}
            </div>
            {/* <div className="col-md-6 mb-30px">
                <div className="select">
                    <select
                      className="form-control border-radius-4px border-color-white box-shadow-double-large"
                      name="industry"
                      aria-label="select-industry"
                      value={formData.industry}
                      onChange={handleChange}
                    >
                        <option value="">Select Industry</option>
                        <option value="Industry1">Industry1</option>
                        <option value="Industry2">Industry2</option>
                        <option value="Industry3">Industry3</option>
                        <option value="Industry4">Industry4</option>
                    </select>
                    {errors.industry && <span className="text-danger">{errors.industry}</span>}
                </div>
            </div> */}
            <div className="col-md-12 mb-30px">
                <div className="select">
                    <select
                      className="form-control border-radius-4px border-color-white box-shadow-double-large"
                      name="country"
                      aria-label="select-country"
                      value={formData.country}
                      onChange={handleChange}
                    >
                        <option value="">Select Country</option>
                        {countries.map(country => (
                            <option key={country.code} value={country.name}>{country.name}</option>
                        ))}
                    </select>
                    {errors.country && <span className="text-danger">{errors.country}</span>}
                </div>
            </div>

            <div className="col-md-12 mb-30px">
            <ReCAPTCHA
              sitekey="6Le5iGcqAAAAAP_BvzirVJGT1TFzdb1g0clH078r"  // Replace with your actual site key
              onChange={onRecaptchaChange}
              ref={recaptchaRef}
            />
            {errors.recaptcha && <span className="text-danger">{errors.recaptcha}</span>}
          </div>

            <div className="col-md-12 text-center sm-mt-20px">
                <button 
                    className="btn btn-large btn-round-edge bg-blue submit text-white w-100 fin-btn" 
                    type="submit" 
                    disabled={loading} // Disable the button when loading is true
                >
                    {loading ? (
                        <span>
                            <span><i className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></i></span>
                            <span className="btn-double-text ms-3px" data-text="Signing In...">Signing Up...</span>
                        </span>
                    ) : (
                        <span>
                            <span><i className="bi bi-person-circle align-middle"></i></span>
                            <span className="btn-double-text align-middle" data-text="Sign Up Now">Sign Up Now</span> 
                        </span>
                    )}
                </button>
                <span className="fs-14 lh-22 d-block mt-15px">Already have an account? 
                    <Link to="/user-login" className="text-dark-gray text-decoration-line-bottom fw-500">Sign In</Link>
                </span>
            </div>

        </form>
    </>
  );
};

export default SignUpForm;
