import React, { useState, useMemo } from 'react';
import { ChartContainer, RadarChart } from '@/components/charts';
import { useTeamMetricsRadarData } from '@/hooks';
import type { TeamMetrics, PlayStyle } from '@/types';

interface PlayStyleVisualizationProps {
  /**
   * Team metrics data
   */
  metrics: TeamMetrics | null;
  
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
   * Whether to show comparative data
   */
  showComparison?: boolean;
  
  /**
   * Comparative team metrics (optional)
   */
  comparisonMetrics?: TeamMetrics | null;
  
  /**
   * Comparison team name (optional)
   */
  comparisonTeamName?: string;
  
  /**
   * Primary team name
   */
  teamName?: string;
  
  /**
   * Class name
   */
  className?: string;
}

/**
 * Play style visualization component
 * Uses a radar chart to visualize team play style metrics
 */
const PlayStyleVisualization: React.FC<PlayStyleVisualizationProps> = ({
  metrics,
  loading = false,
  error = null,
  onRefresh,
  showComparison = false,
  comparisonMetrics = null,
  comparisonTeamName = 'Comparison Team',
  teamName = 'Team',
  className = '',
}) => {
  // State for selected metric categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'possession', 'attacking', 'defensive', 'tempo'
  ]);
  
  // Transform metrics data for the radar chart
  const radarData = useTeamMetricsRadarData(metrics, selectedCategories);
  
  // Transform comparison metrics if available
  const comparisonRadarData = useTeamMetricsRadarData(comparisonMetrics, selectedCategories);
  
  // Combine data points from both teams for a single dataset
  const combinedData = useMemo(() => {
    if (!radarData.length) return [];
    
    // If no comparison data, just return the primary team data
    if (!showComparison || !comparisonRadarData.length) {
      return radarData.map(item => ({
        name: item.name,
        [teamName]: item.value,
        category: item.category,
        original: item.original,
      }));
    }
    
    // Combine both datasets
    return radarData.map(item => {
      const comparisonItem = comparisonRadarData.find(ci => ci.name === item.name);
      return {
        name: item.name,
        [teamName]: item.value,
        [comparisonTeamName]: comparisonItem?.value || 0,
        category: item.category,
        originalTeam: item.original,
        originalComparison: comparisonItem?.original || 0,
      };
    });
  }, [radarData, comparisonRadarData, showComparison, teamName, comparisonTeamName]);
  
  // Configure radar chart data keys
  const dataKeys = useMemo(() => {
    const keys = [
      {
        key: teamName,
        name: teamName,
        color: '#0ea5e9', // Primary blue
        fillOpacity: 0.6,
      }
    ];
    
    if (showComparison && comparisonMetrics) {
      keys.push({
        key: comparisonTeamName,
        name: comparisonTeamName,
        color: '#f97316', // Orange
        fillOpacity: 0.5,
      });
    }
    
    return keys;
  }, [teamName, comparisonTeamName, showComparison, comparisonMetrics]);
  
  // Get team's play style categories
  const playStyleInfo = useMemo(() => {
    if (!metrics || !metrics.playStyleCategories) {
      return null;
    }
    
    const { primaryPlayStyle, secondaryPlayStyle } = metrics.playStyleCategories;
    
    // Map play style types to descriptive names
    const playStyleNames: Record<PlayStyle, string> = {
      'POSSESSION_BASED': 'Possession-Based',
      'DIRECT_PLAY': 'Direct Play',
      'COUNTER_ATTACKING': 'Counter-Attacking',
      'HIGH_PRESSING': 'High Pressing',
      'LOW_BLOCK': 'Low Block',
      'TIKI_TAKA': 'Tiki-Taka',
      'WING_PLAY': 'Wing Play',
      'LONG_BALL': 'Long Ball',
      'VERTICAL_TIKI_TAKA': 'Vertical Tiki-Taka',
      'BALANCED': 'Balanced'
    };
    
    return {
      primary: {
        type: primaryPlayStyle,
        name: playStyleNames[primaryPlayStyle] || primaryPlayStyle
      },
      secondary: {
        type: secondaryPlayStyle,
        name: playStyleNames[secondaryPlayStyle] || secondaryPlayStyle
      }
    };
  }, [metrics]);
  
  // Calculate key style attributes
  const styleAttributes = useMemo(() => {
    if (!metrics) return [];
    
    const { playStyleCategories } = metrics;
    
    // Select top attributes to display
    const attributes = [
      { name: 'Possession Dominance', value: playStyleCategories.possessionDominance },
      { name: 'Pressing Intensity', value: playStyleCategories.pressingIntensity },
      { name: 'Build-Up Speed', value: playStyleCategories.buildUpSpeed },
      { name: 'Defensive Compactness', value: playStyleCategories.defensiveCompactness },
      { name: 'Attacking Directness', value: playStyleCategories.attackingDirectness },
      { name: 'Width of Play', value: playStyleCategories.widthOfPlay },
      { name: 'Counter-Attack Threat', value: playStyleCategories.counterAttackThreat },
      { name: 'Set Piece Threat', value: playStyleCategories.setPlayThreat }
    ];
    
    // Sort by value (highest first) and take top 4
    return attributes.sort((a, b) => b.value - a.value).slice(0, 4);
  }, [metrics]);
  
  // Custom tooltip formatter
  const tooltipFormatter = (value: number, name: string, props: any) => {
    // Get the original (un-normalized) value if available
    const item = radarData.find(d => d.name === props.payload.name);
    const originalValue = item?.original || value;
    
    return [`${originalValue.toFixed(1)}`, name];
  };
  
  // Toggle metric category
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div className="flex flex-col md:flex-row">
        {/* Chart section */}
        <div className="md:w-2/3 p-6">
          <ChartContainer
            title="Play Style Visualization"
            description="Key performance metrics across different categories"
            loading={loading}
            error={error}
            onRefresh={onRefresh}
            minHeight={400}
            bordered={false}
            infoTooltip="This radar chart shows key metrics normalized to a 0-100 scale across different categories. The further out on each axis, the stronger the team is in that metric."
          >
            <RadarChart
              data={combinedData}
              dataKeys={dataKeys}
              radiusAxisDomain={[0, 100]}
              tooltipFormatter={tooltipFormatter}
              height={350}
              showLegend={showComparison}
              radiusAxisTickFormatter={(value) => `${value}`}
              className="mx-auto"
            />
          </ChartContainer>
          
          {/* Category toggles */}
          <div className="flex flex-wrap justify-center mt-4 gap-2">
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                selectedCategories.includes('possession')
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => toggleCategory('possession')}
            >
              Possession
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                selectedCategories.includes('attacking')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => toggleCategory('attacking')}
            >
              Attacking
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                selectedCategories.includes('defensive')
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => toggleCategory('defensive')}
            >
              Defensive
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                selectedCategories.includes('tempo')
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => toggleCategory('tempo')}
            >
              Tempo
            </button>
          </div>
        </div>
        
        {/* Play style summary section */}
        <div className="md:w-1/3 p-6 border-t md:border-t-0 md:border-l border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Play Style Profile</h3>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : playStyleInfo ? (
            <>
              <div className="mb-6">
                <div className="mb-1 text-sm text-gray-500">Primary Style</div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  {playStyleInfo.primary.name}
                </div>
                
                <div className="mt-3 mb-1 text-sm text-gray-500">Secondary Style</div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {playStyleInfo.secondary.name}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-base font-medium mb-3">Key Attributes</h4>
                <div className="space-y-3">
                  {styleAttributes.map((attr, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{attr.name}</span>
                        <span className="text-sm text-gray-500">{attr.value}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${attr.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-medium mb-2">Style Description</h4>
                <p className="text-sm text-gray-600">
                  {metrics && playStyleInfo.primary.type === 'POSSESSION_BASED' && (
                    "A possession-based team that prioritizes control of the ball. Builds attacks patiently through short passing and movement, looking to break down opponents through sustained pressure and positional play."
                  )}
                  {metrics && playStyleInfo.primary.type === 'HIGH_PRESSING' && (
                    "An aggressive high-pressing team that looks to win the ball high up the pitch. Applies intense pressure to force turnovers in dangerous areas and transitions quickly into attack when possession is regained."
                  )}
                  {metrics && playStyleInfo.primary.type === 'COUNTER_ATTACKING' && (
                    "A counter-attacking team that defends solidly before striking with speed on the break. Absorbs pressure before exploiting spaces with rapid transitions and direct attacking play."
                  )}
                  {metrics && playStyleInfo.primary.type === 'DIRECT_PLAY' && (
                    "A direct team that moves the ball forward quickly. Prioritizes vertical progression over horizontal circulation, using long passes and quick attacks to bypass opposition lines."
                  )}
                  {metrics && playStyleInfo.primary.type === 'LOW_BLOCK' && (
                    "A defensively solid team that defends in a low block. Maintains a compact shape with players behind the ball, focusing on defensive organization before looking to attack."
                  )}
                  {metrics && playStyleInfo.primary.type === 'TIKI_TAKA' && (
                    "A team employing a tiki-taka approach with intricate short passing. Uses quick combinations and positional rotations to maintain possession and create openings through patient build-up."
                  )}
                  {metrics && playStyleInfo.primary.type === 'WING_PLAY' && (
                    "A team that focuses on attacks through wide areas. Uses wingers and full-backs to create crossing opportunities and overloads in wide positions to break down opponents."
                  )}
                  {metrics && playStyleInfo.primary.type === 'VERTICAL_TIKI_TAKA' && (
                    "A team combining possession play with vertical directness. Maintains controlled possession but with a more direct approach to progress the ball quickly when opportunities arise."
                  )}
                  {metrics && playStyleInfo.primary.type === 'BALANCED' && (
                    "A balanced team with a versatile approach. Adapts strategies based on game situations, showing tactical flexibility across different phases of play."
                  )}
                </p>
              </div>
            </>
          ) : (
            <div className="text-gray-500 italic">
              No play style data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayStyleVisualization;