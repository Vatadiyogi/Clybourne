import React from 'react';
import FormField from './FormField';

const FormRadioGroup = ({ label, name, value, options, onChange, onBlur, error }) => (
  <FormField
    label={label}
    type="radio"
    name={name}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    error={error}
    options={options}
  />
);

export default FormRadioGroup;
