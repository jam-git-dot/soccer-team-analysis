/**
 * Play Style Dashboard component
 * Main dashboard for displaying team play style analysis
 */

import React, { useState } from 'react';
import useTeamMetrics from '../../hooks/useTeamMetrics';
import ResultFilter from '../filters/ResultFilter';
import MetricsSection, { MetricDisplay } from '../metrics/MetricsSection';
import MetricsTable from '../metrics/MetricsTable';
import PlayStyleRadarChart from '../charts/PlayStyleRadarChart';
import { getPlayStyleRadarMetrics, getMetricsForPlayStyleCategory } from '../../config/metrics';
import { PLAY_STYLE_CATEGORIES } from '../../config/constants';
import MetricCard from '../metrics/MetricCard';

type PlayStyleDashboardProps = {
  teamId: string;
};

const PlayStyleDashboard: React.FC<PlayStyleDashboardProps> = ({ teamId }) => {
  // Ensure valid string for teamId
  const safeTeamId = typeof teamId === 'string' ? teamId : '';
  
  const {
    teamInfo,
    metricsData,
    selectedResult,
    setSelectedResult,
    getCategoryMetrics,
    getMetricsSubset,
    isLoading,
    error
  } = useTeamMetrics({ teamId: safeTeamId });

  // Get metrics for play style radar
  const radarMetrics = getPlayStyleRadarMetrics();
  const radarMetricIds = radarMetrics.map(metric => metric.id);
  const radarData = getMetricsSubset(radarMetricIds);
  
  // Get key performance metrics for summary
  const summaryMetrics = getMetricsSubset([
    'possession_percentage', 
    'expected_goals', 
    'pressing_intensity',
    'defensive_duels_won',
    'pass_completion',
    'counter_attack_frequency'
  ]);
  
  // Debug logs to help identify issues
  console.log("TeamInfo:", teamInfo);
  console.log("MetricsData:", metricsData);
  console.log("RadarData:", radarData);

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <p className="text-lg text-gray-500">Loading team data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        <p className="font-medium">Error loading team data</p>
        <p>{String(error.message)}</p>
      </div>
    );
  }

  // Safety check for team data
  if (!teamInfo || !metricsData) {
    return (
      <div className="rounded-lg bg-yellow-50 p-4 text-yellow-700">
        <p>No data available for this team.</p>
      </div>
    );
  }

  // Safe team name to use in descriptions
  const teamName = String(teamInfo.name || 'Team');

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          {teamName} Play Style Analysis
        </h2>
        <ResultFilter
          selectedResult={selectedResult}
          onChange={setSelectedResult}
        />
      </div>

      {/* Play Style Overview */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MetricsSection
          title="Play Style Overview"
          description="Radar chart showing key metrics that define the team's play style"
          metrics={radarData}
          visualizationType="radar-chart"
          teamName={teamName}
        />
        
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Performance Summary</h3>
            <p className="mb-4 text-sm text-gray-500">
              Key performance metrics compared to other Premier League teams.
              Values shown as percentiles (higher is better).
            </p>
            
            <MetricsTable 
              metrics={summaryMetrics} 
              showPercentiles={true}
            />
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800">Team Style Overview</h3>
            <p className="mt-2 text-gray-600">
              {teamName} plays with a {getPlayStyleDescription(radarData)}.
            </p>
          </div>
        </div>
      </div>
      
      {/* Play Style Categories */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Metric Categories</h3>
        <p className="text-gray-500">
          Detailed metrics organized by play style category
        </p>
      </div>
      
      <div className="space-y-8">
        {PLAY_STYLE_CATEGORIES.map((category) => {
          const categoryMetrics = getCategoryMetrics(category.id);
          
          return (
            <MetricsSection
              key={category.id}
              title={category.name}
              metrics={categoryMetrics}
              visualizationType="bar-chart"
            />
          );
        })}
      </div>
    </div>
  );
};

// Helper function to generate a simple play style description
function getPlayStyleDescription(metrics: MetricDisplay[]): string {
  // This is a simplified version - in a real app, you might want more sophisticated logic
  const possessionMetric = metrics.find(m => m.metricId === 'possession_percentage');
  const pressingMetric = metrics.find(m => m.metricId === 'pressing_intensity');
  const directPlayMetric = metrics.find(m => m.metricId === 'direct_play_vs_possession');
  
  const possessionStyle = possessionMetric && typeof possessionMetric.percentile === 'number'
    ? possessionMetric.percentile > 70 
      ? 'possession-based approach' 
      : possessionMetric.percentile < 30 
        ? 'low-possession style' 
        : 'balanced possession approach'
    : 'balanced possession approach';
    
  const pressingStyle = pressingMetric && typeof pressingMetric.percentile === 'number'
    ? pressingMetric.percentile > 70 
      ? 'high-pressing intensity' 
      : pressingMetric.percentile < 30 
        ? 'low defensive block' 
        : 'mixed defensive approach'
    : 'mixed defensive approach';
    
  const directnessStyle = directPlayMetric && typeof directPlayMetric.value === 'number'
    ? directPlayMetric.value > 70 
      ? 'direct attacking style' 
      : directPlayMetric.value < 30 
        ? 'patient build-up play' 
        : 'balanced attacking approach'
    : 'balanced attacking approach';
  
  return `${possessionStyle}, ${pressingStyle}, and ${directnessStyle}`;
}

export default PlayStyleDashboard;