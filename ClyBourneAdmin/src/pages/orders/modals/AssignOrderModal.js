import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { apiURL } from "../../../Config";

const AssignOrderModal = ({ show, handleClose, orderId, currentAssignedUser, onAssignSuccess }) => {
    const [adminUsers, setAdminUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const isFirstRender = useRef(true);
   
    useEffect(() => {
        const fetchAdminUsers = async () => {
            try {
                const response = await axios.get(`${apiURL}api/admin/admin`);
                if (response.status === 200) {
                    setAdminUsers(response.data);
                } else {
                    throw new Error('Failed to fetch admin users');
                }
            } catch (error) {
                console.error('Error fetching admin users:', error);
            }
        };

        if (show && isFirstRender.current) {
            fetchAdminUsers();
            setSelectedUser(currentAssignedUser || ""); // Set the initial selected user when the modal opens
            console.log(currentAssignedUser); // This should now print only once per modal open
            isFirstRender.current = false; // After the first render, set this to false
        }
    }, [show, currentAssignedUser]);

    const handleAssign = async () => {
        if (!selectedUser) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please select a user to assign",
            });
            return;
        }

        try {
            const response = await axios.put(`${apiURL}api/admin/orders/${orderId}/assign`, {
                assigned_to: selectedUser
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Order assigned successfully!",
                }).then(() => {
                    handleClose();
                    onAssignSuccess();
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
                <Modal.Title>Assign Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="assignUser">
                        <Form.Label>Select Asignee</Form.Label>
                        <Form.Control as="select" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                            <option value="">Select Asignee</option>
                            {adminUsers.map(user => (
                                <option key={user._id} value={user._id}>
                                    {user.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleAssign}>Assign</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AssignOrderModal;
