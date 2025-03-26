import { useParams, Link } from 'react-router-dom';
import PlayStyleVisualization from '../components/team-dashboard/PlayStyleVisualization';
import { useTeamMetrics } from '@/hooks/useTeamMetrics';
import { getTeamInfo } from '@/services/mock-data';

/**
 * Team Dashboard Page component
 * Displays play style visualization for a selected team
 */
const TeamDashboard = () => {
  // Get team ID from URL params
  const { teamId } = useParams<{ teamId: string }>();
  
  // Use a default team ID if none is provided
  const currentTeamId = teamId || 'arsenal';
  
  // Get team info
  const teamInfo = getTeamInfo(currentTeamId);
  
  // Fetch team metrics data
  const { metrics, loading, error, refreshMetrics } = useTeamMetrics(currentTeamId);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb navigation */}
      <div className="mb-6">
        <nav className="flex">
          <Link to="/" className="text-primary-600 hover:underline">
            Home
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">Team Analysis</span>
        </nav>
      </div>

      {/* Team header */}
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">
          {teamInfo?.name || 'Team'} Play Style Analysis
        </h1>
        <p className="text-lg text-gray-600">
          Visualizing key performance metrics and play style patterns
        </p>
      </header>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-8">
        {/* Play Style Radar Chart */}
        <PlayStyleVisualization
          metrics={metrics}
          loading={loading}
          error={error}
          onRefresh={refreshMetrics}
          teamName={teamInfo?.name || currentTeamId}
        />
        
        {/* Team Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics && (
            <>
              <StatCard 
                title="Possession" 
                value={`${metrics.possession.possessionPercentage.toFixed(1)}%`}
                description="Average ball possession" 
              />
              <StatCard 
                title="Goals Per Match" 
                value={metrics.attacking.goalsPerMatch.toFixed(2)}
                description="Average goals scored" 
              />
              <StatCard 
                title="Expected Goals" 
                value={metrics.attacking.xGPerMatch.toFixed(2)}
                description="xG per match" 
              />
              <StatCard 
                title="Clean Sheets" 
                value={`${metrics.defensive.cleanSheetPercentage.toFixed(1)}%`}
                description="Clean sheet percentage" 
              />
            </>
          )}
        </div>
        
        {/* Help text */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
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
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  );
};

export default TeamDashboard;