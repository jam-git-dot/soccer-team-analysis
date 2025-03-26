import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTeams } from '../services/mock-data';
import { SUPPORTED_LEAGUES } from '../config/constants';

/**
 * Home page component
 * Simple landing page with league and team selection dropdowns
 */
const HomePage = () => {
  const navigate = useNavigate();
  const [selectedLeague, setSelectedLeague] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');

  // Get leagues from constants
  const leagues = SUPPORTED_LEAGUES;

  // Get Premier League teams from mock data
  const allTeams = getAllTeams();

  // For version 0.5, we're focusing only on Premier League
  const teamsByLeague = {
    'premier-league': allTeams,
    'champions-league': [],
    'la-liga': [],
    'bundesliga': [],
    'serie-a': [],
    'ligue-1': [],
  };

  // Get available teams based on selected league
  const availableTeams = selectedLeague ? teamsByLeague[selectedLeague as keyof typeof teamsByLeague] || [] : [];

  // Handle league selection
  const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const leagueId = e.target.value;
    setSelectedLeague(leagueId);
    setSelectedTeam(''); // Reset team selection when league changes
  };

  // Handle team selection
  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeam(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTeam) {
      navigate(`/team/${selectedTeam}`);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
          Soccer Team Play Style Analysis
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* League Selection */}
          <div className="space-y-2">
            <label htmlFor="league-select" className="block text-lg font-medium text-gray-700">
              Pick A League
            </label>
            <select
              id="league-select"
              value={selectedLeague}
              onChange={handleLeagueChange}
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              required
            >
              <option value="">Select a league</option>
              {leagues.map((league) => (
                <option 
                  key={league.id} 
                  value={league.id}
                  disabled={league.id !== 'premier-league'} // Only enable Premier League for v0.5
                >
                  {league.name} {league.id !== 'premier-league' ? '(Coming Soon)' : ''}
                </option>
              ))}
            </select>
            {!selectedLeague && (
              <p className="text-xs text-gray-500 mt-1">
                Note: For version 0.5, only Premier League teams are available
              </p>
            )}
          </div>

          {/* Team Selection */}
          <div className="space-y-2">
            <label htmlFor="team-select" className="block text-lg font-medium text-gray-700">
              Pick A Team
            </label>
            <select
              id="team-select"
              value={selectedTeam}
              onChange={handleTeamChange}
              disabled={!selectedLeague}
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-gray-100"
              required
            >
              <option value="">
                {selectedLeague ? 'Select a team' : 'Please select a league first'}
              </option>
              {availableTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={!selectedTeam}
              className="w-full rounded-md bg-primary-600 py-2 px-4 text-center text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              View Team Analysis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePage;