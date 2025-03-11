import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

/**
 * Team Dashboard Page component
 * Displays detailed analysis and metrics for a selected team
 */
const TeamDashboard = () => {
  const { teamId, compareTeamId } = useParams<{ teamId: string; compareTeamId?: string }>();
  const [activeTab, setActiveTab] = useState('team');

  // Mock data for team info - will be replaced with API data
  const teamInfo = {
    id: teamId,
    name: teamId === 'team-1' ? 'Manchester City' : 'Liverpool',
    logo: `https://placehold.co/100x100?text=${teamId === 'team-1' ? 'MC' : 'LFC'}`,
    league: 'Premier League',
    leagueId: 'premier-league',
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
          <Link to={`/league/${teamInfo.leagueId}`} className="text-primary-600 hover:underline">
            {teamInfo.league}
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">{teamInfo.name}</span>
        </nav>
      </div>

      {/* Team header */}
      <header className="mb-8 flex flex-col items-center md:flex-row">
        <img
          src={teamInfo.logo}
          alt={`${teamInfo.name} logo`}
          className="mr-6 h-24 w-24 object-contain"
        />
        <div>
          <h1 className="mb-2 text-3xl font-bold">{teamInfo.name}</h1>
          <p className="text-lg text-gray-600">{teamInfo.league}</p>
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
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Team Analysis</h2>
            <p className="mb-8 text-gray-600">
              Detailed analysis of {teamInfo.name}'s play style and performance metrics.
            </p>
            
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Placeholder for play style visualization */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-medium">Play Style Overview</h3>
                <div className="flex h-64 items-center justify-center bg-gray-100">
                  <p className="text-gray-500">Radar chart visualization will be displayed here</p>
                </div>
              </div>
              
              {/* Placeholder for performance by result */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-medium">Performance by Result</h3>
                <div className="flex h-64 items-center justify-center bg-gray-100">
                  <p className="text-gray-500">Bar chart visualization will be displayed here</p>
                </div>
              </div>
            </div>

            <h3 className="mb-4 text-xl font-semibold">Metric Categories</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Possession and Build-up */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <h4 className="mb-2 font-medium">Possession & Build-up</h4>
                <p className="text-sm text-gray-600">
                  Possession %, pass completion, progressive passes, etc.
                </p>
                <div className="mt-4 h-32 bg-gray-100"></div>
              </div>
              
              {/* Attacking Patterns */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <h4 className="mb-2 font-medium">Attacking Patterns</h4>
                <p className="text-sm text-gray-600">
                  Shot creation methods, attack zones, counter-attacks, etc.
                </p>
                <div className="mt-4 h-32 bg-gray-100"></div>
              </div>
              
              {/* Defensive Organization */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <h4 className="mb-2 font-medium">Defensive Organization</h4>
                <p className="text-sm text-gray-600">
                  Defensive line height, pressing intensity, recovery time, etc.
                </p>
                <div className="mt-4 h-32 bg-gray-100"></div>
              </div>
              
              {/* Tempo and Transitions */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <h4 className="mb-2 font-medium">Tempo & Transitions</h4>
                <p className="text-sm text-gray-600">
                  Direct play vs. possession, transition speed, game state adaptability, etc.
                </p>
                <div className="mt-4 h-32 bg-gray-100"></div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'league' && (
          <div>
            <h2 className="mb-4 text-2xl font-semibold">League Analysis</h2>
            <p className="text-gray-600">
              Comparative metrics and rankings for all teams in {teamInfo.league}.
            </p>
            <div className="mt-8 flex h-64 items-center justify-center rounded bg-gray-100">
              <p className="text-gray-500">League comparison visualizations will be displayed here</p>
            </div>
          </div>
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
                {/* Mock data - will be replaced with API data */}
                {['team-1', 'team-2', 'team-3', 'team-4'].map((id) => (
                  <Link
                    key={id}
                    to={`/team/${teamId}/compare/${id}`}
                    className={`flex flex-col items-center rounded p-2 transition-colors ${
                      compareTeamId === id
                        ? 'bg-primary-100 text-primary-800'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <img
                      src={`https://placehold.co/60x60?text=${id === 'team-1' ? 'MC' : id === 'team-2' ? 'LFC' : id === 'team-3' ? 'CFC' : 'AFC'}`}
                      alt={`Team logo`}
                      className="mb-2 h-12 w-12 object-contain"
                    />
                    <span className="text-center text-xs font-medium">
                      {id === 'team-1'
                        ? 'Man City'
                        : id === 'team-2'
                        ? 'Liverpool'
                        : id === 'team-3'
                        ? 'Chelsea'
                        : 'Arsenal'}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            
            {compareTeamId ? (
              <div>
                <h3 className="mb-4 text-xl font-medium">Comparison Metrics</h3>
                <div className="flex h-64 items-center justify-center rounded bg-gray-100">
                  <p className="text-gray-500">Team comparison visualizations will be displayed here</p>
                </div>
              </div>
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
