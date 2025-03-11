import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Home page component
 * Simple landing page with league and team selection dropdowns
 */
const HomePage = () => {
  const navigate = useNavigate();
  const [selectedLeague, setSelectedLeague] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');

  // Mock data for leagues - will be replaced with API data
  const leagues = [
    { id: 'champions-league', name: 'UEFA Champions League' },
    { id: 'premier-league', name: 'Premier League' },
    { id: 'la-liga', name: 'La Liga' },
    { id: 'bundesliga', name: 'Bundesliga' },
    { id: 'serie-a', name: 'Serie A' },
    { id: 'ligue-1', name: 'Ligue 1' },
  ];

  // Mock data for teams - will be replaced with API data
  // This would normally be fetched based on the selected league
  const teamsByLeague = {
    'champions-league': [
      { id: 'team-1', name: 'Real Madrid' },
      { id: 'team-2', name: 'Bayern Munich' },
      { id: 'team-3', name: 'Manchester City' },
    ],
    'premier-league': [
      { id: 'team-4', name: 'Manchester City' },
      { id: 'team-5', name: 'Liverpool' },
      { id: 'team-6', name: 'Arsenal' },
    ],
    'la-liga': [
      { id: 'team-7', name: 'Barcelona' },
      { id: 'team-8', name: 'Real Madrid' },
      { id: 'team-9', name: 'Atletico Madrid' },
    ],
    'bundesliga': [
      { id: 'team-10', name: 'Bayern Munich' },
      { id: 'team-11', name: 'Borussia Dortmund' },
      { id: 'team-12', name: 'RB Leipzig' },
    ],
    'serie-a': [
      { id: 'team-13', name: 'Inter Milan' },
      { id: 'team-14', name: 'AC Milan' },
      { id: 'team-15', name: 'Juventus' },
    ],
    'ligue-1': [
      { id: 'team-16', name: 'PSG' },
      { id: 'team-17', name: 'Marseille' },
      { id: 'team-18', name: 'Monaco' },
    ],
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
                <option key={league.id} value={league.id}>
                  {league.name}
                </option>
              ))}
            </select>
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