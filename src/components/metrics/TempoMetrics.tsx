import React, { useState } from 'react';
import { ChartContainer, BarChart } from '@/components/charts';
import { useComparativeMetricsBarData } from '@/hooks';
import type { TeamMetrics, ComparativeMetrics } from '@/types';

interface TempoMetricsProps {
  /**
   * Team metrics data
   */
  metrics: TeamMetrics | null;
  
  /**
   * Comparative metrics for league context
   */
  comparativeMetrics?: ComparativeMetrics | null;
  
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
 * Component that visualizes tempo and transition metrics
 */
const TempoMetrics: React.FC<TempoMetricsProps> = ({
  metrics,
  comparativeMetrics = null,
  loading = false,
  error = null,
  onRefresh,
  teamName = 'Team',
  leagueName = 'League',
  className = '',
}) => {
  // Main tempo metrics to display
  const tempoMetricKeys = [
    'tempo.directPlayIndex',
    'tempo.transitionSpeedAttacking',
    'tempo.counterPressAfterLoss',
    'tempo.verticalityIndex'
  ];
  
  // Additional tempo metrics
  const additionalMetricKeys = [
    'tempo.averagePossessionDuration',
    'tempo.passesPerOffensiveAction',
    'tempo.progressiveCarriesPerMatch',
    'tempo.transitionSpeedDefensive'
  ];
  
  // Prepare data for comparative bar charts
  const tempoComparativeData = useComparativeMetricsBarData(comparativeMetrics, tempoMetricKeys);
  const additionalComparativeData = useComparativeMetricsBarData(comparativeMetrics, additionalMetricKeys);
  
  // Bar chart data keys for comparative view
  const comparativeDataKeys = [
    { key: 'value', name: teamName, color: '#0ea5e9' },
    { key: 'leagueAverage', name: `${leagueName} Average`, color: '#94a3b8' }
  ];
  
  // Map metric keys to display names
  const metricDisplayNames: Record<string, string> = {
    'tempo.directPlayIndex': 'Direct Play Index',
    'tempo.transitionSpeedAttacking': 'Attacking Transition Speed',
    'tempo.counterPressAfterLoss': 'Counter-Press Intensity',
    'tempo.verticalityIndex': 'Verticality Index',
    'tempo.averagePossessionDuration': 'Possession Duration',
    'tempo.passesPerOffensiveAction': 'Passes per Attack',
    'tempo.progressiveCarriesPerMatch': 'Progressive Carries',
    'tempo.transitionSpeedDefensive': 'Defensive Transition Speed'
  };
  
  // Helper function to get metric display name
  const getMetricDisplayName = (key: string) => metricDisplayNames[key] || key;
  
  // Format y-axis tick values
  const formatYAxisTick = (value: number) => {
    return value.toFixed(1);
  };
  
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Main Tempo Metrics Chart */}
      <ChartContainer
        title="Tempo & Transition Analysis"
        description={`How ${teamName} compares to the ${leagueName} average`}
        loading={loading}
        error={error}
        onRefresh={onRefresh}
        minHeight={400}
      >
        <div className="h-64">
          <BarChart
            data={tempoComparativeData}
            dataKeys={comparativeDataKeys}
            xAxisKey="name"
            yAxisTickFormatter={formatYAxisTick}
            height={250}
          />
        </div>
      </ChartContainer>
      
