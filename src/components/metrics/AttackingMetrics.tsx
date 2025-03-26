import React, { useState } from 'react';
import { ChartContainer, BarChart, PieChart } from '@/components/charts';
import { useComparativeMetricsBarData } from '@/hooks';
import type { TeamMetrics, ComparativeMetrics } from '@/types';

interface AttackingMetricsProps {
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

// Import PieChart if needed
declare module '@/components/charts' {
  export const PieChart: React.FC<any>;
}

/**
 * Component that visualizes attacking metrics and patterns
 */
const AttackingMetrics: React.FC<AttackingMetricsProps> = ({
  metrics,
  comparativeMetrics = null,
  loading = false,
  error = null,
  onRefresh,
  teamName = 'Team',
  leagueName = 'League',
  className = '',
}) => {
  // Main attacking metrics to display
  const attackingMetricKeys = [
    'attacking.goalsPerMatch',
    'attacking.xGPerMatch',
    'attacking.shotsPerMatch',
    'attacking.bigChancesCreatedPerMatch'
  ];
  
  // Secondary attacking metrics
  const secondaryMetricKeys = [
    'attacking.crossesPerMatch',
    'attacking.dribbleSuccessRate',
    'attacking.touchesInBox'
  ];
  
  // Prepare data for comparative bar chart
  const attackingComparativeData = useComparativeMetricsBarData(comparativeMetrics, attackingMetricKeys);
  const secondaryComparativeData = useComparativeMetricsBarData(comparativeMetrics, secondaryMetricKeys);
  
  // Bar chart data keys for comparative view
  const comparativeDataKeys = [
    { key: 'value', name: teamName, color: '#0ea5e9' },
    { key: 'leagueAverage', name: `${leagueName} Average`, color: '#94a3b8' }
  ];
  
  // Attack zones data for visualization
  const getAttackZonesData = () => {
    if (!metrics) return [];
    
    const { attacking } = metrics;
    return [
      { name: 'Left', value: attacking.attackZones.left, color: '#34d399' },
      { name: 'Center', value: attacking.attackZones.center, color: '#3b82f6' },
      { name: 'Right', value: attacking.attackZones.right, color: '#f97316' }
    ];
  };
  
  // Goal types data for visualization
  const getGoalTypesData = () => {
    if (!metrics) return [];
    
    const { attacking } = metrics;
    return [
      { name: 'Open Play', value: attacking.openPlayGoalsPercentage, color: '#3b82f6' },
      { name: 'Counter Attack', value: attacking.counterAttackGoalsPercentage, color: '#f97316' },
      { name: 'Set Piece', value: attacking.setPieceGoalsPercentage, color: '#8b5cf6' }
    ];
  };
  
  // Map metric keys to display names
  const metricDisplayNames: Record<string, string> = {
    'attacking.goalsPerMatch': 'Goals per Match',
    'attacking.xGPerMatch': 'Expected Goals (xG)',
    'attacking.shotsPerMatch': 'Shots per Match',
    'attacking.bigChancesCreatedPerMatch': 'Big Chances Created',
    'attacking.crossesPerMatch': 'Crosses per Match',
    'attacking.dribbleSuccessRate': 'Dribble Success %',
    'attacking.touchesInBox': 'Touches in Box'
  };
  
  // Helper function to get metric display name
  const getMetricDisplayName = (key: string) => metricDisplayNames[key] || key;
  
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Main Attacking Metrics Chart */}
      <ChartContainer
        title="Attacking Output"
        description={`Key attacking metrics compared to ${leagueName} average`}
        loading={loading}
        error={error}
        onRefresh={onRefresh}
        minHeight={400}
      >
        <div className="h-64">
          <BarChart
            data={attackingComparativeData}
            dataKeys={comparativeDataKeys}
            xAxisKey="name"
            height={250}
          />
        </div>
      </ChartContainer>
      
