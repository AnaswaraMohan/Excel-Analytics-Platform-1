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
    bg: 'from-emerald-500/20 to-green-500/20',
    border: 'border-emerald-500/50',
    icon: 'text-emerald-400',
    iconBg: 'bg-emerald-500/20',
    progress: 'from-emerald-500 to-green-500',
  },
  error: {
    bg: 'from-red-500/20 to-rose-500/20',
    border: 'border-red-500/50',
    icon: 'text-red-400',
    iconBg: 'bg-red-500/20',
    progress: 'from-red-500 to-rose-500',
  },
  warning: {
    bg: 'from-amber-500/20 to-yellow-500/20',
    border: 'border-amber-500/50',
    icon: 'text-amber-400',
    iconBg: 'bg-amber-500/20',
    progress: 'from-amber-500 to-yellow-500',
  },
  info: {
    bg: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/50',
    icon: 'text-blue-400',
    iconBg: 'bg-blue-500/20',
    progress: 'from-blue-500 to-cyan-500',
  },
};

// Custom Toast Component
const ToastContent = ({ type, message, title, onClose }) => {
  const style = typeStyles[type] || typeStyles.info;
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className={`text-xl ${style.icon}`} />;
      case 'error':
        return <FaTimesCircle className={`text-xl ${style.icon}`} />;
      case 'warning':
        return <FaExclamationTriangle className={`text-xl ${style.icon}`} />;
      case 'info':
      default:
        return <FaInfoCircle className={`text-xl ${style.icon}`} />;
    }
  };

  return (
    <div className={`
      relative flex items-center min-h-[80px] max-w-md w-full rounded-2xl 
      backdrop-blur-xl border ${style.border}
      shadow-2xl px-5 py-4 my-2 group hover:scale-[1.02] transition-all duration-300
      overflow-hidden
    `}>
      {/* Glassmorphism overlay with gradient - this is the only background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${style.bg} rounded-2xl backdrop-blur-xl border ${style.border}`}></div>
      
      {/* Icon container */}
      <div className={`
        relative flex items-center justify-center w-12 h-12 rounded-xl mr-4
        ${style.iconBg} border ${style.border} backdrop-blur-sm z-10
      `}>
        {getIcon()}
      </div>
      
      {/* Content */}
      <div className="relative flex-1 min-w-0 flex flex-col justify-center z-10">
        {title && (
          <h4 className="text-base font-semibold text-white mb-1 leading-tight">
            {title}
          </h4>
        )}
        <p className="text-sm text-white/90 leading-relaxed m-0">
          {message}
        </p>
      </div>
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="relative ml-4 p-2 rounded-xl hover:bg-white/10 transition-all duration-200 text-white/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 group z-10"
        aria-label="Close notification"
      >
        <FaTimes className="text-sm group-hover:scale-110 transition-transform" />
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
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'custom-toast',
        bodyClassName: 'p-0 m-0',
        toastClassName: 'p-0 bg-transparent shadow-none border-none',
        icon: false,
      }
    );
  },

  error: (message, title = 'Error') => {
    toast.error(
      <ToastContent type="error" message={message} title={title} />, {
        position: 'top-right',
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'custom-toast',
        bodyClassName: 'p-0 m-0',
        toastClassName: 'p-0 bg-transparent shadow-none border-none',
        icon: false,
      }
    );
  },

  warning: (message, title = 'Warning') => {
    toast.warning(
      <ToastContent type="warning" message={message} title={title} />, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'custom-toast',
        bodyClassName: 'p-0 m-0',
        toastClassName: 'p-0 bg-transparent shadow-none border-none',
        icon: false,
      }
    );
  },

  info: (message, title = 'Info') => {
    toast.info(
      <ToastContent type="info" message={message} title={title} />, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'custom-toast',
        bodyClassName: 'p-0 m-0',
        toastClassName: 'p-0 bg-transparent shadow-none border-none',
        icon: false,
      }
    );
  },

  // Custom toast with custom styling
  custom: (message, title, type = 'info', options = {}) => {
    const defaultOptions = {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: 'custom-toast',
      bodyClassName: 'p-0 m-0',
      toastClassName: 'p-0 bg-transparent shadow-none border-none',
      icon: false,
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