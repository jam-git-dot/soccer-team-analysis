/**
 * Metrics configuration
 * Centralizes metric definitions, formatting, and visualization defaults
 */

import { PLAY_STYLE_CATEGORIES } from './constants';

// Metric data types
export type MetricId = string;

export type MetricUnit = 
  | 'percentage' 
  | 'seconds' 
  | 'count' 
  | 'meters'
  | 'km/h'
  | 'ratio'
  | 'score'
  | 'index';

export type MetricFormat = {
  decimals: number;
  showUnit: boolean;
  prefix?: string;
  suffix?: string;
};

export type VisualizationType = 
  | 'bar'
  | 'line'
  | 'radar'
  | 'distribution'
  | 'heatmap';

export type MetricDefinition = {
  id: MetricId;
  name: string;
  description: string;
  category: 'possession' | 'attacking' | 'defensive' | 'tempo';
  unit: MetricUnit;
  format: MetricFormat;
  range: {
    min: number;
    max: number;
  };
  higherIsBetter: boolean;
  defaultVisualization: VisualizationType;
  includeInPlayStyleRadar: boolean;
};

/**
 * Complete metrics definition
 */
export const METRICS: Record<MetricId, MetricDefinition> = {
  // Possession & Build-up metrics
  possession_percentage: {
    id: 'possession_percentage',
    name: 'Possession',
    description: 'Percentage of time the team has possession of the ball',
    category: 'possession',
    unit: 'percentage',
    format: {
      decimals: 1,
      showUnit: true,
      suffix: '%'
    },
    range: {
      min: 0,
      max: 100
    },
    higherIsBetter: true,
    defaultVisualization: 'bar',
    includeInPlayStyleRadar: true
  },
  pass_completion: {
    id: 'pass_completion',
    name: 'Pass Completion',
    description: 'Percentage of passes that successfully reach a teammate',
    category: 'possession',
    unit: 'percentage',
    format: {
      decimals: 1,
      showUnit: true,
      suffix: '%'
    },
    range: {
      min: 0,
      max: 100
    },
    higherIsBetter: true,
    defaultVisualization: 'bar',
    includeInPlayStyleRadar: true
  },
  progressive_passes: {
    id: 'progressive_passes',
    name: 'Progressive Passes',
    description: 'Number of passes that move the ball significantly closer to the opponent\'s goal',
    category: 'possession',
    unit: 'count',
    format: {
      decimals: 0,
      showUnit: false
    },
    range: {
      min: 0,
      max: 100
    },
    higherIsBetter: true,
    defaultVisualization: 'bar',
    includeInPlayStyleRadar: true
  },
  build_up_time: {
    id: 'build_up_time',
    name: 'Build-up Time',
    description: 'Average time taken to move the ball from defense to attacking third',
    category: 'possession',
    unit: 'seconds',
    format: {
      decimals: 1,
      showUnit: true,
      suffix: 's'
    },
    range: {
      min: 0,
      max: 30
    },
    higherIsBetter: false,
    defaultVisualization: 'bar',
    includeInPlayStyleRadar: false
  },
  ppda: {
    id: 'ppda',
    name: 'PPDA',
    description: 'Passes Per Defensive Action - measure of pressing intensity',
    category: 'possession',
    unit: 'ratio',
    format: {
      decimals: 1,
      showUnit: false
    },
    range: {
      min: 0,
      max: 20
    },
    higherIsBetter: false,
    defaultVisualization: 'bar',
    includeInPlayStyleRadar: true
  },

  // Attacking Patterns metrics
  shot_creation_methods: {
    id: 'shot_creation_methods',
    name: 'Shot Creation Methods',
    description: 'Distribution of how shots are created (open play, set pieces, etc.)',
    category: 'attacking',
    unit: 'percentage',
    format: {
      decimals: 0,
      showUnit: true,
      suffix: '%'
    },
    range: {
      min: 0,
      max: 100
    },
    higherIsBetter: true,
    defaultVisualization: 'distribution',
    includeInPlayStyleRadar: false
  },
  attack_zones: {
    id: 'attack_zones',
    name: 'Attack Zones',
    description: 'Distribution of attacks by zone (left, center, right)',
    category: 'attacking',
    unit: 'percentage',
    format: {
      decimals: 0,
      showUnit: true,
      suffix: '%'
    },
    range: {
      min: 0,
      max: 100
    },
    higherIsBetter: true,
    defaultVisualization: 'distribution',
    includeInPlayStyleRadar: false
  },
  counter_attack_frequency: {
    id: 'counter_attack_frequency',
    name: 'Counter-Attack Frequency',
    description: 'Percentage of attacks that are counter-attacks',
    category: 'attacking',
    unit: 'percentage',
    format: {
      decimals: 1,
      showUnit: true,
      suffix: '%'
    },
    range: {
      min: 0,
      max: 50
    },
    higherIsBetter: true,
    defaultVisualization: 'bar',
    includeInPlayStyleRadar: true
  },
  set_piece_dependency: {
    id: 'set_piece_dependency',
    name: 'Set Piece Dependency',
    description: 'Percentage of goals scored from set pieces',
    category: 'attacking',
    unit: 'percentage',
    format: {
      decimals: 1,
      showUnit: true,
      suffix: '%'
    },
    range: {
      min: 0,
      max: 100
    },
    higherIsBetter: true,
    defaultVisualization: 'bar',
    includeInPlayStyleRadar: true
  },
  expected_goals: {
    id: 'expected_goals',
    name: 'Expected Goals (xG)',
    description: 'Expected goals based on quality of chances created',
    category: 'attacking',
    unit: 'count',
    format: {
      decimals: 2,
      showUnit: false
    },
    range: {
      min: 0,
      max: 5
    },
    higherIsBetter: true,
    defaultVisualization: 'bar',
    includeInPlayStyleRadar: true
  },
  shot_accuracy: {
    id: 'shot_accuracy',
    name: 'Shot Accuracy',
    description: 'Percentage of shots on target',
    category: 'attacking',
    unit: 'percentage',
    format: {
      decimals: 1,
      showUnit: true,
      suffix: '%'
    },
    range: {
      min: 0,
      max: 100
    },
    higherIsBetter: true,
    defaultVisualization: 'bar',
    includeInPlayStyleRadar: true
  },

  // Defensive Organization metrics
  defensive_line_height: {
    id: 'defensive_line_height',
    name: 'Defensive Line Height',
    description: 'Average distance of defensive line from own goal',
    category: 'defensive',
    unit: 'meters',
    format: {
      decimals: 1,
      showUnit: true,
      suffix: 'm'
    },
    range: {
      min: 10,
      max: 60
    },
    higherIsBetter: true,
    defaultVisualization: 'bar',
    includeInPlayStyleRadar: true
  },
  pressing_intensity: {
    id: 'pressing_intensity',
    name: 'Pressing Intensity',
    description: 'Index of how aggressively the team presses (0-100)',
    category: 'defensive',
    unit: 'index',
    format: {
      decimals: 0,
      showUnit: false
    },
    range: {
      min: 0,
      max: 100
    },
    higherIsBetter: true,
    defaultVisualization: 'bar',
    includeInPlayStyleRadar: true
  },
  recovery_time: {
    id: 'recovery_time',
    name: 'Recovery Time',
    description: 'Average time to regain possession after losing it',
    category: 'defensive',
    unit: 'seconds',
    format: {
      decimals: 1,
      showUnit: true,
      suffix: 's'
    },
    range: {
      min: 0,
      max: 30
    },
    higherIsBetter: false,
    defaultVisualization: 'bar',
    includeInPlayStyleRadar: true
  },
  defensive_actions_by_zone: {
    id: 'defensive_actions_by_zone',
    name: 'Defensive Actions by Zone',
    description: 'Distribution of defensive actions by pitch zone',
    category: 'defensive',
    unit: 'percentage',
    format: {
      decimals: 0,
      showUnit: true,
      suffix: '%'
    },
    range: {
      min: 0,
      max: 100
    },
    higherIsBetter: true,
    defaultVisualization: 'heatmap',
    includeInPlayStyleRadar: false
  },
  defensive_duels_won: {
    id: 'defensive_duels_won',
    name: 'Defensive Duels Won',
    description: 'Percentage of defensive duels won',
    category: 'defensive',
    unit: 'percentage',
    format: {
      decimals: 1,
      showUnit: true,
      suffix: '%'
    },
    range: {
      min: 0,
      max: 100
    },
    higherIsBetter: true,
    defaultVisualization: 'bar',
    includeInPlayStyleRadar: true
  },

  // Tempo & Transitions metrics
  direct_play_vs_possession: {
    id: 'direct_play_vs_possession',
    name: 'Direct Play vs Possession',
    description: 'Index representing tendency toward direct play (100) vs patient possession (0)',
    category: 'tempo',
    unit: 'index',
    format: {
      decimals: 0,
      showUnit: false
    },
    range: {
      min: 0,
      max: 100
    },
    higherIsBetter: null, // Neutral - depends on tactical preference
    defaultVisualization: 'bar',
    includeInPlayStyleRadar: true
  },
  transition_speed: {
    id: 'transition_speed',
    name: 'Transition Speed',
    description: 'Average speed of transitions from defense to attack',
    category: 'tempo',
    unit: 'km/h',
    format: {
      decimals: 1,
      showUnit: true,
      suffix: 'km/h'
    },
    range: {
      min: 0,
      max: 30
    },
    higherIsBetter: true,
    defaultVisualization: 'bar',
    includeInPlayStyleRadar: true
  },
  game_state_adaptability: {
    id: 'game_state_adaptability',
    name: 'Game State Adaptability',
    description: 'Index of how team performance varies by game state (winning/losing/drawing)',
    category: 'tempo',
    unit: 'index',
    format: {
      decimals: 0,
      showUnit: false
    },
    range: {
      min: 0,
      max: 100
    },
    higherIsBetter: true,
    defaultVisualization: 'distribution',
    includeInPlayStyleRadar: true
  },
  attacking_transition_time: {
    id: 'attacking_transition_time',
    name: 'Attacking Transition Time',
    description: 'Average time from winning possession to creating a shot',
    category: 'tempo',
    unit: 'seconds',
    format: {
      decimals: 1,
      showUnit: true,
      suffix: 's'
    },
    range: {
      min: 0,
      max: 30
    },
    higherIsBetter: false,
    defaultVisualization: 'bar',
    includeInPlayStyleRadar: true
  }
};

