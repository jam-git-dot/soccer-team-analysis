/**
 * Application constants
 * Centralizes configuration values and constants
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  VERSION: import.meta.env.VITE_API_VERSION || 'v1',
  TIMEOUT: 30000, // 30 seconds
};

// Feature Flags
export const FEATURES = {
  ENABLE_CACHE: import.meta.env.VITE_ENABLE_CACHE === 'true',
  ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  ENABLE_DEV_TOOLS: import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
};

// Application Settings
export const APP_SETTINGS = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Soccer Analysis',
  DEFAULT_LEAGUE: import.meta.env.VITE_DEFAULT_LEAGUE || 'premier-league',
};

// Cache Settings
export const CACHE_SETTINGS = {
  TTL: 60 * 60 * 1000, // 1 hour in milliseconds
  STORAGE_KEY: 'soccer_analysis_cache',
};

// Supported Leagues
export const SUPPORTED_LEAGUES = [
  {
    id: 'champions-league',
    name: 'UEFA Champions League',
    shortName: 'UCL',
  },
  {
    id: 'premier-league',
    name: 'Premier League',
    shortName: 'EPL',
  },
  {
    id: 'la-liga',
    name: 'La Liga',
    shortName: 'LaLiga',
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    shortName: 'BL',
  },
  {
    id: 'serie-a',
    name: 'Serie A',
    shortName: 'SA',
  },
  {
    id: 'ligue-1',
    name: 'Ligue 1',
    shortName: 'L1',
  },
];

// Play Style Categories - now only include id and name to avoid duplication.
// The individual metrics for each category will be defined in the metrics-dictionary.
export const PLAY_STYLE_CATEGORIES = [
  {
    id: 'possession',
    name: 'Possession & Build-up',
  },
  {
    id: 'attacking',
    name: 'Attacking Patterns',
  },
  {
    id: 'defensive',
    name: 'Defensive Organization',
  },
  {
    id: 'tempo',
    name: 'Tempo & Transitions',
  },
] as const;

export default {
  API_CONFIG,
  FEATURES,
  APP_SETTINGS,
  CACHE_SETTINGS,
  SUPPORTED_LEAGUES,
  PLAY_STYLE_CATEGORIES,
};

// Derived types from PLAY_STYLE_CATEGORIES
export type PlayStyleCategoryID = typeof PLAY_STYLE_CATEGORIES[number]['id'];
export type PlayStyleCategoryName = typeof PLAY_STYLE_CATEGORIES[number]['name'];