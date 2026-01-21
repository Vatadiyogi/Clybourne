import React from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import './DatePicker.css'; // Import any custom styles if needed

const DatePicker = ({ selectedDate, handleDateChange }) => {
    return (
        <Flatpickr
            className="form-control"
            value={selectedDate}
            onChange={date => handleDateChange(date[0])} // Ensure date is correctly passed
            options={{
                dateFormat: "Y-m-d", // Format date as Y-m-d for ISO format
                altFormat: "d-m-Y", // Display format in the input field
                altInput: true,
            }}
        />
    );
};


export default DatePicker;
