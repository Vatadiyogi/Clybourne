import React from 'react';

const CustomFooter = ({ currentPage, totalPages, onPageChange, rowsPerPage, onRowsPerPageChange }) => {
    return (
        <div className="dt--bottom-section d-sm-flex justify-content-sm-between text-center">
            <div className="dt--pages-count mb-sm-0 mb-3">
                Showing page {currentPage} of {totalPages}
            </div>
            <div className="dt--pagination">
                <button 
                    className="btn btn-secondary" 
                    onClick={() => onPageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button 
                    className="btn btn-secondary" 
                    onClick={() => onPageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
                <select value={rowsPerPage} onChange={e => onRowsPerPageChange(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>
        </div>
    );
}

export default CustomFooter;
