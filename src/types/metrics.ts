/**
 * Metrics data model interfaces
 * Defines the structure of performance metrics used for play style analysis
 */

/**
 * Base metrics interface
 */
export interface BaseMetrics {
    teamId: string;
    seasonId: string;
    updatedAt: string;
  }
  
  /**
   * Possession and build-up metrics
   */
  export interface PossessionMetrics {
    possessionPercentage: number;
    passCompletionRate: number;
    progressivePassesPerMatch: number;
    averageBuildUpTime: number; // in seconds
    passingSequencesOver5: number;
    ppda: number; // Passes allowed per defensive action (pressing intensity)
    fieldTiltPercentage: number; // % of possession in final third
    directnessIndex: number; // Ratio of forward passes to lateral/backward passes
  }
  
  /**
   * Attacking pattern metrics
   */
  export interface AttackingMetrics {
    goalsPerMatch: number;
    xGPerMatch: number;
    shotsPerMatch: number;
    shotsOnTargetPerMatch: number;
    bigChancesCreatedPerMatch: number;
    setPieceGoalsPercentage: number;
    counterAttackGoalsPercentage: number;
    openPlayGoalsPercentage: number;
    attackZones: {
      left: number;
      center: number;
      right: number;
    };
    crossesPerMatch: number;
    dribbleSuccessRate: number;
    touchesInBox: number;
  }
  
  /**
   * Defensive organization metrics
   */
  export interface DefensiveMetrics {
    goalsAgainstPerMatch: number;
    xGAgainstPerMatch: number;
    cleanSheetPercentage: number;
    tacklesPerMatch: number;
    interceptionPerMatch: number;
    clearancesPerMatch: number;
    defensiveLineHeight: number; // 1-100 scale (low to high)
    pressingIntensity: number; // 1-100 scale (low to high)
    challengesWonPercentage: number;
    aerialDuelsWonPercentage: number;
    defensiveActionsPerMatch: number;
    opponentPassCompletionAllowed: number;
    defensiveRecoveryTime: number; // in seconds
  }
  
  /**
   * Tempo and transitions metrics
   */
  export interface TempoMetrics {
    directPlayIndex: number; // 1-100 scale (possession-based to direct)
    averagePossessionDuration: number; // in seconds
    transitionSpeedAttacking: number; // in seconds
    transitionSpeedDefensive: number; // in seconds
    counterPressAfterLoss: number; // 1-100 scale
    verticalityIndex: number; // measures directness of attacks
    passesPerOffensiveAction: number;
    progressiveCarriesPerMatch: number;
    gameStateAdaptability: {
      winningStyle: number; // 1-100 scale (defensive to offensive)
      drawingStyle: number; // 1-100 scale (defensive to offensive)
      losingStyle: number; // 1-100 scale (defensive to offensive)
    };
  }
  
  /**
   * Complete team metrics interface
   */
  export interface TeamMetrics extends BaseMetrics {
    possession: PossessionMetrics;
    attacking: AttackingMetrics;
    defensive: DefensiveMetrics;
    tempo: TempoMetrics;
    playStyleCategories: PlayStyleCategories;
  }
  
  /**
   * Play style categorization
   */
  export interface PlayStyleCategories {
    possessionDominance: number; // 1-100 scale
    pressingIntensity: number; // 1-100 scale
    buildUpSpeed: number; // 1-100 scale (slow to fast)
    defensiveCompactness: number; // 1-100 scale
    attackingDirectness: number; // 1-100 scale (patient to direct)
    widthOfPlay: number; // 1-100 scale (narrow to wide)
    counterAttackThreat: number; // 1-100 scale
    setPlayThreat: number; // 1-100 scale
    primaryPlayStyle: PlayStyle;
    secondaryPlayStyle: PlayStyle;
  }
  
  /**
   * Play style type
   */
  export type PlayStyle = 
    | 'POSSESSION_BASED'
    | 'DIRECT_PLAY'
    | 'COUNTER_ATTACKING'
    | 'HIGH_PRESSING'
    | 'LOW_BLOCK'
    | 'TIKI_TAKA'
    | 'WING_PLAY'
    | 'LONG_BALL'
    | 'VERTICAL_TIKI_TAKA'
    | 'BALANCED';
  
  /**
   * Match-specific metrics interface
   */
  export interface MatchMetrics extends BaseMetrics {
    matchId: string;
    possession: PossessionMetrics;
    attacking: AttackingMetrics;
    defensive: DefensiveMetrics;
    tempo: TempoMetrics;
    matchResult: 'WIN' | 'DRAW' | 'LOSS';
    opponentId: string;
    isHome: boolean;
  }
  
  /**
   * Comparative metrics interface
   */
  export interface ComparativeMetrics {
    teamId: string;
    leagueId: string;
    seasonId: string;
    metrics: {
      [key: string]: {
        value: number;
        percentile: number;
        leagueAverage: number;
        leagueMax: number;
        leagueMin: number;
      };
    };
  }
  
  /**
   * Type for team metrics response
   */
  export type TeamMetricsResponse = TeamMetrics;
  
  /**
   * Type for match metrics response
   */
  export type MatchMetricsResponse = MatchMetrics;
  
  /**
   * Type for comparative metrics response
   */
  export type ComparativeMetricsResponse = ComparativeMetrics;
  