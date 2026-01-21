import React from 'react';
import PropTypes from 'prop-types';

const Breadcrumb = ({ items }) => {
  return (
    <div className="page-meta  pb-1">
    <div className="breadcrumb-wrapper-content mb-1 d-flex justify-content-start">
        <nav className="breadcrumb-style-one" aria-label="breadcrumb">
            <ol className="breadcrumb">
                    {items.map((item, index) => (
                        <li key={index} className={`breadcrumb-item ${item.active ? 'active' : ''}`}>
                            {item.link ? <a href={item.link}>{item.label}</a> : item.label}
                        </li>
                    ))}    
            </ol>
        </nav>
    </div>
    </div>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string,
      active: PropTypes.bool
    })
  ).isRequired
};

export default Breadcrumb;
