import axios from 'axios';
import { API_CONFIG } from './constants';

/**
 * Configure axios instance for API requests
 */
const apiClient = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/${API_CONFIG.VERSION}`,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for API calls
 */
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens or other request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for API calls
 */
apiClient.interceptors.response.use(
  (response) => {
    // You can transform or modify the response data here
    return response;
  },
  (error) => {
    // Handle API errors here
    const errorResponse = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'An unexpected error occurred',
      data: error.response?.data || null,
    };

    console.error('API Error:', errorResponse);
    return Promise.reject(errorResponse);
  }
);

export default apiClient;

/**
 * API endpoints
 */
export const ENDPOINTS = {
  // Leagues
  LEAGUES: '/leagues',
  LEAGUE_BY_ID: (id: string) => `/leagues/${id}`,
  
  // Teams
  TEAMS: '/teams',
  TEAMS_BY_LEAGUE: (leagueId: string) => `/leagues/${leagueId}/teams`,
  TEAM_BY_ID: (id: string) => `/teams/${id}`,
  
  // Matches
  MATCHES: '/matches',
  MATCHES_BY_TEAM: (teamId: string) => `/teams/${teamId}/matches`,
  MATCH_BY_ID: (id: string) => `/matches/${id}`,
  
  // Metrics
  TEAM_METRICS: (teamId: string) => `/teams/${teamId}/metrics`,
  TEAM_METRICS_BY_MATCH: (teamId: string, matchId: string) => 
    `/teams/${teamId}/matches/${matchId}/metrics`,
};