
import React from 'react';
import { Link } from 'react-router-dom';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-12 w-12 text-red-500 mx-auto mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{message}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          A página que você está procurando não está disponível ou não existe.
        </p>
        <Link
          to="/" 
          className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
};

export default ErrorDisplay;
