import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import CustomHeader from './CustomHeader';
import './DataTableComponent.css';

// Utility function to access nested fields
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((value, key) => {
        return value && value[key] ? value[key] : '';
    }, obj);
};

const DataTableComponent = ({
    title,
    columns,
    data,
    searchFields = [],
    pagination = true,
    striped = true,
    highlightOnHover = true,
    customStyles = {},
    className = ''
}) => {
    const [filterText, setFilterText] = useState('');

    const filteredData = data.filter(item =>
        searchFields.some(field => {
            const value = getNestedValue(item, field); // Use the utility to get nested field values
            return typeof value === 'string' && value.toLowerCase().includes(filterText.toLowerCase());
        })
    );

    const defaultStyles = {
        headCells: {
            style: {
                backgroundColor: '#EFF5FF',
                color: '#000',
                fontSize: '11px',
                fontWeight: '400',
                overflow: 'unset !important', // Remove overflow: hidden
                whiteSpace: 'normal !important', // Remove white-space: nowrap
            },
        },
        cells: {
            style: {
                padding: '5px',
                fontSize: '12px',
                color: '#000',
            },
        },
        rows: {
            style: {
                minHeight: '50px', // override the row height
                '&:not(:last-of-type)': {
                    borderBottomStyle: 'solid',
                    borderBottomWidth: '1px',
                    borderBottomColor: '#ccc',
                },
            },
        },
        ...customStyles,
    };

    return (
        <>
            {data.length > 0 ? (
                <CustomHeader onSearchChange={setFilterText} />
            ) : null}
            <DataTable
                columns={columns}
                data={filteredData}
                pagination={pagination}
                striped={striped}
                highlightOnHover={highlightOnHover}
                customStyles={defaultStyles}
                paginationPerPage={50}
                paginationRowsPerPageOptions={[50, 100, 150, 200]}
                paginationComponentOptions={{
                    rowsPerPageText: 'Rows per page:',
                }}
                className={className}
            />
        </>
    );
};

export default DataTableComponent;
