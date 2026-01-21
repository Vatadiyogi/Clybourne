import React, { useState } from 'react';
import Modal from 'react-modal';
import Upload from './UploadForm/Upload';
import './Modal.css';

Modal.setAppElement('#root'); // Ensure the root element is set for accessibility

const Support = ({documents}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <>
      <div className="header-cart-icon icon float-end">
        <div className="header-cart dropdown">
          <a
            href="#!"
            className="float-end text-blue text-golden-hover fw-600 fs-12"
            onClick={openModal}
          >
            <i className="bi bi-info-circle-fill"></i> Get Support?
          </a>
          <ul className="cart-item-list p-15px bg-light-blue sm-d-none">
            <li className="cart-item align-items-center fs-12 p-0">
              <span>
                Your plan offers help from our financial experts.
                <a
                  href="#!"
                  className="fw-700 text-blue"
                  onClick={openModal}
                >
                  Click this link to upload
                </a> your financial documents to have our financial expert fill out these details for you.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Modal component */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Upload Documents"
        className="modal-popup-main"
        overlayClassName="modal-overlay"
      >
        <button onClick={closeModal} className="close-modal-btn z-index-9">
          &times;
        </button>
        <Upload documents={documents} />
      </Modal>
    </>
  );
};

export default Support;
