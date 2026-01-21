import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './PhoneInputStyles.css'; // Custom CSS for better design

const PhoneInputs = ({ value, onChange, error, name,disabled }) => {
  const [phone, setPhone] = useState('');
  const [errors, setError] = useState('');

  // Set initial value based on the incoming props
  useEffect(() => {
    if (value && value.fullNumber) {
      setPhone(value.fullNumber);
    }
  }, [value]);

  const handleChange = (value, country, e, formattedValue) => {
    const newDialCode = `${country.dialCode}`;
    // Extract the phone number by removing the dial code
    const newPhoneNumber = value.startsWith(country.dialCode) ? 
      value.substring(country.dialCode.length).trim() : value.trim();
    
    const fullNumber = `+${value}`;
    // Update phone number state
    setPhone(value);
  
    // Trigger onChange to update parent component
    onChange({
      target: {
        name: name,
        value: {
          dialCode: newDialCode,
          phoneNumber: newPhoneNumber,
          fullNumber: fullNumber,
        }
      }
    });
  
    // Simple validation: Check if the phone number is long enough
    // if (newPhoneNumber.replace(/[^0-9]/g, '').length < 10) {
    //   setError('Phone number is too short');
    // } else {
    //   setError('');
    // }
  };
  

  return (
    <div className="phone-input-container">
      <PhoneInput
        country={'us'} // Default country
        value={phone}
        onChange={handleChange}
        placeholder="Enter phone number"
        enableSearch={true} // Enable the search bar in the country dropdown
        countryCodeEditable={false} // Disable dial code editing
        inputClass={`custom-phone-input ${errors ? 'is-invalid' : ''}`} // Apply custom class
        buttonClass="custom-flag-button" // Custom class for the flag dropdown
        dropdownClass="custom-dropdown" // Custom class for the dropdown
        disabled={disabled}
      />
      {errors && <div className="error-message">{errors}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PhoneInputs;
