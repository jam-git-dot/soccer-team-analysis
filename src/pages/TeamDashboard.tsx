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
      </div>
    </div>
  );
};

export default TeamDashboard;