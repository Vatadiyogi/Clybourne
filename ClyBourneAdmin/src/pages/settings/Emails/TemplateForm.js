import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const TemplateForm = ({ template, errors, handleChange, handleSubmit, id, loading }) => {
    return (
        <form onSubmit={handleSubmit}>
            { id &&
            <div className="row mb-3">
                <label htmlFor="inputDays3" className="col-sm-3 col-form-label">Template ID:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="templateId"
                        name="templateId"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        value={template.templateId}
                        readOnly={true}
                    />
                    {errors.templateId && <div className="invalid-feedback">{errors.templateId}</div>}
                </div>
            </div>
            }
            <div className="row mb-3">
                <label htmlFor="inputReport3" className="col-sm-3 col-form-label">Template Name*:</label>
                <div className="col-sm-9">
                <input
                        type="text"
                        id="title"
                        name="title"
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        value={template.title}
                        onChange={handleChange}
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="inputReport3" className="col-sm-3 col-form-label">Template Subject*:</label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                        value={template.subject}
                        onChange={handleChange}
                    />
                    {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="inputReport3" className="col-sm-3 col-form-label">Description*:</label>
                <div className="col-sm-9">
                    <CKEditor
                        editor={ClassicEditor}
                        data={template.description}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            handleChange({ target: { name: 'description', value: data } }, editor);
                        }}
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        style={{ height: '500px' }} // Adjust height as needed
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-sm-3">
                    <button type="submit" className="btn btn-primary w-100">
                        {id ? 'Update Email Template' : 'Add Email Template'}
                    </button>
                </div>
            </div>
            {loading && <p>Loading...</p>}
        </form>
    );
};

export default TemplateForm;
