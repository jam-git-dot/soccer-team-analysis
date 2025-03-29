import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PlayStyleVisualization from '../components/team-dashboard/PlayStyleVisualization';
import { getTeamInfo } from '@/services/mock-data';
import metricsService from '@/services/metrics-service';
import { SUPPORTED_LEAGUES } from '@/config/constants';

/**
 * Team Dashboard Page component
 * Displays play style visualization for a selected team
 */
const TeamDashboard = () => {
  // Get team ID from URL params
  const { teamId } = useParams<{ teamId: string }>();
  
  // State for team data
  const [teamInfo, setTeamInfo] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use a default team ID if none is provided
  const currentTeamId = teamId || 'Arsenaki';
  
  // Fetch team data on component mount
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get team info
        const team = getTeamInfo(currentTeamId);
        if (!team) {
          throw new Error(`Team with ID ${currentTeamId} not found`);
        }
        
        setTeamInfo(team);
        
        // Get team metrics - default to developer-league
        const leagueId = team.leagueId || 'developer-league';
        const teamMetrics = await metricsService.getTeamMetrics(currentTeamId, leagueId);
        setMetrics(teamMetrics);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching team data:', err);
        setError(err instanceof Error ? err : new Error('Failed to load team data'));
        setLoading(false);
      }
    };
    
    fetchTeamData();
  }, [currentTeamId]);
  
  // Handle data refresh
  const handleRefresh = () => {
    // Re-fetch data
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get team metrics - default to developer-league
        const leagueId = teamInfo?.leagueId || 'developer-league';
        const teamMetrics = await metricsService.getTeamMetrics(currentTeamId, leagueId);
        setMetrics(teamMetrics);
        
        setLoading(false);
      } catch (err) {
        console.error('Error refreshing team data:', err);
        setError(err instanceof Error ? err : new Error('Failed to refresh team data'));
        setLoading(false);
      }
    };
    
    fetchTeamData();
  };
  
  // Get league name for the team
  const getLeagueName = (leagueId: string = 'developer-league') => {
    const league = SUPPORTED_LEAGUES.find(l => l.id === leagueId);
    return league ? league.name : 'League';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb navigation */}
      <div className="mb-6">
        <nav className="flex">
          <Link to="/" className="text-primary-600 hover:underline">
            Home
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link 
            to={`/league/${teamInfo?.leagueId || 'developer-league'}`} 
            className="text-primary-600 hover:underline"
          >
            {getLeagueName(teamInfo?.leagueId)}
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">{teamInfo?.name || 'Team'}</span>
        </nav>
      </div>

      {/* Team header */}
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">
          {teamInfo?.name || 'Team'} Play Style Analysis
        </h1>
        <p className="text-lg text-gray-600">
          Analyzing play style patterns and performance metrics
        </p>
      </header>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-8">
        {/* Play Style Radar Chart */}
        <PlayStyleVisualization
          metrics={metrics}
          loading={loading}
          error={error}
          onRefresh={handleRefresh}
          teamName={teamInfo?.name || 'Team'}
        />
        
        {/* Team Stats Summary */}
        {metrics && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Possession" 
              value={`${metrics.metrics?.possession_percentage_for?.toFixed(1) || 'N/A'}%`}
              description="Average ball possession" 
            />
            <StatCard 
              title="Goals Per Match" 
              value={(metrics.metrics?.goals_per_match || 'N/A').toString()}
              description="Average goals scored" 
            />
            <StatCard 
              title="Expected Goals" 
              value={(metrics.metrics?.xg_for || 'N/A').toString()}
              description="Total xG" 
            />
            <StatCard 
              title="Clean Sheets" 
              value={`${metrics.metrics?.clean_sheet_percentage?.toFixed(1) || 'N/A'}%`}
              description="Clean sheet percentage" 
            />
          </div>
        )}
        
        {/* Help text */}
        <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
          <p>
            <strong>How to read this chart:</strong> The radar chart shows key performance metrics across different 
            categories. Each axis represents a normalized metric (0-100), where higher values (further from center) 
            indicate better performance. Use the dropdown above the chart to focus on specific metric categories.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Stat card component for displaying individual stats
 */
interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  );
};

export default TeamDashboard;