      {/* Attack Distribution Visualizations */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Attack Zones Card */}
        <ChartContainer
          title="Attack Zones Distribution"
          description="Percentage of attacks through different zones"
          loading={loading}
          error={error}
          bordered={true}
          minHeight={300}
        >
          {metrics && (
            <div className="flex h-48 items-center justify-center">
              {/* Replace with actual PieChart component or visualization */}
              <div className="flex h-full w-full items-center justify-center">
                <div className="grid grid-cols-3 gap-4 w-full text-center">
                  {getAttackZonesData().map((zone) => (
                    <div key={zone.name} className="flex flex-col items-center">
                      <div 
                        className="w-20 mb-2" 
                        style={{ 
                          height: `${zone.value}px`, 
                          backgroundColor: zone.color,
                          borderRadius: '4px'
                        }}
                      ></div>
                      <div className="text-sm font-medium">{zone.name}</div>
                      <div className="text-xs text-gray-500">{zone.value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </ChartContainer>
        
        {/* Goal Types Card */}
        <ChartContainer
          title="Goals by Type"
          description="Distribution of goals by source"
          loading={loading}
          error={error}
          bordered={true}
          minHeight={300}
        >
          {metrics && (
            <div className="flex h-48 items-center justify-center">
              {/* Replace with actual PieChart component or visualization */}
              <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="mb-4 flex space-x-1">
                  {getGoalTypesData().map((type) => (
                    <div 
                      key={type.name}
                      className="h-6 relative" 
                      style={{ 
                        width: `${type.value * 2}px`, 
                        backgroundColor: type.color,
                        borderRadius: '4px'
                      }}
                    ></div>
                  ))}
                </div>
                <div className="flex w-full justify-between px-4">
                  {getGoalTypesData().map((type) => (
                    <div key={type.name} className="flex flex-col items-center">
                      <div className="flex items-center">
                        <div 
                          className="mr-2 h-3 w-3 rounded-full" 
                          style={{ backgroundColor: type.color }}
                        ></div>
                        <span className="text-sm font-medium">{type.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{type.value.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </ChartContainer>
      </div>
      
      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Goal Scoring Metrics Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Goal Scoring Metrics</h3>
          
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
                label="Goals per Match"
                value={metrics.attacking.goalsPerMatch.toFixed(2)}
                description="Average number of goals scored per match"
                isHigherBetter={true}
                leagueAvg={comparativeMetrics?.metrics?.['attacking.goalsPerMatch']?.leagueAverage}
              />
              
              <MetricItem 
                label="Expected Goals (xG)"
                value={metrics.attacking.xGPerMatch.toFixed(2)}
                description="Expected goals per match based on chance quality"
                isHigherBetter={true}
                leagueAvg={comparativeMetrics?.metrics?.['attacking.xGPerMatch']?.leagueAverage}
              />
              
              <MetricItem 
                label="Shot Conversion"
                value={`${((metrics.attacking.goalsPerMatch / metrics.attacking.shotsPerMatch) * 100).toFixed(1)}%`}
                description="Percentage of shots that result in goals"
                isHigherBetter={true}
                leagueAvg={(comparativeMetrics?.metrics?.['attacking.goalsPerMatch']?.leagueAverage ?? 0)/ 
                           (comparativeMetrics?.metrics?.['attacking.shotsPerMatch']?.leagueAverage ?? 0) * 100}
              />
              
              <MetricItem 
                label="Shot Quality"
                value={`${((metrics.attacking.xGPerMatch / metrics.attacking.shotsPerMatch) * 100).toFixed(1)}%`}
                description="Average xG per shot (higher = better chances)"
                isHigherBetter={true}
                leagueAvg={(comparativeMetrics?.metrics?.['attacking.xGPerMatch']?.leagueAverage ?? 0 )/ 
                           (comparativeMetrics?.metrics?.['attacking.shotsPerMatch']?.leagueAverage ?? 0) * 100}
              />
            </div>
          ) : (
            <div className="text-gray-500 italic">No goal scoring metrics available</div>
          )}
        </div>
        
        {/* Chance Creation Metrics Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Chance Creation Metrics</h3>
          
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
                label="Shots per Match"
                value={metrics.attacking.shotsPerMatch.toFixed(1)}
                description="Average number of shots taken per match"
                isHigherBetter={true}
                leagueAvg={comparativeMetrics?.metrics?.['attacking.shotsPerMatch']?.leagueAverage}
              />
              
              <MetricItem 
                label="Big Chances Created"
                value={metrics.attacking.bigChancesCreatedPerMatch.toFixed(1)}
                description="High-quality goal-scoring opportunities created per match"
                isHigherBetter={true}
                leagueAvg={comparativeMetrics?.metrics?.['attacking.bigChancesCreatedPerMatch']?.leagueAverage}
              />
              
              <MetricItem 
                label="Crosses per Match"
                value={metrics.attacking.crossesPerMatch.toFixed(1)}
                description="Average number of crosses attempted per match"
                isHigherBetter={null}
                leagueAvg={comparativeMetrics?.metrics?.['attacking.crossesPerMatch']?.leagueAverage}
              />
              
              <MetricItem 
                label="Touches in Box"
                value={metrics.attacking.touchesInBox.toFixed(1)}
                description="Average touches in the opponent's penalty area per match"
                isHigherBetter={true}
                leagueAvg={comparativeMetrics?.metrics?.['attacking.touchesInBox']?.leagueAverage}
              />
            </div>
          ) : (
            <div className="text-gray-500 italic">No chance creation metrics available</div>
          )}
        </div>
      </div>
      
      {/* Attacking Style Insights */}
      {metrics && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Attacking Style Insights</h3>
          
          <div className="prose prose-sm">
            <p>
              {generateAttackingInsights(metrics, teamName)}
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
 * Generate insights about attacking style
 */
function generateAttackingInsights(metrics: TeamMetrics, teamName: string): string {
  const { attacking } = metrics;
  
  // High-scoring team
  if (attacking.goalsPerMatch > 2.2) {
    return `${teamName} is a prolific attacking team, scoring ${attacking.goalsPerMatch.toFixed(2)} goals per match. They create ${attacking.bigChancesCreatedPerMatch.toFixed(1)} big chances per game and get ${attacking.touchesInBox.toFixed(1)} touches in the opponent's box, demonstrating their attacking intent. Their attacks are distributed ${attacking.attackZones.left}% from the left, ${attacking.attackZones.center}% through the center, and ${attacking.attackZones.right}% from the right, showing a ${getAttackZonePreference(attacking.attackZones)} attacking approach. ${getGoalTypeInsight(attacking)} scoring ${attacking.goalsPerMatch.toFixed(2)} goals from an xG of ${attacking.xGPerMatch.toFixed(2)}, indicating ${getFinishingQuality(attacking.goalsPerMatch, attacking.xGPerMatch)}.`;
  }
  
  // Shot-heavy but less efficient
  if (attacking.shotsPerMatch > 15 && attacking.goalsPerMatch < 1.8) {
    return `${teamName} generates a high volume of shots (${attacking.shotsPerMatch.toFixed(1)} per match) but converts at a below-average rate, scoring ${attacking.goalsPerMatch.toFixed(2)} goals per match. The team creates ${attacking.bigChancesCreatedPerMatch.toFixed(1)} big chances per game but may need to improve shot selection and finishing quality. Their xG of ${attacking.xGPerMatch.toFixed(2)} per match suggests ${getFinishingQuality(attacking.goalsPerMatch, attacking.xGPerMatch)}. ${getAttackZoneInsight(attacking.attackZones, teamName)} ${getGoalTypeInsight(attacking)}`;
  }
  
  // Efficient team with fewer shots
  if (attacking.shotsPerMatch < 12 && attacking.goalsPerMatch > 1.5) {
    return `${teamName} is a highly efficient team in front of goal, scoring ${attacking.goalsPerMatch.toFixed(2)} goals from just ${attacking.shotsPerMatch.toFixed(1)} shots per match. This indicates excellent shot selection and clinical finishing, with a shot conversion rate of ${((attacking.goalsPerMatch / attacking.shotsPerMatch) * 100).toFixed(1)}%. ${getAttackZoneInsight(attacking.attackZones, teamName)} The team particularly excels at ${getGoalTypeStrength(attacking)}, with ${attacking.touchesInBox.toFixed(1)} touches in the opponent's box per match resulting in quality chances.`;
  }
  
  // Set-piece dependent
  if (attacking.setPieceGoalsPercentage > 30) {
    return `${teamName} shows significant dependence on set pieces, with ${attacking.setPieceGoalsPercentage.toFixed(1)}% of their goals coming from dead-ball situations. This strategic approach helps them score ${attacking.goalsPerMatch.toFixed(2)} goals per match despite generating an xG of ${attacking.xGPerMatch.toFixed(2)}. In open play, they primarily attack ${getAttackZonePreference(attacking.attackZones)}, using ${attacking.crossesPerMatch.toFixed(1)} crosses per match. Their set-piece specialization represents a distinctive and effective attacking approach that capitalizes on specific team strengths.`;
  }
  
  // Counter-attack focused
  if (attacking.counterAttackGoalsPercentage > 25) {
    return `${teamName} excels in counter-attacking situations, with ${attacking.counterAttackGoalsPercentage.toFixed(1)}% of their goals coming from quick transitions. While averaging ${attacking.possessionPercentage}% possession, they make the most of opposition turnovers to create high-quality scoring opportunities. Their attack is primarily focused ${getAttackZonePreference(attacking.attackZones)}, and they generate an xG of ${attacking.xGPerMatch.toFixed(2)} per match, scoring ${attacking.goalsPerMatch.toFixed(2)} goals. This counter-attacking approach allows them to be efficient with their ${attacking.shotsPerMatch.toFixed(1)} shots per match.`;
  }
  
  // Default/balanced approach
  return `${teamName} displays a balanced attacking approach, scoring ${attacking.goalsPerMatch.toFixed(2)} goals per match from ${attacking.shotsPerMatch.toFixed(1)} shots. They create ${attacking.bigChancesCreatedPerMatch.toFixed(1)} big chances per game and generate an xG of ${attacking.xGPerMatch.toFixed(2)}, indicating ${getFinishingQuality(attacking.goalsPerMatch, attacking.xGPerMatch)}. Their goal distribution shows versatility, with ${attacking.openPlayGoalsPercentage.toFixed(1)}% from open play, ${attacking.counterAttackGoalsPercentage.toFixed(1)}% from counter-attacks, and ${attacking.setPieceGoalsPercentage.toFixed(1)}% from set pieces. ${getAttackZoneInsight(attacking.attackZones, teamName)}`;
}

/**
 * Helper function to determine attack zone preference
 */
function getAttackZonePreference(zones: { left: number; center: number; right: number }): string {
  const { left, center, right } = zones;
  const max = Math.max(left, center, right);
  
  if (max === center && center > 40) {
    return 'centrally-focused';
  } else if (max === left && left > 35) {
    return 'left-sided';
  } else if (max === right && right > 35) {
    return 'right-sided';
  } else if (Math.abs(left - right) < 5 && left > 30 && right > 30) {
    return 'wing-focused';
  } else {
    return 'balanced';
  }
}

/**
 * Helper function to generate attack zone insight
 */
function getAttackZoneInsight(zones: { left: number; center: number; right: number }, teamName: string): string {
  const preference = getAttackZonePreference(zones);
  
  switch (preference) {
    case 'centrally-focused':
      return `${teamName} focuses ${zones.center}% of their attacks through the central areas, looking to penetrate directly through the opposition defense.`;
    case 'left-sided':
      return `${teamName} shows a clear preference for attacking down the left flank (${zones.left}%), suggesting strong players or tactical advantages on this side.`;
    case 'right-sided':
      return `${teamName} directs ${zones.right}% of their attacks down the right wing, indicating a tactical focus on this flank.`;
    case 'wing-focused':
      return `${teamName} heavily utilizes the wide areas, with ${zones.left}% of attacks coming from the left and ${zones.right}% from the right, often looking to create crossing opportunities.`;
    default:
      return `${teamName} distributes their attacks evenly across the pitch (${zones.left}% left, ${zones.center}% center, ${zones.right}% right), showing tactical flexibility.`;
  }
}

/**
 * Helper function to evaluate finishing quality
 */
function getFinishingQuality(goals: number, xG: number): string {
  const ratio = goals / xG;
  
  if (ratio > 1.2) {
    return 'exceptional finishing quality that exceeds expected output';
  } else if (ratio > 1.05) {
    return 'above-average finishing efficiency';
  } else if (ratio >= 0.95) {
    return 'finishing that aligns with the quality of chances created';
  } else if (ratio >= 0.8) {
    return 'slightly inefficient finishing that doesnt fully capitalize on chances';
  } else {
    return 'significant room for improvement in finishing quality';
  }
}

/**
 * Helper function to identify goal type strength
 */
function getGoalTypeStrength(attacking: TeamMetrics['attacking']): string {
  const { openPlayGoalsPercentage, counterAttackGoalsPercentage, setPieceGoalsPercentage } = attacking;
  const max = Math.max(openPlayGoalsPercentage, counterAttackGoalsPercentage, setPieceGoalsPercentage);
  
  if (max === openPlayGoalsPercentage && openPlayGoalsPercentage > 60) {
    return 'creating and converting chances in open play';
  } else if (max === counterAttackGoalsPercentage && counterAttackGoalsPercentage > 25) {
    return 'exploiting transition opportunities through counter-attacks';
  } else if (max === setPieceGoalsPercentage && setPieceGoalsPercentage > 25) {
    return 'set-piece situations including corners and free kicks';
  } else {
    return 'creating varied scoring opportunities';
  }
}

/**
 * Helper function to generate goal type insight
 */
function getGoalTypeInsight(attacking: TeamMetrics['attacking']): string {
  const { openPlayGoalsPercentage, counterAttackGoalsPercentage, setPieceGoalsPercentage } = attacking;
  
  return `Their goals come from varied sources: ${openPlayGoalsPercentage.toFixed(1)}% from open play, ${counterAttackGoalsPercentage.toFixed(1)}% from counter-attacks, and ${setPieceGoalsPercentage.toFixed(1)}% from set pieces. `;
}

export default AttackingMetrics;
