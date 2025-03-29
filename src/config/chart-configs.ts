/**
 * Chart configurations
 * Centralized configuration for different chart types and their metrics
 */

/**
 * Chart configuration types
 */
export type ChartType = 'radar' | 'bar' | 'line';

export type CategoryMetrics = {
  [category: string]: string[];
};

export interface ChartConfig {
  id: string;
  name: string;
  description: string;
  type: ChartType;
  metrics: CategoryMetrics;
}

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
        'possession_percentage_for',
        'pass_completion',
        'progressive_passes_for', 
        'field_tilt_percentage',
        'passes_per_defensive_action_for',
        'dribble_success_rate'
      ],
      attacking: [
        'xg_for',
        'shots_per_match',
        'shot_accuracy', 
        'big_chances_created',
        'counter_attack_frequency',
        'touches_in_opposition_penalty_area_for'
      ],
      defending: [
        'clean_sheet_percentage',
        'defensive_duels_won',
        'tackles_per_match',
        'defensive_line_height',
        'pressing_intensity',
        'xg_against'
      ],
      tempo: [
        'direct_play_vs_possession',
        'transition_speed',
        'counter_press_after_loss',
        'verticality_index',
        'progressive_carries',
        'recovery_time'
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
        'possession_percentage_for',
        'pass_completion',
        'progressive_passes_for',
        'passes_into_final_third_for',
        'passes_into_penalty_area_for',
        'passes_per_defensive_action_for',
        'dribble_success_rate',
        'field_tilt_percentage',
        'prog_carries_qty_for',
        'touches_in_opposition_penalty_area_for'
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
        'xg_for',
        'npxg_for',
        'shots_per_match',
        'shots_on_target_for',
        'shot_accuracy',
        'avg_shot_distance_for',
        'big_chances_created',
        'counter_attack_frequency',
        'set_piece_dependency',
        'goal_creating_actions_for'
      ]
    }
  },
  'defensive-focus': {
    id: 'defensive-focus',
    name: 'Defensive Focus',
    description: 'Detailed breakdown of defensive metrics',
    type: 'radar',
    metrics: {
      defending: [
        'goals_against',
        'xg_against', 
        'npxg_against',
        'clean_sheet_percentage',
        'defensive_duels_won',
        'tackles_per_match',
        'tackles_for',
        'interceptions_for',
        'clearances_for',
        'defensive_line_height',
        'pressing_intensity',
        'recovery_time'
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
        'attacking_transition_speed',
        'recovery_time',
        'defensive_recovery_time',
        'counter_press_after_loss',
        'verticality_index',
        'progressive_carries',
        'prog_carries_qty_for',
        'carries_into_final_third_for',
        'carries_into_opp_18_for',
        'game_state_adaptability'
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
export function getAllMetricsFromConfig(config: ChartConfig): string[] {
  const allMetrics: string[] = [];
  
  Object.values(config.metrics).forEach(categoryMetrics => {
    allMetrics.push(...categoryMetrics);
  });
  
  return allMetrics;
}

/**
 * Get metrics for play style radar chart
 */
export function getPlayStyleRadarMetrics(): Array<{id: string, category: string}> {
  const config = getDefaultRadarConfig();
  const metrics: Array<{id: string, category: string}> = [];
  
  Object.entries(config.metrics).forEach(([category, metricIds]) => {
    metricIds.forEach(id => {
      metrics.push({
        id,
        category
      });
    });
  });
  
  return metrics;
}

/**
 * Get metrics for a specific category
 */
export function getMetricsForCategory(categoryId: string): string[] {
  const config = getDefaultRadarConfig();
  return config.metrics[categoryId] || [];
}