import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import axios from 'axios';
import { apiURL } from '../../../../../config/Config';
import Swal from 'sweetalert2';

const Form = ({ documents }) => {
  const [files, setFiles] = useState([]);
  const [tempFile, setTempFile] = useState(null); // Temporary state for file selection
  const [remarks, setRemarks] = useState(''); // State for additional remarks
  const [isNewDocumentAdded, setIsNewDocumentAdded] = useState(false);
  const fileInputRef = useRef(null); // useRef to manage file input
  const token = localStorage.getItem('token');
  const { orderId } = useParams(); // Extract orderId from the URL
  const [isLoading, setIsLoading] = useState(false);

  // Initialize files with document data if documents prop exists
  useEffect(() => {
    if (documents && documents.documents && documents.documents.document.length > 0) {
      setFiles(documents.documents.document); // Assume documents is an array of file objects
      setRemarks(documents.documents.remarks);
    }
  }, [documents]);

  // Allowed file types: .doc, .docx, .xls, .xlsx, .png, .jpg, .jpeg, .gif
  const allowedFileTypes = [
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/png', 
    'image/jpeg', 
    'image/gif'
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (allowedFileTypes.includes(file.type)) {
        setTempFile(file); // Set the temporary file state if file type is allowed
      } else {
        // Show an alert if the file type is not allowed
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Only documents (DOC, DOCX), spreadsheets (XLS, XLSX), and image files (PNG, JPG, JPEG, GIF) are allowed.',
        });
        fileInputRef.current.value = ''; // Clear the file input
      }
    }
  };

  const handleAddFile = () => {
    if (tempFile) {
      setFiles((prevFiles) => [...prevFiles, tempFile]); // Add the file to the main files state
      setTempFile(null); // Clear the temporary file state
      fileInputRef.current.value = ''; // Clear the file input value
      setIsNewDocumentAdded(true); 
    } else {
      Swal.fire({
        icon: 'error',
        title: '',
        text: 'No File Added.',
      });
    }
  };

  const handleRemoveFile = (index, fileId) => {
    // Show confirmation before deleting
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this file?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Call the API to delete the file if it has an ID
        if (fileId) {
          try {
            await axios({
              url: `${apiURL}/order/store-documents`,
              method: 'DELETE',
              headers: {
                Authorization: `${token}`, // Ensure token is prefixed by 'Bearer'
              },
              data: { 
                orderId,  // Include the orderId in the delete request
                documentId: fileId 
              },
            });
            // Remove the file from the state after deletion
            setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
            Swal.fire('Deleted!', 'The file has been deleted.', 'success');
          } catch (error) {
            Swal.fire('Error!', 'Something went wrong, please try again.', 'error');
          }
        } else {
          // If file is newly added and not uploaded yet, just remove from local state
          setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        }
        setIsNewDocumentAdded(files.some((file) => !file._id)); // Update isNewDocumentAdded
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      Swal.fire('Error!', 'Please upload at least one document.', 'success');
      return;
    }

    // Create FormData object
    const formData = new FormData();
    files.forEach((file) => {
      if (!file._id) { // Only append files that don't have an ID (newly added files)
        formData.append('document', file);
      }
    });
    formData.append('remarks', remarks); // Append remarks if any
    
    if(orderId) {
      formData.append('orderId', orderId);
    }
    setIsLoading(true);
    try {
      const response = await axios({
        url: apiURL + '/order/store-documents',
        method: orderId ? 'PUT' : 'POST', // Use PUT if orderId exists, otherwise POST
        headers: {
          Authorization: `${token}`, // Ensure token is prefixed by 'Bearer'
        },
        data: formData, // Send the FormData object as the body
      });

      if (response.data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Document Uploaded',
          html: '<p>Thank you for uploading your financial documents. We will analyse the documents and complete the financial input data. We will get in touch with you in case we have questions.</p><p> Please continue to fill the Business Details, Financial Data and Projections to the best of your knowledge. We will take care of the remaining information wherever you are having difficulty.</p>',
        }).then(() => {
          // if(!orderId){
          //   const newOrderId = response.data.data.order._id;
          //   navigate({
          //     pathname: `/valuation-form/${newOrderId}`,
          //     search: `?step=1`,
          //   });
          // }
          window.location.reload();
        });
        setIsNewDocumentAdded(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No document to upload.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again.',
      });
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="col-sm-6">
      <div className="p-30px">
        <p className="fs-14 text-red mb-0 d-flex lh-1">(Please upload documents only in the English language)</p>
        <form className="myform-01" onSubmit={handleSubmit}>
          <p className="fs-16 fw-600 mb-0 mt-0">Uploaded documents</p>
          <div className="col-12 alert-box-style-02">
            {files.map((file, index) => (
              <div key={index} className="alert alert-success alert-dismissable bg-light-blue text-blue p-0 fs-14 border-radius-0px mb-10px">
                <a href="#!" className="close text-danger w-30px" onClick={() => handleRemoveFile(index, file._id)}>
                  <i className="feather icon-feather-x-circle"></i>
                </a>
                <span className="d-flex align-items-center">
                  <i className="bi bi-file-earmark-text m-0 fs-16 bg-blue text-white p-1 me-5px"></i> {file.name || file.originalname}
                </span>
              </div>
            ))}
          </div>

          {files.length < 4 && (
            <div className="col-12 mt-15px">
              <div className="input-group mb-10px">
                <input
                  ref={fileInputRef} // Assigning ref to input field
                  className="mb-0 form-control h-40px lh-36"
                  type="file"
                  accept=".doc,.docx,.xls,.xlsx,image/*" // Restrict to allowed file types
                  onChange={handleFileChange}
                />
              </div>
              <div className="col-12">
                <button
                  type="button" // Ensures it doesn't trigger form submit
                  onClick={handleAddFile}
                  className="bg-blue h-40px lh-40 p-0 ps-15px pe-15px fs-12 m-0 text-white fs-12 fw-600 text-capitalize fin-btn d-inline-block ls-05px border-radius-4px"
                >
                  <i className="feather icon-feather-file-plus m-0 fs-16 align-text-bottom"></i> Upload Document
                </button>
              </div>
            </div>
          )}

          <div className="col-12 mt-15px">
            <label className="text-black mb-5px fw-500 fs-14 d-block lh-normal">
              Specify any other information you would like to share
              <span className="fs-12 text-light-gray fw-400"><br />(like the future growth projections of the company)</span>
            </label>
            <textarea
              className="border-radius-0px box-shadow form-control p-15px pt-10px fw-300"
              cols="20"
              rows="4"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)} // Update remarks
              placeholder="Additional information"
            ></textarea>
          </div>

          <div className="row row-cols-1 justify-content-center mt-15px mb-15px">
            <div className="col-12 text-center divider-style-01">
              <div className="d-flex justify-content-center">
                <div className="divider-border d-flex align-items-center w-100">
                  <span className="d-flex flex-column justify-content-center w-30px h-30px border border-color-extra-medium-gray rounded-circle ms-20px me-20px">
                    <i className="feather icon-feather-arrow-down fs-16 text-dark-gray"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 text-center">
            {isLoading ?
              <div className="col-sm-12 text-center">
                  <span>
                      <span><i className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></i></span>
                      <span className="btn-double-text ms-3px" data-text="Submitting...">Submitting...</span>
                  </span>
              </div> 
            :
              <button
                type="submit"
                className="bg-blue h-40px lh-40 p-0 ps-15px pe-15px fs-12 m-0 text-white fs-12 fw-600 fin-btn d-inline-block ls-05px border-radius-4px"
                disabled={!isNewDocumentAdded}
              >
                <i className="feather icon-feather-upload m-0 fs-16 align-text-bottom"></i> Submit Document(s) To Get Support
              </button>
            }
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
