import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const PlanForm = ({ plan, errors, handleChange, handleBlur, handleSubmit, id, loading }) => {
    return (
        <form onSubmit={handleSubmit}>
            <div className="row mb-3">
                <label htmlFor="inputDays3" className="col-sm-3 col-form-label">Plan Name*:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        value={plan.name}
                        onChange={handleChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="inputReport3" className="col-sm-3 col-form-label">Plan Type*:</label>
                <div className="col-sm-9">
                    <select
                        name="planType"
                        id="planType"
                        value={plan.planType}
                        onChange={handleChange}
                        className={`form-select ${errors.planType ? 'is-invalid' : ''}`}
                    >
                        <option value="">Select Plan Type</option>
                        <option value="BO">Business Owner</option>
                        <option value="BOP">Business Owner Plus</option>
                        <option value="A">Advisor</option>
                    </select>
                    {errors.planType && <div className="invalid-feedback">{errors.planType}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="inputReport3" className="col-sm-3 col-form-label">Price (USD)*:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="price"
                        name="price"
                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                        value={plan.price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="inputReport3" className="col-sm-3 col-form-label">Number of Reports*:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="reports"
                        name="reports"
                        className={`form-control ${errors.reports ? 'is-invalid' : ''}`}
                        value={plan.reports}
                        onChange={handleChange}
                    />
                    {errors.reports && <div className="invalid-feedback">{errors.reports}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="inputReport3" className="col-sm-3 col-form-label">Access Days*:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="accessDays"
                        name="accessDays"
                        className={`form-control ${errors.accessDays ? 'is-invalid' : ''}`}
                        value={plan.accessDays}
                        onChange={handleChange}
                    />
                    {errors.accessDays && <div className="invalid-feedback">{errors.accessDays}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="inputReport3" className="col-sm-3 col-form-label">Pricing Description*:</label>
                <div className="col-sm-9">
                    <CKEditor
                        editor={ClassicEditor}
                        data={plan.description}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            handleChange({ target: { name: 'description', value: data } }, editor);
                        }}
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        style={{ minHeight: '200px' }} // Adjust height as needed
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="inputReport3" className="col-sm-3 col-form-label">User-Portal Description*:</label>
                <div className="col-sm-9">
                    <CKEditor
                        editor={ClassicEditor}
                        data={plan.userplandescription}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            handleChange({ target: { name: 'userplandescription', value: data } }, editor);
                        }}
                        className={`form-control ${errors.userplandescription ? 'is-invalid' : ''}`}
                        style={{ minHeight: '200px' }} // Adjust height as needed
                    />
                    {errors.userplandescription && <div className="invalid-feedback">{errors.userplandescription}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="inputReport3" className="col-sm-3 col-form-label">Display Sequence*:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="displaySequence"
                        name="displaySequence"
                        className={`form-control ${errors.displaySequence ? 'is-invalid' : ''}`}
                        value={plan.displaySequence}
                        onChange={handleChange}
                    />
                    {errors.displaySequence && <div className="invalid-feedback">{errors.displaySequence}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-sm-2">
                    <button type="submit" className="btn btn-primary w-100">
                        {id ? 'Update Plan' : 'Add Plan'}
                    </button>
                </div>
            </div>
            {loading && <p>Loading...</p>}
        </form>
    );
};

export default PlanForm;
