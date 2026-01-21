import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// import './PhoneInputStyles.css'; // Custom CSS for better design

const ProfilePhone = ({ value, onChange, error, name,disabled }) => {
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
  
  };
  

  return (
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
  );
};

export default ProfilePhone;
