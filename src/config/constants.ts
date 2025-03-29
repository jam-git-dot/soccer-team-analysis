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

export const SUPPORTED_LEAGUES = [
  {
    id: 'developer-league',
    name: 'Developer League',
    shortName: 'DEV',
    disabled: false // Available league
  },
  {
    id: 'premier-league',
    name: 'Premier League',
    shortName: 'EPL',
    disabled: true // Disabled league (coming soon)
  },
  {
    id: 'la-liga',
    name: 'La Liga',
    shortName: 'LaLiga',
    disabled: true
  },
  // Other leagues with disabled: true
];

// Play Style Categories - now only include id and name to avoid duplication.
// The individual metrics for each category will be defined in the metrics-dictionary.
// Adding in aditional properties to filter display metrics or not.
export const PLAY_STYLE_CATEGORIES = [
  {
    id: 'general',
    name: 'Team General Metrics',
    coreCategory: false, // THIS IS A REFERENCE CATEGORY ONLY, FOR THINGS LIKE WINS, LOSSES, DRAWS, etc.
  },
  {
    id: 'possession',
    name: 'Control, Possession & Build-up',
    coreCategory: true,
  },
  {
    id: 'attacking',
    name: 'Attacking Patterns',
    coreCategory: true,
  },
  {
    id: 'defending',
    name: 'Defensive Organization',
    coreCategory: true,
  },
  {
    id: 'tempo',
    name: 'Tempo & Transitions',
    coreCategory: true,
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
export type MetricCategoryID = typeof PLAY_STYLE_CATEGORIES[number]['id'];
export type MetricCategoryCategoryName = typeof PLAY_STYLE_CATEGORIES[number]['name'];

export enum MetricUnits {
  QTY = "qty",        // a simple quantity unit
  PERCENT = "percent",
  PER90 = "per90",
  other = "other",
}

export enum MetricType {
  RAW = "raw",
  CALCULATED = "calculated",
  PERCENTILE = "percentile",
  RANK = 'rank',
  RANK_PERCENTILE = 'rank_percentile',
  AVERAGE = 'average',
}

