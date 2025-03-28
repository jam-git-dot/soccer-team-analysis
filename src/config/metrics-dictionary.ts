/**
 * Metrics dictionary
 * Comprehensive definition of all metrics used in the application
 */

import { MetricCategoryID, MetricUnits, MetricType } from './constants';

export interface MetricDefinition {
  id: string;                     // unique identifier for the metric
  displayName: string;            // display name for the metric
  shortName: string;              // short name for the metric
  category: MetricCategoryID;     // one of 'possession' | 'attacking' | 'defensive' | 'tempo'
  type: MetricType;               // 'raw' | 'calculated' | 'percentile' | 'rank' | 'rank_percentile' | 'average'
  units: MetricUnits;             // 'qty' | 'percent' | 'per90' | 'other'
  description: string;            // description of the metric
  higherIsBetter: boolean | null; // whether higher values are better
  range?: {                       // optional range for normalization
    min: number;
    max: number;
  };
}

/**
 * Complete metrics dictionary
 */
export const METRICS_DICTIONARY: MetricDefinition[] = [
  // Group 1: General Data
  {
    id: "matches_played",
    displayName: "Matches Played",
    shortName: "MP",
    category: "general",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of matches played by the team.",
    higherIsBetter: null
  },
  {
    id: "wins_for",
    displayName: "Wins",
    shortName: "W",
    category: "general",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of matches won by the team.",
    higherIsBetter: true
  },
  {
    id: "draws_for",
    displayName: "Draws",
    shortName: "D",
    category: "general",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of matches drawn/tied by the team.",
    higherIsBetter: null
  },
  {
    id: "losses_for",
    displayName: "Losses",
    shortName: "L",
    category: "general",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of matches lost by the team.",
    higherIsBetter: false
  },

  // Group 2: Goalkeeping (Category: Defensive)
  {
    id: "goals_against",
    displayName: "Goals Against",
    shortName: "GA",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of goals conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "pk_goals_against",
    displayName: "PK Goals Against",
    shortName: "PKGA",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of penalty kick goals conceded.",
    higherIsBetter: false
  },
  {
    id: "free_kick_goals_against",
    displayName: "Free Kick Goals Against",
    shortName: "FKGA",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of free kick goals conceded.",
    higherIsBetter: false
  },
  {
    id: "corner_kick_goals_against",
    displayName: "Corner Kick Goals Against",
    shortName: "CKGA",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of corner kick goals conceded.",
    higherIsBetter: false
  },
  {
    id: "shots_on_target_conceded",
    displayName: "Shots on Target Conceded",
    shortName: "STC",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of shots on target conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "saves",
    displayName: "Saves",
    shortName: "SV",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of saves made by the goalkeeper.",
    higherIsBetter: true
  },
  {
    id: "clean_sheets",
    displayName: "Clean Sheets",
    shortName: "CS",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of clean sheets kept.",
    higherIsBetter: true
  },
  {
    id: "pk_attempts_goalkeeping",
    displayName: "Penalty Kick Attempts Faced",
    shortName: "PKF",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of penalty kick attempts conceded.",
    higherIsBetter: false
  },
  {
    id: "post_shot_expected_goals_against",
    displayName: "Post-Shot xG Against",
    shortName: "PSxGA",
    category: "defending",
    type: MetricType.CALCULATED,
    units: MetricUnits.QTY,
    description: "Total post-shot expected goals conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "post_shot_expected_goals_for",
    displayName: "Post-Shot xG For",
    shortName: "PSxGF",
    category: "attacking",
    type: MetricType.CALCULATED,
    units: MetricUnits.QTY,
    description: "Total post-shot expected goals created by the team.",
    higherIsBetter: true
  },
  
  // Group 3: Shots (For: Attacking; Against: Defensive)
  {
    id: "shots_for",
    displayName: "Shots For",
    shortName: "ShF",
    category: "attacking",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of shots taken by the team.",
    higherIsBetter: true
  },
  {
    id: "shots_against",
    displayName: "Shots Against",
    shortName: "ShA",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of shots conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "shots_on_target_for",
    displayName: "Shots on Target For",
    shortName: "SoTF",
    category: "attacking",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of shots on target taken by the team.",
    higherIsBetter: true
  },
  {
    id: "shots_on_target_against",
    displayName: "Shots on Target Against",
    shortName: "SoTA",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of shots on target conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "avg_shot_distance_for",
    displayName: "Avg Shot Distance For",
    shortName: "ASD-F",
    category: "attacking",
    type: MetricType.CALCULATED,
    units: MetricUnits.other,
    description: "Average shot distance for the team.",
    higherIsBetter: null,
    range: {
      min: 0,
      max: 40
    }
  },
  {
    id: "avg_shot_distance_against",
    displayName: "Avg Shot Distance Against",
    shortName: "ASD-A",
    category: "defending",
    type: MetricType.CALCULATED,
    units: MetricUnits.other,
    description: "Average shot distance conceded by the team.",
    higherIsBetter: true,
    range: {
      min: 0,
      max: 40
    }
  },
  {
    id: "pk_attempts_shots_for",
    displayName: "PK Attempts For",
    shortName: "PKA-F",
    category: "attacking",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of penalty kick attempts taken by the team.",
    higherIsBetter: true
  },
  {
    id: "pk_attempts_shots_against",
    displayName: "PK Attempts Against",
    shortName: "PKA-A",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of penalty kick attempts conceded.",
    higherIsBetter: false
  },
  {
    id: "pks_made_for",
    displayName: "PKs Made For",
    shortName: "PKM-F",
    category: "attacking",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of penalty kicks made by the team.",
    higherIsBetter: true
  },
  {
    id: "pks_made_against",
    displayName: "PKs Made Against",
    shortName: "PKM-A",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of penalty kicks conceded.",
    higherIsBetter: false
  },
  {
    id: "xg_for",
    displayName: "Expected Goals For",
    shortName: "xG-F",
    category: "attacking",
    type: MetricType.CALCULATED,
    units: MetricUnits.QTY,
    description: "Total expected goals for the team.",
    higherIsBetter: true
  },
  {
    id: "xg_against",
    displayName: "Expected Goals Against",
    shortName: "xG-A",
    category: "defending",
    type: MetricType.CALCULATED,
    units: MetricUnits.QTY,
    description: "Total expected goals conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "npxg_for",
    displayName: "Non-Penalty xG For",
    shortName: "npxG-F",
    category: "attacking",
    type: MetricType.CALCULATED,
    units: MetricUnits.QTY,
    description: "Total non-penalty expected goals for the team.",
    higherIsBetter: true
  },
  {
    id: "npxg_against",
    displayName: "Non-Penalty xG Against",
    shortName: "npxG-A",
    category: "defending",
    type: MetricType.CALCULATED,
    units: MetricUnits.QTY,
    description: "Total non-penalty expected goals conceded by the team.",
    higherIsBetter: false
  },

  // Group 4: Passing Metrics (For and Against; Category: Possession)
  {
    id: "passes_attempted_for",
    displayName: "Passes Attempted For",
    shortName: "PA-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of passes attempted by the team.",
    higherIsBetter: true
  },
  {
    id: "passes_attempted_against",
    displayName: "Passes Attempted Against",
    shortName: "PA-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of passes attempted against the team.",
    higherIsBetter: false
  },
  {
    id: "passes_completed_for",
    displayName: "Passes Completed For",
    shortName: "PC-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of passes completed by the team.",
    higherIsBetter: true
  },
  {
    id: "passes_completed_against",
    displayName: "Passes Completed Against",
    shortName: "PC-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of passes completed against the team.",
    higherIsBetter: false
  },
  {
    id: "short_passes_attempted_for",
    displayName: "Short Passes Attempted For",
    shortName: "SPA-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of short passes attempted by the team.",
    higherIsBetter: true
  },
  {
    id: "short_passes_attempted_against",
    displayName: "Short Passes Attempted Against",
    shortName: "SPA-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of short passes attempted against the team.",
    higherIsBetter: false
  },
  {
    id: "short_passes_completed_for",
    displayName: "Short Passes Completed For",
    shortName: "SPC-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of short passes completed by the team.",
    higherIsBetter: true
  },
  {
    id: "short_passes_completed_against",
    displayName: "Short Passes Completed Against",
    shortName: "SPC-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of short passes completed against the team.",
    higherIsBetter: false
  },
  {
    id: "medium_passes_attempted_for",
    displayName: "Medium Passes Attempted For",
    shortName: "MPA-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of medium passes attempted by the team.",
    higherIsBetter: true
  },
  {
    id: "medium_passes_attempted_against",
    displayName: "Medium Passes Attempted Against",
    shortName: "MPA-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of medium passes attempted against the team.",
    higherIsBetter: false
  },
  {
    id: "medium_passes_completed_for",
    displayName: "Medium Passes Completed For",
    shortName: "MPC-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of medium passes completed by the team.",
    higherIsBetter: true
  },
  {
    id: "medium_passes_completed_against",
    displayName: "Medium Passes Completed Against",
    shortName: "MPC-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of medium passes completed against the team.",
    higherIsBetter: false
  },
  {
    id: "long_passes_attempted_for",
    displayName: "Long Passes Attempted For",
    shortName: "LPA-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of long passes attempted by the team.",
    higherIsBetter: true
  },
  {
    id: "long_passes_attempted_against",
    displayName: "Long Passes Attempted Against",
    shortName: "LPA-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of long passes attempted against the team.",
    higherIsBetter: false
  },
  {
    id: "long_passes_completed_for",
    displayName: "Long Passes Completed For",
    shortName: "LPC-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of long passes completed by the team.",
    higherIsBetter: true
  },
  {
    id: "long_passes_completed_against",
    displayName: "Long Passes Completed Against",
    shortName: "LPC-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of long passes completed against the team.",
    higherIsBetter: false
  },
  {
    id: "key_passes_for",
    displayName: "Key Passes For",
    shortName: "KP-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of key passes made by the team.",
    higherIsBetter: true
  },
  {
    id: "key_passes_against",
    displayName: "Key Passes Against",
    shortName: "KP-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of key passes made against the team.",
    higherIsBetter: false
  },
  {
    id: "passes_into_final_third_for",
    displayName: "Passes into Final Third For",
    shortName: "PFT-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of passes into the final third made by the team.",
    higherIsBetter: true
  },
  {
    id: "passes_into_final_third_against",
    displayName: "Passes into Final Third Against",
    shortName: "PFT-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of passes into the final third made against the team.",
    higherIsBetter: false
  },
  {
    id: "passes_into_penalty_area_for",
    displayName: "Passes into Penalty Area For",
    shortName: "PPA-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of passes into the penalty area made by the team.",
    higherIsBetter: true
  },
  {
    id: "passes_into_penalty_area_against",
    displayName: "Passes into Penalty Area Against",
    shortName: "PPA-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of passes into the penalty area made against the team.",
    higherIsBetter: false
  },
  {
    id: "crosses_into_penalty_area_for",
    displayName: "Crosses into Penalty Area For",
    shortName: "CPA-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of crosses into the penalty area made by the team.",
    higherIsBetter: true
  },
  {
    id: "crosses_into_penalty_area_against",
    displayName: "Crosses into Penalty Area Against",
    shortName: "CPA-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of crosses into the penalty area made against the team.",
    higherIsBetter: false
  },
  {
    id: "progressive_passes_for",
    displayName: "Progressive Passes For",
    shortName: "ProgP-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of progressive passes made by the team.",
    higherIsBetter: true
  },
  {
    id: "progressive_passes_against",
    displayName: "Progressive Passes Against",
    shortName: "ProgP-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of progressive passes made against the team.",
    higherIsBetter: false
  },
  {
    id: "crosses_for",
    displayName: "Crosses For",
    shortName: "Cross-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of crosses made by the team.",
    higherIsBetter: true
  },
  {
    id: "crosses_against",
    displayName: "Crosses Against",
    shortName: "Cross-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of crosses made against the team.",
    higherIsBetter: false
  },
  {
    id: "corners_for",
    displayName: "Corners For",
    shortName: "Corners-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of corners taken by the team.",
    higherIsBetter: true
  },
  {
    id: "corners_against",
    displayName: "Corners Against",
    shortName: "Corners-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of corners conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "passes_offside_for",
    displayName: "Passes Offside For",
    shortName: "Offside-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of offside passes made by the team.",
    higherIsBetter: false
  },
  {
    id: "passes_offside_against",
    displayName: "Passes Offside Against",
    shortName: "Offside-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of offside passes made against the team.",
    higherIsBetter: true
  },

  // Group 5: Sources of Shot Creation (For: Attacking; Against: Defensive)
  {
    id: "shot_creating_actions_for",
    displayName: "Shot Creating Actions For",
    shortName: "SCA-F",
    category: "attacking",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of shot creating actions by the team.",
    higherIsBetter: true
  },
  {
    id: "shot_creating_actions_against",
    displayName: "Shot Creating Actions Against",
    shortName: "SCA-A",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of shot creating actions conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "shots_created_from_takeons_for",
    displayName: "Shots Created from Take Ons For",
    shortName: "SCTO-F",
    category: "attacking",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of shots created from take ons by the team.",
    higherIsBetter: true
  },
  {
    id: "shots_created_from_takeons_against",
    displayName: "Shots Created from Take Ons Against",
    shortName: "SCTO-A",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of shots created from take ons conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "shots_created_from_another_shot_for",
    displayName: "Shots Created from Another Shot For",
    shortName: "SCAS-F",
    category: "attacking",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of shots created from another shot by the team.",
    higherIsBetter: true
  },
  {
    id: "shots_created_from_another_shot_against",
    displayName: "Shots Created from Another Shot Against",
    shortName: "SCAS-A",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of shots created from another shot conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "shots_created_from_a_foul_for",
    displayName: "Shots Created from a Foul For",
    shortName: "SCF-F",
    category: "attacking",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of shots created from a foul by the team.",
    higherIsBetter: true
  },
  {
    id: "shots_created_from_a_foul_against",
    displayName: "Shots Created from a Foul Against",
    shortName: "SCF-A",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of shots created from a foul conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "shots_created_from_defensive_action_for",
    displayName: "Shots Created from Defensive Action For",
    shortName: "SCDA-F",
    category: "attacking",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of shots created from a defensive action by the team.",
    higherIsBetter: true
  },
  {
    id: "shots_created_from_defensive_action_against",
    displayName: "Shots Created from Defensive Action Against",
    shortName: "SCDA-A",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of shots created from a defensive action conceded by the team.",
    higherIsBetter: false
  },

  // Group 6: Sources of Goal Creation (For: Attacking; Against: Defensive)
  {
    id: "goal_creating_actions_for",
    displayName: "Goal Creating Actions For",
    shortName: "GCA-F",
    category: "attacking",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of goal creating actions by the team.",
    higherIsBetter: true
  },
  {
    id: "goal_creating_actions_against",
    displayName: "Goal Creating Actions Against",
    shortName: "GCA-A",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of goal creating actions conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "goals_created_from_takeons_for",
    displayName: "Goals Created from Take Ons For",
    shortName: "GCTO-F",
    category: "attacking",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of goals created from take ons by the team.",
    higherIsBetter: true
  },
  {
    id: "goals_created_from_takeons_against",
    displayName: "Goals Created from Take Ons Against",
    shortName: "GCTO-A",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of goals created from take ons conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "goals_created_from_another_shot_for",
    displayName: "Goals Created from Another Shot For",
    shortName: "GCAS-F",
    category: "attacking",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of goals created from another shot by the team.",
    higherIsBetter: true
  },
  {
    id: "goals_created_from_another_shot_against",
    displayName: "Goals Created from Another Shot Against",
    shortName: "GCAS-A",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of goals created from another shot conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "goals_created_from_a_foul_for",
    displayName: "Goals Created from a Foul For",
    shortName: "GCF-F",
    category: "attacking",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of goals created from a foul by the team.",
    higherIsBetter: true
  },
  {
    id: "goals_created_from_a_foul_against",
    displayName: "Goals Created from a Foul Against",
    shortName: "GCF-A",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of goals created from a foul conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "goals_created_from_defensive_actions_for",
    displayName: "Goals Created from Defensive Actions For",
    shortName: "GCD-F",
    category: "attacking",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of goals created from defensive actions by the team.",
    higherIsBetter: true
  },
  {
    id: "goals_created_from_defensive_actions_against",
    displayName: "Goals Created from Defensive Actions Against",
    shortName: "GCD-A",
    category: "defending",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of goals created from defensive actions conceded by the team.",
    higherIsBetter: false
  },

  // Group 7: Transition and Defensive Actions (For: Tempo [Defensive], Against: Tempo [Attacking])
  {
    id: "tackles_for",
    displayName: "Tackles For",
    shortName: "Tackles-F",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of tackles by the team.",
    higherIsBetter: true
  },
  {
    id: "tackles_against",
    displayName: "Tackles Against",
    shortName: "Tackles-A",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of tackles conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "tackles_won_for",
    displayName: "Tackles Won For",
    shortName: "TW-F",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of tackles won by the team.",
    higherIsBetter: true
  },
  {
    id: "tackles_won_against",
    displayName: "Tackles Won Against",
    shortName: "TW-A",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of tackles won against the team.",
    higherIsBetter: false
  },
  {
    id: "duels_for",
    displayName: "Duels For",
    shortName: "Duels-F",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of duels engaged by the team.",
    higherIsBetter: true
  },
  {
    id: "duels_against",
    displayName: "Duels Against",
    shortName: "Duels-A",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of duels conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "duels_won_for",
    displayName: "Duels Won For",
    shortName: "DW-F",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of duels won by the team.",
    higherIsBetter: true
  },
  {
    id: "duels_won_against",
    displayName: "Duels Won Against",
    shortName: "DW-A",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of duels won against the team.",
    higherIsBetter: false
  },
  {
    id: "blocked_shots_for",
    displayName: "Blocked Shots For",
    shortName: "BS-F",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of shots blocked by the team.",
    higherIsBetter: true
  },
  {
    id: "blocked_shots_against",
    displayName: "Blocked Shots Against",
    shortName: "BS-A",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of shots blocked against the team.",
    higherIsBetter: false
  },
  {
    id: "interceptions_for",
    displayName: "Interceptions For",
    shortName: "Interceptions-F",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of interceptions made by the team.",
    higherIsBetter: true
  },
  {
    id: "interceptions_against",
    displayName: "Interceptions Against",
    shortName: "Interceptions-A",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of interceptions conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "clearances_for",
    displayName: "Clearances For",
    shortName: "Clearances-F",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of clearances made by the team.",
    higherIsBetter: true
  },
  {
    id: "clearances_against",
    displayName: "Clearances Against",
    shortName: "Clearances-A",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of clearances conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "mistakes_leading_to_opponent_shot_for",
    displayName: "Mistakes Leading to Opponent Shot For",
    shortName: "Mistakes-F",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of mistakes leading to an opponent's shot by the team.",
    higherIsBetter: false
  },
  {
    id: "mistakes_leading_to_opponent_shot_against",
    displayName: "Mistakes Leading to Opponent Shot Against",
    shortName: "Mistakes-A",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of mistakes leading to an opponent's shot conceded by the team.",
    higherIsBetter: true
  },
  {
    id: "defensive_line_height_for",
    displayName: "Defensive Line Height For",
    shortName: "DLH-F",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Average defensive line height of the team.",
    higherIsBetter: null
  },
  {
    id: "defensive_line_height_against",
    displayName: "Defensive Line Height Against",
    shortName: "DLH-A",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Average defensive line height of the opposing team.",
    higherIsBetter: null
  },
  {
    id: "transition_speed_for",
    displayName: "Transition Speed For",
    shortName: "TS-F",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Transition speed of the team (from defense to attack).",
    higherIsBetter: true
  },
  {
    id: "transition_speed_against",
    displayName: "Transition Speed Against",
    shortName: "TS-A",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Transition speed conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "recovery_time_for",
    displayName: "Recovery Time For",
    shortName: "RT-F",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Average recovery time after losing possession by the team.",
    higherIsBetter: false
  },
  {
    id: "recovery_time_against",
    displayName: "Recovery Time Against",
    shortName: "RT-A",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Average recovery time conceded by the team.",
    higherIsBetter: true
  },
  {
    id: "pressing_intensity_for",
    displayName: "Pressing Intensity For",
    shortName: "PI-F",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Pressing intensity of the team.",
    higherIsBetter: true
  },
  {
    id: "pressing_intensity_against",
    displayName: "Pressing Intensity Against",
    shortName: "PI-A",
    category: "tempo",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Pressing intensity conceded by the team.",
    higherIsBetter: false
  },

  // Group 8: Possession and Shape (For and Against; Category: Possession)
  {
    id: "possession_percentage_for",
    displayName: "Possession Percentage For",
    shortName: "Poss%F",
    category: "possession",
    type: MetricType.CALCULATED,
    units: MetricUnits.PERCENT,
    description: "Net percentage of passes attempted (possession percentage) for the team.",
    higherIsBetter: true
  },
  {
    id: "possession_percentage_against",
    displayName: "Possession Percentage Against",
    shortName: "Poss%A",
    category: "possession",
    type: MetricType.CALCULATED,
    units: MetricUnits.PERCENT,
    description: "Net percentage of passes attempted (possession percentage) against the team.",
    higherIsBetter: false
  },
  {
    id: "touches_in_own_penalty_area_for",
    displayName: "Touches in Own Penalty Area For",
    shortName: "TouchesOwn-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of touches in own defensive penalty area by the team.",
    higherIsBetter: null
  },
  {
    id: "touches_in_own_penalty_area_against",
    displayName: "Touches in Own Penalty Area Against",
    shortName: "TouchesOwn-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of touches in own defensive penalty area conceded by the team.",
    higherIsBetter: null
  },
  {
    id: "touches_in_opposition_penalty_area_for",
    displayName: "Touches in Opposition Penalty Area For",
    shortName: "TouchesOpp-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of touches in opposition penalty area by the team.",
    higherIsBetter: true
  },
  {
    id: "touches_in_opposition_penalty_area_against",
    displayName: "Touches in Opposition Penalty Area Against",
    shortName: "TouchesOpp-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of touches in opposition penalty area conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "takeons_attempted_for",
    displayName: "Take Ons Attempted For",
    shortName: "TA-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of take ons attempted by the team.",
    higherIsBetter: true
  },
  {
    id: "takeons_attempted_against",
    displayName: "Take Ons Attempted Against",
    shortName: "TA-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of take ons attempted against the team.",
    higherIsBetter: false
  },
  {
    id: "takeons_successful_for",
    displayName: "Take Ons Successful For",
    shortName: "TSucc-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of successful take ons by the team.",
    higherIsBetter: true
  },
  {
    id: "takeons_successful_against",
    displayName: "Take Ons Successful Against",
    shortName: "TSucc-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of successful take ons against the team.",
    higherIsBetter: false
  },
  {
    id: "carries_into_opp_18_for",
    displayName: "Carries into Opp 18 Yard Box For",
    shortName: "Carries18-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of carries into the opponent's 18-yard box by the team.",
    higherIsBetter: true
  },
  {
    id: "carries_into_opp_18_against",
    displayName: "Carries into Opp 18 Yard Box Against",
    shortName: "Carries18-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of carries into the opponent's 18-yard box conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "carries_into_final_third_for",
    displayName: "Carries into Final Third For",
    shortName: "CarriesFT-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of carries into the final third by the team.",
    higherIsBetter: true
  },
  {
    id: "carries_into_final_third_against",
    displayName: "Carries into Final Third Against",
    shortName: "CarriesFT-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of carries into the final third conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "prog_carry_total_distance_for",
    displayName: "Progressive Carry Total Distance For",
    shortName: "ProgCarryDist-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total distance covered in progressive carries by the team.",
    higherIsBetter: true
  },
  {
    id: "prog_carry_total_distance_against",
    displayName: "Progressive Carry Total Distance Against",
    shortName: "ProgCarryDist-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total distance covered in progressive carries conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "prog_carries_qty_for",
    displayName: "Progressive Carries Quantity For",
    shortName: "ProgCarries-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of progressive carries by the team.",
    higherIsBetter: true
  },
  {
    id: "prog_carries_qty_against",
    displayName: "Progressive Carries Quantity Against",
    shortName: "ProgCarries-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total number of progressive carries conceded by the team.",
    higherIsBetter: false
  },
  {
    id: "build_up_time_for",
    displayName: "Build-Up Time For",
    shortName: "BuildUp-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total build-up time for the team.",
    higherIsBetter: false
  },
  {
    id: "build_up_time_against",
    displayName: "Build-Up Time Against",
    shortName: "BuildUp-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Total build-up time conceded by the team.",
    higherIsBetter: true
  },
  {
    id: "passes_per_defensive_action_for",
    displayName: "Passes per Defensive Action For",
    shortName: "PPDA-F",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Average number of passes per defensive action by the team.",
    higherIsBetter: false
  },
  {
    id: "passes_per_defensive_action_against",
    displayName: "Passes per Defensive Action Against",
    shortName: "PPDA-A",
    category: "possession",
    type: MetricType.RAW,
    units: MetricUnits.QTY,
    description: "Average number of passes per defensive action conceded by the team.",
    higherIsBetter: true
  },
  
  // Group 9: Derived Metrics for Analysis
  {
    id: "defensive_line_height",
    displayName: "Defensive Line Height",
    shortName: "DefLine",
    category: "defending",
    type: MetricType.CALCULATED,
    units: MetricUnits.other,
    description: "Average height of defensive line from own goal (0-100 scale).",
    higherIsBetter: null,
    range: {
      min: 0,
      max: 100
    }
  },
  {
    id: "pressing_intensity",
    displayName: "Pressing Intensity",
    shortName: "Press",
    category: "tempo",
    type: MetricType.CALCULATED,
    units: MetricUnits.other,
    description: "Measure of how aggressively the team presses (0-100 scale).",
    higherIsBetter: true,
    range: {
      min: 0,
      max: 100
    }
  },
  {
    id: "recovery_time",
    displayName: "Recovery Time",
    shortName: "RecTime",
    category: "tempo",
    type: MetricType.CALCULATED,
    units: MetricUnits.other,
    description: "Average time to regain possession after losing it (in seconds).",
    higherIsBetter: false,
    range: {
      min: 0,
      max: 30
    }
  },
  {
    id: "transition_speed",
    displayName: "Transition Speed",
    shortName: "TranSpd",
    category: "tempo",
    type: MetricType.CALCULATED,
    units: MetricUnits.other,
    description: "Speed of transitions from defense to attack (0-100 scale).",
    higherIsBetter: true,
    range: {
      min: 0,
      max: 100
    }
  },
  {
    id: "build_up_time",
    displayName: "Build-Up Time",
    shortName: "BldTime",
    category: "possession",
    type: MetricType.CALCULATED,
    units: MetricUnits.other,
    description: "Average time taken to move the ball from defense to attacking third (in seconds).",
    higherIsBetter: false,
    range: {
      min: 0,
      max: 30
    }
  },
  {
    id: "passes_per_defensive_action",
    displayName: "PPDA",
    shortName: "PPDA",
    category: "tempo",
    type: MetricType.CALCULATED,
    units: MetricUnits.other,
    description: "Passes allowed per defensive action - measure of pressing intensity.",
    higherIsBetter: false,
    range: {
      min: 0,
      max: 20
    }
  },
  {
    id: "direct_play_vs_possession",
    displayName: "Direct Play vs Possession",
    shortName: "DirPlay",
    category: "tempo",
    type: MetricType.CALCULATED,
    units: MetricUnits.other,
    description: "Index representing tendency toward direct play (100) vs patient possession (0).",
    higherIsBetter: null,
    range: {
      min: 0,
      max: 100
    }
  },
  {
    id: "counter_press_after_loss",
    displayName: "Counter-Press After Loss",
    shortName: "CPress",
    category: "tempo",
    type: MetricType.CALCULATED,
    units: MetricUnits.other,
    description: "Intensity of pressing immediately after losing possession (0-100 scale).",
    higherIsBetter: true,
    range: {
      min: 0,
      max: 100
    }
  },
  {
    id: "field_tilt_percentage",
    displayName: "Field Tilt",
    shortName: "FldTilt",
    category: "possession",
    type: MetricType.CALCULATED,
    units: MetricUnits.PERCENT,
    description: "Percentage of possession in the opponent's final third.",
    higherIsBetter: true,
    range: {
      min: 0,
      max: 100
    }
  },
  {
    id: "clean_sheet_percentage",
    displayName: "Clean Sheet Percentage",
    shortName: "CS%",
    category: "defending",
    type: MetricType.CALCULATED,
    units: MetricUnits.PERCENT,
    description: "Percentage of matches with no goals conceded.",
    higherIsBetter: true,
    range: {
      min: 0,
      max: 100
    }
  },
  {
    id: "set_piece_dependency",
    displayName: "Set Piece Dependency",
    shortName: "SetPiece%",
    category: "attacking",
    type: MetricType.CALCULATED,
    units: MetricUnits.PERCENT,
    description: "Percentage of goals scored from set pieces.",
    higherIsBetter: null,
    range: {
      min: 0,
      max: 100
    }
  },
  {
    id: "counter_attack_frequency",
    displayName: "Counter-Attack Frequency",
    shortName: "CntrAtt%",
    category: "attacking",
    type: MetricType.CALCULATED,
    units: MetricUnits.PERCENT,
    description: "Percentage of attacks that are counter-attacks.",
    higherIsBetter: null,
    range: {
      min: 0,
      max: 50
    }
  },
  {
    id: "pass_completion",
    displayName: "Pass Completion",
    shortName: "Pass%",
    category: "possession",
    type: MetricType.CALCULATED,
    units: MetricUnits.PERCENT,
    description: "Percentage of passes that successfully reach a teammate.",
    higherIsBetter: true,
    range: {
      min: 0,
      max: 100
    }
  },
  {
    id: "progressive_passes",
    displayName: "Progressive Passes per Match",
    shortName: "ProgP/90",
    category: "possession",
    type: MetricType.CALCULATED,
    units: MetricUnits.PER90,
    description: "Number of progressive passes per match.",
    higherIsBetter: true,
    range: {
      min: 0,
      max: 100
    }
  },
  {
    id: "shots_per_match",
    displayName: "Shots per Match",
    shortName: "Sh/90",
    category: "attacking",
    type: MetricType.CALCULATED,
    units: MetricUnits.PER90,
    description: "Average number of shots per match.",
    higherIsBetter: true,
    range: {
      min: 0,
      max: 30
    }
  },
  {
    id: "big_chances_created",
    displayName: "Big Chances Created",
    shortName: "BCC",
    category: "attacking",
    type: MetricType.CALCULATED,
    units: MetricUnits.PER90,
    description: "Number of high-quality chances created per match.",
    higherIsBetter: true,
    range: {
      min: 0,
      max: 10
    }
  },
  {
    id: "shot_accuracy",
    displayName: "Shot Accuracy",
    shortName: "ShotAcc",
    category: "attacking",
    type: MetricType.CALCULATED,
    units: MetricUnits.PERCENT,
    description: "Percentage of shots that are on target.",
    higherIsBetter: true,
    range: {
      min: 0,
      max: 100
    }
  },
  {
    id: "tackles_per_match",
    displayName: "Tackles per Match",
    shortName: "Tkl/90",
    category: "defending",
    type: MetricType.CALCULATED,
    units: MetricUnits.PER90,
    description: "Average number of tackles per match.",
    higherIsBetter: true,
    range: {
      min: 0,
      max: 40
    }
  },
  {
    id: "defensive_duels_won",
    displayName: "Defensive Duels Won",
    shortName: "DDW%",
    category: "defending",
    type: MetricType.CALCULATED,
    units: MetricUnits.PERCENT,
    description: "Percentage of defensive duels won.",
    higherIsBetter: true,
    range: {
      min: 0,
      max: 100
    }
  },
  {
    id: "verticality_index",
    displayName: "Verticality Index",
    shortName: "Vertical",
    category: "tempo",
    type: MetricType.CALCULATED,
    units: MetricUnits.other,
    description: "Measure of directness of attacks (vertical progression).",
    higherIsBetter: null,
    range: {
      min: 0,
      max: 100
    }
  },
  {
    id: "progressive_carries",
    displayName: "Progressive Carries",
    shortName: "ProgCar/90",
    category: "tempo",
    type: MetricType.CALCULATED,
    units: MetricUnits.PER90,
    description: "Number of carries that move the ball significantly forward per match.",
    higherIsBetter: true,
    range: {
      min: 0,
      max: 50
    }
  },
  {
    id: "game_state_adaptability",
    displayName: "Game State Adaptability",
    shortName: "GSA",
    category: "tempo",
    type: MetricType.CALCULATED,
    units: MetricUnits.other,
    description: "Measure of how team adapts their style based on game state (winning/losing/drawing).",
    higherIsBetter: true,
    range: {
      min: 0,
      max: 100
    }
  },
  {
    id: "attacking_transition_speed",
    displayName: "Attacking Transition Speed",
    shortName: "ATS",
    category: "tempo", 
    type: MetricType.CALCULATED,
    units: MetricUnits.other,
    description: "Speed of transition from defense to attack after winning possession.",
    higherIsBetter: true,
    range: {
      min: 0,
      max: 100
    }
  },
  {
    id: "defensive_recovery_time",
    displayName: "Defensive Recovery Time",
    shortName: "DRT",
    category: "tempo",
    type: MetricType.CALCULATED,
    units: MetricUnits.other,
    description: "Time taken to reorganize defensively after losing possession.",
    higherIsBetter: false,
    range: {
      min: 0,
      max: 30
    }
  },
  {
    id: "dribble_success_rate",
    displayName: "Dribble Success Rate",
    shortName: "Drib%",
    category: "possession",
    type: MetricType.CALCULATED,
    units: MetricUnits.PERCENT,
    description: "Percentage of successful dribbles/take-ons.",
    higherIsBetter: true,
    range: {
      min: 0,
      max: 100
    }
  }
];