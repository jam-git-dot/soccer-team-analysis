import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAllTeams } from '../services/mock-data';
import { SUPPORTED_LEAGUES } from '@/config/constants';

/**
 * Team Selection Page component
 * Displays all teams in a selected league with search and filter functionality
 */
const TeamSelectionPage = () => {
  const { leagueId } = useParams<{ leagueId: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ensure we're using a valid league ID
  const currentLeagueId = leagueId || 'developer-league';
  
  // Fetch teams on component mount or when leagueId changes
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if the league is available
        const league = SUPPORTED_LEAGUES.find(l => l.id === currentLeagueId);
        if (!league) {
          throw new Error(`Unknown league: ${currentLeagueId}`);
        }
        
        if (league.disabled) {
          throw new Error(`The ${league.name} data is not available yet.`);
        }
        
        // Get teams for the league
        const allTeams = getAllTeams();
        
        // Map teams to simplified format
        const formattedTeams = allTeams.map(team => ({
          id: team.id,
          name: team.name,
          logo: team.logoUrl || `https://placehold.co/80x80?text=${team.shortName || team.name.substring(0, 3).toUpperCase()}`
        }));
        
        setTeams(formattedTeams);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err instanceof Error ? err.message : 'Failed to load teams');
        setLoading(false);
      }
    };
    
    fetchTeams();
  }, [currentLeagueId]);

  // Filter teams based on search term
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get league name based on ID from constants
  const getLeagueName = (id: string) => {
    const league = SUPPORTED_LEAGUES.find(league => league.id === id);
    return league ? league.name : id;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex h-64 w-full items-center justify-center">
          <p className="text-lg text-gray-500">Loading teams...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <h2 className="mb-4 text-xl font-bold text-red-700">Error</h2>
          <p className="text-red-600">{error}</p>
          <Link to="/" className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb navigation */}
      <div className="mb-6">
        <nav className="flex">
          <Link to="/" className="text-primary-600 hover:underline">
            Home
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">{getLeagueName(currentLeagueId)}</span>
        </nav>
      </div>

      {/* Page header */}
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">{getLeagueName(currentLeagueId)}</h1>
        <p className="text-lg text-gray-600">
          Select a team to view detailed play style analysis and performance metrics.
        </p>
      </header>

      {/* Search and filter */}
      <div className="mb-8">
        <div className="flex w-full max-w-md items-center rounded-md border border-gray-300 bg-white px-3 py-2">
          <svg
            className="mr-3 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            placeholder="Search teams..."
            className="w-full focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Teams grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredTeams.map((team) => (
          <Link
            key={team.id}
            to={`/team/${team.id}`}
            className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-primary-500 hover:shadow-md"
          >
            <img
              src={team.logo}
              alt={`${team.name} logo`}
              className="mb-4 h-20 w-20 object-contain"
            />
            <h3 className="text-center text-xl font-medium">{team.name}</h3>
          </Link>
        ))}
      </div>

      {/* No results */}
      {filteredTeams.length === 0 && (
        <div className="mt-8 rounded-md bg-gray-50 p-8 text-center">
          <p className="text-lg text-gray-600">
            No teams found matching your search. Please try a different search term.
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamSelectionPage;