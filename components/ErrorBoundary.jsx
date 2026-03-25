'use client';

import React from 'react';

/**
 * Error Boundary Component for React Error Boundaries
 * Catches rendering errors in child components
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState((prevState) => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log error to external service in production
    console.error('Error caught by boundary:', error, errorInfo);
    logErrorMetrics(error, errorInfo);

    // Reload page if too many errors
    if (this.state.errorCount > 3) {
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-2 text-center dark:text-white">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              We're sorry for the inconvenience. An unexpected error has occurred.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">
                <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-words">
                  <strong>Error:</strong> {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.resetError}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition"
              >
                Go Home
              </button>
            </div>

            {this.state.errorCount > 2 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                Page will reload automatically if errors continue...
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based Error Boundary using Error Boundary component
 */
export function withErrorBoundary(Component) {
  return function ErrorBoundaryWrapper(props) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

/**
 * Log error metrics (for integration with error tracking services)
 */
function logErrorMetrics(error, errorInfo) {
  try {
    // In production, send to error tracking service (Sentry, LogRocket, etc)
    const errorData = {
      message: error?.message || 'Unknown error',
      stack: error?.stack || '',
      componentStack: errorInfo?.componentStack || '',
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    };

    // For now, just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error metrics:', errorData);
    }

    // TODO: Send to error tracking service
    // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    //   Sentry.captureException(error, { extra: errorData });
    // }
  } catch (err) {
    console.error('Failed to log error metrics:', err);
  }
}
