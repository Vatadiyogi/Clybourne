import React from 'react';

const FormGroup = ({ imgSrc, label, children }) => {
  return(
  <div className="col-sm-11 mt-15px mb-10px">
    <div className="row">
      <div className="w-40px pe-0">
        <img src={imgSrc} alt={label} />
      </div>
      <div className="col">
        <label className="text-black mt-10px mb-10px fw-500 fs-14 d-block lh-normal">{label}</label>
        {children}
      </div>
    </div>
  </div>
)
};

export default FormGroup;
