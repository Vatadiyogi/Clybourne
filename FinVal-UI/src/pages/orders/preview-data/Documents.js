import React from "react";

const Documents = ({ data }) => {
  // Ensure data, documents, and document array exist before rendering
  if (data && data.documents && data.documents.document.length > 0) {
    return (
      <div className="col-sm-6">
        <fieldset className="bg-white p-15px mt-0 mt-sm-30px h-100">
          <legend className="fw-600 float-none border-1px col-auto fs-18 ps-15px pe-15px p-5px lh-1 border-radius-4px bg-blue text-golden">
            Documents Uploaded
          </legend>
          {/* Loop through each document and display */}
          {data.documents.document.map((doc, index) => (
            <p className="fs-14 lh-normal" key={index}>
              <i className="bi bi-file-earmark-text m-0 fs-16 bg-blue text-white p-5px"></i> {doc.name}
            </p>
          ))}
        </fieldset>
      </div>
    );
  }

  // Return null if no documents found
  return null;
};

export default Documents;
