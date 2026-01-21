import React from 'react';

const FormField = ({ label, type, name, value, placeholder, onChange, onBlur, error, options }) => {
  const renderInput = () => {
    switch (type) {
      case 'text':
      case 'email':
        return (
          <input
            className={`border-radius-0px box-shadow form-control ${error ? 'is-invalid' : ''}`}
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
        );
      case 'textarea':
        return (
          <textarea
            className={`border-radius-0px box-shadow form-control ${error ? 'is-invalid' : ''}`}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            rows="4"
          />
        );
      case 'select':
        return (
          <select
            className={`border-radius-0px box-shadow form-control ${error ? 'is-invalid' : ''}`}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          >
            <option value="">Select an option</option>
            {options && options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        );
      case 'radio':
        return options && options.map(option => (
          <div className="form-check float-start ps-30px" key={option.value}>
            <input
              className="form-check-input p-0 mt-0 text-black"
              type="radio"
              name={name}
              id={option._id}
              value={option.display_value}
              checked={value === option.display_value}
              onChange={onChange}
              onBlur={onBlur}
            />
            <label className="text-dark-gray mb-1 fw-400 fs-14 d-block lh-1" htmlFor={option._id}>
              {option.display_value}
            </label>
          </div>
        ));
      default:
        return null;
    }
  };

  return (
       <>
       <label className="text-black mt-10px mb-10px fw-500 fs-14 d-block lh-normal">{label}</label>
          {renderInput()}
          {error && <div className="invalid-feedback">{error}</div>}
      </>
  );
};

export default FormField;
