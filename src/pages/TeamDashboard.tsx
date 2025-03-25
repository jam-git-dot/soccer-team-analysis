import { useParams, Link } from 'react-router-dom';
import PlayStyleVisualization from '../components/team-dashboard/PlayStyleVisualization';
import { useTeamMetrics } from '@/hooks';

/**
 * Team Dashboard Page component
 * Displays play style visualization for a selected team
 */
const TeamDashboard = () => {
  // Get team ID from URL params
  const { teamId } = useParams<{ teamId: string }>();
  
  // Fetch team metrics data
  const { metrics, loading, error, refreshMetrics } = useTeamMetrics(teamId);

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
        <h1 className="mb-2 text-3xl font-bold">Team Play Style Analysis</h1>
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
          teamName={teamId || 'Team'}
        />
      </div>
    </div>
  );
};

export default TeamDashboard;