      {/* Game State Adaptability */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Game State Adaptability</h3>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
          </div>
        ) : metrics ? (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              This section shows how the team's playing style changes based on the match situation (winning, drawing, or losing). 
              Higher values indicate a more offensive approach.
            </p>
            
            {/* Winning style visualization */}
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium text-gray-900">When Winning</span>
                <span className="text-sm font-semibold text-gray-900">{metrics.tempo.gameStateAdaptability.winningStyle}/100</span>
              </div>
              <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${metrics.tempo.gameStateAdaptability.winningStyle}%` }}
                ></div>
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>Defensive</span>
                <span>Balanced</span>
                <span>Offensive</span>
              </div>
            </div>
            
            {/* Drawing style visualization */}
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium text-gray-900">When Drawing</span>
                <span className="text-sm font-semibold text-gray-900">{metrics.tempo.gameStateAdaptability.drawingStyle}/100</span>
              </div>
              <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${metrics.tempo.gameStateAdaptability.drawingStyle}%` }}
                ></div>
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>Defensive</span>
                <span>Balanced</span>
                <span>Offensive</span>
              </div>
            </div>
            
            {/* Losing style visualization */}
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium text-gray-900">When Losing</span>
                <span className="text-sm font-semibold text-gray-900">{metrics.tempo.gameStateAdaptability.losingStyle}/100</span>
              </div>
              <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${metrics.tempo.gameStateAdaptability.losingStyle}%` }}
                ></div>
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>Defensive</span>
                <span>Balanced</span>
                <span>Offensive</span>
              </div>
            </div>
            
            {/* Style flexibility indicator */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium text-gray-900">Style Flexibility</span>
                <span className="text-sm font-semibold text-gray-900">
                  {calculateStyleFlexibility(metrics.tempo.gameStateAdaptability)}/100
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {generateGameStateInsight(metrics.tempo.gameStateAdaptability, teamName)}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 italic">No game state adaptability data available</div>
        )}
      </div>
      
      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Tempo Metrics Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Tempo Metrics</h3>
          
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
                label="Direct Play Index"
                value={metrics.tempo.directPlayIndex.toFixed(1)}
                description="Measure of how directly a team plays (higher = more direct)"
                isHigherBetter={null}
                leagueAvg={comparativeMetrics?.metrics?.['tempo.directPlayIndex']?.leagueAverage}
              />
              
              <MetricItem 
                label="Average Possession Duration"
                value={`${metrics.tempo.averagePossessionDuration.toFixed(1)} sec`}
                description="Average time of team possession sequences"
                isHigherBetter={null}
                leagueAvg={comparativeMetrics?.metrics?.['tempo.averagePossessionDuration']?.leagueAverage}
              />
              
              <MetricItem 
                label="Verticality Index"
                value={metrics.tempo.verticalityIndex.toFixed(1)}
                description="Measure of how vertically a team progresses the ball"
                isHigherBetter={null}
                leagueAvg={comparativeMetrics?.metrics?.['tempo.verticalityIndex']?.leagueAverage}
              />
              
              <MetricItem 
                label="Passes per Offensive Action"
                value={metrics.tempo.passesPerOffensiveAction.toFixed(1)}
                description="Average passes before a shot or entry into final third"
                isHigherBetter={null}
                leagueAvg={comparativeMetrics?.metrics?.['tempo.passesPerOffensiveAction']?.leagueAverage}
              />
            </div>
          ) : (
            <div className="text-gray-500 italic">No tempo metrics available</div>
          )}
        </div>
        
        {/* Transition Metrics Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Transition Metrics</h3>
          
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
                label="Attacking Transition Speed"
                value={`${metrics.tempo.transitionSpeedAttacking.toFixed(1)} sec`}
                description="Time from winning possession to shot (lower = faster)"
                isHigherBetter={false}
                leagueAvg={comparativeMetrics?.metrics?.['tempo.transitionSpeedAttacking']?.leagueAverage}
              />
              
              <MetricItem 
                label="Defensive Transition Speed"
                value={`${metrics.tempo.transitionSpeedDefensive.toFixed(1)} sec`}
                description="Time to regain defensive shape after losing possession"
                isHigherBetter={false}
                leagueAvg={comparativeMetrics?.metrics?.['tempo.transitionSpeedDefensive']?.leagueAverage}
              />
              
              <MetricItem 
                label="Counter-Press Intensity"
                value={metrics.tempo.counterPressAfterLoss.toFixed(1)}
                description="Intensity of pressing immediately after losing possession"
                isHigherBetter={true}
                leagueAvg={comparativeMetrics?.metrics?.['tempo.counterPressAfterLoss']?.leagueAverage}
              />
              
              <MetricItem 
                label="Progressive Carries"
                value={metrics.tempo.progressiveCarriesPerMatch.toFixed(1)}
                description="Ball carries that significantly advance play per match"
                isHigherBetter={true}
                leagueAvg={comparativeMetrics?.metrics?.['tempo.progressiveCarriesPerMatch']?.leagueAverage}
              />
            </div>
          ) : (
            <div className="text-gray-500 italic">No transition metrics available</div>
          )}
        </div>
      </div>
      
      {/* Tempo & Transitions Insights */}
      {metrics && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Tempo & Transitions Insights</h3>
          
          <div className="prose prose-sm">
            <p>
              {generateTempoInsights(metrics, teamName)}
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
          League avg: {typeof value === 'string' && value.includes('sec') 
            ? `${leagueAvg.toFixed(1)} sec` 
            : leagueAvg.toFixed(1)}
        </div>
      )}
    </div>
  );
};

/**
 * Calculate style flexibility based on game state adaptability
 */
function calculateStyleFlexibility(gameStateAdaptability: TeamMetrics['tempo']['gameStateAdaptability']): number {
  const { winningStyle, drawingStyle, losingStyle } = gameStateAdaptability;
  
  // Calculate the range between the most defensive and most offensive approach
  const styleRange = Math.max(winningStyle, drawingStyle, losingStyle) - 
                     Math.min(winningStyle, drawingStyle, losingStyle);
  
  // The larger the range, the more flexible the team is
  // Scale to 0-100 (with 50 being a typical range of about 50 points)
  return Math.min(Math.round(styleRange * 2), 100);
}

/**
 * Generate insights about game state adaptability
 */
function generateGameStateInsight(
  gameStateAdaptability: TeamMetrics['tempo']['gameStateAdaptability'],
  teamName: string
): string {
  const { winningStyle, drawingStyle, losingStyle } = gameStateAdaptability;
  const flexibility = calculateStyleFlexibility(gameStateAdaptability);
  
  // Very defensive when winning
  if (winningStyle < 40 && losingStyle > 75) {
    return `${teamName} shows significant tactical flexibility (${flexibility}/100), adopting a defensive approach when leading (${winningStyle}/100) and becoming much more offensive when trailing (${losingStyle}/100). This pragmatic approach indicates a team that prioritizes protecting leads over maintaining consistent playing style.`;
  }
  
  // Consistent regardless of score
  if (flexibility < 30) {
    return `${teamName} maintains a consistent playing style regardless of the game state, with minimal variation between winning (${winningStyle}/100), drawing (${drawingStyle}/100), and losing (${losingStyle}/100) situations. This low flexibility (${flexibility}/100) suggests a committed philosophy that doesn't change based on the scoreline.`;
  }
  
  // Highly offensive when losing
  if (losingStyle > 85 && winningStyle < 60) {
    return `${teamName} becomes significantly more offensive when trailing (${losingStyle}/100) compared to when leading (${winningStyle}/100) or level (${drawingStyle}/100). This high adaptability (${flexibility}/100) allows them to chase games effectively but may leave them vulnerable to counter-attacks.`;
  }
  
  // Always offensive
  if (winningStyle > 65 && drawingStyle > 70 && losingStyle > 80) {
    return `${teamName} maintains an offensive approach across all game states, with high offensive ratings when winning (${winningStyle}/100), drawing (${drawingStyle}/100), and losing (${losingStyle}/100). This attack-minded philosophy shows moderate flexibility (${flexibility}/100) with a consistent commitment to front-foot football.`;
  }
  
  // Default
  return `${teamName} shows moderate tactical flexibility (${flexibility}/100) across different game states, adapting from a ${winningStyle < 50 ? 'cautious' : 'balanced'} approach when winning (${winningStyle}/100) to a more offensive style when trailing (${losingStyle}/100). This adaptability allows them to adjust their approach based on match situations.`;
}

