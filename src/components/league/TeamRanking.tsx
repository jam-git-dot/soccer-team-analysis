/**
 * Team Ranking component
 * Displays a team's ranking within the league for a specific metric
 */

import React from 'react';
import { MetricId, METRICS, formatMetricValue } from '../../config/metrics';

type TeamRankingProps = {
  metricId: MetricId;
  teamId: string;
  teamName: string;
  value: number;
  rank: number;
  totalTeams: number;
  percentile?: number;
  className?: string;
};

const TeamRanking: React.FC<TeamRankingProps> = ({
  metricId,
  teamId,
  teamName,
  value,
  rank,
  totalTeams,
  percentile,
  className = '',
}) => {
  const metric = METRICS[metricId];
  
  if (!metric) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Unknown metric: {metricId}</div>;
  }
  
  // Format the metric value
  const formattedValue = formatMetricValue(metricId, value);
  
  // Determine rank color
  const getRankColor = () => {
    const rankPercentage = (totalTeams - rank + 1) / totalTeams * 100;
    
    if (rankPercentage >= 80) return 'bg-green-500 text-white';
    if (rankPercentage >= 60) return 'bg-green-400 text-white';
    if (rankPercentage >= 40) return 'bg-yellow-400 text-black';
    if (rankPercentage >= 20) return 'bg-orange-400 text-white';
    return 'bg-red-500 text-white';
  };
  
  // Get rank display (1st, 2nd, 3rd, etc.)
  const getRankDisplay = (rank: number) => {
    const lastDigit = rank % 10;
    const lastTwoDigits = rank % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return `${rank}th`;
    }
    
    switch (lastDigit) {
      case 1: return `${rank}st`;
      case 2: return `${rank}nd`;
      case 3: return `${rank}rd`;
      default: return `${rank}th`;
    }
  };
  
  // Calculate percentage of progress bar to fill
  const progressPercentage = Math.round((totalTeams - rank + 1) / totalTeams * 100);
  
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-800">{metric.name}</h3>
          <p className="text-sm text-gray-500">{metric.description}</p>
        </div>
        <div className={`rounded-full px-3 py-1 text-sm font-bold ${getRankColor()}`}>
          {getRankDisplay(rank)}
        </div>
      </div>
      
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">{formattedValue}</span>
          <span className="text-sm text-gray-500">Out of {totalTeams} teams</span>
        </div>
        
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div 
            className="h-full rounded-full bg-primary-500" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TeamRanking;