/**
 * Helper functions for working with metrics
 */

/**
 * Get all metrics for a specific category
 */
export function getMetricsByCategory(category: string): MetricDefinition[] {
  return Object.values(METRICS).filter(metric => metric.category === category);
}

/**
 * Get metrics by their IDs
 */
export function getMetricsByIds(metricIds: MetricId[]): MetricDefinition[] {
  return metricIds.map(id => METRICS[id]).filter(Boolean);
}

/**
 * Get metrics for a play style category
 */
export function getMetricsForPlayStyleCategory(categoryId: string): MetricDefinition[] {
  const category = PLAY_STYLE_CATEGORIES.find(cat => cat.id === categoryId);
  if (!category) return [];
  
  return category.metrics
    .map(metricId => METRICS[metricId])
    .filter(Boolean);
}

/**
 * Get metrics to include in play style radar chart
 */
export function getPlayStyleRadarMetrics(): MetricDefinition[] {
  return Object.values(METRICS).filter(metric => metric.includeInPlayStyleRadar);
}

/**
 * Format a metric value according to its definition
 */
export function formatMetricValue(metricId: MetricId, value: number): string {
  const metric = METRICS[metricId];
  if (!metric) return value.toString();
  
  const { format } = metric;
  const formatted = value.toFixed(format.decimals);
  
  if (!format.showUnit) return format.prefix ? `${format.prefix}${formatted}` : formatted;
  
  return `${format.prefix || ''}${formatted}${format.suffix || ''}`;
}

/**
 * Normalize a metric value to a 0-100 scale based on its range
 */
export function normalizeMetricValue(metricId: MetricId, value: number): number {
  const metric = METRICS[metricId];
  if (!metric) return value;
  
  const { range, higherIsBetter } = metric;
  const normalized = ((value - range.min) / (range.max - range.min)) * 100;
  
  // Invert scale if lower values are better
  return higherIsBetter === false ? 100 - normalized : normalized;
}

/**
 * Check if a higher value for this metric is better
 */
export function isHigherBetter(metricId: MetricId): boolean | null {
  const metric = METRICS[metricId];
  if (!metric) return null;
  
  return metric.higherIsBetter;
}