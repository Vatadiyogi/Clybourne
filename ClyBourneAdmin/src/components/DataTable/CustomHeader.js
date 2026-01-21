import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const CustomHeader = ({ onSearchChange }) => {
    return (
        <div className="dt--top-section pt-2">
            <div className="row">
                <div className="col-12 col-sm-6 d-flex justify-content-sm-start justify-content-center">
                     
                </div>
                <div className="col-12 col-sm-6 d-flex justify-content-sm-end justify-content-center mt-sm-0 mt-3">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="form-control" 
                        style={{height:'40px'}}
                        onChange={e => onSearchChange(e.target.value)}
                    />
                     <div className="input-group-append">
                    <span className="input-group-text">
                        <FontAwesomeIcon icon={faSearch} />
                    </span>
                </div>
                </div>
            </div>
        </div>
    );
}

CustomHeader.propTypes = {
    onSearchChange: PropTypes.func.isRequired,
};

export default CustomHeader;
