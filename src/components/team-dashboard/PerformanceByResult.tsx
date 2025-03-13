import React, { useState, useCallback } from 'react';
import { ChartContainer, BarChart } from '@/components/charts';
import { useMetricsByResultBarData } from '@/hooks';
import type { TeamMetrics } from '@/types';

interface PerformanceByResultProps {
  /**
   * Metrics grouped by match result
   */
  metricsByResult: {
    win: Partial<TeamMetrics>;
    draw: Partial<TeamMetrics>;
    loss: Partial<TeamMetrics>;
  } | null;
  
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
   * Class name
   */
  className?: string;
}

/**
 * Component that visualizes how team performance varies across different match results
 */
const PerformanceByResult: React.FC<PerformanceByResultProps> = ({
  metricsByResult,
  loading = false,
  error = null,
  onRefresh,
  className = '',
}) => {
  // Selected metric category and specific metric
  const [selectedCategory, setSelectedCategory] = useState<string>('possession');
  const [selectedMetric, setSelectedMetric] = useState<string>('possessionPercentage');
  
  // Full metric key (category.metric)
  const metricKey = `${selectedCategory}.${selectedMetric}`;
  
  // Convert metrics data for the bar chart
  const chartData = useMetricsByResultBarData(metricsByResult, metricKey);
  
  // Define available metrics per category
  const metricOptions = {
    possession: [
      { value: 'possessionPercentage', label: 'Possession %' },
      { value: 'passCompletionRate', label: 'Pass Completion %' },
      { value: 'progressivePassesPerMatch', label: 'Progressive Passes' },
      { value: 'ppda', label: 'PPDA (Pressing)' },
    ],
    attacking: [
      { value: 'goalsPerMatch', label: 'Goals' },
      { value: 'xGPerMatch', label: 'Expected Goals (xG)' },
      { value: 'shotsPerMatch', label: 'Shots' },
      { value: 'bigChancesCreatedPerMatch', label: 'Big Chances Created' },
    ],
    defensive: [
      { value: 'goalsAgainstPerMatch', label: 'Goals Against' },
      { value: 'xGAgainstPerMatch', label: 'Expected Goals Against (xGA)' },
      { value: 'tacklesPerMatch', label: 'Tackles' },
      { value: 'interceptionPerMatch', label: 'Interceptions' },
    ],
    tempo: [
      { value: 'directPlayIndex', label: 'Direct Play Index' },
      { value: 'transitionSpeedAttacking', label: 'Attacking Transition Speed' },
      { value: 'counterPressAfterLoss', label: 'Counter-Press Intensity' },
      { value: 'verticalityIndex', label: 'Verticality Index' },
    ],
  };
  
  // Handle category change
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    // Select the first metric in the new category
    setSelectedMetric(metricOptions[category as keyof typeof metricOptions][0].value);
  }, [metricOptions]);
  
  // Bar chart data keys
  const dataKeys = [
    { key: 'value', name: getMetricLabel(selectedCategory, selectedMetric), color: '#0ea5e9' },
  ];
  
  // Y-axis formatter based on selected metric
  const yAxisFormatter = useCallback((value: number) => {
    if (selectedMetric === 'possessionPercentage' || selectedMetric === 'passCompletionRate') {
      return `${value}%`;
    }
    return value.toFixed(1);
  }, [selectedMetric]);
  
  // Helper function to get a readable metric label
  function getMetricLabel(category: string, metric: string): string {
    const options = metricOptions[category as keyof typeof metricOptions] || [];
    const option = options.find(opt => opt.value === metric);
    return option?.label || metric;
  }
  
  // Get description text based on selected metric
  const getMetricDescription = (): string => {
    switch (metricKey) {
      case 'possession.possessionPercentage':
        return 'Ball possession percentage across different match results';
      case 'possession.passCompletionRate':
        return 'Percentage of successful passes across different match results';
      case 'possession.progressivePassesPerMatch':
        return 'Passes that move the ball substantially closer to the opponent\'s goal';
      case 'possession.ppda':
        return 'Passes Per Defensive Action - lower values indicate more intense pressing';
      case 'attacking.goalsPerMatch':
        return 'Average goals scored per match across different match results';
      case 'attacking.xGPerMatch':
        return 'Expected Goals (xG) per match - the quality of chances created';
      case 'attacking.shotsPerMatch':
        return 'Average shots taken per match across different match results';
      case 'attacking.bigChancesCreatedPerMatch':
        return 'High-quality goal-scoring opportunities created per match';
      case 'defensive.goalsAgainstPerMatch':
        return 'Average goals conceded per match across different match results';
      case 'defensive.xGAgainstPerMatch':
        return 'Expected Goals Against (xGA) per match - the quality of chances conceded';
      case 'defensive.tacklesPerMatch':
        return 'Average tackles per match across different match results';
      case 'defensive.interceptionPerMatch':
        return 'Average interceptions per match across different match results';
      case 'tempo.directPlayIndex':
        return 'Measure of how directly a team plays (higher = more direct)';
      case 'tempo.transitionSpeedAttacking':
        return 'Speed of attacking transitions in seconds (lower = faster)';
      case 'tempo.counterPressAfterLoss':
        return 'Intensity of pressing immediately after losing possession';
      case 'tempo.verticalityIndex':
        return 'Measure of how vertically a team progresses the ball';
      default:
        return 'Performance comparison across different match results';
    }
  };
  
  return (
    <div className={className}>
      <ChartContainer
        title="Performance by Match Result"
        description={getMetricDescription()}
        loading={loading}
        error={error}
        onRefresh={onRefresh}
        minHeight={400}
      >
        {/* Category tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex">
            {Object.keys(metricOptions).map((category) => (
              <button
                key={category}
                className={`mr-4 border-b-2 px-4 py-2 text-sm font-medium ${
                  selectedCategory === category
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Metric selector */}
        <div className="mb-6">
          <div className="w-full md:w-64">
            <label htmlFor="metric-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Metric
            </label>
            <select
              id="metric-select"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {metricOptions[selectedCategory as keyof typeof metricOptions].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-64">
          {chartData.length > 0 ? (
            <BarChart
              data={chartData}
              dataKeys={dataKeys}
              xAxisKey="name"
              yAxisLabel={getMetricLabel(selectedCategory, selectedMetric)}
              yAxisTickFormatter={yAxisFormatter}
              height={250}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">No data available for this metric</p>
            </div>
          )}
        </div>
        
        {/* Insights */}
        {chartData.length > 0 && (
          <div className="mt-6 border-t border-gray-100 pt-4">
            <h4 className="text-sm font-medium text-gray-900">Key Insights</h4>
            <p className="mt-2 text-sm text-gray-600">
              {generateInsights(chartData, selectedMetric)}
            </p>
          </div>
        )}
      </ChartContainer>
    </div>
  );
};

