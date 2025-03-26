/**
 * API response types
 * Defines the structure of API responses and request parameters
 */

/**
 * Base API response interface
 */
export interface ApiResponse<T> {
    status: number;
    success: boolean;
    message?: string;
    data: T;
    timestamp: string;
  }
  
  /**
   * Pagination information
   */
  export interface PaginationInfo {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }
  
  /**
   * Paginated API response
   */
  export interface PaginatedApiResponse<T> extends ApiResponse<T> {
    pagination: PaginationInfo;
  }
  
  /**
   * API error response
   */
  export interface ApiErrorResponse {
    status: number;
    success: false;
    message: string;
    errors?: Record<string, string[]>;
    timestamp: string;
  }
  
  /**
   * Common query parameters
   */
  export interface CommonQueryParams {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }
  
  /**
   * League query parameters
   */
  export interface LeagueQueryParams extends CommonQueryParams {
    country?: string;
    season?: string;
    type?: 'league' | 'cup' | 'international';
  }
  
  /**
   * Team query parameters
   */
  export interface TeamQueryParams extends CommonQueryParams {
    leagueId?: string;
    search?: string;
  }
  
  /**
   * Match query parameters
   */
  export interface MatchQueryParams extends CommonQueryParams {
    leagueId?: string;
    teamId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    season?: string;
    matchday?: number;
  }
  
  /**
   * Metrics query parameters
   */
  export interface MetricsQueryParams extends CommonQueryParams {
    leagueId?: string;
    teamId?: string;
    matchId?: string;
    dateFrom?: string;
    dateTo?: string;
    season?: string;
    includeMatchMetrics?: boolean;
  }
  
  /**
   * API caching configuration
   */
  export interface ApiCacheConfig {
    enabled: boolean;
    ttl: number; // Time to live in milliseconds
  }
  
  /**
   * API request options
   */
  export interface ApiRequestOptions {
    cache?: ApiCacheConfig;
    signal?: AbortSignal;
    headers?: Record<string, string>;
  }
  