/**
 * Generate insights about tempo and transitions
 */
function generateTempoInsights(metrics: TeamMetrics, teamName: string): string {
  const { tempo } = metrics;
  
  // Direct, fast transition team
  if (tempo.directPlayIndex > 65 && tempo.transitionSpeedAttacking < 6.0) {
    return `${teamName} employs a direct attacking approach with a high Direct Play Index of ${tempo.directPlayIndex.toFixed(1)}/100 and rapid attacking transitions (${tempo.transitionSpeedAttacking.toFixed(1)} seconds). With a verticality index of ${tempo.verticalityIndex.toFixed(1)}/100, they prioritize forward progression over lateral circulation. Their average possession duration of ${tempo.averagePossessionDuration.toFixed(1)} seconds reflects this direct style, using just ${tempo.passesPerOffensiveAction.toFixed(1)} passes per offensive action. This approach is complemented by ${tempo.progressiveCarriesPerMatch.toFixed(1)} progressive carries per match, adding dynamism to their attacks.`;
  }
  
  // Possession-based team
  if (tempo.directPlayIndex < 45 && tempo.averagePossessionDuration > 20.0) {
    return `${teamName} adopts a patient possession-based approach with extended possession sequences averaging ${tempo.averagePossessionDuration.toFixed(1)} seconds. Their low Direct Play Index of ${tempo.directPlayIndex.toFixed(1)}/100 indicates a preference for controlled build-up over direct play. The team uses ${tempo.passesPerOffensiveAction.toFixed(1)} passes per offensive action, gradually working the ball into dangerous areas. Despite this methodical approach, they maintain a counter-press intensity of ${tempo.counterPressAfterLoss.toFixed(1)}/100 after losing possession, helping them regain control and continue their patient attacking pattern.`;
  }
  
  // Counter-pressing team
  if (tempo.counterPressAfterLoss > 80 && tempo.transitionSpeedDefensive < 4.5) {
    return `${teamName} demonstrates an aggressive counter-pressing approach, with an intensity of ${tempo.counterPressAfterLoss.toFixed(1)}/100 immediately after losing possession. Their defensive transition speed of just ${tempo.transitionSpeedDefensive.toFixed(1)} seconds shows how quickly they reorganize defensively. This high-intensity approach allows them to regain possession quickly and restart attacks, complementing their Direct Play Index of ${tempo.directPlayIndex.toFixed(1)}/100 and verticality index of ${tempo.verticalityIndex.toFixed(1)}/100. Their ability to transition between defense and attack rapidly makes them dynamic and unpredictable.`;
  }
  
  // Vertical tiki-taka 
  if (tempo.averagePossessionDuration > 18.0 && tempo.verticalityIndex > 60) {
    return `${teamName} blends possession football with vertical directness, maintaining possession for ${tempo.averagePossessionDuration.toFixed(1)} seconds on average while achieving a high verticality index of ${tempo.verticalityIndex.toFixed(1)}/100. This approach balances patience with purpose, using possession to progress forward rather than merely retain the ball. They execute ${tempo.progressiveCarriesPerMatch.toFixed(1)} progressive carries per match, adding dynamism to their build-up. With attacking transitions of ${tempo.transitionSpeedAttacking.toFixed(1)} seconds and a counter-press intensity of ${tempo.counterPressAfterLoss.toFixed(1)}/100, they maintain control while looking to penetrate defenses.`;
  }
  
  // Slow, methodical team
  if (tempo.transitionSpeedAttacking > 8.0 && tempo.directPlayIndex < 50) {
    return `${teamName} employs a measured approach to attacking play, with slower attacking transitions of ${tempo.transitionSpeedAttacking.toFixed(1)} seconds and a moderate Direct Play Index of ${tempo.directPlayIndex.toFixed(1)}/100. Their possession sequences last ${tempo.averagePossessionDuration.toFixed(1)} seconds on average, using ${tempo.passesPerOffensiveAction.toFixed(1)} passes before creating shooting opportunities. This methodical style prioritizes control and position over speed, with their game state adaptability showing more offensive intent when trailing (${tempo.gameStateAdaptability.losingStyle}/100) than when leading (${tempo.gameStateAdaptability.winningStyle}/100).`;
  }
  
  // Balanced approach
  return `${teamName} demonstrates a balanced approach to tempo and transitions with a Direct Play Index of ${tempo.directPlayIndex.toFixed(1)}/100 and verticality index of ${tempo.verticalityIndex.toFixed(1)}/100. Their attacking transitions take ${tempo.transitionSpeedAttacking.toFixed(1)} seconds on average, complemented by ${tempo.progressiveCarriesPerMatch.toFixed(1)} progressive carries per match to advance play. With possession sequences lasting ${tempo.averagePossessionDuration.toFixed(1)} seconds and a counter-press intensity of ${tempo.counterPressAfterLoss.toFixed(1)}/100, they can adapt between controlled build-up and more direct approaches depending on the game situation.`;
}

export default TempoMetrics;
