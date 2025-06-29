import React from 'react';
import { toast } from 'react-toastify';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaTimesCircle,
  FaTimes 
} from 'react-icons/fa';

const typeStyles = {
  success: {
    border: 'border-l-4 border-green-500',
    bg: 'bg-green-50 dark:bg-green-900',
    icon: 'text-green-500',
    progress: 'bg-green-500',
  },
  error: {
    border: 'border-l-4 border-red-500',
    bg: 'bg-red-50 dark:bg-red-900',
    icon: 'text-red-500',
    progress: 'bg-red-500',
  },
  warning: {
    border: 'border-l-4 border-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900',
    icon: 'text-yellow-500',
    progress: 'bg-yellow-500',
  },
  info: {
    border: 'border-l-4 border-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900',
    icon: 'text-blue-500',
    progress: 'bg-blue-500',
  },
};

// Custom Toast Component
const ToastContent = ({ type, message, title, onClose }) => {
  const style = typeStyles[type] || typeStyles.info;
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className={`text-2xl ${style.icon}`} />;
      case 'error':
        return <FaTimesCircle className={`text-2xl ${style.icon}`} />;
      case 'warning':
        return <FaExclamationTriangle className={`text-2xl ${style.icon}`} />;
      case 'info':
      default:
        return <FaInfoCircle className={`text-2xl ${style.icon}`} />;
    }
  };

  return (
    <div
      className={`relative flex items-center min-h-[72px] max-w-md w-full rounded-xl shadow-lg ${style.bg} ${style.border} px-5 py-3 my-2`}
    >
      <div className="flex items-center justify-center min-w-[40px] min-h-[40px] mr-4">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        {title && (
          <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-0.5 leading-tight">
            {title}
          </h4>
        )}
        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed m-0">
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none"
        aria-label="Close notification"
      >
        <FaTimes className="text-base" />
      </button>
    </div>
  );
};

// Toast utility functions
export const showToast = {
  success: (message, title = 'Success') => {
    toast.success(
      <ToastContent type="success" message={message} title={title} />, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: '',
        bodyClassName: 'p-0',
        toastClassName: 'p-0 bg-transparent shadow-none',
      }
    );
  },

  error: (message, title = 'Error') => {
    toast.error(
      <ToastContent type="error" message={message} title={title} />, {
        position: 'top-right',
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: '',
        bodyClassName: 'p-0',
        toastClassName: 'p-0 bg-transparent shadow-none',
      }
    );
  },

  warning: (message, title = 'Warning') => {
    toast.warning(
      <ToastContent type="warning" message={message} title={title} />, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: '',
        bodyClassName: 'p-0',
        toastClassName: 'p-0 bg-transparent shadow-none',
      }
    );
  },

  info: (message, title = 'Info') => {
    toast.info(
      <ToastContent type="info" message={message} title={title} />, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: '',
        bodyClassName: 'p-0',
        toastClassName: 'p-0 bg-transparent shadow-none',
      }
    );
  },

  // Custom toast with custom styling
  custom: (message, title, type = 'info', options = {}) => {
    const defaultOptions = {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: '',
      bodyClassName: 'p-0',
      toastClassName: 'p-0 bg-transparent shadow-none',
    };

    toast(
      <ToastContent type={type} message={message} title={title} />, {
        ...defaultOptions,
        ...options,
      }
    );
  }
};

export default ToastContent; 