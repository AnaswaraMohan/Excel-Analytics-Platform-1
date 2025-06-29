import React, { useState, useEffect } from 'react';
import { FaChartLine, FaChartBar, FaChartPie, FaChartArea } from 'react-icons/fa';

const DataColumnSelector = ({ jsonData, onAxisChange, onChartTypeChange }) => {
  const [xAxisKey, setXAxisKey] = useState('');
  const [yAxisKey, setYAxisKey] = useState('');
  const [chartType, setChartType] = useState('line');
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    if (jsonData && jsonData.length > 0) {
      // Extract headers from the first row of data
      const dataHeaders = Object.keys(jsonData[0]);
      setHeaders(dataHeaders);
      
      // Set default selections if not already set
      if (!xAxisKey && dataHeaders.length > 0) {
        setXAxisKey(dataHeaders[0]);
      }
      if (!yAxisKey && dataHeaders.length > 1) {
        setYAxisKey(dataHeaders[1]);
      }
    }
  }, [jsonData, xAxisKey, yAxisKey]);

  useEffect(() => {
    // Propagate changes to parent component
    if (xAxisKey && yAxisKey) {
      onAxisChange({ xAxisKey, yAxisKey });
    }
  }, [xAxisKey, yAxisKey, onAxisChange]);

  useEffect(() => {
    onChartTypeChange(chartType);
  }, [chartType, onChartTypeChange]);

  const chartTypes = [
    { value: 'line', label: 'Line Chart', icon: FaChartLine },
    { value: 'bar', label: 'Bar Chart', icon: FaChartBar },
    { value: 'pie', label: 'Pie Chart', icon: FaChartPie },
    { value: 'scatter', label: 'Scatter Plot', icon: FaChartArea }
  ];

  if (!jsonData || jsonData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Column Selection</h3>
        <p className="text-gray-500">No data available for visualization.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Chart Configuration</h3>
      
      {/* Chart Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Chart Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {chartTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => setChartType(type.value)}
                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 ${
                  chartType === type.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800'
                }`}
              >
                <IconComponent className="w-6 h-6 mb-2" />
                <span className="text-xs font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Axis Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* X-Axis Selection */}
        <div>
          <label htmlFor="xAxis" className="block text-sm font-medium text-gray-700 mb-2">
            X-Axis
          </label>
          <select
            id="xAxis"
            value={xAxisKey}
            onChange={(e) => setXAxisKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select X-Axis</option>
            {headers.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>

        {/* Y-Axis Selection */}
        <div>
          <label htmlFor="yAxis" className="block text-sm font-medium text-gray-700 mb-2">
            Y-Axis
          </label>
          <select
            id="yAxis"
            value={yAxisKey}
            onChange={(e) => setYAxisKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Y-Axis</option>
            {headers.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Preview */}
      {xAxisKey && yAxisKey && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Data Preview</h4>
          <div className="text-xs text-gray-600">
            <p>Chart Type: <span className="font-medium">{chartType}</span></p>
            <p>X-Axis: <span className="font-medium">{xAxisKey}</span></p>
            <p>Y-Axis: <span className="font-medium">{yAxisKey}</span></p>
            <p>Data Points: <span className="font-medium">{jsonData.length}</span></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataColumnSelector; 