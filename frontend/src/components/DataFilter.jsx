import React, { useState, useEffect } from 'react';
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';

const DataFilter = ({ jsonData, onFilteredDataChange, headers }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Apply filters to data
  const applyFilters = () => {
    let filteredData = [...jsonData];

    // Apply column-specific filters
    Object.entries(filters).forEach(([column, filterValue]) => {
      if (filterValue) {
        filteredData = filteredData.filter(row => {
          const cellValue = String(row[column]).toLowerCase();
          return cellValue.includes(filterValue.toLowerCase());
        });
      }
    });

    // Apply global search
    if (searchTerm) {
      filteredData = filteredData.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return filteredData;
  };

  // Update filtered data whenever filters change
  useEffect(() => {
    const filteredData = applyFilters();
    onFilteredDataChange(filteredData);
  }, [filters, searchTerm, jsonData]);

  const handleFilterChange = (column, value) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const hasActiveFilters = Object.values(filters).some(v => v) || searchTerm;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaFilter className="mr-2 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Data Filters</h3>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Active
            </span>
          )}
        </div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="text-gray-600 hover:text-gray-800"
        >
          {isFilterOpen ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      {/* Global Search */}
      <div className="mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search across all columns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Column Filters */}
      {isFilterOpen && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {headers.map(column => (
              <div key={column}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {column}
                </label>
                <input
                  type="text"
                  placeholder={`Filter ${column}...`}
                  value={filters[column] || ''}
                  onChange={(e) => handleFilterChange(column, e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            ))}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filter Results Summary */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {applyFilters().length} of {jsonData.length} rows
      </div>
    </div>
  );
};

export default DataFilter;
