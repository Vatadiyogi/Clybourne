import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import DatePicker from "../../../components/Datepicker/Datepicker";
import axios from "axios";
import Swal from "sweetalert2";
import { apiURL } from "../../../Config";

const AddHolidayModal = ({ show, handleClose }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [description, setDescription] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDateChange = (date) => {
        setSelectedDate(date); // Ensure to handle the first element of the array (Flatpickr returns an array)
        setError(""); // Clear error on date change
    };

    const onFormChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        if (!selectedDate) {
            setError("Holiday Date is required");
            return;
        }

        // Clone selectedDate to avoid mutating the original object
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1); // Add 1 day

        // Format nextDay to ISO string (YYYY-MM-DD)
        const formattedDate = nextDay.toISOString().split('T')[0]; // Extracts YYYY-MM-DD from ISO string

        const formData = {
            date: formattedDate, // Convert to ISO string format (YYYY-MM-DDTHH:mm:ssZ)
            day: selectedDate.toLocaleDateString("en-US", { weekday: "long" }), // Get weekday name
            description: description
        };

        try {
            setLoading(true);
            const response = await axios.post(`${apiURL}api/admin/holiday/holidays`, formData);
            setLoading(false);

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Holiday added successfully!",
                }).then(() => {
                    handleClose();
                    window.location.reload(); // Reloading the page to fetch updated data
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data.message || "Failed to add holiday",
                });
            }
        } catch (error) {
            setLoading(false);
            console.error("Error adding holiday:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while adding the holiday.",
            });
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Holiday</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmitForm}>
                    <div className="row mb-4">
                        <label htmlFor="inputDate" className="col-sm-3 col-form-label">
                            Date:
                        </label>
                        <div className="col-sm-8">
                            <DatePicker selectedDate={selectedDate} handleDateChange={handleDateChange} />
                            {error && <div className="invalid-feedback" style={{ display: "block" }}>{error}</div>}
                        </div>
                    </div>
                    <div className="row mb-4">
                        <label htmlFor="inputDay" className="col-sm-3 col-form-label">
                            Day:
                        </label>
                        <div className="col-sm-8">
                            <input
                                type="text"
                                className="form-control"
                                id="inputDay"
                                name="day"
                                placeholder="Day of the week"
                                value={selectedDate ? selectedDate.toLocaleDateString("en-US", { weekday: "long" }) : ""}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <label htmlFor="description" className="col-sm-3 col-form-label">
                            Description:
                        </label>
                        <div className="col-sm-8">
                            <input
                                type="text"
                                className="form-control"
                                id="description"
                                name="description"
                                onChange={onFormChange}
                            />
                        </div>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary w-50" disabled={loading}>
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddHolidayModal;
