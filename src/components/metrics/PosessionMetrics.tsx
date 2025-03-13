import React, { useState } from 'react';
import { ChartContainer, BarChart, LineChart } from '@/components/charts';
import { useComparativeMetricsBarData, useMatchMetricsLineData } from '@/hooks';
import type { TeamMetrics, ComparativeMetrics, MatchMetrics } from '@/types';

interface PossessionMetricsProps {
  /**
   * Team metrics data
   */
  metrics: TeamMetrics | null;
  
  /**
   * Comparative metrics for league context
   */
  comparativeMetrics?: ComparativeMetrics | null;
  
  /**
   * Match metrics for trend analysis
   */
  matchMetrics?: MatchMetrics[] | null;
  
  /**
   * Loading state
   */
  loading?: boolean;
  
  /**
   * Error state
   */
  error?: Error | null;
  
  /**
   * Function to refresh data
   */
  onRefresh?: () => void;
  
  /**
   * Team name
   */
  teamName?: string;
  
  /**
   * League name
   */
  leagueName?: string;
  
  /**
   * Class name
   */
  className?: string;
}

/**
 * Component that visualizes possession and build-up metrics
 */
const PossessionMetrics: React.FC<PossessionMetricsProps> = ({
  metrics,
  comparativeMetrics = null,
  matchMetrics = null,
  loading = false,
  error = null,
  onRefresh,
  teamName = 'Team',
  leagueName = 'League',
  className = '',
}) => {
  // View mode for the main metrics chart
  const [viewMode, setViewMode] = useState<'comparative' | 'trend'>('comparative');
  
  // Possession metrics to display
  const possessionMetricKeys = [
    'possession.possessionPercentage',
    'possession.passCompletionRate',
    'possession.progressivePassesPerMatch',
    'possession.fieldTiltPercentage'
  ];
  
  // Build-up metrics to display
  const buildUpMetricKeys = [
    'possession.averageBuildUpTime',
    'possession.passingSequencesOver5',
    'possession.ppda',
    'possession.directnessIndex'
  ];
  
  // Selected metric for trend view
  const [selectedTrendMetric, setSelectedTrendMetric] = useState('possession.possessionPercentage');
  
  // Prepare data for comparative bar chart
  const possessionComparativeData = useComparativeMetricsBarData(comparativeMetrics, possessionMetricKeys);
  const buildUpComparativeData = useComparativeMetricsBarData(comparativeMetrics, buildUpMetricKeys);
  
  // Prepare data for trend line chart
  const trendData = useMatchMetricsLineData(matchMetrics, selectedTrendMetric);
  
  // Format y-axis tick values
  const formatYAxisTick = (value: number, metricKey: string) => {
    if (metricKey.includes('Percentage') || metricKey === 'possession.passCompletionRate') {
      return `${value}%`;
    }
    return value.toFixed(1);
  };
  
  // Map metric keys to display names
  const metricDisplayNames: Record<string, string> = {
    'possession.possessionPercentage': 'Possession %',
    'possession.passCompletionRate': 'Pass Completion %',
    'possession.progressivePassesPerMatch': 'Progressive Passes',
    'possession.fieldTiltPercentage': 'Field Tilt %',
    'possession.averageBuildUpTime': 'Build-up Time (sec)',
    'possession.passingSequencesOver5': 'Long Passing Sequences',
    'possession.ppda': 'PPDA (Pressing)',
    'possession.directnessIndex': 'Directness Index'
  };
  
  // Helper function to get metric display name
  const getMetricDisplayName = (key: string) => metricDisplayNames[key] || key;
  
  // Bar chart data keys for comparative view
  const comparativeDataKeys = [
    { key: 'value', name: teamName, color: '#0ea5e9' },
    { key: 'leagueAverage', name: `${leagueName} Average`, color: '#94a3b8' }
  ];
  
  // Line chart data keys for trend view
  const trendDataKeys = [
    { key: 'value', name: getMetricDisplayName(selectedTrendMetric), color: '#0ea5e9' }
  ];
  
  // Create tooltip formatter
  const tooltipFormatter = (value: number, name: string) => {
    // Format based on metric type
    if (selectedTrendMetric.includes('Percentage') || 
        selectedTrendMetric === 'possession.passCompletionRate') {
      return [`${value.toFixed(1)}%`, name];
    }
    return [value.toFixed(2), name];
  };
  
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Main Metrics Chart */}
      <ChartContainer
        title="Possession & Build-up Analysis"
        description={viewMode === 'comparative' 
          ? `How ${teamName} compares to the ${leagueName} average` 
          : `Recent trends in key possession metrics`}
        loading={loading}
        error={error}
        onRefresh={onRefresh}
        availableTypes={[
          { value: 'comparative', label: 'Comparative' },
          { value: 'trend', label: 'Trends' }
        ]}
        currentType={viewMode}
        onTypeChange={(type) => setViewMode(type as 'comparative' | 'trend')}
        minHeight={400}
      >
        {viewMode === 'comparative' ? (
          <div className="h-64">
            <BarChart
              data={possessionComparativeData}
              dataKeys={comparativeDataKeys}
              xAxisKey="name"
              yAxisTickFormatter={(value) => formatYAxisTick(value, selectedTrendMetric)}
              height={250}
            />
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label htmlFor="trend-metric-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Metric
              </label>
              <select
                id="trend-metric-select"
                value={selectedTrendMetric}
                onChange={(e) => setSelectedTrendMetric(e.target.value)}
                className="max-w-xs rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {[...possessionMetricKeys, ...buildUpMetricKeys].map((key) => (
                  <option key={key} value={key}>
                    {getMetricDisplayName(key)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="h-64">
              {trendData.length > 0 ? (
                <LineChart
                  data={trendData}
                  dataKeys={trendDataKeys}
                  xAxisKey="name"
                  tooltipFormatter={tooltipFormatter}
                  height={250}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-500">No trend data available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </ChartContainer>
      
      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Possession Metrics Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Core Possession Metrics</h3>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/5"></div>
            </div>
          ) : metrics ? (
            <div className="space-y-4">
              <MetricItem 
                label="Possession"
                value={`${metrics.possession.possessionPercentage.toFixed(1)}%`}
                description="Average ball possession percentage"
                isHigherBetter={true}
                leagueAvg={comparativeMetrics?.metrics?.['possession.possessionPercentage']?.leagueAverage}
              />
              
              <MetricItem 
                label="Pass Completion"
                value={`${metrics.possession.passCompletionRate.toFixed(1)}%`}
                description="Percentage of successful passes"
                isHigherBetter={true}
                leagueAvg={comparativeMetrics?.metrics?.['possession.passCompletionRate']?.leagueAverage}
              />
              
              <MetricItem 
                label="Progressive Passes"
                value={metrics.possession.progressivePassesPerMatch.toFixed(1)}
                description="Passes that move the ball substantially forward"
                isHigherBetter={true}
                leagueAvg={comparativeMetrics?.metrics?.['possession.progressivePassesPerMatch']?.leagueAverage}
              />
              
              <MetricItem 
                label="Field Tilt"
                value={`${metrics.possession.fieldTiltPercentage.toFixed(1)}%`}
                description="Percentage of possession in the attacking third"
                isHigherBetter={true}
                leagueAvg={comparativeMetrics?.metrics?.['possession.fieldTiltPercentage']?.leagueAverage}
              />
            </div>
          ) : (
            <div className="text-gray-500 italic">No possession metrics available</div>
          )}
        </div>
        
        {/* Build-up Metrics Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Build-up & Pressing Metrics</h3>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/5"></div>
            </div>
          ) : metrics ? (
            <div className="space-y-4">
              <MetricItem 
                label="Build-up Time"
                value={`${metrics.possession.averageBuildUpTime.toFixed(1)} sec`}
                description="Average duration of possession sequences"
                isHigherBetter={null}
                leagueAvg={comparativeMetrics?.metrics?.['possession.averageBuildUpTime']?.leagueAverage}
              />
              
              <MetricItem 
                label="Long Sequences"
                value={metrics.possession.passingSequencesOver5.toFixed(1)}
                description="Number of sequences with 5+ passes per match"
                isHigherBetter={true}
                leagueAvg={comparativeMetrics?.metrics?.['possession.passingSequencesOver5']?.leagueAverage}
              />
              
              <MetricItem 
                label="PPDA"
                value={metrics.possession.ppda.toFixed(2)}
                description="Passes allowed per defensive action (pressing intensity)"
                isHigherBetter={false}
                leagueAvg={comparativeMetrics?.metrics?.['possession.ppda']?.leagueAverage}
              />
              
              <MetricItem 
                label="Directness Index"
                value={metrics.possession.directnessIndex.toFixed(1)}
                description="Measure of how directly the team plays (higher = more direct)"
                isHigherBetter={null}
                leagueAvg={comparativeMetrics?.metrics?.['possession.directnessIndex']?.leagueAverage}
              />
            </div>
          ) : (
            <div className="text-gray-500 italic">No build-up metrics available</div>
          )}
        </div>
      </div>
      
      {/* Play Style Insights */}
      {metrics && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Possession Style Insights</h3>
          
          <div className="prose prose-sm">
            <p>
              {generatePossessionInsights(metrics, teamName)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Component for displaying an individual metric with comparison
 */
interface MetricItemProps {
  label: string;
  value: string | number;
  description: string;
  isHigherBetter: boolean | null; // null for neutral metrics
  leagueAvg?: number;
}

const MetricItem: React.FC<MetricItemProps> = ({
  label,
  value,
  description,
  isHigherBetter,
  leagueAvg,
}) => {
  // Determine if value is better than league average
  const isBetterThanAvg = (): boolean | null => {
    if (leagueAvg === undefined || isHigherBetter === null) return null;
    
    // Extract numeric part from value if it's a string
    const numericValue = typeof value === 'string' 
      ? parseFloat(value.replace(/[^0-9.]/g, '')) 
      : value;
    
    return isHigherBetter 
      ? numericValue > leagueAvg 
      : numericValue < leagueAvg;
  };
  
  const comparisonResult = isBetterThanAvg();
  
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        <div className="flex items-center">
          <span className="text-sm font-semibold text-gray-900">{value}</span>
          
          {comparisonResult !== null && (
            <span className={`ml-2 text-xs font-medium rounded-full px-2 py-0.5 ${
              comparisonResult 
                ? 'bg-green-100 text-green-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {comparisonResult ? 'Above Avg' : 'Below Avg'}
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-500">{description}</p>
      
      {leagueAvg !== undefined && (
        <div className="mt-1 text-xs text-gray-500">
          League avg: {typeof value === 'string' && value.includes('%') 
            ? `${leagueAvg.toFixed(1)}%` 
            : leagueAvg.toFixed(2)}
        </div>
      )}
    </div>
  );
};

/**
 * Generate insights about possession style
 */
function generatePossessionInsights(metrics: TeamMetrics, teamName: string): string {
  const { possession } = metrics;
  
  // High possession, high pass completion
  if (possession.possessionPercentage > 60 && possession.passCompletionRate > 85) {
    return `${teamName} is a strong possession-oriented team with excellent ball retention (${possession.possessionPercentage.toFixed(1)}%) and passing accuracy (${possession.passCompletionRate.toFixed(1)}%). The team patiently builds attacks through sustained possession, using ${possession.progressivePassesPerMatch.toFixed(1)} progressive passes per match to advance up the field. With a field tilt of ${possession.fieldTiltPercentage.toFixed(1)}%, they maintain significant territorial advantage in the opponent's third.`;
  }
  
  // High possession, low directness
  if (possession.possessionPercentage > 55 && possession.directnessIndex < 45) {
    return `${teamName} employs a patient possession approach (${possession.possessionPercentage.toFixed(1)}%) with a low directness index of ${possession.directnessIndex.toFixed(1)}. The team prefers to build gradually through short passing combinations, averaging ${possession.passingSequencesOver5.toFixed(1)} extended passing sequences per match. This controlled approach allows them to maintain positional balance while looking for openings in the opponent's defense.`;
  }
  
  // Low possession, high directness
  if (possession.possessionPercentage < 45 && possession.directnessIndex > 60) {
    return `${teamName} adopts a direct approach to attacking play with relatively low possession (${possession.possessionPercentage.toFixed(1)}%) but a high directness index of ${possession.directnessIndex.toFixed(1)}. The team prioritizes vertical progression over ball circulation, with shorter build-up times of ${possession.averageBuildUpTime.toFixed(1)} seconds on average. This suggests a counter-attacking or direct play style that aims to reach the opponent's goal quickly rather than through sustained possession.`;
  }
  
  // Strong pressing team
  if (possession.ppda < 8) {
    return `${teamName} exhibits an aggressive pressing style with a PPDA (Passes Per Defensive Action) of just ${possession.ppda.toFixed(2)}, indicating intense pressure on opponents. Despite having ${possession.possessionPercentage.toFixed(1)}% possession, the team's defensive approach is proactive, aiming to win the ball high up the pitch. This pressing approach is complemented by a field tilt of ${possession.fieldTiltPercentage.toFixed(1)}%, showing their territorial dominance even without the ball.`;
  }
  
  // Balanced approach
  return `${teamName} shows a balanced approach to possession, maintaining ${possession.possessionPercentage.toFixed(1)}% of the ball with a pass completion rate of ${possession.passCompletionRate.toFixed(1)}%. The team's build-up is neither overly patient nor excessively direct, with a directness index of ${possession.directnessIndex.toFixed(1)} and average build-up sequences lasting ${possession.averageBuildUpTime.toFixed(1)} seconds. Their PPDA of ${possession.ppda.toFixed(2)} indicates a moderate pressing intensity that adapts to different game situations.`;
}

export default PossessionMetrics;