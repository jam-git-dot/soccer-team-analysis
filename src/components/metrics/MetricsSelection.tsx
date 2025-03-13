/**
 * Metrics Section component
 * Displays a section of related metrics with title and description
 */

import React from 'react';
import MetricCard from './MetricCard';
import MetricsBarChart from '../charts/MetricsBarChart';
import PlayStyleRadarChart from '../charts/PlayStyleRadarChart';
import { MetricId, METRICS } from '../../config/metrics';

export type MetricDisplay = {
  metricId: MetricId;
  value: number;
  percentile?: number;
};

type VisualizationType = 'cards' | 'bar-chart' | 'radar-chart';

type MetricsSectionProps = {
  title: string;
  description?: string;
  metrics: MetricDisplay[];
  visualizationType?: VisualizationType;
  cardColumns?: 1 | 2 | 3 | 4;
  className?: string;
  teamName?: string;
};

const MetricsSection: React.FC<MetricsSectionProps> = ({
  title,
  description,
  metrics,
  visualizationType = 'cards',
  cardColumns = 3,
  className = '',
  teamName,
}) => {
  // Check if we have valid metrics to display
  if (!metrics || metrics.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="mt-2 text-gray-500">No metrics data available.</p>
      </div>
    );
  }

  // Get column classes based on cardColumns
  const getColumnClasses = () => {
    switch (cardColumns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  // Render content based on visualization type
  const renderVisualization = () => {
    switch (visualizationType) {
      case 'cards':
        return (
          <div className={`mt-4 grid gap-4 ${getColumnClasses()}`}>
            {metrics.map((metric) => (
              <MetricCard
                key={metric.metricId}
                metricId={metric.metricId}
                value={metric.value}
                percentile={metric.percentile}
              />
            ))}
          </div>
        );
      
      case 'bar-chart':
        return (
          <div className="mt-4">
            <MetricsBarChart
              data={metrics}
              height={Math.max(300, metrics.length * 40)}
              layout={metrics.length > 5 ? 'vertical' : 'horizontal'}
            />
          </div>
        );
      
      case 'radar-chart':
        return (
          <div className="mt-4">
            <PlayStyleRadarChart
              data={metrics}
              teamName={teamName}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      {description && <p className="mt-2 text-gray-500">{description}</p>}
      
      {renderVisualization()}
    </div>
  );
};

export default MetricsSection;