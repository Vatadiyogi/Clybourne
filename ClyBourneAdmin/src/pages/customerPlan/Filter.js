import React from 'react';
import Select from 'react-select';

const Filter = ({ data, selectedCustomer, setSelectedCustomer, handleFilterSubmit, setCustomerData }) => {
    // Format the data to be compatible with react-select
    const customerOptions = Array.isArray(data)
        ? data.map(customer => ({
            value: customer._id,
            label: `${customer.first_name} ${customer.last_name} (${customer.email})`
        }))
        : [];

    // Find the selected option for controlled component behavior
    const selectedOption = customerOptions.find(option => option.value === selectedCustomer);

    return (
        <div className="filter-container">
            <form onSubmit={handleFilterSubmit}>
                <div className="row mb-2">
                    <div className="col-md-2"></div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="customerName">Customer Name</label>
                            <Select
                                name="customerName"
                                id="customerName"
                                className="form-select"
                                value={selectedOption} // Set the value to the selected option
                                onChange={(option) => setSelectedCustomer(option ? option.value : '')} // Update the selected customer on change
                                options={customerOptions} // Set options for the dropdown
                                isClearable={true} // Allows the user to clear the selection
                                placeholder="Select Customer Name"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: '10px',
                                    }),
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-md-4" style={{ marginTop : '2.3rem' }}> {/* Adjusted column width */}
                        <button type="button" className="btn btn-md btn-danger" onClick={() => {
                            setSelectedCustomer(""); // Reset the selected customer
                            setCustomerData(null); // Clear customer data
                            localStorage.removeItem('selectedCustomerPlan'); // Clear from local storage
                        }}>
                            Reset
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Filter;
