import React from 'react';
import { MdError, MdRefresh } from 'react-icons/md';

const ErrorMessage = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`weather-card p-6 text-center ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <MdError className="w-12 h-12 text-red-500 dark:text-red-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {message || 'Failed to load weather data. Please try again.'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <MdRefresh className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
