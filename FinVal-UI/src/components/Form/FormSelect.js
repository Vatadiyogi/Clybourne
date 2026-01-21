import React from 'react';
import FormField from './FormField';

const FormSelect = ({ label, name, value, options, onChange, onBlur, error }) => (
  <FormField
    label={label}
    type="select"
    name={name}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    error={error}
    options={options}
  />
);

export default FormSelect;
