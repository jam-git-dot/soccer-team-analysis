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

// Play Style Categories
export const PLAY_STYLE_CATEGORIES = [
  {
    id: 'possession',
    name: 'Possession & Build-up',
    metrics: [
      'possession_percentage',
      'pass_completion',
      'progressive_passes',
      'build_up_time',
      'ppda',
    ],
  },
  {
    id: 'attacking',
    name: 'Attacking Patterns',
    metrics: [
      'shot_creation_methods',
      'attack_zones',
      'counter_attack_frequency',
      'set_piece_dependency',
    ],
  },
  {
    id: 'defensive',
    name: 'Defensive Organization',
    metrics: [
      'defensive_line_height',
      'pressing_intensity',
      'recovery_time',
      'defensive_actions_by_zone',
    ],
  },
  {
    id: 'tempo',
    name: 'Tempo & Transitions',
    metrics: [
      'direct_play_vs_possession',
      'transition_speed',
      'game_state_adaptability',
    ],
  },
];

export default {
  API_CONFIG,
  FEATURES,
  APP_SETTINGS,
  CACHE_SETTINGS,
  SUPPORTED_LEAGUES,
  PLAY_STYLE_CATEGORIES,
};
