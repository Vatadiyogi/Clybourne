import React from 'react';
import { TreeSelect } from 'antd';
import styles from './CustomDropdown.module.css';
import { IoMdArrowDropdown } from "react-icons/io";

const { TreeNode } = TreeSelect;

const CustomDropdown = ({ data, value, onChange, error, name, disabled }) => {
  const suffixIcon = <IoMdArrowDropdown size={18} color="#1aa79c" />;

  // Format the tree nodes from the data
  const formatTreeNodes = (data) => {
    // Sort industries alphabetically
    const sortedIndustries = Object.keys(data).sort();

    return sortedIndustries.map(industry => {
      // Check if data[industry] is an array
      if (!Array.isArray(data[industry])) {
        return null;
      }

      // Sort sub-items alphabetically by name
      const sortedSubItems = data[industry].sort((a, b) => a.name.localeCompare(b.name));

      return (
        <TreeNode
          value={industry}
          title={industry} // Title for display
          key={industry}
          selectable={false} // Disable selection of main industry
          disabled={disabled}
        >
          {sortedSubItems.map(subItem => (
            <TreeNode value={subItem.name} title={subItem.name} key={subItem.name} disabled={disabled} />
          ))}
        </TreeNode>
      );
    });
  };

  // Handle change event
  const handleChangeInternal = (value) => {
    // Check if the selected value is a sub-industry (not the main industry)
    const isValidValue = Object.values(data).some(subIndustries =>
      subIndustries.some(subItem => subItem.name === value)
    );

    // Only call onChange if it's a valid value
    if (isValidValue) {
      onChange({ target: { name, value } });
    }
  };

  // Filter function for search
  const filterTreeNode = (inputValue, treeNode) => {
    // Return true if the node title includes the search input (case-insensitive)
    return treeNode.title.toLowerCase().includes(inputValue.toLowerCase());
  };

  return (
    <div className={`form-group financial-info-input ${error ? 'is-invalid' : ''}`}>
      <TreeSelect
        suffixIcon={suffixIcon}
        style={{ width: "100%" }}
        value={value || undefined}
        placeholder="Select your Industry"
        className={` my-custom-select   `}

        onChange={handleChangeInternal}
        showSearch // Enable search feature
        filterTreeNode={filterTreeNode} // Apply custom search filter
        treeDefaultExpandAll={false} // Initially collapse all nodes
       
      >
        {formatTreeNodes(data)}
      </TreeSelect>
      {error && <div className="text-danger">{error}</div>}
    </div>
  );
};

export default CustomDropdown;
