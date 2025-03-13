/**
 * Team Comparison component
 * Displays side-by-side comparison of two teams' play styles
 */

import React, { useState } from 'react';
import useTeamMetrics from '../../hooks/useTeamMetrics';
import { MetricId, METRICS, formatMetricValue } from '../../config/metrics';
import { PLAY_STYLE_CATEGORIES } from '../../config/constants';
import ResultFilter from '../filters/ResultFilter';
import { MatchResult } from '../../services/mock-data';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

type TeamComparisonProps = {
  teamId: string;
  compareTeamId: string;
};

// Custom tooltip for bar charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || payload.length === 0) return null;
  
  const metricId = label as MetricId;
  const metric = METRICS[metricId];
  
  if (!metric) return null;
  
  return (
    <div className="custom-tooltip bg-white p-3 border border-gray-200 shadow-md rounded-md">
      <p className="font-medium">{metric.name}</p>
      {payload.map((entry: any, index: number) => (
        <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {formatMetricValue(metricId, entry.value)}
        </p>
      ))}
      <p className="text-xs mt-1 text-gray-500">{metric.description}</p>
    </div>
  );
};

const TeamComparison: React.FC<TeamComparisonProps> = ({ teamId, compareTeamId }) => {
  const [selectedResult, setSelectedResult] = useState<MatchResult>('all');
  const [selectedCategory, setSelectedCategory] = useState(PLAY_STYLE_CATEGORIES[0].id);
  const [showRadar, setShowRadar] = useState(true);

  // Get data for both teams
  const teamA = useTeamMetrics({ teamId, defaultResult: selectedResult });
  const teamB = useTeamMetrics({ teamId: compareTeamId, defaultResult: selectedResult });

  // Check if we have valid data for both teams
  if (!teamA.teamInfo || !teamB.teamInfo) {
    return (
      <div className="rounded-lg bg-yellow-50 p-4 text-yellow-700">
        <p>Unable to load comparison data for one or both teams.</p>
      </div>
    );
  }

  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  // Get metrics for the selected category
  const categoryMetrics = PLAY_STYLE_CATEGORIES.find(
    category => category.id === selectedCategory
  )?.metrics || [];

  // Prepare comparison data for bar chart
  const barChartData = categoryMetrics.map(metricId => {
    const valueA = teamA.getMetricValue(metricId) || 0;
    const valueB = teamB.getMetricValue(metricId) || 0;
    
    return {
      metricId,
      [teamA.teamInfo!.shortName]: valueA,
      [teamB.teamInfo!.shortName]: valueB,
    };
  });

  // Prepare radar chart data
  const radarMetrics = categoryMetrics.filter(metricId => 
    METRICS[metricId]?.includeInPlayStyleRadar
  );
  
  const radarData = radarMetrics.map(metricId => {
    const valueA = teamA.getMetricValue(metricId) || 0;
    const valueB = teamB.getMetricValue(metricId) || 0;
    const percentileA = teamA.getMetricPercentile(metricId) || 0;
    const percentileB = teamB.getMetricPercentile(metricId) || 0;
    
    return {
      metricId,
      name: METRICS[metricId]?.name || metricId,
      [teamA.teamInfo!.shortName]: percentileA,
      [teamB.teamInfo!.shortName]: percentileB,
      rawA: valueA,
      rawB: valueB,
    };
  });

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          {teamA.teamInfo.name} vs. {teamB.teamInfo.name}
        </h2>
        <ResultFilter
          selectedResult={selectedResult}
          onChange={setSelectedResult}
        />
      </div>

      {/* Team headers with logos */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="flex items-center rounded-lg border border-primary-100 bg-primary-50 p-4">
          <img
            src={teamA.teamInfo.logoUrl}
            alt={`${teamA.teamInfo.name} logo`}
            className="mr-4 h-16 w-16 object-contain"
          />
          <div>
            <h3 className="text-lg font-medium text-primary-800">{teamA.teamInfo.name}</h3>
            <div className="flex items-center text-sm text-primary-600">
              <span className="mr-2 inline-block h-3 w-3 rounded-full bg-primary-500"></span>
              Primary team
            </div>
          </div>
        </div>
        
        <div className="flex items-center rounded-lg border border-secondary-100 bg-secondary-50 p-4">
          <img
            src={teamB.teamInfo.logoUrl}
            alt={`${teamB.teamInfo.name} logo`}
            className="mr-4 h-16 w-16 object-contain"
          />
          <div>
            <h3 className="text-lg font-medium text-secondary-800">{teamB.teamInfo.name}</h3>
            <div className="flex items-center text-sm text-secondary-600">
              <span className="mr-2 inline-block h-3 w-3 rounded-full bg-secondary-500"></span>
              Comparison team
            </div>
          </div>
        </div>
      </div>

      {/* Category selector and chart toggle */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="sm:w-1/2">
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
        
        <div className="flex items-center sm:ml-auto">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio h-4 w-4 text-primary-600"
              checked={showRadar}
              onChange={() => setShowRadar(true)}
            />
            <span className="ml-2 text-sm text-gray-700">Radar Chart</span>
          </label>
          <label className="ml-4 inline-flex items-center">
            <input
              type="radio"
              className="form-radio h-4 w-4 text-primary-600"
              checked={!showRadar}
              onChange={() => setShowRadar(false)}
            />
            <span className="ml-2 text-sm text-gray-700">Bar Chart</span>
          </label>
        </div>
      </div>

      {/* Visualization */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-800">
          {PLAY_STYLE_CATEGORIES.find(c => c.id === selectedCategory)?.name} Comparison
        </h3>
        
        {showRadar && radarData.length > 0 ? (
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name={teamA.teamInfo.name}
                  dataKey={teamA.teamInfo.shortName}
                  stroke="#0ea5e9"
                  fill="#0ea5e9"
                  fillOpacity={0.5}
                />
                <Radar
                  name={teamB.teamInfo.name}
                  dataKey={teamB.teamInfo.shortName}
                  stroke="#64748b"
                  fill="#64748b"
                  fillOpacity={0.5}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="metricId" 
                  tickFormatter={(metricId) => METRICS[metricId]?.name || metricId}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey={teamA.teamInfo.shortName} 
                  name={teamA.teamInfo.name} 
                  fill="#0ea5e9" 
                />
                <Bar 
                  dataKey={teamB.teamInfo.shortName} 
                  name={teamB.teamInfo.name} 
                  fill="#64748b" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        
        <p className="mt-4 text-sm text-gray-500">
          {showRadar ? 
            'The radar chart shows percentile rankings within the Premier League (higher is better).' : 
            'The bar chart shows actual metric values for direct comparison.'
          }
        </p>
      </div>

      {/* Key differences and similarities */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-800">
          Key Differences & Similarities
        </h3>
        
        <div className="space-y-4">
          {categoryMetrics.map(metricId => {
            const metric = METRICS[metricId];
            if (!metric) return null;
            
            const valueA = teamA.getMetricValue(metricId) || 0;
            const valueB = teamB.getMetricValue(metricId) || 0;
            
            // Calculate difference percentage
            const avg = (valueA + valueB) / 2;
            const diffPercent = avg === 0 ? 0 : Math.abs(valueA - valueB) / avg * 100;
            
            // Skip metrics with minimal differences
            if (diffPercent < 5) return null;
            
            const isDifferent = diffPercent > 20;
            
            // Determine which team is better for this metric
            let comparisonText = '';
            if (isDifferent) {
              if (metric.higherIsBetter === null) {
                // For neutral metrics, just state the difference
                comparisonText = valueA > valueB
                  ? `${teamA.teamInfo.name} has a higher ${metric.name.toLowerCase()} than ${teamB.teamInfo.name}.`
                  : `${teamB.teamInfo.name} has a higher ${metric.name.toLowerCase()} than ${teamA.teamInfo.name}.`;
              } else if (metric.higherIsBetter) {
                // For metrics where higher is better
                comparisonText = valueA > valueB
                  ? `${teamA.teamInfo.name} is better at ${metric.name.toLowerCase()} than ${teamB.teamInfo.name}.`
                  : `${teamB.teamInfo.name} is better at ${metric.name.toLowerCase()} than ${teamA.teamInfo.name}.`;
              } else {
                // For metrics where lower is better
                comparisonText = valueA < valueB
                  ? `${teamA.teamInfo.name} is better at ${metric.name.toLowerCase()} than ${teamB.teamInfo.name}.`
                  : `${teamB.teamInfo.name} is better at ${metric.name.toLowerCase()} than ${teamA.teamInfo.name}.`;
              }
            }
            
            return (
              <div key={metricId} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800">{metric.name}</h4>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                    isDifferent ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {isDifferent ? 'Different' : 'Similar'}
                  </span>
                </div>
                
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{teamA.teamInfo.name}</p>
                    <p className="text-lg font-bold text-primary-700">
                      {formatMetricValue(metricId, valueA)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{teamB.teamInfo.name}</p>
                    <p className="text-lg font-bold text-secondary-700">
                      {formatMetricValue(metricId, valueB)}
                    </p>
                  </div>
                </div>
                
                {isDifferent && (
                  <p className="mt-2 text-sm text-gray-600">{comparisonText}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeamComparison;