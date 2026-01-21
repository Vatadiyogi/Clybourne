import React from 'react';
import { formatDate} from '../../common/utils/dateUtils';

const CustomerForm = ({ customer, errors, handleChange }) => {
    console.log(customer);
    return (
        <form>
            <div className="row mb-3">
                <label htmlFor="customer_id" className="col-sm-3 col-form-label">Customer ID:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="customer_id"
                        name="customer_id"
                        className={`form-control ${errors.customer_id ? 'is-invalid' : ''}`}
                        value={customer.customerId}
                        onChange={handleChange}
                        readOnly
                    />
                    {errors.customer_id && <div className="invalid-feedback">{errors.customer_id}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="first_name" className="col-sm-3 col-form-label">First Name:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                        value={customer.first_name}
                        onChange={handleChange}
                        readOnly
                    />
                    {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="last_name" className="col-sm-3 col-form-label">Last Name:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                        value={customer.last_name}
                        onChange={handleChange}
                        readOnly
                    />
                    {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="email" className="col-sm-3 col-form-label">Email:</label>
                <div className="col-sm-9">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={customer.email}
                        onChange={handleChange}
                        readOnly
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="company" className="col-sm-3 col-form-label">Company:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="company"
                        name="company"
                        className={`form-control ${errors.company ? 'is-invalid' : ''}`}
                        value={customer.company}
                        onChange={handleChange}
                        readOnly
                    />
                    {errors.company && <div className="invalid-feedback">{errors.company}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="industry" className="col-sm-3 col-form-label">Industry:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="industry"
                        name="industry"
                        className={`form-control ${errors.industry ? 'is-invalid' : ''}`}
                        value={customer.industry}
                        onChange={handleChange}
                        readOnly
                    />
                    {errors.industry && <div className="invalid-feedback">{errors.industry}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="phone" className="col-sm-3 col-form-label">Phone:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        value={customer.phone}
                        onChange={handleChange}
                        readOnly
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="jobTitle" className="col-sm-3 col-form-label">Job Title:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="jobTitle"
                        name="jobTitle"
                        className={`form-control ${errors.jobTitle ? 'is-invalid' : ''}`}
                        value={customer.jobTitle}
                        onChange={handleChange}
                        readOnly
                    />
                    {errors.jobTitle && <div className="invalid-feedback">{errors.jobTitle}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="country" className="col-sm-3 col-form-label">Country:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="country"
                        name="country"
                        className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                        value={customer.country}
                        onChange={handleChange}
                        readOnly
                    />
                    {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="createdAt" className="col-sm-3 col-form-label">Date Created:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="createdAt"
                        name="createdAt"
                        className="form-control"
                        value={customer.createdAt ? formatDate(customer.createdAt) : ''}
                        readOnly
                    />
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="registerDate" className="col-sm-3 col-form-label">Date Registered:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="registerDate"
                        name="registerDate"
                        className="form-control"
                        value={customer.registerDate ? formatDate(customer.registerDate) : ''}
                        readOnly
                    />
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="lastOtpSent" className="col-sm-3 col-form-label">Last OTP sent:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="lastOtpSent"
                        name="lastOtpSent"
                        className="form-control"
                        value={customer.otp}
                        readOnly
                    />
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="lastOtpDateSent" className="col-sm-3 col-form-label">Date Last OTP sent:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="lastOtpDateSent"
                        name="lastOtpDateSent"
                        className="form-control"
                        value={customer.lastOtpDate ? formatDate(customer.lastOtpDate) : ''}
                        readOnly
                    />
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="lastLoginDate" className="col-sm-3 col-form-label">Last Login Date:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="lastLoginDate"
                        name="lastLoginDate"
                        className="form-control"
                        value={customer.lastLoginDate ? formatDate(customer.lastLoginDate) : ''}
                        readOnly
                    />
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="lastOrderSubmitDate" className="col-sm-3 col-form-label">Last Order Submit Date:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="lastOrderSubmitDate"
                        name="lastOrderSubmitDate"
                        className="form-control"
                        value={customer.lastOrderDate ? formatDate(customer.lastOrderDate) : ''}
                        readOnly
                    />
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="activePlanId" className="col-sm-3 col-form-label">Active Plan ID:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="activePlanId"
                        name="activePlanId"
                        className="form-control"
                        value={customer.activePlanSeqId}
                        readOnly
                    />
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="activePlanType" className="col-sm-3 col-form-label">Active Plan Type:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="activePlanType"
                        name="activePlanType"
                        className="form-control"
                        value={customer.activePlanType}
                        readOnly
                    />
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="activePlanExpiryDate" className="col-sm-3 col-form-label">Active Plan Expiry Date:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="activePlanExpiryDate"
                        name="activePlanExpiryDate"
                        className="form-control"
                        value={customer.activePlanExpiryDate ? formatDate(customer.activePlanExpiryDate) : ''}
                        readOnly
                    />
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="TotalPlanOrderedCount" className="col-sm-3 col-form-label">Total Plan Ordered Count:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="TotalPlanOrderedCount"
                        name="TotalPlanOrderedCount"
                        className="form-control"
                        value={customer.TotalPlanOrderedCount}
                        readOnly
                    />
                </div>
            </div>
        </form>
    );
};

export default CustomerForm;
