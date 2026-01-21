import React from 'react';

const UserForm = ({ admin, errors, handleChange, handleSubmit, id, loading }) => {
    return (
        <form onSubmit={handleSubmit}>
            <div className="row mb-3">
                <label htmlFor="name" className="col-sm-3 col-form-label">Name*:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        value={admin.name}
                        onChange={handleChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="email" className="col-sm-3 col-form-label">Email*:</label>
                <div className="col-sm-9">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={admin.email}
                        onChange={handleChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="password" className="col-sm-3 col-form-label">Password*:</label>
                <div className="col-sm-9">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        value={admin.password}
                        onChange={handleChange}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="role" className="col-sm-3 col-form-label">Role*:</label>
                <div className="col-sm-9">
                    <select
                        name="role"
                        id="role"
                        value={admin.role}
                        onChange={handleChange}
                        className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                    >
                        <option value="">Select Role</option>
                        <option value="SuperAdmin">Super Admin</option>
                        <option value="ReportAdmin">Report Admin</option>
                    </select>
                    {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-sm-2">
                    <button type="submit" className="btn btn-primary w-100">
                        {id ? 'Update Admin User' : 'Add Admin User'}
                    </button>
                </div>
            </div>
            {loading && <p>Loading...</p>}
        </form>
    );
};

export default UserForm;
