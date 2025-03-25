import React, { useState } from 'react';

export interface ChartContainerProps {
  /**
   * Title of the chart
   */
  title: string;
  
  /**
   * Description or subtitle for the chart
   */
  description?: string;
  
  /**
   * The chart component
   */
  children: React.ReactNode;
  
  /**
   * Loading state for the chart
   */
  loading?: boolean;
  
  /**
   * Error state for the chart
   */
  error?: Error | null;
  
  /**
   * Function to refresh the chart data
   */
  onRefresh?: () => void;
  
  /**
   * Class name for the container
   */
  className?: string;
  
  /**
   * Additional information to display in a tooltip
   */
  infoTooltip?: string;
  
  /**
   * Min height for the chart container
   */
  minHeight?: number | string;
  
  /**
   * Whether to show a border
   */
  bordered?: boolean;
}

/**
 * Container component for charts with consistent styling and functionality
 */
const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  children,
  loading = false,
  error = null,
  onRefresh,
  className = '',
  infoTooltip,
  minHeight = 400,
  bordered = true,
}) => {
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  
  // Loading state UI
  const renderLoading = () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Loading chart data...</p>
      </div>
    </div>
  );
  
  // Error state UI
  const renderError = () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="mb-2 text-lg font-medium text-gray-900">Failed to load chart data</p>
        <p className="mb-4 text-sm text-gray-600">{error?.message || 'An unexpected error occurred'}</p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
  
  return (
    <div 
      className={`${bordered ? 'border border-gray-200 shadow-sm' : ''} bg-white rounded-lg ${className}`}
      style={{ minHeight }}
    >
      {/* Chart Header */}
      <div className="flex flex-col items-start justify-between border-b border-gray-200 px-6 py-4 sm:flex-row sm:items-center">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            
            {/* Info tooltip button */}
            {infoTooltip && (
              <div className="relative ml-2">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onMouseEnter={() => setShowInfoTooltip(true)}
                  onMouseLeave={() => setShowInfoTooltip(false)}
                  aria-label="Information"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Info tooltip */}
                {showInfoTooltip && (
                  <div className="absolute left-0 z-10 mt-2 w-64 rounded-md bg-gray-900 px-4 py-2 text-sm text-white shadow-lg">
                    {infoTooltip}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
        
        {/* Refresh button */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        )}
      </div>
      
      {/* Chart Body */}
      <div className="p-6" style={{ minHeight: `calc(${minHeight}px - 80px)` }}>
        {loading ? renderLoading() : error ? renderError() : children}
      </div>
    </div>
  );
};

export default ChartContainer;