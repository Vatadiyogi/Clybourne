import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { apiURL } from "../../../Config";

const CustodyModal = ({ show, handleClose, orderId, currentCustody, onCustodySuccess }) => {
    
    const [selectedCustody, setSelectedCustody] = useState("");
    const isFirstRender = useRef(true);
   
    useEffect(() => {
        if (show && isFirstRender.current) {
            setSelectedCustody(currentCustody); // Set the initial selected user when the modal opens
            isFirstRender.current = false; // After the first render, set this to false
        }
    }, [show, currentCustody]);

    const handleAssign = async () => {
        if (!selectedCustody) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please select Custody",
            });
            return;
        }

        try {
            const response = await axios.put(`${apiURL}api/admin/orders/${orderId}/custody`, {
                custody: selectedCustody
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Order Custody Changed successfully!",
                }).then(() => {
                    handleClose();
                    onCustodySuccess();
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data.message || "Failed to assign order",
                });
            }
        } catch (error) {
            console.error('Error assigning order:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while assigning the order.",
            });
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Change Custody</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="assignUser">
                        <Form.Label>Select Custody</Form.Label>
                        <Form.Control as="select" value={selectedCustody} onChange={e => setSelectedCustody(e.target.value)}>
                            <option value="">Select Custody</option>
                                <option value="Company">Company</option>
                                <option value="Customer">Customer</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleAssign}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CustodyModal;
