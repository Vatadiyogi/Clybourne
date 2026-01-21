import React from 'react';
import './Modal.css';

const Documents = ({ documents, onClose }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Document List</h2>
                    <span className="close" onClick={onClose}>&times;</span>
                </div>
                <div className="modal-body">
                    <ul className="document-list">
                        {documents.map((doc, index) => (
                            <li className="document-item" key={doc.name}>
                                <span className="serial-number">{index + 1}</span> {/* Serial Number */}
                                <div className="document-info">
                                    <span className="document-name">{doc.name}</span>
                                </div>
                                <a className="btn-download" href={doc.url} download>
                                    Download
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Documents;
