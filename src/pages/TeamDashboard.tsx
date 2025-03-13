import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PlayStyleDashboard from '../components/team-dashboard/PlayStyleDashboard';
import LeagueDashboard from '../components/league-dashboard/LeagueDashboard';
import TeamComparison from '../components/compare-dashboard/TeamComparison';
import { getAllTeams, getTeamInfo } from '../services/mock-data';

/**
 * Team Dashboard Page component
 * Displays detailed analysis and metrics for a selected team
 */
const TeamDashboard = () => {
  const { teamId, compareTeamId } = useParams<{ teamId: string; compareTeamId?: string }>();
  const [activeTab, setActiveTab] = useState('team');

  // Ensure teamId is a string
  const safeTeamId = typeof teamId === 'string' ? teamId : '';

  // Get team info from mock data service
  const mockTeamInfo = getTeamInfo(safeTeamId);

  // Fallback to mock data if team info not found
  const teamInfo = mockTeamInfo || {
    id: safeTeamId,
    name: safeTeamId === 'man-city' ? 'Manchester City' : 'Liverpool',
    shortName: safeTeamId === 'man-city' ? 'MCI' : 'LIV',
    logoUrl: `https://placehold.co/100x100?text=${safeTeamId === 'man-city' ? 'MC' : 'LFC'}`,
    league: 'Premier League',
    leagueId: 'premier-league',
  };

  // Get all teams for the selector
  const allTeams = getAllTeams();
  const comparisonTeams = allTeams.filter(team => team.id !== safeTeamId).slice(0, 8);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb navigation */}
      <div className="mb-6">
        <nav className="flex">
          <Link to="/" className="text-primary-600 hover:underline">
            Home
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link to={`/league/${teamInfo.leagueId || 'premier-league'}`} className="text-primary-600 hover:underline">
            Premier League
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">{teamInfo.name}</span>
        </nav>
      </div>

      {/* Team header */}
      <header className="mb-8 flex flex-col items-center md:flex-row">
        <img
          src={teamInfo.logoUrl}
          alt={`${teamInfo.name} logo`}
          className="mr-6 h-24 w-24 object-contain"
        />
        <div>
          <h1 className="mb-2 text-3xl font-bold">{teamInfo.name}</h1>
          <p className="text-lg text-gray-600">Premier League</p>
        </div>
      </header>

      {/* Tab navigation */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            className={`mr-4 border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === 'team'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('team')}
          >
            Team
          </button>
          <button
            className={`mr-4 border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === 'league'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('league')}
          >
            League
          </button>
          <button
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === 'compare'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('compare')}
          >
            Compare
          </button>
        </nav>
      </div>

      {/* Tab content */}
      <div className="min-h-[50vh]">
        {activeTab === 'team' && (
          <PlayStyleDashboard teamId={safeTeamId} />
        )}
        
        {activeTab === 'league' && (
          <LeagueDashboard teamId={safeTeamId} />
        )}
        
        {activeTab === 'compare' && (
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Compare Teams</h2>
            <p className="mb-6 text-gray-600">
              Compare {teamInfo.name} with another team to see similarities and differences in play styles.
            </p>
            
            {/* Team selector for comparison */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-medium">Select Team to Compare</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {comparisonTeams.map((team) => (
                  <Link
                    key={team.id}
                    to={`/team/${safeTeamId}/compare/${team.id}`}
                    className={`flex flex-col items-center rounded p-2 transition-colors ${
                      compareTeamId === team.id
                        ? 'bg-primary-100 text-primary-800'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <img
                      src={team.logoUrl}
                      alt={`${team.name} logo`}
                      className="mb-2 h-12 w-12 object-contain"
                    />
                    <span className="text-center text-xs font-medium">
                      {team.shortName}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            
            {compareTeamId ? (
              typeof compareTeamId === 'string' ? (
                <TeamComparison teamId={safeTeamId} compareTeamId={compareTeamId} />
              ) : (
                <div className="rounded-lg bg-gray-50 p-8 text-center">
                  <p className="text-lg text-gray-600">
                    Invalid comparison team.
                  </p>
                </div>
              )
            ) : (
              <div className="rounded-lg bg-gray-50 p-8 text-center">
                <p className="text-lg text-gray-600">
                  Select a team above to compare with {teamInfo.name}.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDashboard;