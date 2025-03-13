/**
 * League Dashboard component
 * Displays how a team compares to other teams in the league
 */

import React, { useState } from 'react';
import useLeagueMetrics from '../../hooks/useLeagueMetrics';
import { PLAY_STYLE_CATEGORIES } from '../../config/constants';
import { MetricId, METRICS } from '../../config/metrics';
import ResultFilter from '../filters/ResultFilter';
import TeamRanking from '../league/TeamRanking';
import LeagueMetricsChart from '../charts/LeagueMetricsChart';
import { MatchResult } from '../../services/mock-data';

type LeagueDashboardProps = {
  teamId: string;
};

const LeagueDashboard: React.FC<LeagueDashboardProps> = ({ teamId }) => {
  const [selectedResult, setSelectedResult] = useState<MatchResult>('all');
  const [selectedCategory, setSelectedCategory] = useState(PLAY_STYLE_CATEGORIES[0].id);
  const [selectedMetric, setSelectedMetric] = useState<MetricId | null>(null);
  
  const { 
    teamInfo, 
    allTeams,
    getMetricComparisonData,
    getTeamRank,
    getTopTeamsForMetric,
    getCategoryAverages
  } = useLeagueMetrics({ teamId, result: selectedResult });

  // If no team is selected, show a message
  if (!teamInfo) {
    return (
      <div className="rounded-lg bg-yellow-50 p-4 text-yellow-700">
        <p>Please select a team to view league comparisons.</p>
      </div>
    );
  }

  // Get the metrics for the selected category
  const categoryMetrics = PLAY_STYLE_CATEGORIES.find(
    category => category.id === selectedCategory
  )?.metrics || [];

  // If no metric is selected, default to the first one in the category
  const effectiveSelectedMetric = selectedMetric || categoryMetrics[0];
  
  // Get comparison data for the selected metric
  const metricComparisonData = effectiveSelectedMetric 
    ? getMetricComparisonData(effectiveSelectedMetric)
    : [];
  
  // Get team rank for selected metric
  const teamRank = effectiveSelectedMetric 
    ? getTeamRank(effectiveSelectedMetric)
    : 0;
  
  // Get category averages
  const categoryAverages = getCategoryAverages(selectedCategory);
  
  // Get selected metric details
  const selectedMetricDetails = effectiveSelectedMetric 
    ? METRICS[effectiveSelectedMetric]
    : null;

  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    
    // Reset selected metric when category changes
    setSelectedMetric(null);
  };

  // Handle metric selection
  const handleMetricChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMetric(e.target.value as MetricId);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          {teamInfo.name} in the Premier League
        </h2>
        <ResultFilter
          selectedResult={selectedResult}
          onChange={setSelectedResult}
        />
      </div>

      {/* Key metrics overview */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {['possession_percentage', 'expected_goals', 'pressing_intensity', 'defensive_duels_won'].map(metricId => {
          const comparisonData = getMetricComparisonData(metricId as MetricId);
          const teamData = comparisonData.find(data => data.teamId === teamId);
          
          if (!teamData) return null;
          
          return (
            <TeamRanking
              key={metricId}
              metricId={metricId as MetricId}
              teamId={teamId}
              teamName={teamInfo.name}
              value={teamData.value}
              rank={teamData.rank}
              totalTeams={allTeams.length}
              percentile={teamData.percentile}
            />
          );
        })}
      </div>

      {/* Metric category selector */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="category-select" className="block text-sm font-medium text-gray-700">
            Metric Category
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          >
            {PLAY_STYLE_CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="metric-select" className="block text-sm font-medium text-gray-700">
            Specific Metric
          </label>
          <select
            id="metric-select"
            value={effectiveSelectedMetric}
            onChange={handleMetricChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          >
            {categoryMetrics.map(metricId => (
              <option key={metricId} value={metricId}>
                {METRICS[metricId]?.name || metricId}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* League comparison chart */}
      {metricComparisonData.length > 0 && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-800">
            {selectedMetricDetails?.name || 'Metric'} - League Comparison
          </h3>
          {selectedMetricDetails && (
            <p className="mb-4 text-sm text-gray-500">
              {selectedMetricDetails.description}
            </p>
          )}
          <LeagueMetricsChart
            metricId={effectiveSelectedMetric}
            data={metricComparisonData}
            highlightedTeamId={teamId}
            height={500}
          />
        </div>
      )}

      {/* Category averages */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-800">
          {PLAY_STYLE_CATEGORIES.find(c => c.id === selectedCategory)?.name} - 
          Comparison to League Average
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Metric
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Team Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  League Avg
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Difference
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {categoryMetrics.map(metricId => {
                const metric = METRICS[metricId];
                const data = categoryAverages[metricId];
                
                if (!metric || !data) return null;
                
                // Determine if the difference is positive or negative based on whether higher is better
                const isPositiveDiff = metric.higherIsBetter === false
                  ? data.difference < 0 
                  : data.difference > 0;
                
                // Neutral if higherIsBetter is null
                const diffClass = metric.higherIsBetter === null
                  ? 'text-gray-500'
                  : isPositiveDiff 
                    ? 'text-green-600' 
                    : 'text-red-600';
                
                const diffPrefix = data.difference > 0 ? '+' : '';
                
                return (
                  <tr key={metricId}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {metric.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {metric.format.decimals === 0 
                        ? Math.round(data.teamValue) 
                        : data.teamValue.toFixed(metric.format.decimals)
                      }
                      {metric.format.suffix || ''}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {metric.format.decimals === 0 
                        ? Math.round(data.leagueAvg) 
                        : data.leagueAvg.toFixed(metric.format.decimals)
                      }
                      {metric.format.suffix || ''}
                    </td>
                    <td className={`whitespace-nowrap px-6 py-4 text-sm font-medium ${diffClass}`}>
                      {diffPrefix}
                      {metric.format.decimals === 0 
                        ? Math.round(data.difference) 
                        : data.difference.toFixed(metric.format.decimals)
                      }
                      {metric.format.suffix || ''}
                      {' '}
                      ({diffPrefix}{data.percentDifference.toFixed(1)}%)
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeagueDashboard;