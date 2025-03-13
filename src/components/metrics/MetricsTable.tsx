/**
 * Metrics Table component
 * Displays metrics in a concise, interactive table format
 */

import React, { useState } from 'react';
import { MetricId, METRICS, formatMetricValue, isHigherBetter } from '../../config/metrics';

type MetricTableProps = {
  metrics: Array<{
    metricId: MetricId;
    value: number;
    percentile?: number;
  }>;
  className?: string;
  showPercentiles?: boolean;
};

const MetricsTable: React.FC<MetricTableProps> = ({
  metrics,
  className = '',
  showPercentiles = true,
}) => {
  const [hoveredRow, setHoveredRow] = useState<MetricId | null>(null);

  // Get percentile color class
  const getPercentileColorClass = (percentile: number): string => {
    if (percentile >= 80) return 'text-green-600';
    if (percentile >= 60) return 'text-green-500';
    if (percentile >= 40) return 'text-yellow-500';
    if (percentile >= 20) return 'text-orange-500';
    return 'text-red-500';
  };

  // Render trend icon based on whether higher is better
  const renderTrendIcon = (metricId: MetricId, percentile: number) => {
    const higherIsBetter = isHigherBetter(metricId);
    
    if (higherIsBetter === null) return null;
    
    if ((higherIsBetter && percentile >= 50) || (!higherIsBetter && percentile < 50)) {
      return (
        <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }
    
    return (
      <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className={`overflow-hidden rounded-lg border border-gray-200 ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Metric
            </th>
            <th 
              scope="col" 
              className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Value
            </th>
            {showPercentiles && (
              <th 
                scope="col" 
                className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Percentile
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {metrics.map((metric) => {
            const metricDefinition = METRICS[metric.metricId];
            if (!metricDefinition) return null;
            
            const isHovered = hoveredRow === metric.metricId;
            
            return (
              <tr 
                key={metric.metricId}
                onMouseEnter={() => setHoveredRow(metric.metricId)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`${isHovered ? 'bg-blue-50' : ''} transition-colors duration-150 cursor-pointer`}
              >
                <td className="px-3 py-2 text-sm">
                  <div className="font-medium text-gray-900">{metricDefinition.name}</div>
                  {isHovered && (
                    <div className="text-xs text-gray-500 max-w-xs">{metricDefinition.description}</div>
                  )}
                </td>
                <td className="px-3 py-2 text-sm text-right">
                  <span className="font-semibold">{formatMetricValue(metric.metricId, metric.value)}</span>
                </td>
                {showPercentiles && metric.percentile !== undefined && (
                  <td className="px-3 py-2 text-sm text-right">
                    <div className="flex items-center justify-end">
                      <span className={`font-semibold ${getPercentileColorClass(metric.percentile)}`}>
                        {metric.percentile}%
                      </span>
                      <span className="ml-1">{renderTrendIcon(metric.metricId, metric.percentile)}</span>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MetricsTable;