/**
 * Generate insights about the performance by result data
 */
function generateInsights(
  data: Array<{name: string; value: number; result: string}>,
  metricKey: string
): string {
  if (!data || data.length === 0) return '';
  
  const winData = data.find(d => d.result === 'win');
  const drawData = data.find(d => d.result === 'draw');
  const lossData = data.find(d => d.result === 'loss');
  
  if (!winData || !drawData || !lossData) {
    return 'Insufficient data to generate insights. Some match results may not have data.';
  }
  
  const winValue = winData.value;
  const drawValue = drawData.value;
  const lossValue = lossData.value;
  
  // For metrics where lower is better
  const isLowerBetter = ['ppda', 'goalsAgainstPerMatch', 'xGAgainstPerMatch', 'transitionSpeedAttacking'].includes(metricKey);
  
  if (isLowerBetter) {
    if (winValue < drawValue && winValue < lossValue) {
      return `The team shows significantly better ${getMetricName(metricKey)} in wins compared to draws and losses, suggesting this metric is closely linked to successful outcomes.`;
    } else if (lossValue < winValue && lossValue < drawValue) {
      return `Interestingly, the team has better ${getMetricName(metricKey)} in losses, which suggests this metric alone isn't determining match outcomes.`;
    } else {
      return `The team's ${getMetricName(metricKey)} doesn't show a clear pattern across different match results, indicating other factors may be more decisive.`;
    }
  } 
  // For metrics where higher is better
  else {
    if (winValue > drawValue && winValue > lossValue) {
      return `The team shows significantly better ${getMetricName(metricKey)} in wins compared to draws and losses, suggesting this metric is closely linked to successful outcomes.`;
    } else if (lossValue > winValue && lossValue > drawValue) {
      return `Interestingly, the team has better ${getMetricName(metricKey)} in losses, which suggests this metric alone isn't determining match outcomes. The team may need to improve in other areas.`;
    } else {
      return `The team's ${getMetricName(metricKey)} doesn't show a clear pattern across different match results, indicating other factors may be more decisive.`;
    }
  }
}

/**
 * Get a readable name for a metric
 */
function getMetricName(metricKey: string): string {
  const metricNames: Record<string, string> = {
    'possessionPercentage': 'possession percentage',
    'passCompletionRate': 'pass completion rate',
    'progressivePassesPerMatch': 'progressive passing',
    'ppda': 'pressing intensity',
    'goalsPerMatch': 'goal scoring',
    'xGPerMatch': 'chance creation quality',
    'shotsPerMatch': 'shot volume',
    'bigChancesCreatedPerMatch': 'big chance creation',
    'goalsAgainstPerMatch': 'defensive solidity',
    'xGAgainstPerMatch': 'chance concession',
    'tacklesPerMatch': 'tackling',
    'interceptionPerMatch': 'interception',
    'directPlayIndex': 'directness of play',
    'transitionSpeedAttacking': 'attacking transition speed',
    'counterPressAfterLoss': 'counter-pressing',
    'verticalityIndex': 'vertical progression',
  };
  
  return metricNames[metricKey] || metricKey;
}

export default PerformanceByResult;
