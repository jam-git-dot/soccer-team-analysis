/**
 * Chart configurations
 * Centralized configuration for different chart types and their metrics
 */

import { MetricId } from './metrics';

/**
 * Chart configuration types
 */
export type ChartType = 'radar' | 'bar' | 'line';

export type CategoryMetrics = {
  [category: string]: MetricId[];
};

export type ChartConfig = {
  id: string;
  name: string;
  description: string;
  type: ChartType;
  metrics: CategoryMetrics;
};

/**
 * Predefined configurations for radar charts
 */
export const RADAR_CHART_CONFIGS: Record<string, ChartConfig> = {
  'team-overview': {
    id: 'team-overview',
    name: 'Team Overview',
    description: 'Key metrics across all categories',
    type: 'radar',
    metrics: {
      possession: [
        'possession_percentage',
        'pass_completion',
        'progressive_passes',
        'ppda'
      ],
      attacking: [
        'expected_goals',
        'shot_accuracy',
        'counter_attack_frequency',
        'set_piece_dependency'
      ],
      defensive: [
        'defensive_line_height',
        'pressing_intensity',
        'recovery_time',
        'defensive_duels_won'
      ],
      tempo: [
        'direct_play_vs_possession',
        'transition_speed',
        'game_state_adaptability',
        'attacking_transition_time'
      ]
    }
  },
  'possession-focus': {
    id: 'possession-focus',
    name: 'Possession Focus',
    description: 'Detailed breakdown of possession metrics',
    type: 'radar',
    metrics: {
      possession: [
        'possession_percentage',
        'pass_completion',
        'progressive_passes',
        'build_up_time',
        'ppda'
      ]
    }
  },
  'attacking-focus': {
    id: 'attacking-focus',
    name: 'Attacking Focus',
    description: 'Detailed breakdown of attacking metrics',
    type: 'radar',
    metrics: {
      attacking: [
        'expected_goals',
        'shot_accuracy',
        'counter_attack_frequency',
        'set_piece_dependency',
        'shot_creation_methods',
        'attack_zones'
      ]
    }
  },
  'defensive-focus': {
    id: 'defensive-focus',
    name: 'Defensive Focus',
    description: 'Detailed breakdown of defensive metrics',
    type: 'radar',
    metrics: {
      defensive: [
        'defensive_line_height',
        'pressing_intensity',
        'recovery_time',
        'defensive_duels_won',
        'defensive_actions_by_zone'
      ]
    }
  },
  'tempo-focus': {
    id: 'tempo-focus',
    name: 'Tempo & Transitions Focus',
    description: 'Detailed breakdown of tempo metrics',
    type: 'radar',
    metrics: {
      tempo: [
        'direct_play_vs_possession',
        'transition_speed',
        'game_state_adaptability',
        'attacking_transition_time'
      ]
    }
  }
};

/**
 * Get configuration by ID
 */
export function getChartConfig(configId: string): ChartConfig | undefined {
  return RADAR_CHART_CONFIGS[configId];
}

/**
 * Get default radar chart configuration
 */
export function getDefaultRadarConfig(): ChartConfig {
  return RADAR_CHART_CONFIGS['team-overview'];
}

/**
 * Get all metric IDs from a chart configuration
 */
export function getAllMetricsFromConfig(config: ChartConfig): MetricId[] {
  const allMetrics: MetricId[] = [];
  
  Object.values(config.metrics).forEach(categoryMetrics => {
    allMetrics.push(...categoryMetrics);
  });
  
  return allMetrics;
}