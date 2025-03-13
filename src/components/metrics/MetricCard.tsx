/**
 * Metric card component
 * Displays a single metric with its value and percentile
 */

import React from 'react';
import { MetricId, METRICS, formatMetricValue, isHigherBetter } from '../../config/metrics';

type MetricCardProps = {
  metricId: MetricId;
  value: number;
  percentile?: number;
  showPercentile?: boolean;
  className?: string;
};

const MetricCard: React.FC<MetricCardProps> = ({
  metricId,
  value,
  percentile,
  showPercentile = true,
  className = '',
}) => {
  const metric = METRICS[metricId];
  
  if (!metric) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Unknown metric: {metricId}</div>;
  }
  
  const formattedValue = formatMetricValue(metricId, value);
  const higherIsBetter = isHigherBetter(metricId);
  
  // Determine percentile color
  const getPercentileColor = (percentile: number): string => {
    if (percentile >= 80) return 'text-green-600';
    if (percentile >= 60) return 'text-green-500';
    if (percentile >= 40) return 'text-yellow-500';
    if (percentile >= 20) return 'text-orange-500';
    return 'text-red-500';
  };
  
  // Render trend icon based on whether higher is better
  const renderTrendIcon = (percentile: number) => {
    if (higherIsBetter === null) return null;
    
    if ((higherIsBetter && percentile >= 50) || (!higherIsBetter && percentile < 50)) {
      return (
        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }
    
    return (
      <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">{metric.name}</h3>
        {percentile !== undefined && showPercentile && (
          <div className="flex items-center">
            <span className={`text-xs font-semibold ${getPercentileColor(percentile)}`}>
              {percentile}%
            </span>
            {renderTrendIcon(percentile)}
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <p className="text-2xl font-bold text-gray-900">{formattedValue}</p>
      </div>
      
      {metric.description && (
        <div className="mt-2">
          <p className="text-xs text-gray-500">{metric.description}</p>
        </div>
      )}
    </div>
  );
};

export default MetricCard;