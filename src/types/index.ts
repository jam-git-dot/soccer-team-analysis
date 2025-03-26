/**
 * Export all type definitions from a central location
 * This simplifies imports by allowing `import { Team, Match } from '@/types'`
 */

// Re-export all types
export * from './team';
export * from './league';
export * from './match';
export * from './metrics';
export * from './api';

// Add any additional shared types below

/**
 * Generic key-value record type
 */
export type Dictionary<T> = Record<string, T>;

/**
 * Nullable type helper
 */
export type Nullable<T> = T | null;

/**
 * Status states for async operations
 */
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

/**
 * Async data wrapper with status
 */
export interface AsyncData<T> {
  data: T | null;
  status: RequestStatus;
  error: string | null;
  timestamp: number | null;
}

/**
 * Create a new AsyncData instance in idle state
 */
export const createInitialAsyncData = <T>(): AsyncData<T> => ({
  data: null,
  status: 'idle',
  error: null,
  timestamp: null,
});