import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const ChartThemeToggle = ({ isDarkTheme, onThemeChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Chart Theme:</span>
      <button
        onClick={() => onThemeChange(!isDarkTheme)}
        className={`flex items-center px-3 py-1 rounded-lg transition-colors ${
          isDarkTheme 
            ? 'bg-gray-800 text-white' 
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {isDarkTheme ? (
          <>
            <FaMoon className="mr-1" />
            Dark
          </>
        ) : (
          <>
            <FaSun className="mr-1" />
            Light
          </>
        )}
      </button>
    </div>
  );
};

export default ChartThemeToggle;
