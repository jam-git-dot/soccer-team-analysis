import React, { useState } from 'react';
import { ChartContainer, BarChart, LineChart } from '@/components/charts';
import { useComparativeMetricsBarData, useMatchMetricsLineData } from '@/hooks';
import type { TeamMetrics, ComparativeMetrics, MatchMetrics } from '@/types';

interface DefensiveMetricsProps {
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
 * Component that visualizes defensive metrics and organization
 */
const DefensiveMetrics: React.FC<DefensiveMetricsProps> = ({
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
  
  // Core defensive metrics to display
  const coreDefensiveMetricKeys = [
    'defensive.goalsAgainstPerMatch',
    'defensive.xGAgainstPerMatch',
    'defensive.cleanSheetPercentage',
    'defensive.defensiveLineHeight'
  ];
  
  // Activity metrics to display
  const activityMetricKeys = [
    'defensive.tacklesPerMatch',
    'defensive.interceptionPerMatch',
    'defensive.clearancesPerMatch',
    'defensive.defensiveActionsPerMatch'
  ];
  
  // Selected metric for trend view
  const [selectedTrendMetric, setSelectedTrendMetric] = useState('defensive.goalsAgainstPerMatch');
  
  // Prepare data for comparative bar chart
  const coreComparativeData = useComparativeMetricsBarData(comparativeMetrics, coreDefensiveMetricKeys);
  const activityComparativeData = useComparativeMetricsBarData(comparativeMetrics, activityMetricKeys);
  
  // Prepare data for trend line chart
  const trendData = useMatchMetricsLineData(matchMetrics, selectedTrendMetric);
  
  // Format y-axis tick values
  const formatYAxisTick = (value: number, metricKey: string) => {
    if (metricKey.includes('Percentage') || metricKey === 'defensive.cleanSheetPercentage') {
      return `${value}%`;
    }
    return value.toFixed(1);
  };
  
  // Map metric keys to display names
  const metricDisplayNames: Record<string, string> = {
    'defensive.goalsAgainstPerMatch': 'Goals Against',
    'defensive.xGAgainstPerMatch': 'xG Against',
    'defensive.cleanSheetPercentage': 'Clean Sheet %',
    'defensive.defensiveLineHeight': 'Defensive Line',
    'defensive.tacklesPerMatch': 'Tackles',
    'defensive.interceptionPerMatch': 'Interceptions',
    'defensive.clearancesPerMatch': 'Clearances',
    'defensive.defensiveActionsPerMatch': 'Defensive Actions',
    'defensive.pressingIntensity': 'Pressing Intensity',
    'defensive.challengesWonPercentage': 'Duels Won %',
    'defensive.aerialDuelsWonPercentage': 'Aerial Duels Won %',
    'defensive.opponentPassCompletionAllowed': 'Opp. Pass Completion %',
    'defensive.defensiveRecoveryTime': 'Recovery Time (sec)'
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
        selectedTrendMetric === 'defensive.cleanSheetPercentage') {
      return [`${value.toFixed(1)}%`, name];
    }
    return [value.toFixed(2), name];
  };
  
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Main Metrics Chart */}
      <ChartContainer
        title="Defensive Performance"
        description={viewMode === 'comparative' 
          ? `How ${teamName} compares to the ${leagueName} average` 
          : `Recent trends in key defensive metrics`}
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
              data={coreComparativeData}
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
                {[...coreDefensiveMetricKeys, ...activityMetricKeys].map((key) => (
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
      
      {/* Defensive Style Visualization */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Defensive Style Profile</h3>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
          </div>
        ) : metrics ? (
          <div className="space-y-6">
            {/* Defensive line height visualization */}
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium text-gray-900">Defensive Line Height</span>
                <span className="text-sm font-semibold text-gray-900">{metrics.defensive.defensiveLineHeight}/100</span>
              </div>
              <div className="relative h-8 w-full bg-gray-100 rounded-full">
                <div className="absolute bottom-0 left-0 h-full w-full">
                  <div className="absolute bottom-0 left-0 h-8 w-full">
                    <div className="absolute left-0 top-0 h-8 w-full flex items-center">
                      <div className="absolute h-1 w-full bg-gray-300"></div>
                      {/* Position marker based on defensive line height */}
                      <div 
                        className="absolute h-8 w-4 bg-primary-600 rounded-full transform -translate-x-1/2 flex items-center justify-center" 
                        style={{ left: `${metrics.defensive.defensiveLineHeight}%` }}
                      >
                        <div className="h-2 w-2 bg-white rounded-full"></div>
                      </div>
                      {/* Labels */}
                      <div className="absolute bottom-full left-0 mb-1 text-xs text-gray-500">Low Block</div>
                      <div className="absolute bottom-full left-1/2 mb-1 transform -translate-x-1/2 text-xs text-gray-500">Mid Block</div>
                      <div className="absolute bottom-full right-0 mb-1 text-xs text-gray-500">High Press</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pressing intensity visualization */}
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium text-gray-900">Pressing Intensity</span>
                <span className="text-sm font-semibold text-gray-900">{metrics.defensive.pressingIntensity}/100</span>
              </div>
              <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-600" 
                  style={{ width: `${metrics.defensive.pressingIntensity}%` }}
                ></div>
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>Passive</span>
                <span>Moderate</span>
                <span>Aggressive</span>
              </div>
            </div>
            
            {/* Success rates visualization */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2 flex justify-between">
                  <span className="text-sm font-medium text-gray-900">Duels Won</span>
                  <span className="text-sm font-semibold text-gray-900">{metrics.defensive.challengesWonPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${metrics.defensive.challengesWonPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="mb-2 flex justify-between">
                  <span className="text-sm font-medium text-gray-900">Aerial Duels Won</span>
                  <span className="text-sm font-semibold text-gray-900">{metrics.defensive.aerialDuelsWonPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500" 
                    style={{ width: `${metrics.defensive.aerialDuelsWonPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 italic">No defensive style data available</div>
        )}
      </div>
      
      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Core Defensive Metrics Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Defensive Performance Metrics</h3>
          
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
                label="Goals Against"
                value={metrics.defensive.goalsAgainstPerMatch.toFixed(2)}
                description="Average goals conceded per match"
                isHigherBetter={false}
                leagueAvg={comparativeMetrics?.metrics?.['defensive.goalsAgainstPerMatch']?.leagueAverage}
              />
              
              <MetricItem 
                label="Expected Goals Against (xGA)"
                value={metrics.defensive.xGAgainstPerMatch.toFixed(2)}
                description="Expected goals conceded based on chance quality"
                isHigherBetter={false}
                leagueAvg={comparativeMetrics?.metrics?.['defensive.xGAgainstPerMatch']?.leagueAverage}
              />
              
              <MetricItem 
                label="Clean Sheet Percentage"
                value={`${metrics.defensive.cleanSheetPercentage.toFixed(1)}%`}
                description="Percentage of matches with no goals conceded"
                isHigherBetter={true}
                leagueAvg={comparativeMetrics?.metrics?.['defensive.cleanSheetPercentage']?.leagueAverage}
              />
              
              <MetricItem 
                label="Goals Prevented"
                value={(metrics.defensive.xGAgainstPerMatch - metrics.defensive.goalsAgainstPerMatch).toFixed(2)}
                description="Difference between xGA and actual goals against (higher = better)"
                isHigherBetter={true}
                leagueAvg={
                  comparativeMetrics?.metrics?.['defensive.xGAgainstPerMatch']?.leagueAverage 
                  - comparativeMetrics?.metrics?.['defensive.goalsAgainstPerMatch']?.leagueAverage
                }
              />
            </div>
          ) : (
            <div className="text-gray-500 italic">No defensive metrics available</div>
          )}
        </div>
        
        {/* Defensive Activity Metrics Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Defensive Activity Metrics</h3>
          
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
                label="Tackles per Match"
                value={metrics.defensive.tacklesPerMatch.toFixed(1)}
                description="Average number of tackles attempted per match"
                isHigherBetter={null}
                leagueAvg={comparativeMetrics?.metrics?.['defensive.tacklesPerMatch']?.leagueAverage}
              />
              
              <MetricItem 
                label="Interceptions per Match"
                value={metrics.defensive.interceptionPerMatch.toFixed(1)}
                description="Average number of passes intercepted per match"
                isHigherBetter={null}
                leagueAvg={comparativeMetrics?.metrics?.['defensive.interceptionPerMatch']?.leagueAverage}
              />
              
              <MetricItem 
                label="Opponent Pass Completion"
                value={`${metrics.defensive.opponentPassCompletionAllowed.toFixed(1)}%`}
                description="Pass completion percentage allowed to opponents"
                isHigherBetter={false}
                leagueAvg={comparativeMetrics?.metrics?.['defensive.opponentPassCompletionAllowed']?.leagueAverage}
              />
              
              <MetricItem 
                label="Defensive Recovery Time"
                value={`${metrics.defensive.defensiveRecoveryTime.toFixed(1)} sec`}
                description="Average time to regain defensive shape after losing possession"
                isHigherBetter={false}
                leagueAvg={comparativeMetrics?.metrics?.['defensive.defensiveRecoveryTime']?.leagueAverage}
              />
            </div>
          ) : (
            <div className="text-gray-500 italic">No defensive activity metrics available</div>
          )}
        </div>
      </div>
      
      {/* Defensive Style Insights */}
      {metrics && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Defensive Style Insights</h3>
          
          <div className="prose prose-sm">
            <p>
              {generateDefensiveInsights(metrics, teamName)}
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
      ? parseFloat(value.replace(/[^0-9.-]/g, '')) 
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
 * Generate insights about defensive style
 */
function generateDefensiveInsights(metrics: TeamMetrics, teamName: string): string {
  const { defensive } = metrics;
  
  // High pressing team
  if (defensive.defensiveLineHeight > 75 && defensive.pressingIntensity > 80) {
    return `${teamName} employs a high-pressing defensive strategy with a defensive line height of ${defensive.defensiveLineHeight}/100 and pressing intensity of ${defensive.pressingIntensity}/100. This aggressive approach disrupts opposition build-up play, allowing only ${defensive.opponentPassCompletionAllowed.toFixed(1)}% pass completion. The team's defensive organization is complemented by ${defensive.interceptionPerMatch.toFixed(1)} interceptions and ${defensive.tacklesPerMatch.toFixed(1)} tackles per match, indicating active ball-winning. This proactive defensive approach results in ${defensive.goalsAgainstPerMatch.toFixed(2)} goals conceded per match from an xGA of ${defensive.xGAgainstPerMatch.toFixed(2)}.`;
  }
  
  // Low block team
  if (defensive.defensiveLineHeight < 40) {
    return `${teamName} adopts a deep defensive block with a defensive line height of just ${defensive.defensiveLineHeight}/100. This compact, deep-lying defense focuses on protecting space near their goal, recording ${defensive.clearancesPerMatch.toFixed(1)} clearances per match. With ${defensive.aerialDuelsWonPercentage.toFixed(1)}% of aerial duels won, the team is effective at defending crosses and long balls. Despite absorbing pressure, they maintain organization, conceding ${defensive.goalsAgainstPerMatch.toFixed(2)} goals per match compared to an xGA of ${defensive.xGAgainstPerMatch.toFixed(2)}, and keeping clean sheets in ${defensive.cleanSheetPercentage.toFixed(1)}% of matches.`;
  }
  
  // Strong defensive team (good goals against and clean sheets)
  if (defensive.goalsAgainstPerMatch < 1.0 && defensive.cleanSheetPercentage > 40) {
    return `${teamName} demonstrates exceptional defensive solidity, conceding just ${defensive.goalsAgainstPerMatch.toFixed(2)} goals per match and keeping clean sheets in ${defensive.cleanSheetPercentage.toFixed(1)}% of games. With a defensive line height of ${defensive.defensiveLineHeight}/100, the team balances security with pressure. Their defensive success is built on winning ${defensive.challengesWonPercentage.toFixed(1)}% of duels and maintaining a pressing intensity of ${defensive.pressingIntensity}/100. This well-organized defense consistently outperforms their xGA of ${defensive.xGAgainstPerMatch.toFixed(2)}, preventing ${(defensive.xGAgainstPerMatch - defensive.goalsAgainstPerMatch).toFixed(2)} expected goals per match.`;
  }
  
  // Mid-block counter-pressing
  if (defensive.defensiveLineHeight >= 40 && defensive.defensiveLineHeight <= 65 && defensive.pressingIntensity > 70) {
    return `${teamName} utilizes a mid-block defensive approach with selective pressing. With a defensive line height of ${defensive.defensiveLineHeight}/100, they balance compactness with controlled pressure. The team's pressing intensity of ${defensive.pressingIntensity}/100 indicates aggressive engagement in specific zones, recovering possession with a quick recovery time of ${defensive.defensiveRecoveryTime.toFixed(1)} seconds. This coordinated defensive system results in ${defensive.interceptionPerMatch.toFixed(1)} interceptions and ${defensive.tacklesPerMatch.toFixed(1)} tackles per match, allowing them to control defensive transitions effectively.`;
  }
  
  // Defensively vulnerable team
  if (defensive.goalsAgainstPerMatch > 1.5 && defensive.xGAgainstPerMatch > 1.5) {
    return `${teamName} shows some defensive vulnerabilities, conceding ${defensive.goalsAgainstPerMatch.toFixed(2)} goals per match from an xGA of ${defensive.xGAgainstPerMatch.toFixed(2)}. Despite a pressing intensity of ${defensive.pressingIntensity}/100, the team may have structural issues or individual errors that lead to high-quality chances for opponents. With clean sheets in only ${defensive.cleanSheetPercentage.toFixed(1)}% of matches, improving defensive organization and consistency will be key to better results. The team currently wins ${defensive.challengesWonPercentage.toFixed(1)}% of duels and ${defensive.aerialDuelsWonPercentage.toFixed(1)}% of aerial contests, suggesting areas for potential improvement.`;
  }
  
  // Balanced/moderate approach
  return `${teamName} shows a balanced defensive approach with a moderate defensive line height of ${defensive.defensiveLineHeight}/100. Their defensive structure is flexible, adapting to different game situations while maintaining pressing intensity at ${defensive.pressingIntensity}/100. The team records ${defensive.defensiveActionsPerMatch.toFixed(1)} defensive actions per match, including ${defensive.tacklesPerMatch.toFixed(1)} tackles and ${defensive.interceptionPerMatch.toFixed(1)} interceptions. This measured approach leads to ${defensive.goalsAgainstPerMatch.toFixed(2)} goals conceded per match against an xGA of ${defensive.xGAgainstPerMatch.toFixed(2)}, with clean sheets in ${defensive.cleanSheetPercentage.toFixed(1)}% of matches.`;
}

export default DefensiveMetrics;