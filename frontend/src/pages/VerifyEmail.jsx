import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (hasVerified.current) return;
      hasVerified.current = true;
      
      try {
        const response = await authAPI.verifyEmail(token);
        setStatus('success');
        setMessage(response.data.message);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="card p-8 text-center">
          {status === 'verifying' && (
            <div>
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifying Email</h2>
              <p className="text-gray-600">Please wait while we verify your email address...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div>
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Verified!</h2>
              <p className="text-gray-600 mb-8">{message}</p>
              <Link 
                to="/login" 
                className="btn-primary w-full inline-block"
              >
                Continue to Login
              </Link>
            </div>
          )}
          
          {status === 'error' && (
            <div>
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h2>
              <p className="text-gray-600 mb-8">{message}</p>
              <Link 
                to="/signup" 
                className="btn-primary w-full inline-block"
              >
                Try Again
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;