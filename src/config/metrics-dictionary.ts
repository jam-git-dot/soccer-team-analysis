import { MetricCategoryID } from './constants';
import { MetricUnits } from './constants';
import { MetricType } from './constants';

export interface MetricDefinition {
  id: string;                 // unique identifier for the metric
  displayName: string;        // display name for the metric
  shortName: string;          // short name for the metric
  category: MetricCategoryID; // one of 'possession' | 'attacking' | 'defensive' | 'tempo'
  type: MetricType;           // 'raw' 'calculated' 'percentile' 'rank' 'rank_percentile' 'average'
  units: MetricUnits;         // 'qty' 'percent' 'per90' 'other'
  description: string;        // description of the metric
  higherIsBetter: boolean;    // useful later
}

export const METRICS_DICTIONARY: MetricDefinition[] = [
  // Group 1: General Data
  {
    id: "matches_played",
    displayName: "Matches Played",
    shortName: "MP",
    category: "general", // General data – assign to a default category
    type: "for",
    metricKind: "total_count",
    description: "Total number of matches played by the team."
  },
  {
    id: "wins_for",
    displayName: "Wins",
    shortName: "wins",
    category: "general", // General data – assign to a default category
    type: "for",
    metricKind: "total_count",
    description: "Total number of matches won by the team."
  },
  {
    id: "draws_for",
    displayName: "Draws",
    shortName: "draws",
    category: "general", // General data – assign to a default category
    type: "for",
    metricKind: "total_count",
    description: "Total number of matches drawn/tied by the team."
  },
  {
    id: "losses_for",
    displayName: "Losses",
    shortName: "losses",
    category: "general", // General data – assign to a default category
    type: "for",
    metricKind: "total_count",
    description: "Total number of matches lost by the team."
  },

  // Group 2: Goalkeeping (Category: Defensive)
  {
    id: "goals_against",
    displayName: "Goals Against",
    shortName: "GA",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of goals conceded by the team."
  },
  {
    id: "pk_goals_against",
    displayName: "PK Goals Against",
    shortName: "PKGA",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of penalty kick goals conceded."
  },
  {
    id: "free_kick_goals_against",
    displayName: "Free Kick Goals Against",
    shortName: "FKGA",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of free kick goals conceded."
  },
  {
    id: "corner_kick_goals_against",
    displayName: "Corner Kick Goals Against",
    shortName: "CKGA",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of corner kick goals conceded."
  },
  {
    id: "shots_on_target_conceded",
    displayName: "Shots on Target Conceded",
    shortName: "STC",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of shots on target conceded by the team."
  },
  {
    id: "saves",
    displayName: "Saves",
    shortName: "Saves",
    category: "defensive",
    type: "for",
    metricKind: "total_count",
    description: "Total number of saves made by the goalkeeper."
  },
  {
    id: "clean_sheets",
    displayName: "Clean Sheets",
    shortName: "CS",
    category: "defensive",
    type: "for",
    metricKind: "total_count",
    description: "Total number of clean sheets kept."
  },
  {
    id: "pk_attempts_goalkeeping",
    displayName: "Penalty Kick Attempts (Goalkeeping)",
    shortName: "PKatt",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of penalty kick attempts conceded."
  },
  {
    id: "post_shot_expected_goals_against",
    displayName: "Post-Shot Expected Goals Against",
    shortName: "xGpostAgainst",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total post-shot expected goals conceded by the team."
  },
  {
    id: "post_shot_expected_goals_for",
    displayName: "Post-Shot Expected Goals For",
    shortName: "xGpostFor",
    category: "attacking",
    type: "for",
    metricKind: "total_count",
    description: "Total post-shot expected goals created by the team."
  },
  // Group 3: Shots (For: Attacking; Against: Defensive)
  {
    id: "shots_for",
    displayName: "Shots (For)",
    shortName: "ShotsF",
    category: "attacking",
    type: "for",
    metricKind: "total_count",
    description: "Total number of shots taken by the team."
  },
  {
    id: "shots_against",
    displayName: "Shots (Against)",
    shortName: "ShotsA",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of shots conceded by the team."
  },
  {
    id: "shots_on_target_for",
    displayName: "Shots on Target (For)",
    shortName: "STF",
    category: "attacking",
    type: "for",
    metricKind: "total_count",
    description: "Total number of shots on target taken by the team."
  },
  {
    id: "shots_on_target_against",
    displayName: "Shots on Target (Against)",
    shortName: "STA",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of shots on target conceded by the team."
  },
  {
    id: "avg_shot_distance_for",
    displayName: "Avg Shot Distance (For)",
    shortName: "AvgSD-F",
    category: "attacking",
    type: "for",
    metricKind: "total_count",
    description: "Average shot distance for the team."
  },
  {
    id: "avg_shot_distance_against",
    displayName: "Avg Shot Distance (Against)",
    shortName: "AvgSD-A",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Average shot distance conceded by the team."
  },
  {
    id: "pk_attempts_shots_for",
    displayName: "PK Attempts (Shots For)",
    shortName: "PKA-F",
    category: "attacking",
    type: "for",
    metricKind: "total_count",
    description: "Total number of penalty kick attempts taken by the team."
  },
  {
    id: "pk_attempts_shots_against",
    displayName: "PK Attempts (Shots Against)",
    shortName: "PKA-A",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of penalty kick attempts conceded."
  },
  {
    id: "pks_made_for",
    displayName: "PKs Made (For)",
    shortName: "PKM-F",
    category: "attacking",
    type: "for",
    metricKind: "total_count",
    description: "Total number of penalty kicks made by the team."
  },
  {
    id: "pks_made_against",
    displayName: "PKs Made (Against)",
    shortName: "PKM-A",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of penalty kicks conceded."
  },
  {
    id: "xg_for",
    displayName: "Expected Goals (xG) (For)",
    shortName: "xG-F",
    category: "attacking",
    type: "for",
    metricKind: "total_count",
    description: "Total expected goals for the team."
  },
  {
    id: "xg_against",
    displayName: "Expected Goals (xG) (Against)",
    shortName: "xG-A",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total expected goals conceded by the team."
  },
  {
    id: "npxg_for",
    displayName: "Non-Penalty xG (For)",
    shortName: "npxG-F",
    category: "attacking",
    type: "for",
    metricKind: "total_count",
    description: "Total non-penalty expected goals for the team."
  },
  {
    id: "npxg_against",
    displayName: "Non-Penalty xG (Against)",
    shortName: "npxG-A",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total non-penalty expected goals conceded by the team."
  },

  // Group 4: Passing Metrics (For and Against; Category: Possession)
  {
    id: "passes_attempted_for",
    displayName: "Passes Attempted (For)",
    shortName: "PA-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of passes attempted by the team."
  },
  {
    id: "passes_attempted_against",
    displayName: "Passes Attempted (Against)",
    shortName: "PA-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of passes attempted against the team."
  },
  {
    id: "passes_completed_for",
    displayName: "Passes Completed (For)",
    shortName: "PC-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of passes completed by the team."
  },
  {
    id: "passes_completed_against",
    displayName: "Passes Completed (Against)",
    shortName: "PC-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of passes completed against the team."
  },
  {
    id: "short_passes_attempted_for",
    displayName: "Short Passes Attempted (For)",
    shortName: "SPA-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of short passes attempted by the team."
  },
  {
    id: "short_passes_attempted_against",
    displayName: "Short Passes Attempted (Against)",
    shortName: "SPA-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of short passes attempted against the team."
  },
  {
    id: "short_passes_completed_for",
    displayName: "Short Passes Completed (For)",
    shortName: "SPC-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of short passes completed by the team."
  },
  {
    id: "short_passes_completed_against",
    displayName: "Short Passes Completed (Against)",
    shortName: "SPC-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of short passes completed against the team."
  },
  {
    id: "medium_passes_attempted_for",
    displayName: "Medium Passes Attempted (For)",
    shortName: "MPA-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of medium passes attempted by the team."
  },
  {
    id: "medium_passes_attempted_against",
    displayName: "Medium Passes Attempted (Against)",
    shortName: "MPA-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of medium passes attempted against the team."
  },
  {
    id: "medium_passes_completed_for",
    displayName: "Medium Passes Completed (For)",
    shortName: "MPC-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of medium passes completed by the team."
  },
  {
    id: "medium_passes_completed_against",
    displayName: "Medium Passes Completed (Against)",
    shortName: "MPC-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of medium passes completed against the team."
  },
  {
    id: "long_passes_attempted_for",
    displayName: "Long Passes Attempted (For)",
    shortName: "LPA-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of long passes attempted by the team."
  },
  {
    id: "long_passes_attempted_against",
    displayName: "Long Passes Attempted (Against)",
    shortName: "LPA-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of long passes attempted against the team."
  },
  {
    id: "long_passes_completed_for",
    displayName: "Long Passes Completed (For)",
    shortName: "LPC-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of long passes completed by the team."
  },
  {
    id: "long_passes_completed_against",
    displayName: "Long Passes Completed (Against)",
    shortName: "LPC-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of long passes completed against the team."
  },
  {
    id: "key_passes_for",
    displayName: "Key Passes (For)",
    shortName: "KP-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of key passes made by the team."
  },
  {
    id: "key_passes_against",
    displayName: "Key Passes (Against)",
    shortName: "KP-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of key passes made against the team."
  },
  {
    id: "passes_into_final_third_for",
    displayName: "Passes into Final Third (For)",
    shortName: "PFT-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of passes into the final third made by the team."
  },
  {
    id: "passes_into_final_third_against",
    displayName: "Passes into Final Third (Against)",
    shortName: "PFT-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of passes into the final third made against the team."
  },
  {
    id: "passes_into_penalty_area_for",
    displayName: "Passes into Penalty Area (For)",
    shortName: "PPA-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of passes into the penalty area made by the team."
  },
  {
    id: "passes_into_penalty_area_against",
    displayName: "Passes into Penalty Area (Against)",
    shortName: "PPA-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of passes into the penalty area made against the team."
  },
  {
    id: "crosses_into_penalty_area_for",
    displayName: "Crosses into Penalty Area (For)",
    shortName: "CPA-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of crosses into the penalty area made by the team."
  },
  {
    id: "crosses_into_penalty_area_against",
    displayName: "Crosses into Penalty Area (Against)",
    shortName: "CPA-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of crosses into the penalty area made against the team."
  },
  {
    id: "progressive_passes_for",
    displayName: "Progressive Passes (For)",
    shortName: "ProgP-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of progressive passes made by the team."
  },
  {
    id: "progressive_passes_against",
    displayName: "Progressive Passes (Against)",
    shortName: "ProgP-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of progressive passes made against the team."
  },
  {
    id: "crosses_for",
    displayName: "Crosses (For)",
    shortName: "Cross-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of crosses made by the team."
  },
  {
    id: "crosses_against",
    displayName: "Crosses (Against)",
    shortName: "Cross-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of crosses made against the team."
  },
  {
    id: "corners_for",
    displayName: "Corners (For)",
    shortName: "Corners-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of corners taken by the team."
  },
  {
    id: "corners_against",
    displayName: "Corners (Against)",
    shortName: "Corners-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of corners conceded by the team."
  },
  {
    id: "passes_offside_for",
    displayName: "Passes Offside (For)",
    shortName: "Offside-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of offside passes made by the team."
  },
  {
    id: "passes_offside_against",
    displayName: "Passes Offside (Against)",
    shortName: "Offside-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of offside passes made against the team."
  },

  // Group 5: Sources of Shot Creation (For: Attacking; Against: Defensive)
  {
    id: "shot_creating_actions_for",
    displayName: "Shot Creating Actions (For)",
    shortName: "SCA-F",
    category: "attacking",
    type: "for",
    metricKind: "total_count",
    description: "Total number of shot creating actions by the team."
  },
  {
    id: "shot_creating_actions_against",
    displayName: "Shot Creating Actions (Against)",
    shortName: "SCA-A",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of shot creating actions conceded by the team."
  },
  {
    id: "shots_created_from_takeons_for",
    displayName: "Shots Created from Take Ons (For)",
    shortName: "SCTO-F",
    category: "attacking",
    type: "for",
    metricKind: "total_count",
    description: "Total number of shots created from take ons by the team."
  },
  {
    id: "shots_created_from_takeons_against",
    displayName: "Shots Created from Take Ons (Against)",
    shortName: "SCTO-A",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of shots created from take ons conceded by the team."
  },
  {
    id: "shots_created_from_another_shot_for",
    displayName: "Shots Created from Another Shot (For)",
    shortName: "SCAS-F",
    category: "attacking",
    type: "for",
    metricKind: "total_count",
    description: "Total number of shots created from another shot by the team."
  },
  {
    id: "shots_created_from_another_shot_against",
    displayName: "Shots Created from Another Shot (Against)",
    shortName: "SCAS-A",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of shots created from another shot conceded by the team."
  },
  {
    id: "shots_created_from_a_foul_for",
    displayName: "Shots Created from a Foul (For)",
    shortName: "SCF-F",
    category: "attacking",
    type: "for",
    metricKind: "total_count",
    description: "Total number of shots created from a foul by the team."
  },
  {
    id: "shots_created_from_a_foul_against",
    displayName: "Shots Created from a Foul (Against)",
    shortName: "SCF-A",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of shots created from a foul conceded by the team."
  },
  {
    id: "shots_created_from_defensive_action_for",
    displayName: "Shots Created from Defensive Action (For)",
    shortName: "SCDA-F",
    category: "attacking",
    type: "for",
    metricKind: "total_count",
    description: "Total number of shots created from a defensive action by the team."
  },
  {
    id: "shots_created_from_defensive_action_against",
    displayName: "Shots Created from Defensive Action (Against)",
    shortName: "SCDA-A",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of shots created from a defensive action conceded by the team."
  },

  // Group 6: Sources of Goal Creation (For: Attacking; Against: Defensive)
  {
    id: "goal_creating_actions_for",
    displayName: "Goal Creating Actions (For)",
    shortName: "GCA-F",
    category: "attacking",
    type: "for",
    metricKind: "total_count",
    description: "Total number of goal creating actions by the team."
  },
  {
    id: "goal_creating_actions_against",
    displayName: "Goal Creating Actions (Against)",
    shortName: "GCA-A",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of goal creating actions conceded by the team."
  },
  {
    id: "goals_created_from_takeons_for",
    displayName: "Goals Created from Take Ons (For)",
    shortName: "GCTO-F",
    category: "attacking",
    type: "for",
    metricKind: "total_count",
    description: "Total number of goals created from take ons by the team."
  },
  {
    id: "goals_created_from_takeons_against",
    displayName: "Goals Created from Take Ons (Against)",
    shortName: "GCTO-A",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of goals created from take ons conceded by the team."
  },
  {
    id: "goals_created_from_another_shot_for",
    displayName: "Goals Created from Another Shot (For)",
    shortName: "GCAS-F",
    category: "attacking",
    type: "for",
    metricKind: "total_count",
    description: "Total number of goals created from another shot by the team."
  },
  {
    id: "goals_created_from_another_shot_against",
    displayName: "Goals Created from Another Shot (Against)",
    shortName: "GCAS-A",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of goals created from another shot conceded by the team."
  },
  {
    id: "goals_created_from_a_foul_for",
    displayName: "Goals Created from a Foul (For)",
    shortName: "GCF-F",
    category: "attacking",
    type: "for",
    metricKind: "total_count",
    description: "Total number of goals created from a foul by the team."
  },
  {
    id: "goals_created_from_a_foul_against",
    displayName: "Goals Created from a Foul (Against)",
    shortName: "GCF-A",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of goals created from a foul conceded by the team."
  },
  {
    id: "goals_created_from_defensive_actions_for",
    displayName: "Goals Created from Defensive Actions (For)",
    shortName: "GCD-F",
    category: "attacking",
    type: "for",
    metricKind: "total_count",
    description: "Total number of goals created from defensive actions by the team."
  },
  {
    id: "goals_created_from_defensive_actions_against",
    displayName: "Goals Created from Defensive Actions (Against)",
    shortName: "GCD-A",
    category: "defensive",
    type: "against",
    metricKind: "total_count",
    description: "Total number of goals created from defensive actions conceded by the team."
  },

  // Group 7: Transition and Defensive Actions (For: Tempo [Defensive], Against: Tempo [Attacking])
  {
    id: "tackles_for",
    displayName: "Tackles (For)",
    shortName: "Tackles-F",
    category: "tempo",
    type: "for",
    metricKind: "total_count",
    description: "Total number of tackles by the team."
  },
  {
    id: "tackles_against",
    displayName: "Tackles (Against)",
    shortName: "Tackles-A",
    category: "tempo",
    type: "against",
    metricKind: "total_count",
    description: "Total number of tackles conceded by the team."
  },
  {
    id: "tackles_won_for",
    displayName: "Tackles Won (For)",
    shortName: "TW-F",
    category: "tempo",
    type: "for",
    metricKind: "total_count",
    description: "Total number of tackles won by the team."
  },
  {
    id: "tackles_won_against",
    displayName: "Tackles Won (Against)",
    shortName: "TW-A",
    category: "tempo",
    type: "against",
    metricKind: "total_count",
    description: "Total number of tackles won against the team."
  },
  {
    id: "duels_for",
    displayName: "Duels (For)",
    shortName: "Duels-F",
    category: "tempo",
    type: "for",
    metricKind: "total_count",
    description: "Total number of duels engaged by the team."
  },
  {
    id: "duels_against",
    displayName: "Duels (Against)",
    shortName: "Duels-A",
    category: "tempo",
    type: "against",
    metricKind: "total_count",
    description: "Total number of duels conceded by the team."
  },
  {
    id: "duels_won_for",
    displayName: "Duels Won (For)",
    shortName: "DW-F",
    category: "tempo",
    type: "for",
    metricKind: "total_count",
    description: "Total number of duels won by the team."
  },
  {
    id: "duels_won_against",
    displayName: "Duels Won (Against)",
    shortName: "DW-A",
    category: "tempo",
    type: "against",
    metricKind: "total_count",
    description: "Total number of duels won against the team."
  },
  {
    id: "blocked_shots_for",
    displayName: "Blocked Shots (For)",
    shortName: "BS-F",
    category: "tempo",
    type: "for",
    metricKind: "total_count",
    description: "Total number of shots blocked by the team."
  },
  {
    id: "blocked_shots_against",
    displayName: "Blocked Shots (Against)",
    shortName: "BS-A",
    category: "tempo",
    type: "against",
    metricKind: "total_count",
    description: "Total number of shots blocked against the team."
  },
  {
    id: "interceptions_for",
    displayName: "Interceptions (For)",
    shortName: "Interceptions-F",
    category: "tempo",
    type: "for",
    metricKind: "total_count",
    description: "Total number of interceptions made by the team."
  },
  {
    id: "interceptions_against",
    displayName: "Interceptions (Against)",
    shortName: "Interceptions-A",
    category: "tempo",
    type: "against",
    metricKind: "total_count",
    description: "Total number of interceptions conceded by the team."
  },
  {
    id: "clearances_for",
    displayName: "Clearances (For)",
    shortName: "Clearances-F",
    category: "tempo",
    type: "for",
    metricKind: "total_count",
    description: "Total number of clearances made by the team."
  },
  {
    id: "clearances_against",
    displayName: "Clearances (Against)",
    shortName: "Clearances-A",
    category: "tempo",
    type: "against",
    metricKind: "total_count",
    description: "Total number of clearances conceded by the team."
  },
  {
    id: "mistakes_leading_to_opponent_shot_for",
    displayName: "Mistakes Leading to Opponent Shot (For)",
    shortName: "Mistakes-F",
    category: "tempo",
    type: "for",
    metricKind: "total_count",
    description: "Total number of mistakes leading to an opponent's shot by the team."
  },
  {
    id: "mistakes_leading_to_opponent_shot_against",
    displayName: "Mistakes Leading to Opponent Shot (Against)",
    shortName: "Mistakes-A",
    category: "tempo",
    type: "against",
    metricKind: "total_count",
    description: "Total number of mistakes leading to an opponent's shot conceded by the team."
  },
  {
    id: "defensive_line_height_for",
    displayName: "Defensive Line Height (For)",
    shortName: "DLH-F",
    category: "tempo",
    type: "for",
    metricKind: "total_count",
    description: "Average defensive line height of the team."
  },
  {
    id: "defensive_line_height_against",
    displayName: "Defensive Line Height (Against)",
    shortName: "DLH-A",
    category: "tempo",
    type: "against",
    metricKind: "total_count",
    description: "Average defensive line height of the opposing team."
  },
  {
    id: "transition_speed_for",
    displayName: "Transition Speed (For)",
    shortName: "TS-F",
    category: "tempo",
    type: "for",
    metricKind: "total_count",
    description: "Transition speed of the team (from defense to attack)."
  },
  {
    id: "transition_speed_against",
    displayName: "Transition Speed (Against)",
    shortName: "TS-A",
    category: "tempo",
    type: "against",
    metricKind: "total_count",
    description: "Transition speed conceded by the team."
  },
  {
    id: "recovery_time_for",
    displayName: "Recovery Time (For)",
    shortName: "RT-F",
    category: "tempo",
    type: "for",
    metricKind: "total_count",
    description: "Average recovery time after losing possession by the team."
  },
  {
    id: "recovery_time_against",
    displayName: "Recovery Time (Against)",
    shortName: "RT-A",
    category: "tempo",
    type: "against",
    metricKind: "total_count",
    description: "Average recovery time conceded by the team."
  },
  {
    id: "pressing_intensity_for",
    displayName: "Pressing Intensity (For)",
    shortName: "PI-F",
    category: "tempo",
    type: "for",
    metricKind: "total_count",
    description: "Pressing intensity of the team."
  },
  {
    id: "pressing_intensity_against",
    displayName: "Pressing Intensity (Against)",
    shortName: "PI-A",
    category: "tempo",
    type: "against",
    metricKind: "total_count",
    description: "Pressing intensity conceded by the team."
  },

  // Group 8: Possession and Shape (For and Against; Category: Possession)
  {
    id: "possession_percentage_for",
    displayName: "Possession Percentage (For)",
    shortName: "Poss%F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Net percentage of passes attempted (possession percentage) for the team."
  },
  {
    id: "possession_percentage_against",
    displayName: "Possession Percentage (Against)",
    shortName: "Poss%A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Net percentage of passes attempted (possession percentage) against the team."
  },
  {
    id: "touches_in_own_penalty_area_for",
    displayName: "Touches in Own Penalty Area (For)",
    shortName: "TouchesOwn-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of touches in own defensive penalty area by the team."
  },
  {
    id: "touches_in_own_penalty_area_against",
    displayName: "Touches in Own Penalty Area (Against)",
    shortName: "TouchesOwn-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of touches in own defensive penalty area conceded by the team."
  },
  {
    id: "touches_in_opposition_penalty_area_for",
    displayName: "Touches in Opposition Penalty Area (For)",
    shortName: "TouchesOpp-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of touches in opposition penalty area by the team."
  },
  {
    id: "touches_in_opposition_penalty_area_against",
    displayName: "Touches in Opposition Penalty Area (Against)",
    shortName: "TouchesOpp-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of touches in opposition penalty area conceded by the team."
  },
  {
    id: "takeons_attempted_for",
    displayName: "Take Ons Attempted (For)",
    shortName: "TA-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of take ons attempted by the team."
  },
  {
    id: "takeons_attempted_against",
    displayName: "Take Ons Attempted (Against)",
    shortName: "TA-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of take ons attempted against the team."
  },
  {
    id: "takeons_successful_for",
    displayName: "Take Ons Successful (For)",
    shortName: "TSucc-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of successful take ons by the team."
  },
  {
    id: "takeons_successful_against",
    displayName: "Take Ons Successful (Against)",
    shortName: "TSucc-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of successful take ons against the team."
  },
  {
    id: "carries_into_opp_18_for",
    displayName: "Carries into Opp 18 Yard Box (For)",
    shortName: "Carries18-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of carries into the opponent's 18-yard box by the team."
  },
  {
    id: "carries_into_opp_18_against",
    displayName: "Carries into Opp 18 Yard Box (Against)",
    shortName: "Carries18-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of carries into the opponent's 18-yard box conceded by the team."
  },
  {
    id: "carries_into_final_third_for",
    displayName: "Carries into Final Third (For)",
    shortName: "CarriesFT-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of carries into the final third by the team."
  },
  {
    id: "carries_into_final_third_against",
    displayName: "Carries into Final Third (Against)",
    shortName: "CarriesFT-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of carries into the final third conceded by the team."
  },
  {
    id: "prog_carry_total_distance_for",
    displayName: "Progressive Carry Total Distance (For)",
    shortName: "ProgCarryDist-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total distance covered in progressive carries by the team."
  },
  {
    id: "prog_carry_total_distance_against",
    displayName: "Progressive Carry Total Distance (Against)",
    shortName: "ProgCarryDist-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total distance covered in progressive carries conceded by the team."
  },
  {
    id: "prog_carries_qty_for",
    displayName: "Progressive Carries Quantity (For)",
    shortName: "ProgCarries-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total number of progressive carries by the team."
  },
  {
    id: "prog_carries_qty_against",
    displayName: "Progressive Carries Quantity (Against)",
    shortName: "ProgCarries-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total number of progressive carries conceded by the team."
  },
  {
    id: "build_up_time_for",
    displayName: "Build-Up Time (For)",
    shortName: "BuildUp-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Total build-up time for the team."
  },
  {
    id: "build_up_time_against",
    displayName: "Build-Up Time (Against)",
    shortName: "BuildUp-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Total build-up time conceded by the team."
  },
  {
    id: "passes_per_defensive_action_for",
    displayName: "Passes per Defensive Action (For)",
    shortName: "PPDA-F",
    category: "possession",
    type: "for",
    metricKind: "total_count",
    description: "Average number of passes per defensive action by the team."
  },
  {
    id: "passes_per_defensive_action_against",
    displayName: "Passes per Defensive Action (Against)",
    shortName: "PPDA-A",
    category: "possession",
    type: "against",
    metricKind: "total_count",
    description: "Average number of passes per defensive action conceded by the team."
  }
];